var MyView, TextEditorView, View, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ref = require("atom-space-pen-views"), View = ref.View, TextEditorView = ref.TextEditorView;
var SelectListView = require('atom-space-pen-views').SelectListView;

module.exports = MyView = (function(superClass) {
  extend(MyView, superClass);

  function MyView() {
    return MyView.__super__.constructor.apply(this, arguments);
  }

  MyView.content = function() {
    return this.div((function(_this) {
      return function() {
        _this.h3("快捷键(*)");
        _this.subview('trg', new TextEditorView({
          mini: true,
          placeholderText: '输入你的snp'
        }));
        _this.h3("内容(*)");
        _this.subview('answer', new TextEditorView({
          mini: 'nomini',
          placeholderText: '输入你的内容',
          attributes:{
            'class':'snp-content'
          }
        }));

        _this.h3("描述");
        _this.subview('des', new TextEditorView({
          mini: true,
          placeholderText: 'snp描述'
        }));
        _this.h3("类型");
        _this.subview('type', new TextEditorView({
          mini: true,
          placeholderText: 'snp类型'
        }));
        _this.subview('btn1', '<button class="btn btnadd">提交</button>');
      };
    })(this));
  };



  return MyView;

})(View);
