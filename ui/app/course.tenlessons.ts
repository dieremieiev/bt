
namespace BT.Course {
  export interface ICourse {
    handle: (message: IMessage, callback:(IMessage)=>void) => void
  }

  let course: ICourse;

  export function getCourse(state?: IState): [ICourse, IState] {
    return [course ? course : course = new CourseRunner({
      name: "Ознакомительный",
      description: "Курс чтобы освоить интерфейс и hello world",
      help: "some help",
      lessons: [
        {
          name: "Начало",
          description: "Несколько шагов чтобы немного освоиться",
          help: "Немного помощи не помешает...",
          steps: [
            {
              name: "Начало",
              description: "",
              help: "",
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                if (message.text === "init") {
                  return {
                    text: details.course.description,
                    state: {
                      step: "Чат"
                    },
                    next: {
                      text: details.lesson.description,
                      next: {
                        text: "Попробуйте написать что нибуть в чате"
                      }
                    }
                  }
                }
              }
            },
            {
              name: "Чат",
              description: "Попробуйте написать что нибуть в чате",
              help: "Чат находится справа - чат это просто чат",
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                switch (message.sender) {
                  case "chat":
                    return {
                      text: "Все в порядке: двигаемся дальше",
                      state: {
                        step: "Вернуться в начало",
                      }
                    }
                  case "editor":
                    return {
                      text: "Попробуйте набрать какой-то текст",
                    }
                }
              }
            },
            {
              name: "Вернуться в начало",
              description: "Как начать урок сначала.",
              help: "Чтобы начать урок сначала - нужно просто написать 'вернуться в начало!' (восклицательный знак обязателен - признак комманды).",
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                return {
                  text: details.step.description,
                  next: {
                    text: details.step.help,
                    next: {
                      text: "Впрочем мы попробуем распознать и другие формулировки, но не гарантируем"
                    }
                  },
                  state: {
                    step: "Вернуться в начало: комманда"
                  }
                }
              }
            },
            {
              name: "Вернуться в начало: комманда",
              description: "Вернуться в начало: комманда",
              help: "",
              patterns: [{ patterns: [".*начало!"], guess: "Вернуться в начало", type: "command" }],
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                switch (message.sender) {
                  case "chat":
                    if (guess.length == 1 && guess[0] === "Вернуться в начало") {
                      return {
                        text: "Отлично! В следующий раз урок начнется с начала",
                        state: {
                          step: "Hello world! - объяснение"
                        }
                      }
                    } else {
                      return {
                        text: "Что-то непонятно - попробуйте еще раз!",
                      }
                    }
                }
              }
            },
            {
              name: "Hello world! - объяснение",
              description: "Сейчас попробуем запусить просейшую программу",
              help: "В редакторе появилась программа, попробуйте ее запустить набрав 'запустить!'",
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                switch (message.sender) {
                  case "timer":
                    return {
                      text: details.step.description,
                      code: "function(){return 'hello word!'}",
                      next: {
                        text: details.step.help,
                        next: {
                          text: "Впрочем мы попробуем распознать и другие формулировки, но не гарантируем"
                        }
                      },
                      state: {
                        step: "Hello world!"
                      }
                    }
                }
              }
            },
            {
              name: "Hello world!",
              description: "Простейшая программа",
              help: "",
              patterns: [{ patterns: [".*запустить!"], guess: "запуск", type: "command" }],
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                switch (message.sender) {
                  case "chat":
                    if (guess.length == 1 && guess[0] === "запуск") {
                      return {
                        sender: "bot",
                        text: "",
                        state: "Hello world!",
                        code: message.code
                      }
                    } else {
                      return {
                        text: "Что-то непонятно - попробуйте еще раз!",
                      }
                    }
                }
              }
            }
          ]
        }
      ]
    }), state ? state : {
      course: "Ознакомительный",
      lesson: "Начало",
      step: "Начало"
    }]
  }
}
