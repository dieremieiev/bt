namespace BT {
  describe("app.editor.spec", () => {
    describe("constructor", () => {
      it("new EditorController(\"\")", () => {
        expect(() => {
          new EditorController("")
        }).toThrowError("elementId is not defined")
      })

      it("new EditorController(\" \")", () => {
        expect(() => {
          new EditorController(" ")
        }).toThrowError("elementId is not defined")
      })

      it("new EditorController(\"wrong id\")", () => {
        expect(() => {
          new EditorController("wrong id")
        }).toThrowError("ace.edit can't find div #wrong id")
      })

      it("new EditorController(\"editor\")", () => {
        expect(() => {
          new EditorController("editor")
        }).not.toThrowError()
      })
    })

    describe("public methods", () => {
      let ec: EditorController

      beforeEach(() => {
        ec = new EditorController("editor")
      })

      it("getValue(): string", () => {
        expect(() => { ec.getValue() }).not.toThrowError()
      })

      it("setOnChangeCallback(callback: () => void): void", () => {
        expect(() => { ec.setOnChangeCallback(() => {}) }).not.toThrowError()
      })
    })

    describe("test getValue() & setValue(...)", () => {
      let ec: EditorController

      beforeEach(() => {
        ec = new EditorController("editor")
      })

      it("setValue(\"\")", () => {
        ec.setValue("")
        expect("").toEqual(ec.getValue())
      })

      it("setValue(\"var i = 0;\")", () => {
        ec.setValue("var i = 0;")
        expect("var i = 0;").toEqual(ec.getValue())
      })
    })

    describe("test callbacks", () => {
      let ec: EditorController
      let s : string

      beforeAll(() => {
        ec = new EditorController("editor")
        ec.setOnChangeCallback(() => { s = ec.getValue(); })
      })

      beforeEach(() => {
        ec.setValue("?")
      })

      it("setValue(\"\")", () => {
        ec.setValue("")
        expect("").toEqual(s)
      })

      it("setValue(\"var i = 0;\")", () => {
        ec.setValue("var i = 0;")
        expect("var i = 0;").toEqual(s)
      })
    })
  })
}
