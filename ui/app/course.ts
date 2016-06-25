namespace BT.Course {
  export type MessageType = "question" | "command" | "answer"
  export type SenderType = "chat" | "timer" | "editor" | "bot" | "course"

  export interface Message {
    sender: SenderType
    text: string
    code?: string
    state?: State
  }

  export interface Pattern {
    patterns: string[]
    guess: string
    type: MessageType
  }

  export interface Unit {
    name: string
    description: string
    help: string
  }

  export interface Course extends Unit {
    lessons: Lesson[]
  }

  export interface Lesson extends Unit {
    steps: Step[]
  }

  export interface Step extends Unit {
    patterns: Pattern[]
    execute: (message: Message, quess: string[]) => Message
  }

  export interface State {
    course: string
    lesson: string
    step: string
  }

  export interface StepsMap {
    [key: string]: Step
  }

  const STATE_NAME = 'course_state'

  export class CourseRunner {
    private state: State
    private steps: StepsMap
    private worker: Worker = new Worker("js/botrunner")

    constructor(course: Course, state: State) {
      this.state = state;
      this.steps = this.createStepsMapping(course);
    }

    public handle(message: Message): Message {
      let step = this.getStep(this.state)
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
        this.state = result.state
      }
      if (!result.state) {
        result.state = this.state
      }
      return result
    }

    private recognise(message: Message, patterns: Pattern[]): string[] {
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

    private createStepsMapping(course: Course): StepsMap {
      let stepsMap = <StepsMap>{}
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

    private key(state: State): string {
      return state.course + "|" + state.lesson + "|" + state.step
    }

    private getStep(state: State): Step {
      return this.steps[this.key(state)]
    }
  }
}
