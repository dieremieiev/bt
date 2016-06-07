"use strict";

function State(lesson, editor, chat) {
  this.lesson = lesson
  this.editor = editor
  this.chat = chat
}

State.prototype.save = function() {
  localStorage.setItem('state', btoa(lzjs.compress(JSON.stringify(this))))
}

State.prototype.load = function() {
  var state = JSON.parse(lzjs.decompress(atob(localStorage.getItem('state'))))
  this.lesson = state.lesson
  this.editor = state.editor
  this.chat = state.chat
}