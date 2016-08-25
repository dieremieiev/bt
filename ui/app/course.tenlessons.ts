namespace BT.Course {
  export interface ICourse {
    handle: (message: IMessage, callback: (IMessage) => void) => void
  }

  let course: ICourse;

  export function getCourse(state?: IState, courseDescription?: ICourseModel): [ICourse, IState] {
    return [course ? course :
      course = new CourseRunner(courseDescription),
      state ? state : {
        step: "start"
      }
    ]
  }
}
