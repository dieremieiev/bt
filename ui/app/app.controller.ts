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
    messages : IFormattedMessage[]
    version  : string

    private mc: ModelController
    private ec: EditorController

    private course: Course.ICourse


    /***************************************************************************
     * Constructor
     **************************************************************************/

    constructor() {
      this.mc = new ModelController
      this.mc.loadModel()

      let state
      [this.course, state] = Course.getCourse(this.mc.getState())
      this.mc.setState(state)

      this.ec = new EditorController(this, "editor", this.mc.getEditor())

      this.handleCourse("system", "init")
      this.initUI()
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
      if (!s) { return }

      s = s.trim()
      if (s.length === 0) { return }

      this.inputText = null

      this.addMessage(Actor.Person, s)

      if (this.handleSystemCommand(s) === false) {
        this.handleCourse("chat", s)
      }

      this.mc.saveModel()

      AppController.scrollChat()
    }

    onTimer(): void {
      var t = new Date().getTime()

      this.handleCourse("timer", String(t))

      if (this.mc.isDirty() === false) { return }

      let i = this.mc.getEditorChanged()
      if (i === 0) { return }

      if (t - i > SAVE_AFTER_CHANGES) {
        this.mc.saveModel()

        this.handleCourse("editor", String(this.mc.getEditorChanged()))
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

    private addMessage(actorId: number, text: string): void {
      this.mc.addMessage({ actorId: actorId, text: text })
      this.updateUI()
    }

    private handleCourse(sender: Course.SenderType, text: string) {
      let state = this.mc.getState()

      let m = this.course.handle({
        sender: sender,
        text  : text,
        code  : this.mc.getEditor(),
        state : state
      })

      if (!m) { return }

      let b = false

      if (m.state) {
        if (!state || (state.course !== m.state.course)
                   || (state.lesson !== m.state.lesson)
                   || (state.step   !== m.state.step)) {
          this.mc.setState(m.state)
          b = true
        }
      }

      if (m.text) {
        let sender = m.sender === "bot" ? Actor.Bot : Actor.Teacher
        this.addMessage(sender, m.text)
        b = true
      }

      if (m.code) {
        this.ec.setValue(m.code)
        b = true
      }

      if (b) { this.mc.saveModel() }
    }

    private handleSystemCommand(s: string): boolean {
      let b = false

      if (s === "/clear") {
        this.mc.clearMessages()
        this.updateUI()
        b = true
      }

      if (s === "/help") {
        this.addMessage(Actor.Teacher, "/clear /help /reset")
        b = true
      }

      if (s === "/reset") {
        this.mc.resetModel()
        this.ec.setValue(this.mc.getEditor())
        this.updateUI()
        b = true
      }

      return b
    }

    private initUI(): void {
      window.onresize = AppController.scrollChat

      this.setFocusOnChat()

      AppController.scrollChat()

      let self = this
      setInterval(function() { self.onTimer() }, TIMER_EVENT_INTERVAL)

      this.updateUI()
    }

    private static scrollChat(): void {
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

    private updateUI(): void {
      this.messages = this.mc.getFormattedMessages()
      this.version  = this.mc.getVersion()
    }
  }
}
