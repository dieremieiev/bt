namespace BT {
  /*****************************************************************************
   * Constants
   ****************************************************************************/

  const SAVE_AFTER_CHANGES   = 5000
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
    ml       : { [key: string]: string }
    version  : string

    private commandPos: number = 0

    private mc: ModelController
    private ec: EditorController

    private course: Course.ICourse


    /***************************************************************************
     * Constructor
     **************************************************************************/

    constructor(private $mdToast) {
      this.mc = new ModelController
      this.mc.loadModel()

      this.initML()
      this.initController()
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    onEditorChange(): void {
      this.mc.setEditor(this.ec.getValue())
    }

    onInputTextKeyUp(event: KeyboardEvent): void {
      switch (event.which) {
        case 13: this.onEnter(); return
        case 38: this.onArrowUp(); return
        case 40: this.onArrowDown(); return
      }
    }

    onTimer(): void {
      var t = new Date().getTime()

      this.handleCourse("timer", String(t))

      if (this.mc.isDirty() === false) { return }

      let i = this.mc.getEditorChanged()

      if (i !== 0 && t - i > SAVE_AFTER_CHANGES) {
        this.mc.saveModel()
        this.showToast(this.ml["code_saved"])
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
      AppController.scrollChat()
    }

    private handleCourse(sender: Course.SenderType, text: string) {
      let m = this.course.handle({
        sender: sender,
        text  : text,
        code  : this.mc.getEditor(),
        state : this.mc.getState()
      })

      this.handleMessage(m)
    }

    private handleMessage(m: Course.IMessage) {
      if (!m) { return }

      let b = false

      if (m.state) {
        let state = this.mc.getState()
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

      this.handleMessage(m.next)
    }

    private handleSystemCommand(s: string): boolean {
      let b = false

      if (s === "/clear") {
        this.mc.clearMessages()
        this.updateUI()
        this.setCommandPos()
        b = true
      }

      if (s === "/help") {
        this.addMessage(Actor.System, this.ml["help_message"])
        b = true
      }

      if (s === "/reset") {
        this.mc.initModel()
        this.initController()
        b = true
      }

      return b
    }

    private initController(): void {
      let state
      [this.course, state] = Course.getCourse(this.mc.getState())
      this.mc.setState(state)

      this.ec = new EditorController(this, "editor", this.mc.getEditor())

      this.handleCourse("system", "init")
      this.initUI()
      this.setCommandPos()
    }

    private initML(): void {
      this.ml = {
        "code_saved"  : "Сохранено",
        "help_message": "Допустимые команды: /clear /help /reset"
      }
    }

    private initUI(): void {
      window.onresize = AppController.scrollChat

      this.setFocusOnChat()

      AppController.scrollChat()

      let self = this
      setInterval(function() { self.onTimer() }, TIMER_EVENT_INTERVAL)

      this.updateUI()
    }

    private onArrowDown(): void {
      let i  = this.commandPos + 1
      let pm = this.mc.getPersonMessages()

      if (i > pm.length) { i = pm.length }

      this.inputText = i < pm.length ? pm[i].text : null

      this.commandPos = i
    }

    private onArrowUp(): void {
      let i = this.commandPos - 1
      if (i < 0) { return }

      let pm = this.mc.getPersonMessages()
      if (pm.length <= i) { i = pm.length - 1 }

      if (i >= 0) { this.inputText = pm[i].text }

      this.commandPos = i
    }

    private onEnter(): void {
      let s: string = this.inputText
      if (!s) { return }

      s = s.trim()
      if (s.length === 0) { return }

      this.inputText = null

      this.addMessage(Actor.Person, s)
      this.setCommandPos()

      if (this.handleSystemCommand(s) === false) {
        this.handleCourse("chat", s)
      }

      this.mc.saveModel()
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

    private setCommandPos(): void {
      this.commandPos = this.mc.getPersonMessages().length
    }

    private showToast(s: string): void {
      this.$mdToast.show(
        this.$mdToast.simple()
          .textContent(s)
          .parent(document.getElementById("editor"))
          .position("top right")
          .hideDelay(2000)
      )
    }

    private updateUI(): void {
      this.messages = this.mc.getFormattedMessages()
      this.version  = this.mc.getVersion()
    }
  }
}
