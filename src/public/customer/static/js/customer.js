const currentUser = JSON.parse(localStorage.getItem('user'));
const trackButton = document.getElementById('trackButton');
const packageID = document.getElementById('packageId');
trackButton.addEventListener('click', function (event) {
    event.preventDefault();
    packageIDValue = packageID.value;
    if (packageIDValue === '') {
        alert("please insert valid package ID...");
    } else {
        const headers = new Headers();
        headers.append('x-access-token', currentUser.token);
        fetch(`${deliveryApiUrl}/api/v1/package/${packageIDValue}`, { method: 'get', headers })
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
            .then(data => {
                const { from_location, to_location, _id, __v, width, weight, height, depth, ...packageInfo } = data;
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
                if (data?.active_delivery_id) {
                    fetch(`${deliveryApiUrl}/api/v1/delivery/${data.active_delivery_id}`, { method: 'get', headers }).then((res) => {
                        return res.json();
                    }).then((deliveryData) => {
                        let { location, status, __v, _id, ...deliveryInfo } = deliveryData;
                        const deliveryDataElt = document.getElementById('delivery');
                        while (deliveryDataElt.firstChild) {
                            deliveryDataElt.removeChild(deliveryDataElt.firstChild);
                        }
                        displayDeliveryStatus(status);
                        displayPropreties(deliveryDataElt, deliveryInfo);
                        const socket = io(`${socketUrl}`, {
                            auth: {
                                token: currentUser.token
                            }
                        });
                        socket.emit('joinRoom', deliveryData.delivery_id);
                        socket.on('location_changed', (location) => {
                            const currentLocalisation = new google.maps.Marker({
                                position: new google.maps.LatLng(location.lat, location.lon),
                                map: map,
                                title: 'To Location',
                            });
                        });
                        socket.on('status_changed', (newStatus) => {
                            displayDeliveryStatus(newStatus);
                        })
                        displayDeliveryStatus(status);

                    }).catch((err) => {
                        console.log(err);
                    })
                }

            })
            .catch(error => {
                console.error(error);
            });
    }
});
