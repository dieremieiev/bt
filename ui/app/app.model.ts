namespace BT {
  export class AppModel {
    actors   : Array<Actor>
    inputText: string
    messages : Array<ChatMessage>
  }

  export class Actor {
    actorId: number
    name   : string
    icon   : string
  }

  export class ChatMessage {
    actorId: number
    text   : string
  }
}
