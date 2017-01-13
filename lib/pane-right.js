var MyView, MySelectListView, SelectListView, ref, View,
  extend = function(child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  },
  hasProp = {}.hasOwnProperty;

var fs = require('fs');

ref = require("atom-space-pen-views"), View = ref.View, TextEditorView = ref.TextEditorView;
SelectListView = require('atom-space-pen-views').SelectListView;
var Atom = require('atom');

var path = atom.packages.getPackageDirPaths() + '/liuin-clip/snippets/';

module.exports = MySelectListView = (function(superClass) {
  extend(MySelectListView, superClass);

  function MySelectListView() {
    return MySelectListView.__super__.constructor.apply(this, arguments);
  }

  MySelectListView.prototype.initialize = function() {
    MySelectListView.__super__.initialize.apply(this, arguments);
    //this.addClass('overlay from-top');
    this.reloadFIle();



    // if (this.panel == null) {
    //   this.panel = atom.workspace.addModalPanel({
    //     item: this
    //   });
    // }
    //this.panel.show();
    // return this.focusFilterEditor();
  };

  MySelectListView.prototype.reloadFIle = function(){
    var _this = this;
    // var atomFile1 = new Atom.File('E:/xampp/htdocs/liuin-clip/snippets/');
    // var atomPack = new Atom.PackageManager();

    fs.readdir(path, function(err, files) {
      if (err) {
        console.log(err);
        return;
      }

      var results = {};
      var arr = [];

      files.forEach(function(filename) {
        filename = filename.replace(".cson",'');
        arr.push(filename);
      });
      _this.setItems(arr);
    })
  }

  MySelectListView.prototype.viewForItem = function(item) {
    var buttonMod = "<button class='btn mod'>修改</button>";
    var buttonDel = "<button class='btn del'>删除</button>";
    return "<li title="+ item +" data-path='"+path+item+'.cson'+"'><span class=\"lab\">" + item + "</span> " + buttonMod + " " + buttonDel + "</li>";
  };
  MySelectListView.prototype.confirmed = function(item) {
    // return false;



    // return console.log(item + " was selected");
  };



  MySelectListView.prototype.cancelled = function() {
    // return console.log("This view was cancelled");
  };

  return MySelectListView;

})(SelectListView);
