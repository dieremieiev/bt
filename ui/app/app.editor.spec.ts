namespace BT {
  describe("app.editor.spec", () => {
    describe("constructor", () => {
      it("new EditorController(null)", () => {
        expect(() => {
          new EditorController(null)
        }).toThrowError("elementId is not defined")
      })

      it("new EditorController(undefined)", () => {
        expect(() => {
          new EditorController(undefined)
        }).toThrowError("elementId is not defined")
      })

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

    describe("get/set value", () => {
      it("setValue(null)", () => {
        let ec = new EditorController("editor")
        ec.setValue(null)
        expect("").toEqual(ec.getValue())
      })

      it("setValue(undefined)", () => {
        let ec = new EditorController("editor")
        ec.setValue(undefined)
        expect("").toEqual(ec.getValue())
      })

      it("setValue(\"\")", () => {
        let ec = new EditorController("editor")
        ec.setValue("")
        expect("").toEqual(ec.getValue())
      })

      it("setValue(\"var i = 0;\")", () => {
        let ec = new EditorController("editor")
        ec.setValue("var i = 0;")
        expect("var i = 0;").toEqual(ec.getValue())
      })
    })

    describe("callback", () => {
      let ec: EditorController
      let s : string

      beforeAll(() => {
        ec = new EditorController("editor")
        ec.setOnChangeCallback(() => { s = ec.getValue(); })
      })

      beforeEach(() => {
        ec.setValue("?")
      })

      it("setValue(null)", () => {
        ec.setValue(null)
        expect("").toEqual(s)
      })

      it("setValue(undefined)", () => {
        ec.setValue(undefined)
        expect("").toEqual(s)
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
