// script.js
const getDataBtn = document.getElementById('getDataBtn');
const dataContainer = document.getElementById('dataContainer');

getDataBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/api/data')
        .then(response => response.json())
        .then(data => {
            dataContainer.textContent = data.message;
            //    console.log(data.message)
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// map functionality

var map = L.map('map');
// map.setView([51.505, -0.09], 13);
map.setView([40.7244, -74.00030], 20);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success, error);

let marker, circle, zoomed;

function success(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    fetch('https://cafe-connection.onrender.com/api/location')
        .then(response => response.json())
        .then(result => {
            // console.log(result)
            for (var user in result) {
                if (result.hasOwnProperty(user)) {
                    var userData = result[user];
                    var userLat = userData.lat;
                    var userLng = userData.lng;
                    var markerImage = userData.image;

                    var marker = L.marker([userLat, userLng], { icon: L.icon({ iconUrl: markerImage }) }).addTo(map);
                    marker.bindPopup(userData.name);

                    // circle = L.circle([userLat, userLng], { radius: accuracy, color: 'red' }).addTo(map);
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // circle = L.circle([lat, lng], { radius: accuracy, color: 'red' }).addTo(map);

    if (!zoomed) {
        zoomed = map.fitBounds(); //circle.getBounds()
    }
}

function error(err) {
    if (err.code === 1) {
        alert('Please allow geolocation access.');
    } else {
        alert('Cannot get current location.');
    }
}
