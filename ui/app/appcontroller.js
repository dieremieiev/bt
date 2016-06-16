/*******************************************************************************
 * Main
 ******************************************************************************/

'use strict';

function AppController($scope, $timeout)
{
  this.initModel()
  this.initEditor()

  $scope.model = this.model

  var self = this

  // TODO: call ctrl.onInputTextKeyDown() in HTML instead of scope.onInputTextKeyDown()

  $scope.onInputTextKeyDown = function(event) { self.onInputTextKeyDown(event) }

  $scope.setFocusOnChat = AppController.prototype.setFocusOnChat

  this.initUI()
  this.scrollBottom()
  this.setFocusOnChat()
}


/*******************************************************************************
 * Private
 ******************************************************************************/

AppController.prototype.initEditor = function()
{
  var editor = ace.edit('editor')

  editor.$blockScrolling = Infinity
  editor.setTheme('ace/theme/monokai')
  editor.getSession().setMode('ace/mode/javascript')

  editor.setValue('function test() { return 1 + 1 }')
  editor.gotoLine(0)
}

AppController.prototype.initModel = function()
{
  this.model = {
    inputText: null,
    messages: [
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
  }
}

AppController.prototype.onInputTextKeyDown = function(event)
{
  if (event.which !== 13) { return; }

  var s = this.model.inputText
  if (s == null || s.trim().length == 0) { return; }

  this.model.messages.push({
    'actor': 'person', 'name': 'Дима', 'message': s
  })

  this.model.inputText = null

  AppController.prototype.scrollBottom()
}


/*******************************************************************************
 * Private - UI
 ******************************************************************************/

AppController.prototype.initUI = function()
{
  window.onresize = AppController.prototype.scrollBottom
}

AppController.prototype.scrollBottom = function()
{
  var o = document.getElementById('chatContainer')
  var h = o.style.height

  setTimeout(function() {
    setTimeout(function() {
      o.style.height = h
      var d = o.children[0]
      d.scrollTop = d.scrollHeight - d.offsetHeight
    }, 100)
  }, 100)
}

AppController.prototype.setFocusOnChat = function()
{
  setTimeout(function() {
    document.getElementById('inputText').focus()
  }, 100)
}
