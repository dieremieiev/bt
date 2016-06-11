(function() {
  'use strict';

  var app = angular.module('app', ['ngMaterial', 'ngMdIcons'])

  app.directive('ngEnter', function () {
    return function(scope, element, attrs) {
      element.bind('keydown keypress', function(event) {
          if (event.which === 13) {
            scope.onEnter()
            event.preventDefault()
          }
      })
    }
  })

  app.controller('AppController', function($scope, $timeout, $location, $anchorScroll)
  {
    //
    var editor = ace.edit('editor')

    editor.$blockScrolling = Infinity
    editor.setTheme('ace/theme/monokai')
    editor.getSession().setMode('ace/mode/javascript')

    editor.setValue('function test() { return 1 + 1 }')
    editor.gotoLine(0)

    //
    $scope.inputText = null;
    $scope.messages = [
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Это текст, который написал бот-учитель'},
      {'actor': 'person' , 'name': 'Дима' , 'message': 'Это текст, который написал человек-студент'},
      {'actor': 'bot'    , 'name': 'MyBot', 'message': 'Старт'},
      {'actor': 'bot'    , 'name': 'MyBot', 'message': 'Привет, босс!'},
      {'actor': 'bot'    , 'name': 'MyBot', 'message': 'Стоп'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Отлично! Урок выполнен. Переходим к следующему уроку? И вообще это тест длинного текста, который написал бот-учитель.'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Или не переходим к следующему уроку?'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Предлагаю таки продолжить!'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Бесполезное сообщение для теста скроллинга 1'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Бесполезное сообщение для теста скроллинга 2'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Бесполезное сообщение для теста скроллинга 3'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Бесполезное сообщение для теста скроллинга 4'},
      {'actor': 'teacher', 'name': 'Карл' , 'message': 'Бесполезное сообщение для теста скроллинга 5'}
    ]

    //
    $scope.onEnter = function() {
       this.messages.push({
         'actor': 'person', 'name': 'Дима', 'message': this.inputText
       })

       this.inputText = null

       $timeout(function() { $scope.scrollBottom() })
    }

    //
    $scope.scrollBottom = function() {
      $timeout(function() {
        $location.hash('chatBottom')
        $anchorScroll()
      })
    }

    $scope.setFocusOnChat = function() {
      $timeout(function() {
        document.getElementById('inputText').focus()
      }, 200)
    }

    $scope.scrollBottom()
    $scope.setFocusOnChat()
  })
})()
