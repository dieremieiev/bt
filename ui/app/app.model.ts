namespace BT {
  /*****************************************************************************
   * Constants
   ****************************************************************************/

  const MODEL_STORAGE_KEY = 'BTMODEL'


  /*****************************************************************************
   * Enums
   ****************************************************************************/

  export enum Actor { Teacher, Person, Bot, System }


  /*****************************************************************************
   * Interface Model
   ****************************************************************************/

  export interface IModel {
    editor       : string
    editorChanged: number
    messages     : IMessage[]
    state?       : Course.IState
    version      : string
  }


  /*****************************************************************************
   * Interface FormattedChatMessage
   ****************************************************************************/

  export interface IFormattedMessage {
    icon: string
    name: string
    text: string
  }


  /*****************************************************************************
   * Interface Actor
   ****************************************************************************/

  export interface IActor {
    actorId: number
    name   : string
    icon   : string
  }


  /*****************************************************************************
   * Interface ChatMessage
   ****************************************************************************/

  export interface IMessage {
    actorId: number
    text   : string
  }


  /*****************************************************************************
   * Class ModelController
   ****************************************************************************/

  export class ModelController {
    /***************************************************************************
     * State
     **************************************************************************/

    private actors: IActor[]

    private model: IModel

    private dirty: boolean = false

    private storageKey = MODEL_STORAGE_KEY


    /***************************************************************************
     * Constructor
     **************************************************************************/

    constructor() { this.reset() }


    /***************************************************************************
     * Public
     **************************************************************************/

    addMessage(message: IMessage): void {
      if (message) {
        this.model.messages.push(message)
      }
    }

    clearMessages(): void {
      this.model.messages = []
    }

    getEditor(): string {
      return this.model.editor
    }

    getEditorChanged(): number {
      return this.model.editorChanged
    }

    getFormattedMessages(): IFormattedMessage[] {
      let messages = this.model.messages
      let count    = messages.length
      let formatted: IFormattedMessage[] = []

      for (let i = 0; i < count; i++) {
        let message = messages[i]
        let actor   = this.getActor(message)

        if (actor === null) { continue }

        formatted.push({ icon: actor.icon, name: actor.name, text: message.text })
      }

      return formatted
    }

    getPersonMessages(): IMessage[] {
      return this.model.messages.filter(m => m.actorId === Actor.Person)
    }

    getState(): Course.IState | undefined {
      return this.model.state
    }

    getVersion(): string {
      return this.model.version
    }

    isDirty(): boolean {
      return this.dirty
    }

    load(): void {
      let s = localStorage.getItem(this.storageKey)
      if (s === null) { return }

      let m = null

      try {
        m = JSON.parse(s)
      } catch (e) {
        console.log(e)
      }

      if (m != null && ModelController.isModelValid(m)) { this.model = m }
    }

    reset(): void {
      this.model = {
        editor       : "",
        editorChanged: 0,
        messages     : [],
        version      : "0.0.1"
      }
    }

    save(): void {
      let s: string

      try {
        s = JSON.stringify(this.model)
      } catch (e) {
        console.log(e)
        return
      }

      if (s) {
        localStorage.setItem(this.storageKey, s)
        this.dirty = false
      }
    }

    setActors(actors: IActor[]): void {
      this.actors = actors
    }

    setEditor(value: string): void {
      if (this.model.editor === value) { return  }

      this.model.editor = value
      this.model.editorChanged = new Date().getTime()
      this.dirty = true
    }

    setState(state: Course.IState): void {
      this.model.state = state
    }

    setStorageKey(key: string): void {
      this.storageKey = key
    }


    /***************************************************************************
     * Pivate
     **************************************************************************/

    private getActor(message: IMessage): IActor | null {
      if (!this.actors) { return null }

      let id = message.actorId

      let fa = this.actors.filter(actor => actor.actorId === id)
      if (typeof fa === "undefined" || fa.length === 0) { return null }

      return fa[0]
    }

    private static isModelValid(model: IModel): boolean {
      if (!model
       || typeof model               !== "object"
       || typeof model.editor        !== "string"
       || typeof model.editorChanged !== "number"
       || typeof model.messages      !== "object"
       || typeof model.version       !== "string") { return false }

      if (!(model.messages instanceof Array)
       || model.version.length === 0) { return false }

      return true
    }
  }
}
