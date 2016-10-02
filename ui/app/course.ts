interface IAether {
  transpile: (string) => void
  createFunction: () => () => string
  problems: IAetherProblems
}

interface IAetherProblems {
  errors: IAetherError[]
}

interface IAetherError {
  message: string
}

interface IAetherFactory {
  new():IAether
}

declare var Aether: IAetherFactory

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
    payload: any
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
      let step = this.getStep(message.state!.step)

      let result:IMessage = {
        text: "",
        state: message.state,
        code: message.code
      }

      for (var aCase of step.cases) {
        if (aCase.sender == message.sender && new RegExp(aCase.pattern).test(message.text)) {
          for (var action of aCase.actions) {
            switch(action.actionType) {
              case "code":
                result.code = action.payload
                break
              case "message":
                let next: IMessage | undefined = result
                while (next) {
                  if (!next.text) {
                    next.text = action.payload
                  } else if (!next.next) {
                    next.next = { text: "" }
                  }
                  next = next.next
                }
                break
              case "test":
                let input = action.payload[0]
                let output = action.payload[1]
                let tip = action.payload[2]

                if (!result.code) { throw new Error("code is not defined") }

                let scriptResult = this.runScript(result.code, input)
                if(!new RegExp(output).test(scriptResult)) {
                  callback({
                    text: tip + ' : ' + scriptResult
                  })
                  return
                }
                break
              case "bot":
                this.worker.postMessage({ "text": message.text, "code": result.code })
                this.worker.onmessage = (message)=> {
                  result.text = message.data
                  callback(result)
                }
                return
              case "next":
                result.state = {step: action.payload, context: message.state!.context}
                break
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

    private runScript(script: string, message: string): string {
      let aethr = new Aether()
      // aethr.transpile(script + "; return main('" + message + "');")
      aethr.transpile('return ' + script);

      if (aethr.problems.errors.length > 0) {
        return aethr.problems.errors[0].message
      }

      let f = aethr.createFunction()

      return f()
    }

    private getStep(step: string): IStep {
      return this.steps[step]
    }
  }
}
