process.stdin.setEncoding('utf8');

var buffer = []

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    buffer.push(chunk);
  }
});

process.stdin.on('close', function(){
  var input = JSON.parse(buffer.join());
  var steps = [];
  var result = {steps: steps};
  for (var step in input) {
    var cases = [];
    steps.push({
      name: step,
      cases: cases
    });
    for (var aCase in input[step]) {
      var aCaseDef = aCase.split(" ");
      var sender = aCaseDef[0];
      var pattern = aCaseDef[1];
      var actions = [];
      cases.push({
        sender: sender,
        pattern: pattern,
        actions: actions
      })
      for (var i=0; i < input[step][aCase].length; i++) {
        var action = input[step][aCase][i];
        var actionType = Object.keys(action)[0];
        var payload = action[actionType];
        actions.push({
          actionType: actionType,
          payload: payload
        });
      }
    }
  }
  process.stdout.write(JSON.stringify(result));
});
