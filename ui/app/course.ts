namespace BT.Course {
  export type MessageType = "answer" | "command" | "question"
  export type SenderType = "bot" | "chat" | "course" | "editor" | "system" | "timer"
  export type ActionType = "code" | "message" | "test" | "bot" | "next"

  export interface IStateDetails {
    course: ICourseModel
    step: IStep
  }

  export interface IContext {
    [key: string]: string
  }

  export interface IState {
    step:string
    context?:IContext
  }

  export interface IMessage {
    sender?: SenderType
    text: string
    code?: string
    state?: IState
    next?: IMessage
    context?: IContext
  }

  export interface ICourseModel {
    steps: IStep[]
  }

  export interface IStep {
    name: string
    cases: ICase[]
  }

  export interface ICase {
    sender: SenderType
    pattern: string
    actions: IAction[]
  }

  export interface IAction {
    actionType: ActionType
    payload: string
  }

  interface IStepsMap {
    [key: string]: IStep
  }

  export class CourseRunner {
    private steps: IStepsMap
    private course: ICourseModel
    private worker: Worker

    constructor(course: ICourseModel) {
      this.steps = this.createMapping(course)
      this.course = course
      this.worker = new Worker("/js/botrunner.js")
    }

    public handle(message: IMessage, callback: (message: IMessage) => void): void {
      let step = this.getStep(message.state.step)
      let result:IMessage = {
        text: null,
        state: message.state
      }
      for(var aCase of step.cases) {
        if(aCase.sender == message.sender && new RegExp(aCase.pattern).test(message.text)) {
          for(var action of aCase.actions) {
            switch(action.actionType) {
              case "code": {
                result.code = action.payload
              }
              case "message": {
                let next = result
                while (next) {
                  if(!next.text) {
                    next.text = action.payload
                  } else if (!next.next) {
                    next.next = {text:''}
                  }
                  next = next.next
                }
              }
              case "test": {
                //TODO: implement unit tests
              }
              case "bot": {
                this.worker.postMessage({ "text": message.text, "code": message.code })
                this.worker.onmessage = (message)=> {
                  result.text = message.data
                  callback(result)
                }
              }
              case "next": {
                result.state = {step: action.payload, context: message.state.context}
              }
            }
          }
        }
      }
      callback(result)
    }

    private createMapping(course: ICourseModel): IStepsMap {
      let stepsMap = <IStepsMap>{}
        for (let step of course.steps) {
          stepsMap[step.name] = step
        }
      return stepsMap
    }

    private getStep(step: string): IStep {
      return this.steps[step]
    }
  }
}
