// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/College%20Station%2C%20TX?unitGroup=us&key=VJJGNCLMUX552BNFYVJ9RYCNS&contentType=json

// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?aggregateHours=24&contentType=csv&unitGroup=us&key=VJJGNCLMUX552BNFYVJ9RYCNS&locations=New York City,NY 

const date = new Date();
let day = date.getDate();
let month = date.getMonth()+1;
let year = date.getFullYear();
let currentDate  = `${year}-${month}-${day}`;
let weather_req = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/College Station/${currentDate}?key=VJJGNCLMUX552BNFYVJ9RYCNS`;

fetch(weather_req, {
  method: 'GET', 
  headers: {
 
  },
           
}).then(response => {
  if (!response.ok) {
    throw response; //check the http response code and if isn't ok then throw the response as an error
  }
            
  return response.json(); //parse the result as JSON

}).then(response => {
  //response now contains parsed JSON ready for use
  processWeatherData(response);

}).catch((errorResponse) => {
  if (errorResponse.text) { //additional error information
    errorResponse.text().then( errorMessage => {
      //errorMessage now returns the response body which includes the full error message
    })
  } else {
    //no additional error information 
  } 
});

function processWeatherData(response) {
  
    var location=response.resolvedAddress;
    var days=response.days;
    var icon = response.icon;
    console.log("Location: "+location);
    for (var i=0;i<days.length;i++) {
      console.log(days[i].datetime+": tempmax="+days[i].tempmax+", tempmin="+days[i].tempmin + ", icon=" + days[i].icon);
    }
  }