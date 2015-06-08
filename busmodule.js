var rest = require('restler');

//See https://github.com/srt4/OneBusAway-Node-Client
var OBA_API_URL = 'http://api.onebusaway.org/api/where/';
var OBA_KEY = 'key=14f3bc28-6c02-4257-8a36-b1eaac4122aa';
//Find stops at http://pugetsound.onebusaway.org/where/standard/#m(route)route(1_102581)
var stopId = "3160";
//for some reason, we need to add this
stopId = "1_" + stopId;


stopurl = OBA_API_URL + 'arrivals-and-departures-for-stop/' + stopId + '.json?' + OBA_KEY;

function getBusTime(){
     rest.get(stopurl).on('complete', function(data) {
     arrivalsAndDepartures = data.data.entry.arrivalsAndDepartures; 
    for(i = 0; i < arrivalsAndDepartures.length; i++){
                     console.log('bus number ',arrivalsAndDepartures[i].routeShortName);
                     shortname = data.data.entry.arrivalsAndDepartures[i].routeShortName; 
                     currentTime = data.currentTime;
                     predictedArrivalTime = arrivalsAndDepartures[i].predictedArrivalTime;
                     deltaTime = predictedArrivalTime - currentTime;
                     secondsAway = deltaTime/1000;
                     minutesAway = secondsAway/60; 
                     minutesAway = Math.round(minutesAway);
                     console.log("minutes away", minutesAway); 
                     //console.log('predictedArrivalTime ',arrivalsAndDepartures[i].predictedArrivalTime);
                     console.log("stops away " + data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway);
                     numberOfStopsAway = data.data.entry.arrivalsAndDepartures[0].numberOfStopsAway;
                     }

     });
};
exports.getBusTime = getBusTime();