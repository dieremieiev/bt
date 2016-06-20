namespace BT {
  export class AppController {
    /***************************************************************************
     * Main
     **************************************************************************/

    model: AppModel

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

    getMessageActor(message: ChatMessage): string {
      let actor = this.getActor(message.actorId)

      return actor !== null ? actor.name : null
    }

    getMessageIcon(message: ChatMessage): string {
      let actor = this.getActor(message.actorId)

      return actor !== null ? actor.icon : null
    }

    getMessageText(message: ChatMessage): string {
      return message.text
    }

    onInputTextKeyDown(event: KeyboardEvent): void {
      if (event.which !== 13) { return; }

      let s: string = this.model.inputText
      if (s == null || s.trim().length === 0) { return; }

      this.model.messages.push({actorId: 1, text: s})

      this.model.inputText = null

      AppController.scrollBottom()
    }

    setFocusOnChat(): void {
      setTimeout(function() {
        document.getElementById("inputText").focus()
      }, 100)
    }


    /***************************************************************************
     * Private
     **************************************************************************/

    private getActor(actorId: number): Actor {
      if (this.model.actors == null) { return null }

      let fa = this.model.actors.filter(actor => actor.actorId == actorId)
      if (typeof fa === "undefined" || fa.length == 0) { return null }

      return fa[0]
    }

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
        actors: [
          {actorId: 0, name: "Карл" , icon: "date_range"},
          {actorId: 1, name: "Дима" , icon: "person"},
          {actorId: 2, name: "MyBot", icon: "adb"}
        ],
        inputText: null,
        messages: [
          {actorId: 0, text: "Это текст, который написал бот-учитель"},
          {actorId: 1, text: "Это текст, который написал человек-студент"},
          {actorId: 2, text: "Старт"},
          {actorId: 2, text: "Привет, босс!"},
          {actorId: 2, text: "Стоп"},
          {actorId: 0, text: "Отлично! Урок выполнен. Переходим к следующему уроку? И вообще это тест длинного текста, который написал бот-учитель."},
          {actorId: 0, text: "Или не переходим к следующему уроку?"},
          {actorId: 0, text: "Предлагаю таки продолжить!"},
          {actorId: 0, text: "Бесполезное сообщение для теста скроллинга 1"},
          {actorId: 0, text: "Бесполезное сообщение для теста скроллинга 2"},
          {actorId: 0, text: "Бесполезное сообщение для теста скроллинга 3"},
          {actorId: 0, text: "Бесполезное сообщение для теста скроллинга 4"},
          {actorId: 0, text: "Бесполезное сообщение для теста скроллинга X"}
        ]
      }
    }

    private static initUI(): void {
      window.onresize = AppController.scrollBottom
    }

    private static scrollBottom(): void {
      let o = document.getElementById("chatContainer")
      let h = o.style.height

      setTimeout(function() {
        setTimeout(function() {
          o.style.height = h

          let d = <HTMLScriptElement>o.children[0]
          d.scrollTop = d.scrollHeight - d.offsetHeight
        }, 100)
      }, 100)
    }
  }
}
