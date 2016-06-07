(function() {
  "use strict";

  var app = angular.module('app', ['ngMaterial'])

  app.controller('AppController', function($scope)
  {
    var editor = ace.edit("editor")
    editor.setTheme("ace/theme/monokai")
    editor.getSession().setMode("ace/mode/javascript")
  })
})()
