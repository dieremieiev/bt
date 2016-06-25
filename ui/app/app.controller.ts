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

      this.messages = this.mc.getFormattedMessages()
      this.version  = this.mc.getVersion()

      let state
      [this.course, state] = Course.getCourse(this.mc.getState())
      this.mc.setState(state)

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
      if (s == null) { return }

      s = s.trim()
      if (s.length === 0) { return }

      this.inputText = null

      this.addMessage(1, s)
      this.mc.saveModel()
      this.handleCourse("chat", s)

      AppController.scrollBottom()
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

      this.messages = this.mc.getFormattedMessages()
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

      let save = false

      if (m.state) {
        if (!state || (state.course !== m.state.course)
                   || (state.lesson !== m.state.lesson)
                   || (state.step   !== m.state.step)) {
          this.mc.setState(m.state)
          save = true
        }
      }

      if (m.text) {
        this.addMessage(0, m.text)
        save = true
      }

      if (save) { this.mc.saveModel() }
    }

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
