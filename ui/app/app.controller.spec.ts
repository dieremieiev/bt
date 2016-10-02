namespace BT {
  describe("app.controller.spec", () => {
    let httpBackend
	  let toast
    let ac: AppController

    beforeAll(() => {
      toast = jasmine.createSpyObj("$mdToast", ["show", "simple"])
    })

    beforeEach(inject($controller => {
      ac = $controller(BT.AppController, { $mdToast: toast })
    }))

    beforeEach(inject($httpBackend => {
      httpBackend = $httpBackend
      httpBackend.expectGET("course.json").respond(200, TEST_COURSE)
      httpBackend.flush()
    }))

    describe("public properties", () => {
      it("inputText", () => {
        expect("").toEqual(ac.inputText)
      })

      it("messages", () => {
        expect(ac.messages).toEqual(jasmine.any(Array))
      })

      it("ml", () => {
        expect(ac.ml).toEqual(jasmine.any(Object))
      })

      it("version", () => {
        expect("0.0.1").toEqual(ac.version)
      })
    })

    describe("public methods", () => {
      it("onInputTextKeyUp(event: KeyboardEvent): void", () => {
        expect(() => { ac.onInputTextKeyUp(new KeyboardEvent("")) }).not.toThrowError()
      })

      it("onTimer(): void", () => {
        expect(() => { ac.onTimer() }).not.toThrowError()
      })

      it("setFocusOnChat(): void", () => {
        expect(() => { ac.setFocusOnChat() }).not.toThrowError()
      })
    })
  })

  let TEST_COURSE = {"steps":[{"name":"start","cases":[{"sender":"system","pattern":"init","actions":[{"actionType":"code","payload":"/* Напишите ответ здесь вместо этой строки */"},{"actionType":"message","payload":"Есть простая задачка:"},{"actionType":"message","payload":"У вас есть 2 евро"},{"actionType":"message","payload":"Сколько всего будет евро если вы получили еще 2 евро"},{"actionType":"message","payload":"Напишите ответ в левом окне"},{"actionType":"message","payload":"Для провеки наберите /run"},{"actionType":"next","payload":"step1"}]}]},{"name":"step1","cases":[{"sender":"chat","pattern":"/run","actions":[{"actionType":"test","payload":[null,"^4$","Неправильно, попробуйте еще раз, ваш ответ"]},{"actionType":"message","payload":"Великолепно!!!!"},{"actionType":"code","payload":"2+2"},{"actionType":"next","payload":"step2"}]}]},{"name":"step2","cases":[{"sender":"timer","pattern":".*","actions":[{"actionType":"message","payload":"А теперь немного посложнее:"},{"actionType":"message","payload":"Вы выиграли лотерею и к тем евро которые уже у вас есть"},{"actionType":"message","payload":"Добавилость еще 126743 евро"},{"actionType":"message","payload":"Сколько всего евро теперь у вас есть"},{"actionType":"message","payload":"Напишите ответ в левом окне и наберите /run в чате"},{"actionType":"next","payload":"step3"}]}]},{"name":"step3","cases":[{"sender":"chat","pattern":"/run","actions":[{"actionType":"test","payload":[null,"^126747$","Неправильно, попробуйте еще раз, ваш ответ"]},{"actionType":"message","payload":"Правильно :)"},{"actionType":"code","payload":"2+2+126743"}]}]}]}
}
