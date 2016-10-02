namespace BT {
  /*****************************************************************************
   * Class EditorController
   ****************************************************************************/

  export class EditorController {
    /***************************************************************************
     * State
     **************************************************************************/

    private editor: AceAjax.Editor


    /***************************************************************************
     * Constructor
     **************************************************************************/

    constructor(elementId: string) {
      if (!elementId || !elementId.trim()) {
        throw new Error("elementId is not defined")
      }

      this.editor = ace.edit(elementId)

      this.editor.$blockScrolling = Infinity
      this.editor.setTheme("ace/theme/monokai")
      this.editor.session.setMode("ace/mode/javascript")
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    getValue(): string {
      return this.editor.getValue()
    }

    setOnChangeCallback(callback: () => void): void {
      this.editor.session.on("change", callback)
    }

    setValue(s: string): void {
      if (s === this.getValue()) { return }

      // note: runtime check
      if (s === null || typeof s === "undefined") { s = "" }

      this.editor.setValue(s)
      this.editor.gotoLine(0)
    }
  }
}
