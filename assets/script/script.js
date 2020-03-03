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
        // console.log("GetCurrent location");
        console.log(pos);
        geoHash = encodeGeoHash(pos.lat, pos.lng);
        console.log(geoHash);

        $("#geoHash").text(geoHash);
        $("#lat").text(pos.lat);
        $("#lng").text(pos.lng);


        return pos;
    });

}

function loadEvents() {

}

function GetManualLocation() {

}




function GetEvents(radius) {
    CreateEventTable(radius);
}

function CreateEventTable(radius) {
    radius = 30;
    var tmURI = CreateTicketMasterURI(radius);

    $.ajax({
            url: tmURI,
            method: "GET",
        })
        .then(function(response) {

            var events = response._embedded.events;

            var evtGrid = $("#evtGrid");

            events.forEach(function(evt) {

                // Create new row
                var row = $("<div>");
                row.addClass("row");

                // Start Columns
                var ImgCol = $("<div>");
                ImgCol.addClass("three wide column");

                var evtImg = $("<img>");
                evtImg.attr("src", evt.images[5]);

                ImgCol.append(evtImg);
                row.append(ImgCol);

                var evtDetailCol = $("<div>");
                evtDetailCol.addClass("ten wide column");

                var evtTitle = $("<h2>");
                evtTitle.addClass("title");
                evtTitle.text(evt.name);
                evtDetailCol.append(evtTitle);

                var evtStart = $("<div>");
                evtStart.text("Start: " + EventDate(evt.dates.startDate, evt.dates.startTime));

                var evtEnd = $("<div>");
                evtEnd.text("End: " + EventDate(evt.dates.endDate, evt.dates.endTime));


                evtDetailCol.append(evtStart);
                evtDetailCol.append(evtEnd);

                console.log("Event Row Added");
                evtGrid.append(row);
            });
            // console.log(evts[0].name);
            //  eventList.text(JSON.stringify(response));

        })
        .fail(function(error) {

            console.log(error);
        });
    console.log("YOU SUCK!--------------");
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
    var endDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
    console.log(endDate);
    var startDate = moment().add(10, 'days').format("YYYY-MM-DDTHH:mm:ssZ");
    console.log(startDate);

    var TicketMasterApiKey = "KJZmAQM4bhS920dy8zGsGnXAXWJGPGli";
    var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + TicketMasterApiKey;

    var geoLoc = "&geoLoc=" + geoHash;
    var rad = "&radius=" + radius;
    var unit = "&unit=miles";
    var range = "&startDateTime=" + startDate + "&endDateTime=" + endDate;

    URI = url + geoLoc + rad + unit + range;

    console.log(URI);
    return URI
}


function RenderEvents() {

}


function ShowModal() {

}