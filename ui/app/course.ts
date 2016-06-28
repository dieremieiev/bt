namespace BT.Course {
  // TODO: use enum
  export type MessageType = "answer" | "command" | "question"
  export type SenderType = "bot" | "chat" | "course" | "editor" | "system" | "timer"

  export interface IMessage {
    sender: SenderType
    text: string
    code?: string
    state?: IState
  }

  export interface IPattern {
    patterns: string[]
    guess: string
    type: MessageType
  }

  export interface IUnit {
    name: string
    description: string
    help: string
  }

  export interface ICourseModel extends IUnit {
    lessons: ILesson[]
  }

  export interface ILesson extends IUnit {
    steps: IStep[]
  }

  export interface IStep extends IUnit {
    patterns: IPattern[]
    execute: (message: IMessage, quess: string[]) => IMessage
  }

  export interface IState {
    course: string
    lesson: string
    step: string
  }

  export interface IStepsMap {
    [key: string]: IStep
  }

  const STATE_NAME = 'course_state'

  export class CourseRunner {
    private steps: IStepsMap
    private worker: Worker = new Worker("js/botrunner")

    constructor(course: ICourseModel) {
      this.steps = this.createStepsMapping(course);
    }

    public handle(message: IMessage): IMessage {
      let step = this.getStep(message.state)
      let result = message
      if (step.execute) {
        //TODO: recognise, test and THEN execute

        // bot.postMessage({'command': 'execute', 'code': code})
        // bot.onmessage = function(e) {
        //     callback({
        //       'course': course.name,
        //       'lesson': course.currentLesson,
        //       'step'  : course.lessons[course.currentLesson].currentStep,
        //       'codeSample': step.codeSample,
        //       'message': e.data
        //     })
        // }
        let variants: string[] = this.recognise(message, step.patterns)
        result = step.execute(message, variants)
      }
      return result
    }

    private recognise(message: IMessage, patterns: IPattern[]): string[] {
      let result: string[] = []

      for (let pattern of patterns) {
        for (let reg of pattern.patterns) {
          if (new RegExp(reg).test(message.text)) {
            result.push(pattern.guess)
            break
          }
        }
      }

      return result
    }

    private createStepsMapping(course: ICourseModel): IStepsMap {
      let stepsMap = <IStepsMap>{}

      for (let lesson of course.lessons) {
        for (let step of lesson.steps) {
          stepsMap[this.key({
            course: course.name,
            lesson: lesson.name,
            step: step.name
          })] = step
        }
      }

      return stepsMap
    }

    private key(state: IState): string {
      return state.course + "|" + state.lesson + "|" + state.step
    }

    private getStep(state: IState): IStep {
      return this.steps[this.key(state)]
    }
  }
}
