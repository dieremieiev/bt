namespace BT {
  /*****************************************************************************
   * Constants
   ****************************************************************************/

  const SAVE_AFTER_CHANGES   = 10000
  const TIMER_EVENT_INTERVAL = 10000


  /*****************************************************************************
   * Class AppController
   ****************************************************************************/

  export class AppController {
    /***************************************************************************
     * State
     **************************************************************************/

    inputText: string = null
    messages : FormattedChatMessage[]
    version  : string

    private mc: ModelController
    private ec: EditorController


    /***************************************************************************
     * Constructor
     **************************************************************************/

    constructor() {
      this.mc = new ModelController
      this.mc.loadModel()

      this.messages = this.mc.getFormattedMessages()
      this.version  = this.mc.getVersion()

      this.initUI()

      this.ec = new EditorController(this, "editor", this.mc.getEditor())
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    onEditorChange(): void {
      this.mc.setEditor(this.ec.getValue())
    }

    onInputTextKeyDown(event: KeyboardEvent): void {
      if (event.which !== 13) { return; }

      let s: string = this.inputText
      if (s == null || s.trim().length === 0) { return; }

      this.mc.addMessage({ actorId: 1, text: s })

      this.messages  = this.mc.getFormattedMessages()
      this.inputText = null

      this.mc.saveModel()

      AppController.scrollBottom()
    }

    onTimer(): void {
      if (this.mc.isDirty() === false) { return }

      let i = this.mc.getEditorChanged()
      if (i === 0) { return }

      if (new Date().getTime() - i > SAVE_AFTER_CHANGES) {
        this.mc.saveModel()
      }
    }

    setFocusOnChat(): void {
      setTimeout(function() {
        document.getElementById("inputText").focus()
      }, 100)
    }


    /***************************************************************************
     * Private
     **************************************************************************/

    private initUI(): void {
      window.onresize = AppController.scrollBottom

      this.setFocusOnChat()

      AppController.scrollBottom()

      let self = this
      setInterval(function() { self.onTimer() }, TIMER_EVENT_INTERVAL)
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
