namespace BT.Controllers {
  export class AppController {
    /***************************************************************************
     * Main
     **************************************************************************/

    public model: any

    constructor() {
      this.initModel()

      AppController.initEditor()
      AppController.initUI()
      AppController.scrollBottom()

      this.setFocusOnChat()
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    public getMessageActor(message): string {
      return this.model.actors[message[0]]
    }

    public getMessageIcon(message): string {
      if (message[0] === 0) { return "date_range" }
      if (message[0] === 1) { return "person" }

      return "adb"
    }

    public getMessageText(message): string {
      return message[1]
    }

    public onInputTextKeyDown(event): void {
      if (event.which !== 13) { return; }

      let s: string = this.model.inputText
      if (s == null || s.trim().length === 0) { return; }

      this.model.messages.push([1, s])

      this.model.inputText = null

      AppController.scrollBottom()
    }

    public setFocusOnChat(): void {
      setTimeout(function() {
        document.getElementById("inputText").focus()
      }, 100)
    }


    /***************************************************************************
     * Private
     **************************************************************************/

    private static initEditor(): void {
      let editor: AceAjax.Editor = ace.edit("editor")

      editor.$blockScrolling = Infinity
      editor.setTheme("ace/theme/monokai")
      editor.getSession().setMode("ace/mode/javascript")

      editor.setValue("function test() { return 1 + 1 }")
      editor.gotoLine(0)
    }

    private initModel(): void {
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

    private static initUI(): void {
      window.onresize = AppController.scrollBottom
    }

    private static scrollBottom(): void {
      let o: HTMLScriptElement = <HTMLScriptElement>document.getElementById("chatContainer")
      let h: string = o.style.height

      setTimeout(function() {
        setTimeout(function() {
          o.style.height = h

          let d: HTMLScriptElement = <HTMLScriptElement>o.children[0]
          d.scrollTop = d.scrollHeight - d.offsetHeight
        }, 100)
      }, 100)
    }
  }
}
