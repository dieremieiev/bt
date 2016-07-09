interface IAether {
  transpile: (string) => void,
  createFunction: () => () => string
}

interface IAetherFactory {
  new():IAether
}

declare var Aether: IAetherFactory

declare function postMessage(message:any):void

importScripts("/lib/lodash.js", "/lib/esper.js", "/lib/aether.min.js")

this.onmessage = args => {
  let data = args.data
  let aethr = new Aether()
  aethr.transpile("var message = '" + data.text + "'; " + data.code)
  let f = aethr.createFunction()
  postMessage(f())
}
