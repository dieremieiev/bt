namespace BT.Course {
  export interface ICourse {
    handle: (message: IMessage, callback: (IMessage) => void) => void
  }

  let course: ICourse;

  export function getCourse(state?: IState, courseDescription?: ICourseModel): [ICourse, IState] {
    if (!course) {
      if (!courseDescription) {
        throw new Error("course is not defined")
      }

      course = new CourseRunner(courseDescription)
    }

    return [course, state ? state : { step: "start" }]
  }
}
