onmessage = function(e) {
  postMessage(eval(e.data.code));
}