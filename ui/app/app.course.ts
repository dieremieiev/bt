  interface Message {
    text:string
    code:string
    state?:State
  }

  interface Question extends Message {
    question:string
  }

  interface Command extends Message {
    command:string
  }

  interface Answer extends Message {
    answer:string
  }

  interface Unit {
    name:string
    description:string
    help:string
  }

  interface Course extends Unit {
    lesson:string
    step:string
    lessons:Lesson[]
  }

  interface Lesson extends Unit {
    steps:Step[]
  }

  interface Step extends Unit {
    questions?:Question[]
    commands?:Command[]
    answers?:Answer[]
    execute:(message:Message)=>Message
  }

  interface State {
    course:string
    lesson:string
    step:string
  }

  interface StepsMap {
    [key:string]:Step
  }

  const STATE_NAME = 'course_state'

  class CourseRunner {
    private state:State
    private steps:StepsMap
    private worker:Worker = new Worker("js/botrunner")

    constructor(course:Course) {
      if(!this.state) {
        this.state = this.load();
        if(!this.state) {
          this.state = {
            course: course.name,
            lesson: course.lesson,
            step: course.step}
        }
      }
      this.steps = this.createStepsMapping(course);
    }

    public handle(message:Message):Message {
      let step = this.getStep(this.state)
      let result = message
      if(step.execute) {
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

        result = step.execute(message)
        this.state = result.state
        this.save(this.state)
      }
      if(!result.state) {
        result.state = this.state
      }
      return result
    }

    private createStepsMapping(course: Course): StepsMap {
      let stepsMap = <StepsMap>{}
      for (let lesson of course.lessons) {
        for (let step of lesson.steps) {
          stepsMap[this.key({
            course:course.name,
            lesson:lesson.name,
            step:step.name})] = step
        }
      }
      return stepsMap
    }

    private key(state:State):string {
      return state.course + "|" + state.lesson + "|" + state.step
    }

    private getStep(state:State):Step{
      return this.steps[this.key(state)]
    }

    private load():State {
      let saved = localStorage.getItem(STATE_NAME)
      return saved ? JSON.parse(atob(saved)) : null
    }

    private save(state:State):void {
      localStorage.setItem(STATE_NAME, btoa(JSON.stringify(state)))
    }
  }
