var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};


var rest = require('restler');

//See https://github.com/srt4/OneBusAway-Node-Client
var OBA_API_URL = 'http://api.onebusaway.org/api/where/';
var OBA_KEY = 'key=14f3bc28-6c02-4257-8a36-b1eaac4122aa';
//Find stops at http://pugetsound.onebusaway.org/where/standard/#m(route)route(1_102581)
var stopId = "3160";
//for some reason, we need to add this
stopId = "1_" + stopId;


stopurl = OBA_API_URL + 'arrivals-and-departures-for-stop/' + stopId + '.json?' + OBA_KEY;

https.createServer(options, function(req, res) {
    function sendResponse() {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            //console.dir(jsonString, {depth: 5});
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};

            echoResponse.response.outputSpeech.type = "PlainText"
            rest.get(stopurl).on('complete', function(data) {
                //console.dir(data,{depth:5})

                 arrivalsAndDepartures = data.data.entry.arrivalsAndDepartures;
                 for(i = 0; i < arrivalsAndDepartures.length; i++){
                     console.log('stops away ',arrivalsAndDepartures[i].numberOfStopsAway);
                     console.log('bus ',arrivalsAndDepartures[i].routeShortName);
                     shortname = data.data.entry.arrivalsAndDepartures[i].routeShortName; 
                     currentTime = data.currentTime;
                     predictedArrivalTime = arrivalsAndDepartures[i].predictedArrivalTime;
                     deltaTime = predictedArrivalTime - currentTime;
                     secondsAway = deltaTime/1000;
                     console.log('deltaTime', deltaTime/1000);
                    console.log('currentTime ',data.CurrentTime);
                     console.log('currentTime ',data.currentTime);
                     minutesAway = secondsAway/60; 
                     minutesAway = Math.round(minutesAway);
                     console.log("minutesAway", minutesAway); 
                     console.log('predictedArrivalTime ',arrivalsAndDepartures[i].predictedArrivalTime);
                     console.log("stops away:" + data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway);
                     numberOfStopsAway = data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway;
                    console.log("numberOfStopsAway", numberOfStopsAway);
                     if (numberOfStopsAway < 0){
                        console.log("skipping negative");
                        continue;  
                     }

                     break;

                     //console.log(arrivalsAndDepartures[i]);
                }

                // console.log("stops away:" + data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway);
                // numberOfStopsAway = data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway;
                // console.log = ("shortname", shortname);
                // console.log("numberOfStopsAway", numberOfStopsAway);
                if (minutesAway = 1){
                echoResponse.response.outputSpeech.text = "The number of stops away for bus number" + shortname + "is" + numberOfStopsAway + ", it is" + minutesAway + "minute away";
                }
                if (minutesAway != 1){
                echoResponse.response.outputSpeech.text = "The number of stops away for bus number" + shortname + "is" + numberOfStopsAway + ", it is" + minutesAway + "minutes away";
                }
                echoResponse.response.shouldEndSession = "true";
                sendResponse();
            });
        });
    } else {
        sendResponse();
    }
}).listen(3005); //Put number in the 3000 range for testing and 443 for production