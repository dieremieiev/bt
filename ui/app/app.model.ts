namespace BT {
  /*****************************************************************************
   * Constants
   ****************************************************************************/

  const MODEL_STORAGE_KEY = 'BTMODEL'


  /*****************************************************************************
   * Interface Model
   ****************************************************************************/

  export interface AppModel {
    actors       : Actor[]
    editor       : string
    editorChanged: number
    messages     : ChatMessage[]
    version      : string
  }


  /*****************************************************************************
   * Interface Actor
   ****************************************************************************/

  export interface Actor {
    actorId: number
    name   : string
    icon   : string
  }


  /*****************************************************************************
   * Interface ChatMessage
   ****************************************************************************/

  export interface ChatMessage {
    actorId: number
    text   : string
  }


  /*****************************************************************************
   * Interface FormattedChatMessage
   ****************************************************************************/

  export interface FormattedChatMessage {
    icon: string
    name: string
    text: string
  }


  /*****************************************************************************
   * Class ModelController
   ****************************************************************************/

  export class ModelController {
    /***************************************************************************
     * State
     **************************************************************************/

    private model: AppModel

    private dirty: boolean = false


    /***************************************************************************
     * Constructor
     **************************************************************************/

    constructor() {
      this.model = {
        actors: [
          {actorId: 0, name: "Бот-учитель" , icon: "date_range"},
          {actorId: 1, name: "Пользователь", icon: "person"},
          {actorId: 2, name: "MyBot"       , icon: "adb"}
        ],
        editor       : "",
        editorChanged: 0,
        messages     : [],
        version      : "0.0.1"
      }
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    addMessage(message: ChatMessage) {
      this.model.messages.push(message)
    }

    getEditor(): string {
      return this.model.editor
    }

    getEditorChanged(): number {
      return this.model.editorChanged
    }

    getFormattedMessages(): FormattedChatMessage[] {
      let messages  = this.model.messages
      let count     = messages.length
      let formatted = new Array(count)

      for (let i = 0; i < count; i++) {
        let message = messages[i]
        let actor   = this.getActor(message)
        if (actor === null) { continue }

        formatted[i] = {
          icon: actor.icon,
          name: actor.name,
          text: message.text
        }
      }

      return formatted
    }

    getVersion(): string {
      return this.model.version
    }

    isDirty(): boolean
    {
      return this.dirty
    }

    loadModel(): void {
      let s = localStorage.getItem(MODEL_STORAGE_KEY)
      if (s === null) { return }

      let m = null

      try {
        m = JSON.parse(s)
      } catch (e) {
        console.log(e)
      }

      if (ModelController.isModelValid(m)) { this.model = m }
    }

    setEditor(editor: string): void {
      this.model.editor = editor
      this.model.editorChanged = new Date().getTime()
      this.dirty = true
    }

    saveModel(): void {
      let s = null

      try {
        s = JSON.stringify(this.model)
      } catch (e) {
        console.log(e)
      }

      if (s !== null) {
        localStorage.setItem(MODEL_STORAGE_KEY, s)
        this.dirty = false
      }
    }


    /***************************************************************************
     * Pivate
     **************************************************************************/

    private getActor(message: ChatMessage): Actor {
      let id = message.actorId

      let fa = this.model.actors.filter(actor => actor.actorId === id)
      if (typeof fa === "undefined" || fa.length === 0) { return null }

      return fa[0]
    }

    private static isModelValid(model: AppModel): boolean {
      if (model === null
       || typeof model               !== "object"
       || typeof model.actors        !== "object"
       || typeof model.editor        !== "string"
       || typeof model.editorChanged !== "number"
       || typeof model.messages      !== "object"
       || typeof model.version       !== "string") { return false }

      if (!(model.actors instanceof Array) || model.actors.length < 3
       || !(model.messages instanceof Array)
       || model.version.length === 0) { return false }

      return true
    }
  }
}
