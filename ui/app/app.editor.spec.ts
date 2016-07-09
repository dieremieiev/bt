namespace BT {
  describe("app.editor.spec", () => {
    describe("constructor", () => {
      it("new EditorController(null, null, null)", () => {
        let ec = new EditorController(null, null, null)
        expect(ec.getValue()).toEqual("")
      })

      it("new EditorController(null, undefined, null)", () => {
        let ec = new EditorController(null, undefined, null)
        expect(ec.getValue()).toEqual("")
      })

      it("new EditorController(null, \"var i = 0;\", null)", () => {
        let ec = new EditorController(null, "var i = 0;", null)
        expect(ec.getValue()).toEqual("var i = 0;")
      })
    })
  })

  // class TestAppController extends AppController {
  //   onEditorChange(): void {}

  //   protected init() {}
  // }
}
