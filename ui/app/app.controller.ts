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

    constructor(private $mdToast, private $timeout: ng.ITimeoutService) {
      this.initML()
      this.initModel()
      this.initController()
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    onInputTextKeyUp(event: KeyboardEvent): void {
      switch (event.which) {
        case 13: this.onEnter(); return
        case 38: this.onArrowUp(); return
        case 40: this.onArrowDown(); return
      }
    }

    onTimer(): void {
      let t = new Date().getTime()

      this.handleCourse("timer", String(t))

      if (this.mc.isDirty() === false) { return }

      let i = this.mc.getEditorChanged()

      if (i !== 0 && t - i > SAVE_AFTER_CHANGES) {
        this.saveModel(true)
        this.handleCourse("editor", String(this.mc.getEditorChanged()))
      }
    }

    setFocusOnChat(): void {
      setTimeout(() => {
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
      this.course.handle({
        sender: sender,
        text  : text,
        code  : this.mc.getEditor(),
        state : this.mc.getState()
      }, m => { this.handleMessage(m) })
    }

    private handleMessage(m: Course.IMessage): void {
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

      if (b) { this.saveModel(false) }

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
        this.mc.reset()
        this.initController()
        b = true
      }

      if (s === "/save") {
        this.saveModel(true)
        b = true
      }

      return b
    }

    private initController(): void {
      let state
      [this.course, state] = Course.getCourse(this.mc.getState())
      this.mc.setState(state)

      this.ec = new EditorController("editor")
      this.ec.setValue(this.mc.getEditor())
      this.ec.setOnChangeCallback(() => { this.onEditorChange() })

      this.handleCourse("system", "init")
      this.initUI()
      this.setCommandPos()
    }

    private initML(): void {
      this.ml = {
        "code_saved"  : "Сохранено",
        "help_message": "Допустимые команды: /clear /help /reset /save"
      }
    }

    private initModel(): void {
      this.mc = new ModelController
      this.mc.load()
    }

    private initUI(): void {
      window.onresize = AppController.scrollChat

      this.setFocusOnChat()

      AppController.scrollChat()

      setInterval(() => { this.onTimer() }, TIMER_EVENT_INTERVAL)

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

    private onEditorChange(): void {
      this.mc.setEditor(this.ec.getValue())
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

      this.saveModel(false)
    }

    private saveModel(showToast: boolean): void {
      this.mc.save()

      if (showToast) { this.showToast(this.ml["code_saved"]) }
    }

    private static scrollChat(): void {
      let o = document.getElementById("chatContainer")
      if (!o) { return }

      let h = o.style.height

      setTimeout(() => {
        setTimeout(() => {
          o.style.height = h

          let d = <HTMLScriptElement>o.children[0]
          d.scrollTop = d.scrollHeight - d.offsetHeight
        }, 200)
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

      AppController.scrollChat()

      this.$timeout(() => { AppController.scrollChat() })
    }
  }
}
