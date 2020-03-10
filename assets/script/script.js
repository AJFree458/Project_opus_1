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
    GetCurrentLocation();
}

function getGeoHash(lat, lng) {
    geoHash = encodeGeoHash(lat, lng);
    return geoHash;
}

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

                // Used for weather day forcast
                var daysFromToday = eventDate.diff(today, 'days');
                var venueNode = evt._embedded.venues[0];


                //    Row 1
                var row = $("<div>");
                row.addClass("row left floated");


                // ========================
                // Start row 1 column 1
                // ========================

                //event title
                var evtTitleDiv = $("<div>");
                evtTitleDiv.addClass("left floated six wide column");
                evtTitleDiv.addClass("eventName");
                evtTitleDiv.text(evt.name);

                //Event image
                var evtImage = $("<img>");
                evtImage.attr("src", evt.images[imgNumber].url);
                evtTitleDiv.append(evtImage);

                //Add to event row
                row.append(evtTitleDiv);


                // ========================
                // Start row 1 column 2
                // ========================
                var infoCol = $("<div>");
                infoCol.addClass("left floated ten wide column");

                // Insert grid inside row 1 col 2
                //Insert row inside info cell for date and weather
                var detailGrid = $("<div>");
                detailGrid.addClass("detailGrid ui grid");

                var infoHdrRow = $("<div>");
                infoHdrRow.addClass("row");

                //  create Header Row column-1  (Col-1, row-1)
                var evtDateCell = $("<div>");
                evtDateCell.addClass("left floated ten wide column");
                evtDateCell.addClass("eventDate");
                evtDateCell.text(EventDate(evt.dates.start.localDate, evt.dates.start.localTime));
                infoHdrRow.append(evtDateCell);


                //Weather Column Row1, col-2
                var weatherCell = $("<div>");
                weatherCell.addClass("weatherElement weatherCell right five wide column");
                weatherCell.attr("weatherIDX", daysFromToday);
                infoHdrRow.append(weatherCell);


                detailGrid.append(infoHdrRow);
                infoCol.append(detailGrid);



                var infoDetailsRow = $("<div>");
                infoDetailsRow.addClass("row");

                //  var detailsCell = $("<div>");
                var detailText = $("<p>");
                detailText.addClass("bio");
                if (evt.info) {
                    detailText.text(evt.info);
                } else {
                    detailText.text("No Detail Informaiton Available");
                }

                // detailsCell.append(detailText);
                infoDetailsRow.append(detailText);
                infoCol.append(infoDetailsRow);

                row.append(infoCol);
                evtGrid.append(row);

                // *************************************************
                // Start Second row for event item Detail
                // *************************************************
                var row = $("<div>");
                row.addClass("row");
                row.attr("style", "padding-bottom: 0px;");

                //Address Column
                var addrCol = $("<div>");
                addrCol.addClass("left floated eight wide column");

                var venueNameDiv = $("<div>");
                venueNameDiv.addClass("venueName left floated");
                venueNameDiv.text(venueNode.name);
                addrCol.append(venueNameDiv);

                var venueAddrDiv = $("<div>");
                venueAddrDiv.addClass("eventAddr");
                venueAddrDiv.text(venueNode.address.line1 + " " + venueNode.city.name + ", " + venueNode.state.stateCode);
                addrCol.append(venueAddrDiv);

                row.append(addrCol);

                //Buy Button
                var btnDiv = $("<div>");
                btnDiv.addClass("buyBtn");

                var buyNowLink = $("<a>");
                buyNowLink.attr("href", evt.url);

                var buyNowBtn = $("<button>");
                buyNowBtn.text("Buy Now");
                buyNowBtn.addClass("right floated ui primary button");

                buyNowLink.append(buyNowBtn);
                btnDiv.append(buyNowLink);

                row.append(btnDiv);
                evtGrid.append(row);

                //Record Divider
                var dividerDiv = $("<div>");
                dividerDiv.addClass("ui divider");
                evtGrid.append(dividerDiv);


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

    var TicketMasterApiKey = "KJZmAQM4bhS920dy8zGsGnXAXWJGPGli";
    var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + TicketMasterApiKey;

    var latLon = "&latlong=" + lat + "," + lng; //35.2312612,-81.2460958=" + geoHash;
    var rad = "&radius=30"; // + radius;
    var unit = "&unit=miles";
    var dateRange = "&startDateTime=" + startDate + "&endDateTime=" + endDate;
    var orderBy = "&sort=date,asc";
    var classificationId = "&classificationId=KZFzniwnSyZfZ7v7nJ"; //""&keyword=tool";

    URI = url + latLon + dateRange + rad + unit + classificationId + orderBy;
    //   console.log(URI);
    return URI;

}


// Create a call for the Weather from the WeatherBit.IO
function grabWeather(lat, lng) {

    var weatherAPIKey = "3b00f1a6bf12472594d84b96c2fbee05";
    var weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?lat=" + lat + "&lon=" + lng + "&days=" + _Days + "&units=I&key=" + weatherAPIKey;


    $.ajax({
        url: weatherURL,
        method: "GET",
    }).then(function(response) {

        var weatherData = response.data;

        $(".weatherElement").each(function(index, element) {
            var weatherIndex = $(element).attr("weatherIDX");

            var weatherDiv = $("<figure>");
            weatherDiv.addClass("weatherCell");

            var imgFile = weatherData[weatherIndex].weather.icon;
            var iconImg = $("<img>").attr("src", "assets/img/icons/" + imgFile + ".png");
            iconImg.addClass("weatherImage");
            weatherDiv.append(iconImg);

            var weatherCondDiv = $("<figcaption>");
            weatherCondDiv.html(weatherData[weatherIndex].weather.description + " " + weatherData[weatherIndex].temp + " &#8457;");
            weatherDiv.append(weatherCondDiv);

            $(element).append(weatherDiv);
        });

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