namespace BT.Controllers {
  export class AppController {
    /***************************************************************************
     * Main
     **************************************************************************/

    public model

    constructor() {
      this.initModel()
      this.initEditor()
      this.initUI()
      this.scrollBottom()
      this.setFocusOnChat()
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    public getMessageActor(message) {
      return this.model.actors[message[0]]
    }

    public getMessageIcon(message) {
      if (message[0] === 0) { return "date_range" }
      if (message[0] === 1) { return "person" }

      return "adb"
    }

    public getMessageText(message) {
      return message[1]
    }

    public onInputTextKeyDown(event) {
      if (event.which !== 13) { return; }

      var s = this.model.inputText
      if (s == null || s.trim().length === 0) { return; }

      this.model.messages.push([1, s])

      this.model.inputText = null

      this.scrollBottom()
    }

    public setFocusOnChat() {
      setTimeout(function() {
        document.getElementById("inputText").focus()
      }, 100)
    }


    /***************************************************************************
     * Private
     **************************************************************************/

    private initEditor() {
      var editor = ace.edit("editor")

      editor.$blockScrolling = Infinity
      editor.setTheme("ace/theme/monokai")
      editor.getSession().setMode("ace/mode/javascript")

      editor.setValue("function test() { return 1 + 1 }")
      editor.gotoLine(0)
    }

    private initModel() {
      this.model = {
        actors: ["Карл", "Дима", "MyBot"],
        inputText: null,
        messages: [
          [0, "Это текст, который написал бот-учитель"],
          [1, "Это текст, который написал человек-студент"],
          [2, "Старт"],
          [2, "Привет, босс!"],
          [2, "Стоп"],
          [0, "Отлично! Урок выполнен. Переходим к следующему уроку? И вообще это тест длинного текста, который написал бот-учитель."],
          [0, "Или не переходим к следующему уроку?"],
          [0, "Предлагаю таки продолжить!"],
          [0, "Бесполезное сообщение для теста скроллинга 1"],
          [0, "Бесполезное сообщение для теста скроллинга 2"],
          [0, "Бесполезное сообщение для теста скроллинга 3"],
          [0, "Бесполезное сообщение для теста скроллинга 4"],
          [0, "Бесполезное сообщение для теста скроллинга 5"]
        ]
      }
    }

    private initUI() {
      window.onresize = this.scrollBottom
    }

    private scrollBottom = function() {
      var o = document.getElementById("chatContainer")
      var h = o.style.height

      setTimeout(function() {
        setTimeout(function() {
          o.style.height = h
          var d = o.children[0]
          d.scrollTop = d.scrollHeight //- d.offsetHeight
        }, 100)
      }, 100)
    }
  }
}
