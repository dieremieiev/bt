namespace BT {
  describe("app.model.spec", () => {
    let mc: ModelController

    beforeEach(angular.mock.inject(() => {
      mc = new ModelController
      mc.setStorageKey("BTMODEL_TEST")
    }))

    describe("public methods", () => {
      it("clearMessages(): void", () => {
        expect(() => { mc.clearMessages() }).not.toThrowError()
      })

      it("getEditor(): string", () => {
        expect(() => { mc.getEditor() }).not.toThrowError()
      })

      it("getEditorChanged(): number", () => {
        expect(() => { mc.getEditorChanged() }).not.toThrowError()
      })

      it("getFormattedMessages(): IFormattedMessage[]", () => {
        expect(() => { mc.getFormattedMessages() }).not.toThrowError()
      })

      it("getPersonMessages(): IMessage[]", () => {
        expect(() => { mc.getPersonMessages() }).not.toThrowError()
      })

      it("getState(): Course.IState", () => {
        expect(() => { mc.getState() }).not.toThrowError()
      })

      it("getVersion(): string", () => {
        expect(() => { mc.getVersion() }).not.toThrowError()
      })

      it("isDirty(): boolean", () => {
        expect(() => { mc.isDirty() }).not.toThrowError()
      })

      it("load(): void", () => {
        expect(() => { mc.load() }).not.toThrowError()
      })

      it("reset(): void", () => {
        expect(() => { mc.reset() }).not.toThrowError()
      })

      it("save(): void", () => {
        expect(() => { mc.save() }).not.toThrowError()
      })
    })

    describe("test addMessage(...)", () => {
      it("addMessage({actorId: Actor.Person, text: \"text\"})", () => {
        mc.setActors([{actorId: Actor.Person, name: "name", icon: "icon"}])
        mc.addMessage({actorId: Actor.Person, text: "text"})
        expect([{icon: "icon", name: "name", text: "text"}]).toEqual(mc.getFormattedMessages())
      })
    })

    describe("test clearMessages()", () => {
      it("set message and clear it", () => {
        mc.setActors([{actorId: Actor.Person, name: "name", icon: "icon"}])
        mc.addMessage({actorId: Actor.Person, text: "text"})
        mc.clearMessages()
        expect([]).toEqual(mc.getFormattedMessages())
      })
    })

    describe("test getEditor() & setEditor(...)", () => {
      it("check initial value", () => {
        expect("").toEqual(mc.getEditor())
      })

      it("set test value and check it", () => {
        mc.setEditor("test")
        expect("test").toEqual(mc.getEditor())
      })
    })

    describe("test getEditorChanged()", () => {
      it("check initial value", () => {
        expect(0).toEqual(mc.getEditorChanged())
      })

      it("set test value and check date/time", () => {
        let t = new Date().getTime()
        mc.setEditor("test")
        let v = mc.getEditorChanged()
        expect(true).toEqual(Math.abs(v - t) < 10)
      })
    })

    describe("test getFormattedMessages()", () => {
      it("check initial value", () => {
        expect([]).toEqual(mc.getFormattedMessages())
      })

      it("add test message and check it", () => {
        mc.setActors([{actorId: Actor.Person, name: "name", icon: "icon"}])
        mc.addMessage({actorId: Actor.Person, text: "text"})
        expect([{icon: "icon", name: "name", text: "text"}]).toEqual(mc.getFormattedMessages())
      })
    })

    describe("test getPersonMessages()", () => {
      it("check initial value", () => {
        expect([]).toEqual(mc.getPersonMessages())
      })

      it("add test message and check it", () => {
        let m: IMessage = {actorId: Actor.Person, text: "text"}
        mc.addMessage(m)
        expect([m]).toEqual(mc.getPersonMessages())
      })
    })

    describe("test getState()", () => {
      it("check initial value", () => {
        expect(undefined).toEqual(mc.getState())
      })
    })

    describe("test getVersion()", () => {
      it("check initial value", () => {
        expect("0.0.1").toEqual(mc.getVersion())
      })
    })

    describe("test isDirty()", () => {
      it("check initial value", () => {
        expect(false).toEqual(mc.isDirty())
      })

      it("set editor value and check dirty state", () => {
        mc.setEditor("test")
        expect(true).toEqual(mc.isDirty())
      })

      it("set editor value, save model and check non-dirty state", () => {
        mc.setEditor("test")
        mc.save()
        expect(false).toEqual(mc.isDirty())
      })
    })

    describe("test setActors(...)", () => {
      it("setActors({actorId: Actor.Person, name: \"name\", icon: \"icon\"})", () => {
        mc.setActors([{actorId: Actor.Person, name: "name", icon: "icon"}])
        mc.addMessage({actorId: Actor.Person, text: "text"})
        expect([{icon: "icon", name: "name", text: "text"}]).toEqual(mc.getFormattedMessages())
      })
    })

    describe("test reset(), save() & load()", () => {
      it("change editor", () => {
        mc.reset()
        mc.setEditor("test")
        mc.save()
        mc.reset()
        expect("").toEqual(mc.getEditor())
        mc.load()
        expect("test").toEqual(mc.getEditor())
      })

      it("change message", () => {
        mc.reset()
        mc.setActors([{actorId: Actor.Person, name: "name", icon: "icon"}])
        let m: IMessage = {actorId: Actor.Person, text: "text"}
        mc.addMessage(m)
        mc.save()
        mc.reset()
        expect([]).toEqual(mc.getPersonMessages())
        mc.load()
        expect([m]).toEqual(mc.getPersonMessages())
      })
    })
  })
}
