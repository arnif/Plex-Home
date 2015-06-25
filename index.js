var PlexAPI = require("plex-api");
var client = new PlexAPI("10.0.1.10");
var request = require('request');

var HUE_SERVICE_IP = 'localhost';
var HUE_SERVICE_PORT = '3000';

var isLightOn = false;

setInterval(function() {
  client.query("/status/sessions").then(function (result) {

      // array of children, such as Directory or Server items
      // will have the .uri-property attached
      // console.log(result._children);
      result._children.map(function(ff) {
        // console.log('ff',ff);
        ff._children.map(function(dd) {
          // console.log('dd',dd);
          if (dd.title === 'arnif') {
              console.log(dd.title);
              analyze(ff);
          }
        })
      });
  }, function (err) {
      throw new Error("Could not connect to server");
  });

},1000);

function analyze(watching) {

  watching._children.map(function(ll) {
    // console.log(ll);
    if (ll.title === 'Xbox-SystemOS') {
      if (ll.state === 'playing') {
        console.log('playing');
        if (isLightOn) {
            toggleLight('off');
            isLightOn = false;
        }
        return;
      } else if (ll.state === 'paused') {
        console.log('paused');
        if (!isLightOn) {
            toggleLight('on');
            isLightOn = true;
        }

        return;
      }
    }

  })
}


function toggleLight(state) {
  request.post('http://' + HUE_SERVICE_IP + ':' + HUE_SERVICE_PORT + '/' + state, function (error, response, body) {
    console.log(response);
      if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
      }
    })
}
