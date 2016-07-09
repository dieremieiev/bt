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

    constructor(elementId: string, value: string, callback: () => void) {
      this.editor = ace.edit(elementId)

      this.editor.$blockScrolling = Infinity
      this.editor.setTheme("ace/theme/monokai")
      this.editor.getSession().setMode("ace/mode/javascript")

      // TODO: remove following, use special method this.setOnChangeCallback()

      this.setValue(value)

      this.editor.getSession().on("change", callback)
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    getValue(): string {
        return this.editor.getValue()
    }

    setValue(value: string): void {
      if (value === null || typeof value === "undefined") { value = "" }

      this.editor.setValue(value)
      this.editor.gotoLine(0)
    }
  }
}
