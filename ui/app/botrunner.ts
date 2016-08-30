declare function postMessage(message:any):void

importScripts("/lib/lodash.js", "/lib/esper.js", "/lib/aether.min.js")

this.onmessage = args => {
  let data = args.data
  let aethr = new Aether()
  aethr.transpile(data.code + "; return main('" + data.text + "');")
  let f = aethr.createFunction()
  postMessage(f())
}
