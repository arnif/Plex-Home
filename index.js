var PlexAPI = require("plex-api");
var request = require('request');

var HUE_SERVICE_IP = process.env.HUE_SERVICE_IP;
var HUE_SERVICE_PORT = process.env.HUE_SERVICE_PORT;
var client = new PlexAPI(process.env.PLEX_SERVER_IP);

var isLightOn = true;

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
  console.log('analize');
  watching._children.map(function(ll) {
    console.log(ll.title);
    if (ll.title === 'Xbox-SystemOS' || ll.title === 'Apple TV') {
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
  request.get('http://' + HUE_SERVICE_IP + ':' + HUE_SERVICE_PORT + '/' + state, function (error, response, body) {
    console.log(response);
  });
}
