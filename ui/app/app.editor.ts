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

    constructor(ac: AppController, elementId: string, value: string) {
      this.editor = ace.edit(elementId)

      this.editor.$blockScrolling = Infinity
      this.editor.setTheme("ace/theme/monokai")
      this.editor.getSession().setMode("ace/mode/javascript")

      this.setValue(value)

      this.editor.getSession().on("change", function() { ac.onEditorChange() })
    }


    /***************************************************************************
     * Public
     **************************************************************************/

    getValue(): string {
        return this.editor.getValue()
    }

    setValue(value: string): void {
      this.editor.setValue(value)
      this.editor.gotoLine(0)
    }
  }
}
