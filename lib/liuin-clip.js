'use babel';

import LiuinClipView from './liuin-clip-view';
import {
  CompositeDisposable,
  File
} from 'atom';
ref = require('atom');



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

    // console.log(ref);

    function resetEditer(){
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

      if (getType == "") {
        getType = '*';
      }

      if (getDes == "") {
        getDes = getTrg;
      }
      

      var file = new ref.File('E:/xampp/htdocs/liuin-clip/snippets/' + getTrg + '.cson');
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
        s.done(function(){
          alert('添加成功');
          resetEditer();
          $this.modalPanel.hide();
        })
      })
    });


    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liuin-clip:toggle': () => this.toggle()
        // 'liuin-clip:clipborad': () => this.clipborad()
    }));

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.liuinClipView.destroy();
  },

  serialize() {
    return {
      liuinClipViewState: this.liuinClipView.serialize()
    };
  },

  toggle() {
    // console.log('LiuinClip was toggled!');

    // if(this.modalPanel.isVisible()){
    //   return this.modalPanel.hide();
    // }else{
    //   var editor = atom.workspace.getActiveTextEditor();
    //   var words = editor.getText().split(/\s+/).length;
    //   this.liuinClipView.setCount(words);
    //   return this.modalPanel.show();
    // }

    if (this.modalPanel.isVisible()) {
      return this.modalPanel.hide();
    } else {
      return this.modalPanel.show();
    }


    // atom.confirm({
    //   message:'howyou feeling',
    //   detailedMessage: 'Be honest.',
    //   buttons: {
    //     Good: function(){
    //       window.alert('good to hear');
    //     },
    //     bad:function(){
    //       window.alert('bummer');
    //     }
    //   }
    // })
  },

  clipborad() {
    atom.clipboard.write('hello');
  }
};
