"user strict";

//simple hello world course
btCourse = (function(initialCourse) {
  // course state declaration
  var course = null
  // save course state
  var save = function(acourse) {
    localStorage.setItem('course', btoa(JSON.stringify(acourse)))
  }
  // load course state
  var load = function() {
    var saved = localStorage.getItem('course')
    return saved ? JSON.parse(atob(saved)) : null
  }
  // worker for running bot logic
  var bot = new Worker('app/botrunner.js')

  return function (callback, message, code, type)
    {
      if(!course) {
        course = load()
      }
      if(!course) {
        course = initialCourse
      }

      var currentStep = course.lessons[course.currentLesson].currentStep = 'let\'s run'

      var test = initialCourse.lessons[course.currentLesson].steps[currentStep].test
      var step = course.lessons[course.currentLesson].steps[currentStep]

      var validator = {isValid : function(){return false}}

      if(typeof test == 'function') {
        var validationResult = test(code, validator)
      }

      if(!validationResult || validationResult.passed) {
          bot.postMessage({'command': 'execute', 'code': code})
          bot.onmessage = function(e) {
              callback({
                'course': course.name,
                'lesson': course.currentLesson,
                'step'  : course.lessons[course.currentLesson].currentStep,
                'codeSample': step.codeSample,
                'message': e.data
              })
          }
      } else {
        callback({
          'course': course.name,
          'lesson': course.currentLesson,
          'step'  : course.lessons[course.currentLesson].currentStep,
          'codeSample': step.codeSample,
          'message': validationResult.message
        })
      }

      save(course)
    }
})({
   name: 'simple course',
   description: 'simple course description',
   help: 'help is coming',
   currentLesson: 'hello word',
   lessons: {
     'hello word' :
     {
       name: 'hello word',
       description: 'hello word',
       help: 'hello word',
       currentStep: 'preparations',
       steps: {
         'preparations':
         {
           name: 'preparations',
           description: 'some preparation for hello word',
           help: 'preparation step help',
           codeSample: 'function(message) {return "hello world!"}'
         },
         'let\'s run':
         {
           name: 'let\'s run',
           description: 'please run your code',
           help: 'there is a help to run your code',
           test: function(code, checker) { //todo restore function
             return {'passed': checker.isValid(code), 'message': 'success'}
           }
         },
         'congratulations':
         {
           name: 'congratulations!',
           description: 'gift!!!!'
         }
       },
     }
   }
 }
)