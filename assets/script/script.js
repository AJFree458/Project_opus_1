$(document).ready(InitializeScript);

var geoHash;

// controls program flow
function InitializeScript() {

    if (navigator.geolocation) {

        $("#currLoc").show(); //Show Current Location Button
        $("#currLoc").on("click", GetCurrentLocation);
    }
}


// Gets current location from browser
// Button is not available unless script found the capability.
function GetCurrentLocation() {


    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        console.log(pos);
        geoHash = encodeGeoHash(pos.lat, pos.lng);
        console.log(geoHash);

        $("#geoHash").text(geoHash);
        $("#lat").text(pos.lat);
        $("#lng").text(pos.lng);


        return pos;


    });
}




function GetEvents(radius) {
    CreateEventTable(radius);
}

function CreateEventTable(radius) {
    radius = 60;
    var imgNumber = 0;
    var URI = CreateTicketMasterURI(radius);

    $.ajax({
            url: URI,
            method: "GET",
        })
        .then(function(response) {
            console.log(response);
            var events = response._embedded.events;

            var evtGrid = $("#eventGrid");


            events.forEach(function(evt) {
                //New Row
                var row = $("<div>");
                row.addClass("row");

                // Start Columns
                var ImgCol = $("<div>");
                ImgCol.addClass("three wide column");

                var evtImg = $("<img>");
                evtImg.attr("src", evt.images[imgNumber].url);

                ImgCol.append(evtImg);
                row.append(ImgCol);

                var evtDetailCol = $("<div>");
                evtDetailCol.addClass("ten wide column");

                var evtTitle = $("<h2>");
                evtTitle.addClass("title");
                evtTitle.text(evt.name);
                evtDetailCol.append(evtTitle);

                var evtStart = $("<div>");
                evtStart.text("Start: " + EventDate(evt.dates.start.localDate, evt.dates.start.localTime));
                evtDetailCol.append(evtStart);


                var evtEnd = $("<div>");
                evtEnd.text("End: " + EventDate(evt.dates.endDate, evt.dates.endTime));
                evtDetailCol.append(evtEnd);


                row.append(evtDetailCol);

                var endCol = $("<div>");
                endCol.addClass("three wide column");
                row.append(endCol);

                //console.log("Event Row Added");
                evtGrid.append(row);
                //console.log(row);
            });
            // console.log(evts[0].name);
            //  eventList.text(JSON.stringify(response));

        })
        .fail(function(error) {

            console.log(error);
        });

}

function EventDate(date, time) {
    var date = moment(date).format("dddd, MMMM Do, YYYY");
    var time = moment(time, "HH").format("ha");

    return date + " at " + time;
}
// ################################################################
// Create API Call
// ################################################################

function CreateTicketMasterURI(radius) {
    var startDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
    var endDate = moment().add(30, 'days').format("YYYY-MM-DDTHH:mm:ssZ");

    var TicketMasterApiKey = "KJZmAQM4bhS920dy8zGsGnXAXWJGPGli";
    var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + TicketMasterApiKey;

    var geoLoc = "&geoLoc=" + geoHash;
    var rad = "&radius=30"; // + radius;
    var unit = "&unit=miles";
    var range = "&startDateTime=" + startDate + "&endDateTime=" + endDate;
    var classificationId = "&classificationId=KZFzniwnSyZfZ7v7nJ"; //""&keyword=tool";

    URI = url + geoLoc + unit + range + classificationId;

    console.log(URI);
    return URI;

}


// Create a call for the Weather from the OpenWeatherMaps
function grabWeather() {
    var weatherAPIKey = "5a51f9cb85ab0cba2e91fb5674a4966d";

    var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=35.308377899999996&lon=-80.73251789999999&type=accurate&appid=" + weatherAPIKey + "&units=imperial";

    $.ajax({
        url: weatherURL,
        method: "GET",
    }).then(function(forecast) {
        console.log(forecast);

        $("#city").text(forecast.city.name);
        $("#temp").text(forecast.list[0].main.temp);
        $("#condit").text(forecast.list[0].weather[0].main);
        $("#humid").text(forecast.list[0].main.humidity);

    });


}