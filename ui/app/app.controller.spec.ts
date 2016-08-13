namespace BT {
  describe("app.controller.spec", () => {
	  let toast
    let ac: AppController

    beforeAll(() => {
      toast = jasmine.createSpyObj("$mdToast", ["show", "simple"])
    })

    beforeEach(angular.mock.inject($controller => {
      ac = $controller(BT.AppController, { $mdToast: toast })
    }))

    describe("public properties", () => {
      it("inputText", () => {
        expect(null).toEqual(ac.inputText)
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
