var _pos = {
    lat: "",
    lng: ""
};
var _Days = "6"; //Number of days to query zero index!


$(document).ready(InitializeScript);

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

    console.log("Calling CurrentLocation");
    navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        window.location.href = "index2.html?lat=" + pos.lat + "&lng=" + pos.lng;
    });
}

function GetAddrLocation() {
    console.log("GetAddrLocation");
}

function getGeoHash(lat, lng) {
    geoHash = encodeGeoHash(lat, lng);
    return geoHash;
}




// function GetEvents(radius) {
//     CreateEventTable(radius);
// }

function CreateEventTable() {
    radius = 30;
    var imgNumber = 0;

    var today = moment();

    // Get the location params from URL
    var currUrl = window.location.href;
    var lat = urlParam(currUrl, "lat");
    var lng = urlParam(currUrl, "lng");

    var TicketMasterURI = CreateTicketMasterURI(lat, lng);

    var evtGrid = $("#eventGrid");

    $.ajax({
            url: TicketMasterURI,
            method: "GET",
        })
        .then(function(response) {
            console.log(response);
            var events = response._embedded.events; //All Events in response



            events.forEach(function(evt) {


                var eventDate = moment(evt.dates.start.localDate);

                //Used for weather day forcast
                var daysFromToday = eventDate.diff(today, 'days');

                var venueNode = evt._embedded.venues[0];
                var row = $("<div>");
                row.addClass("row");


                //Image Column
                var imgCol = $("<div>");
                imgCol.addClass("left floated five wide column");


                var img = $("<img>");
                img.attr("src", evt.images[imgNumber].url);



                var eventDateDiv = $("<div>");
                var eventDate = EventDate(evt.dates.start.localDate, evt.dates.start.localTime);

                eventDateDiv.addClass("eventDate");
                eventDateDiv.text(eventDate);



                imgCol.append(img);
                row.append(imgCol);


                // Information Bio Column
                var bioCol = $("<div>");
                bioCol.addClass("left floated ten wide column");

                bioCol.append(eventDateDiv);
                var bioText = $("<p>");
                bioText.addClass("bio");

                bioText.text(evt.info);

                bioCol.append(bioText);
                row.append(bioCol);

                // *******************************
                // End of First Row
                //********************************
                evtGrid.append(row);

                // *******************************
                // Start Second row for event item
                // *******************************
                var row = $("<div>");
                row.addClass("row");

                // //Nexted Address & weather row
                // var nextedRow = $("<div>");
                // nextedRow.addClass("row");


                //Address Column
                var addrCol = $("<div>");
                addrCol.addClass("left floated eight wide column");

                var venueNameDiv = $("<div>");
                venueNameDiv.addClass("venueName");
                venueNameDiv.text(venueNode.name);
                addrCol.append(venueNameDiv);

                var venueAddrDiv = $("<div>");
                venueAddrDiv.text(venueNode.address.line1 + " " + venueNode.city.name + ", " + venueNode.state.stateCode);
                addrCol.append(venueAddrDiv);

                addrCol.append(venueNameDiv);
                addrCol.append(venueAddrDiv);
                row.append(addrCol);

                //Weather Column
                var weatherCol = $("<div>");
                weatherCol.addClass("weatherElement");
                weatherCol.addClass("left floated ui centered grid");
                weatherCol.attr("weatherIDX", daysFromToday);

                row.append(weatherCol); //Close subrow
                evtGrid.append(row);
            });
            grabWeather(lat, lng);



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

function CreateTicketMasterURI(lat, lng) {
    var startDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
    var endDate = moment().add(_Days, 'days').format("YYYY-MM-DDTHH:mm:ssZ");

    var currUrl = window.location.href;
    var geoHash = getGeoHash(urlParam(currUrl, "lat"), urlParam(currUrl, "lng"));
    console.log(geoHash);


    var TicketMasterApiKey = "KJZmAQM4bhS920dy8zGsGnXAXWJGPGli";
    var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + TicketMasterApiKey;

    var latLon = "&latlong=" + lat + "," + lng; //35.2312612,-81.2460958=" + geoHash;
    var rad = "&radius=30"; // + radius;
    var unit = "&unit=miles";
    var dateRange = "&startDateTime=" + startDate + "&endDateTime=" + endDate;
    var orderBy = "&sort=date,asc";
    var classificationId = "&classificationId=KZFzniwnSyZfZ7v7nJ"; //""&keyword=tool";

    URI = url + latLon + dateRange + rad + unit + classificationId + orderBy;

    return URI;

}






// Create a call for the Weather from the OpenWeatherMaps
function grabWeather(lat, lng) {
    var weatherAPIKey = "3b00f1a6bf12472594d84b96c2fbee05";
    //35.308377899999996&lon=-80.73251789999999
    // var weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?lat=" + lat + "&lon=" + lng + "&days=7&units=I&key=" + weatherAPIKey;

    var weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?lat=" + lat + "&lon=" + lng + "&days=" + _Days + "&units=I&key=" + weatherAPIKey;

    var weatherElements = $(".weatherElement");
    console.log(weatherElements[0].);
    $.ajax({
        url: weatherURL,
        method: "GET",
    }).then(function(response) {
        // console.log(response);
        var weatherData = response.data;





        // var iconImage = response.data[0].weather.icon;
        // var iconImg = $("<img>").attr("src", "assets/img/icons/" + iconImage + ".png");
        // $("#weatherIcon").append(iconImg);
        // $("#weatherTemp").html(response.data[0].temp + " &#8457;");
        // $("#weatherCond").text(response.data[0].weather.description);
    });

}


function urlParam(URL, ParmName) {
    var results = new RegExp('[\?&]' + ParmName + '=([^&#]*)').exec(URL);
    if (results == null) {
        return null;
    } else {
        return decodeURI(results[1]) || 0;
    }
}