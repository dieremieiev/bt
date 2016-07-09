namespace BT {
  describe("app.model.spec", () => {

    describe("Test Suite 1", () => {
      it("test", () => {
        // TOOD - load index.html

        // TODO - use setup/teardown

        angular.module("BT", [ "ngMaterial", "ngMdIcons" ])
          .controller("AppController", [ "$mdToast", "$timeout", AppController ])

        expect(true).toEqual(true)
      })
    })

  })
}
