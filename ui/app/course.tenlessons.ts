
namespace BT.Course {
  export interface ICourse {
    handle: (message: IMessage) => IMessage
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
              name: "Чат",
              description: "Попробуйте написать что нибуть в чате",
              help: "Чат находится справа - чат это просто чат",
              patterns: [],
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                if (message.text === "init") {
                  return {
                    text: details.course.description,
                    next: {
                      text: details.lesson.description,
                      next: {
                        text: details.step.description
                      }
                    }
                  }
                }
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
              patterns: [],
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                switch (message.sender) {
                  case "timer":
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
              }
            },
            {
              name: "Вернуться в начало: комманда",
              description: "Вернуться в начало: комманда",
              help: "",
              patterns: [{ patterns: [".* начало!"], guess: "Вернуться в начало", type: "command" }],
              execute: (message: IMessage, guess: string[], details: IStateDetails) => {
                switch (message.sender) {
                  case "chat":
                    if (guess.length == 1 && guess[0] === "Вернуться в начало") {
                      return {
                        text: "Отлично! В следующий раз урок начнется с начала",
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
      step: "Чат"
    }]
  }
}
