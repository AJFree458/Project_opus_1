$(document).ready(InitializeScript());

var geoHash;

// controls program flow
function InitializeScript() {

    if (navigator.geolocation) {

        $("#currLoc").show(); //Show Current Location Button
        $("#currLoc").on("click", "GetCurrentLocation()");
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

    var tmURI = CreateTicketMasterURI(30);

    $.ajax({
        url: tmURI,
        method: "GET",
    }).then(function(data) {
        console.log(data);
    })




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