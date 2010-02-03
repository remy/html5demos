var running = false;
var ctr = 0;

function log(s) {
  postMessage('log:' + s);
}

onmessage = function (event) {
  // doesn't matter what the message is, just toggle the worker
  if (running == false) {
    running = true;
    run();
  } else {
    running = false;
  }
};

function run() {
  while (running) {
    postMessage(ctr);
    ctr++;
  }
}
