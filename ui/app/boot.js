(function() {
  'use strict';

  var app = angular.module('app', ['ngMaterial'])

  app.controller('AppController', function($scope)
  {
    var editor = ace.edit('editor')

    editor.$blockScrolling = Infinity
    editor.setTheme('ace/theme/monokai')
    editor.getSession().setMode('ace/mode/javascript')

    editor.setValue('function test() { return 1 + 1 }')
    editor.gotoLine(0)
  })
})()
