/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global postMessage, addEventListener */

(function () {
    "use strict";

    var WHEN_TO_STOP       = 10000000;
    var COMPUTE_BLOCK_SIZE =  1000000;
    
    var running = false;
    var count = 0;
    
    // We have to compute in blocks of ~1 second of computation in order to make sure
    // that we read our message queue occasionally. Worker threads are not preemptive
    // (like all JS), so if we don't pause computation to read the message queue, we'll
    // be unresponsive to user requests.
    function compute(start) {
        var n = start;
        var i, hasDivisor;
        
        if (!running) { // got a message to stop before this call to compute
            postMessage("Stopped!");
        } else {
            while (n < start + COMPUTE_BLOCK_SIZE) {
                hasDivisor = false;
                for (i = 2; i <= Math.sqrt(n); i += 1) {
                    if (n % i === 0) {
                        hasDivisor = true;
                        break;
                    }
                }
                if (!hasDivisor) {
                    // found a prime!
                    count++;
                }
                n += 1;
            }

            if (n < WHEN_TO_STOP) {
                // allow for event loop to actually forward messages to the worker
                setTimeout(function () { compute(n); }, 1);
            } else {
                // we reached the end
                running = false;
                postMessage("Done!");
            }
        }

        // Finally, always report how many primes we've found so far
        postMessage("Found " + count + " primes between 2 and " + (n - 1));

    }
    
    addEventListener('message', function (event) {
        // doesn't matter what the message is, just toggle the worker
        if (running === false) {
            postMessage("Starting...");
            count = 0;
            running = true;
            compute(1);
        } else {
            postMessage("Stopping...");
            running = false;
        }
    });
    
    
}());