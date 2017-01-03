'use babel';

import { CompositeDisposable } from 'atom';

export default class LiuinClipView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('liuin-clip');

    // Create message element
    // const message = document.createElement('div');
    // message.textContent = 'The LiuinClip package is Alive! It\'s ALIVE!';
    // message.classList.add('message');
    // this.element.appendChild(message);


    //  var buildTextEditor1 =  new buildTextEditor({});

    //  console.log(buildTextEditor1);


    // this.element.appendChild(buildTextEditor1);

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {

  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    // return this.element;
    // return this.element;

    var editorTxt;
    if (this.editorTxt == null) {
      editorTxt = require('./text-editor');
      this.editorTxt = new editorTxt();
    }

    this.element.appendChild(this.editorTxt[0]);
    this.element.items = this.editorTxt;
    return this.element;

  }

  getElementRight(){
    var ele = document.createElement('div');
    ele.classList.add('liuin-clip-right');
    var editorRight = require('./pane-right')
    var editorRight1 = new editorRight();
    ele.appendChild(editorRight1[0]);
    ele.items = editorRight1;
    return ele;
  }

  setCount(count){
    var displayText = "There are " + count + " words.";
    this.element.children[0].textContent = displayText;
  }
}
