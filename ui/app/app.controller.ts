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

    inputText: string = ""
    isReady  : boolean = false
    messages : IFormattedMessage[]
    ml       : {[key: string]: string}
    version  : string

    private commandPos: number = 0
    private course: Course.ICourse

    private mc: ModelController
    private ec: EditorController

    private static refChatContainer: HTMLElement | null
    private static refEditor       : HTMLElement | null
    private static refInputText    : HTMLElement | null


    /***************************************************************************
     * Constructor
     **************************************************************************/

    constructor(private $http: ng.IHttpService
              , private $timeout: ng.ITimeoutService, private $mdToast) {
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
      if (!this.isReady) { return }

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
        if (AppController.refInputText) { AppController.refInputText.focus() }
      }, 100)
    }


    /***************************************************************************
     * Private
     **************************************************************************/

    private addMessage(actorId: number, text: string): void {
      this.mc.addMessage({actorId: actorId, text: text})
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

    private handleMessage(m: Course.IMessage | undefined): void {
      if (!m) { return }

      let b = false

      if (m.state) {
        let state = this.mc.getState()
        if (!state || (state.step   !== m.state.step)) {
          this.mc.setState(m.state)
          b = true
        }
      }

      if (m.text) {
        let sender = m.sender === "bot" ? Actor.Bot : Actor.Teacher
        this.addMessage(sender, m.text)
        b = true
      }

      if (m.code && m.code != this.ec.getValue()) {
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
      this.ec = new EditorController("editor")
      this.ec.setValue(this.mc.getEditor())

      this.$http.get("course.json").then((response) => {
        if (!response || !response.data) { return }

        this.onCourseLoaded(<Course.ICourseModel>response.data)
      })
    }

    private initML(): void {
      this.ml = {
        "actor_bot"    : "MyBot",
        "actor_person" : "Пользователь",
        "actor_system" : "Система",
        "actor_teacher": "Бот-учитель",
        "code_saved"   : "Сохранено",
        "help_message" : "Допустимые команды: /clear /help /reset /save"
      }
    }

    private initModel(): void {
      let ml = this.ml

      this.mc = new ModelController
      this.mc.load()
      this.mc.setActors([
        {actorId: Actor.Teacher, name: ml["actor_teacher"], icon: "date_range"},
        {actorId: Actor.Person , name: ml["actor_person"] , icon: "person"},
        {actorId: Actor.Bot    , name: ml["actor_bot"]    , icon: "adb"},
        {actorId: Actor.System , name: ml["actor_system"] , icon: "build"}
      ])
    }

    private static initReferences(): void {
      AppController.refInputText     = document.getElementById("inputText")
      AppController.refChatContainer = document.getElementById("chatContainer")
      AppController.refEditor        = document.getElementById("editor")
    }

    private initUI(): void {
      AppController.initReferences()

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

      this.inputText = i < pm.length ? pm[i].text : ""

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

    private onCourseLoaded(course: Course.ICourseModel): void {
      let state
      [this.course, state] = Course.getCourse(this.mc.getState(), course)
      this.mc.setState(state)

      this.ec.setOnChangeCallback(() => { this.onEditorChange() })

      this.handleCourse("system", "init")
      this.initUI()
      this.setCommandPos()

      this.isReady = true
    }

    private onEditorChange(): void {
      this.mc.setEditor(this.ec.getValue())
    }

    private onEnter(): void {
      let s = this.inputText
      if (!s) { return }

      s = s.trim()
      if (s.length === 0) { return }

      this.inputText = ""

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
      let cc = AppController.refChatContainer
      if (!cc) { return }

      let h = cc.style.height

      setTimeout(() => {
        setTimeout(() => {
          if (!cc) { return }

          cc.style.height = h

          let d = <HTMLScriptElement>cc.children[0]
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
