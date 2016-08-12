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
      it("inputText === null", () => {
        expect(null).toEqual(ac.inputText)
      })

      it("messages is Array", () => {
        expect(ac.messages).toEqual(jasmine.any(Array))
      })

      it("ml is Object", () => {
        expect(ac.ml).toEqual(jasmine.any(Object))
      })

      it("version === \"0.0.1\"", () => {
        expect("0.0.1").toEqual(ac.version)
      })
    }
  })
}
