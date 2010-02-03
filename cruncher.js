var running = false;

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
  var n = 1;
  search: while (running) {
    n += 1;
    for (var i = 2; i <= Math.sqrt(n); i += 1)
      if (n % i == 0)
       continue search;
    // found a prime!
    postMessage(n);
  }
}

