namespace BT {
  export interface AppModel {
    actors   : Actor[]
    editor   : string
    inputText: string
    messages : ChatMessage[]
    version  : string
  }

  export interface Actor {
    actorId: number
    name   : string
    icon   : string
  }

  export interface ChatMessage {
    actorId: number
    text   : string
  }
}
