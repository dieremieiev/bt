namespace BT.Course {
  // TODO: use enum
  export type MessageType = "answer" | "command" | "question"
  export type SenderType = "bot" | "chat" | "course" | "editor" | "system" | "timer"

  export interface IStateDetails {
    course: ICourseModel
    lesson: ILesson
    step: IStep
  }

  export interface IContext {
    [key: string]: string
  }

  export interface IMessage {
    sender?: SenderType
    text: string
    code?: string
    state?: IState
    next?: IMessage
    context?: IContext
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
    execute: (message: IMessage, variants: string[], details: IStateDetails) => IMessage
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
      this.course = course
    }

    public handle(message: IMessage): IMessage {
      let step = this.getStep(message.state)
      let lesson = this.getLesson(message.state)

      if (!step.execute) {
        return null
      }
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

      let result = step.execute(message,variants,
        {
          step: step,
          lesson: lesson,
          course: this.course
        })
      if (!result) {
        return null
      }
      result.state = {
        course: this.course.name,
        lesson: (result.state && result.state.lesson) ?
          result.state.lesson :
          message.state.lesson,
        step: (result.state && result.state.step) ?
          result.state.step :
          message.state.step
      }
      result.sender = "course"
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
    }
  }
}
