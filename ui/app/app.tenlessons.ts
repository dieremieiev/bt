  var course = new CourseRunner({
    name: "10 lessons",
    description: "test course",
    help: "some help",
    lesson: "test lesson",
    step: "step1",
    lessons: [
      {
        name: "test lesson",
        description: "test course description",
        help: "help related to lessson",
        steps: [
          {
            name: "step1",
            description: "step 1",
            help: "help related to step1",
            execute: (message:Message)=>{
              message.state = {
                course: "10 lessons",
                lesson: "test lesson",
                step: "step2"};
                return message}
          },
          {
            name: "step2",
            description: "step 2",
            help: "help related to step2",
            execute: (message:Message)=>{return message}
          }
        ]
      }
    ]
  })
