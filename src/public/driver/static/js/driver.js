const currentUser = JSON.parse(localStorage.getItem('user'));
var submitButton = document.getElementById('track_button');
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    const deliveryId = document.getElementById('deliveryId').value;
    if (deliveryId === "") {
        alert(" Please enter delivery ID ");
    } else {
        const headers = new Headers();
        headers.append('x-access-token', currentUser.token);
        fetch(`${deliveryApiUrl}/api/v1/delivery/${deliveryId}`, { method: 'get', headers })
            .then(response => {
                if (response.status !== 200) {
                    if (response.status === 401) {
                        return window.location.href = "/login/index.html"
                    }
                    alert(' Please enter valid package ID');
                    throw new Error(' Request Error ' + `${response.status}`);
                }
                return response.json();
            })
            .then(deliveryData => {
                let { location, status, __v, _id, ...deliveryInfo } = deliveryData;
                const deliveryDataElt = document.getElementById('delivery');
                while (deliveryDataElt.firstChild) {
                    deliveryDataElt.removeChild(deliveryDataElt.firstChild);
                }
                displayDeliveryStatus(status);
                displayPropreties(deliveryDataElt, deliveryInfo);
                if (deliveryData?.package_id) {
                    fetch(`${deliveryApiUrl}/api/v1/package/${deliveryData?.package_id}`, { method: 'get', headers }).then((res) => {
                        return res.json();
                    }).then((dataPackage) => {
                        const { from_location, to_location, _id, __v, width, weight, height, depth, ...packageInfo } = dataPackage;
                        const fromLocationMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(from_location.lat, from_location.lon),
                            map: map,
                            title: 'From Location',
                        });
                        const toLocationMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(to_location.lat, to_location.lon),
                            map: map,
                            title: 'To Location',
                        });
                        const packageData = document.getElementById('package');
                        while (packageData.firstChild) {
                            packageData.removeChild(packageData.firstChild);
                        }
                        displayPropreties(packageData, packageInfo);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
                const socket = io(`${socketUrl}`, {
                    auth: {
                        token: currentUser.token
                    }
                });
                socket.emit('joinRoom', deliveryId);
                setInterval(() => {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        socket.emit('location_changed', deliveryId, { lon: position.coords.longitude, lat: position.coords.latitude });
                    })
                }, Time_Period);
                const pickupButton = document.getElementById('pickup');
                const transitButton = document.getElementById('transit');
                const deliveredButton = document.getElementById('delivered');
                const failedButton = document.getElementById('failed');
                pickupButton.addEventListener('click', function (event) {
                    displayDeliveryStatus('picked-up');
                    socket.emit('status_changed', deliveryId, 'picked-up');
                    transitButton.removeAttribute('disabled');
                    pickupButton.setAttribute('disabled', true);
                    transitButton.addEventListener('click', function (event1) {
                        displayDeliveryStatus('in-transit');
                        socket.emit('status_changed', deliveryId, 'in-transit');
                        deliveredButton.removeAttribute('disabled');
                        failedButton.removeAttribute('disabled');
                        transitButton.setAttribute('disabled', true);
                        deliveredButton.addEventListener('click', function (event2) {
                            displayDeliveryStatus('delivered');
                            socket.emit('status_changed', deliveryId, 'delivered');
                            failedButton.setAttribute('disabled', true);
                        });
                        failedButton.addEventListener('click', function (event3) {
                            displayDeliveryStatus('failed');
                            deliveredButton.setAttribute('disabled', true);
                            socket.emit('status_changed', deliveryId, 'failed');
                        })
                    })
                });

            })
            .catch(error => {
                console.error(error);
            });
    }

});