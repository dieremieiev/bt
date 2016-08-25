namespace BT {
  describe("app.controller.spec", () => {
	  let toast
    let ac: AppController
    //let $httpBackend

    beforeAll(() => {
      toast = jasmine.createSpyObj("$mdToast", ["show", "simple"])
    })

    beforeEach(angular.mock.inject($injector => {
      //$httpBackend = $injector.get("$httpBackend")
      //$httpBackend.when("GET", "course.json").respond({}, {})

      let $controller = $injector.get("$controller")

      ac = $controller(BT.AppController, { $mdToast: toast })

      //spyOn(ac, "onCourseLoaded").and.callFake(() => {})

      ac.onCourseLoaded({"steps":[{"name":"start","cases":[{"sender":"system","pattern":"init","actions":[{"actionType":"message","payload":"Несколько шагов чтобы немного освоиться"},{"actionType":"message","payload":"Попробуйте написать что нибуть в чате"},{"actionType":"next","payload":"chatting"}]}]},{"name":"chatting","cases":[{"sender":"chat","pattern":".*","actions":[{"actionType":"message","payload":"Все в порядке - двигаемся дальше"},{"actionType":"next","payload":"goto start"}]},{"sender":"editor","pattern":".*","actions":[{"actionType":"message","payload":"Попробуйте набрать какой-то текст"}]}]},{"name":"goto start","cases":[{"sender":"chat","pattern":".*начало!","actions":[{"actionType":"message","payload":"Отлично! В следующий раз урок начнется с начала"},{"actionType":"next","payload":"hello world explanation"}]}]},{"name":"hello world explanation","cases":[{"sender":"timer","pattern":".*","actions":[{"actionType":"code","payload":"return 'hello word!'"},{"actionType":"message","payload":"Сейчас попробуем запусить простейшую программу"},{"actionType":"message","payload":"В редакторе появилась программа, попробуйте ее запустить набрав 'запустить!'"},{"actionType":"next","payload":"hello world"}]}]},{"name":"hello world","cases":[{"sender":"chat","pattern":".*запустить!","actions":[{"actionType":"test","payload":"<test case name>"},{"actionType":"bot","payload":"start"}]}]},{"name":"less2 first step","cases":[{"sender":"chat","pattern":".*запустить!","actions":[{"actionType":"message","payload":"from less2"}]}]}]})
    }))

    describe("public properties", () => {
      it("inputText", () => {
        expect(null).toEqual(ac.inputText)
      })

      it("messages", () => {
        //$httpBackend.expectGET("course.json")

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
        expect(() => { ac.onInputTextKeyUp(new KeyboardEvent(null)) }).not.toThrowError()
      })

      it("onTimer(): void", () => {
        expect(() => { ac.onTimer() }).not.toThrowError()
      })

      it("setFocusOnChat(): void", () => {
        expect(() => { ac.setFocusOnChat() }).not.toThrowError()
      })
    })
  })
}
