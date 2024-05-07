var map; 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        //center: { lat: 6.175118456811638, lng: 1.2351003027920973 },  
        zoom: 14
    });
    navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        map.setCenter(pos);
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Your Location'
        });
    }, function () {
        alert('Error: The Geolocation service failed.');
    });
}