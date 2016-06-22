namespace BT {
  const MODEL_STORAGE_KEY = 'BTMODEL'

  export class AppController {
    /***************************************************************************
     * Main
     **************************************************************************/

    model: AppModel

    private editor: AceAjax.Editor

    constructor() {
      this.initUI()
      this.loadModel()
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

      this.saveModel()

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
      if (this.model.actors === null) { return null }

      let fa = this.model.actors.filter(actor => actor.actorId === actorId)
      if (typeof fa === "undefined" || fa.length === 0) { return null }

      return fa[0]
    }

    private static getInitialModel(): AppModel {
      return {
        actors: [
          {actorId: 0, name: "Карл" , icon: "date_range"},
          {actorId: 1, name: "Дима" , icon: "person"},
          {actorId: 2, name: "MyBot", icon: "adb"}
        ],
        editor   : "",
        inputText: null,
        messages : [],
        version  : "0.0.1"
      }
    }

    private initEditor(): void {
      let editor = ace.edit("editor")

      editor.$blockScrolling = Infinity
      editor.setTheme("ace/theme/monokai")
      editor.getSession().setMode("ace/mode/javascript")

      this.editor = editor
    }

    private initUI(): void {
      window.onresize = AppController.scrollBottom

      this.initEditor()
      this.setFocusOnChat()

      AppController.scrollBottom()
    }

    private static isModelValid(model: AppModel): boolean {
      if (model === null
       || typeof model !== "object"
       || typeof model.actors    !== "object"
       || typeof model.editor    !== "string"
       || typeof model.inputText === "undefined"
       || typeof model.messages  !== "object"
       || typeof model.version   !== "string") { return false }

      if (!(model.actors instanceof Array) || model.actors.length < 3
       || !(model.messages instanceof Array)
       || model.version.length === 0) { return false }

      return true
    }

    private loadModel(): void {
      let s = localStorage.getItem(MODEL_STORAGE_KEY)
      let m = null

      if (s !== null) {
        try {
          m = JSON.parse(s)
        } catch (e) {
          console.log(e)
        }
      }

      this.model = AppController.isModelValid(m)
                 ? m : AppController.getInitialModel()

      if (this.editor) {
        this.editor.setValue(this.model.editor)
        this.editor.gotoLine(0)
      }
    }

    private saveModel(): void {
      let s = null

      this.model.editor = this.editor.getValue()

      try {
        s = JSON.stringify(this.model)
      } catch (e) {
        console.log(e)
      }

      if (s !== null) {
        localStorage.setItem(MODEL_STORAGE_KEY, s)
      }
    }

    private static scrollBottom(): void {
      let o = document.getElementById("chatContainer")
      let h = o.style.height

      setTimeout(function() {   // note: two nested calls required
        setTimeout(function() {
          o.style.height = h

          let d = <HTMLScriptElement>o.children[0]
          d.scrollTop = d.scrollHeight - d.offsetHeight
        }, 100)
      }, 100)
    }
  }
}
