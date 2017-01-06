'use babel';

import LiuinClipView from './liuin-clip-view';
import {
  compile as coffee
} from "coffee-script";

import {
  CompositeDisposable,
  File
} from 'atom';
ref = require('atom');
var fs = require("fs");
var path = atom.packages.getPackageDirPaths() + '/liuin-clip/snippets/';


var ref1 = require('atom-space-pen-views');
var $ = ref1.$;

export default {

  liuinClipView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    $this = this;
    this.liuinClipView = new LiuinClipView(state.liuinClipViewState);



    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.liuinClipView.getElement(),
      // item: $('<atom-text-editor>'),
      visible: false
    });


    this.modalPanelRight = atom.workspace.addRightPanel({
      item: this.liuinClipView.getElementRight(),
      visible: true
    });


    var pane1 = this.modalPanel.item.items;
    var trg = pane1.trg;
    var answer = pane1.answer;
    var type = pane1.type;
    var des = pane1.des;

    var btn1 = $(pane1).find('button');

    function resetEditer() {
      trg.setText('');
      answer.setText('');
      type.setText('');
      des.setText('');
    }

    //点击添加文件
    btn1.on('click', function() {
      var getTrg = trg.getText();
      var getAnswer = answer.getText();
      var getType = type.getText();
      var getDes = des.getText();

      if (getAnswer == "" || getTrg == "") {
        alert('*的选项不能为空');
        return;
      }

      getAnswer = getAnswer.replace(/(\\)/g, '$1$1$1$1');
      if (getType == 'file') {
        getAnswer = getAnswer.replace(/(\$)(.)/g, '\\\\$1\\\\$2');
      }



      if (getType == "" || getType == "file") {
        getType = '*';
      }

      if (getDes == "") {
        getDes = getTrg;
      }


      var file = new ref.File(path + getTrg + '.cson');
      var fileTxt = '';
      fileTxt += " '" + getType + "':";
      fileTxt += "\n  '" + getDes + "':";
      fileTxt += "\n      'prefix': '" + getTrg + "'";
      fileTxt += "\n      'body': \"\"\"";
      fileTxt += "\n " + getAnswer + " ";
      fileTxt += "\n      \"\"\"";
      var newfile = file.create();

      newfile.done(function() {
        var s = file.write(fileTxt);
        s.done(function() {
          alert('添加成功');
          resetEditer();

          $this.modalPanelRight.item.items.reloadFIle();
          $this.modalPanel.hide();

        })
      })
    });


    var paneRight = this.modalPanelRight.item;
    var buttonMod = $(paneRight).find('.mod');
    var buttonDel = $(paneRight).find('.del');

    $('.liuin-clip-right').on('dblclick','li',function(){
      var editor = atom.workspace.getActiveTextEditor();
      var selection = editor.getLastSelection();

      var getFile = new ref.File($(this).data('path'));

      getFile.read().then(function(data){
          var getTxt = data;
          var getConten = data.match(/body(.|\n|\r)*[^\"\"\"]/);
          getConten = getConten[0].replace(/^body': """/,'');
          getConten = getConten.replace(/(^\s+)|(\s+$)/g,"");
          getConten = getConten.replace(/(\"\"\"*$)/g,"");

          getConten = getConten.replace(/(\\\\\\\\)/g, '\\');
          if(getConten.indexOf('file')){
            getConten = getConten.replace(/\\\\$1\\\\/g, '\$');
          }
          selection.insertText(getConten);
      })
    })

    //修改面板
    $('.liuin-clip-right').on('click', 'button.mod', function(event) {
      $this.modalPanel.show();

      var getFilePath = $(this).parent().data('path');
      var getFile = new ref.File(getFilePath);
      getFile.read().then(function(data) {
        var getTxt = data;
        var getTrg = data.match("'prefix': '(.*)\'");
        getTrg = getTrg[1].replace(/(^\s*)|(^\'*)|(\s*$)|(\'*$)/g, '');

        // var getConten = data.match(/[^\'body\'\:  \"\"\"\n](.|\n)*[^\"\"\"]/);
        var getConten = data.match(/body(.|\n|\r)*[^\"\"\"]/);
        getConten = getConten[0].replace(/^body': """/, '');

        getConten = getConten.replace(/(^\s*)|(^\'*)|(\s*$)|(\'*$)|(\n*$)|(\r*$)/g, "");
        getConten = getConten.replace(/(\"\"\"*$)/g, "");
        getConten = getConten.replace(/(\s+$)/g, "");

        var getType = data.match(/(.*)/);
        var getDes = data.match(/\n{1}(.*)/);

        getType = getType[0].replace(/(^\s*\')|(\'\:(\n*))/g,'');
        getDes = getDes[1].replace(/(^\s*\')|(\'\:(\n*))/g,'');

        trg.setText(getTrg);
        answer.setText(getConten);
        type.setText(getType);
        des.setText(getDes);
      });


      event.preventDefault();
      event.stopPropagation();
      /* Act on the event */
    });


    $('.liuin-clip-right').on('click', 'button.del', function(event) {
      //alert('删除');
      var $thisObj = $(this);


      if(confirm("确定删除?") == false){
        return false;
      }

      var getFilePath = $(this).parent().data('path');
      fs.unlink(getFilePath, function(err) {
        if (err) {
          alert('删除失败');
        } else {
          alert('删除成功');
          $thisObj.parent().remove();
        }
      });

      $this.modalPanel.hide();

      event.preventDefault();
      event.stopPropagation();
      /* Act on the event */
    });



    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liuin-clip:rightPlan': () => this.togglePlan(this.modalPanelRight)
      // 'liuin-clip:clipborad': () => this.clipborad()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liuin-clip:addSnp': () => this.togglePlan(this.modalPanel)
      // 'liuin-clip:clipborad': () => this.clipborad()
    }));

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.liuinClipView.destroy();
  },

  togglePlan(obj) {
    if (obj.isVisible()) {
      return obj.hide();
    } else {
      return obj.show();
    }
  },

  serialize() {
    return {
      liuinClipViewState: this.liuinClipView.serialize()
    };
  },


  clipborad() {
    atom.clipboard.write('hello');
  }
};
