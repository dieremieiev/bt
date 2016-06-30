namespace BT.Course {
  // TODO: use enum
  export type MessageType = "answer" | "command" | "question"
  export type SenderType = "bot" | "chat" | "course" | "editor" | "system" | "timer"

  export interface IMessage {
    sender: SenderType
    text: string
    code?: string
    state?: IState
    next?: IMessage
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
    course?: string
    lesson?: string
    step?: string
  }

  interface IStepsMap {
    [key: string]: IStep
  }

  interface ILessonsMap {
    [key: string]: ILesson
  }

  const STATE_NAME = 'course_state'

  export class CourseRunner {
    private steps: IStepsMap
    private lessons: ILessonsMap
    private course: ICourseModel
    private worker: Worker = new Worker("js/botrunner")

    constructor(course: ICourseModel) {
      [this.lessons, this.steps] = this.createMapping(course)
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
        if (!result) { return null }

        if(!result.state) {
          result.state = message.state
        } else {
          let nextText = ''
          let nextState = message.state
          if(result.state.lesson) {
            nextState.lesson = result.state.lesson
            nextText = this.appendDescription(nextText, this.getLesson(nextState))
          }
          if(result.state.step) {
            nextState.step = result.state.step
            nextText = this.appendDescription(nextText, this.getStep(nextState))
          }
          if(nextText) {
            result.next = {
              sender: 'course',
              text: nextText
            }
          }
        }
      }
      return result
    }

    private appendDescription(text:string, unit:IUnit) {
      return text + '\n' + unit.description
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

    private createMapping(course: ICourseModel): [ILessonsMap, IStepsMap] {
      let stepsMap = <IStepsMap>{}
      let lessonsMap = <ILessonsMap>{}
      for (let lesson of course.lessons) {
        lessonsMap[this.lessonKey({
          course: course.name,
          lesson: lesson.name
        })] = lesson
        for (let step of lesson.steps) {
          stepsMap[this.stepKey({
            course: course.name,
            lesson: lesson.name,
            step: step.name
          })] = step
        }
      }
      return [lessonsMap, stepsMap]
    }

    private stepKey(state: IState): string {
      return state.course + "|" + state.lesson + "|" + state.step
    }

    private lessonKey(state: IState): string {
      return state.course + "|" + state.lesson
    }

    private getStep(state: IState): IStep {
      return this.steps[this.stepKey(state)]
    }

    private getLesson(state: IState): ILesson {
      return this.lessons[this.lessonKey(state)]
    }}
}
