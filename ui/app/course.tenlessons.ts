
namespace BT.Course {
  export interface ICourse {
    handle: (message: IMessage) => IMessage
  }

  let course: ICourse;

  export function getCourse(state?: IState): [ICourse, IState] {
    return [course ? course : new CourseRunner({
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
              description: "Приглашение",
              help: "",
              patterns: [],
              execute: (message: IMessage, guess: string[]) => {
                return {
                  sender: "course",
                  text: "Ознакомительный курс чтобы освоить интерфейс и hello world",
                  state: {
                    course: "Ознакомительный",
                    lesson: "Начало",
                    step: "Чат"
                  }
                }
              }
            },
            {
              name: "Чат",
              description: "Попробуйте написать что нибуть в чате",
              help: "Чат находится справа - чат это просто чат",
              patterns: [],
              execute: (message: IMessage, guess: string[]) => {
                switch (message.sender) {
                  case "chat":
                    return {
                      sender: "course",
                      text: "Все в порядке: двигаемся дальше",
                      state: {
                        course: "Ознакомительный",
                        lesson: "Начало",
                        step: "Вернуться в начало"
                      }
                    }
                  case "editor":
                    return {
                      sender: "course",
                      text: "Попробуйте набрать какой-то текст",
                      state: message.state
                    }
                }
              }
            },
            {
              name: "Вернуться в начало",
              description: "Как начать урок сначала",
              help: "Чтобы начать урок сначала - нужно просто написать 'вернуться в начало!' или '/reset' (восклицательный знак обязателен :). Впрочем мы попробуем распознать и другие формулировки, но не гарантируем",
              patterns: [{ patterns: [".* начало!", "/reset"], guess: "Вернуться в начало", type: "command" }],
              execute: (message: IMessage, guess: string[]) => {
                switch (message.sender) {
                  case "chat":
                    if (guess.length == 1 && guess[0] === "Вернуться в начало") {
                      return {
                        sender: "course",
                        text: "Отлично! В следующий раз урок начнется с начала",
                        state: message.state
                      }
                    } else {
                      return {
                        sender: "course",
                        text: "Что-то непонятно - попробуйте еще раз!",
                        state: message.state
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
