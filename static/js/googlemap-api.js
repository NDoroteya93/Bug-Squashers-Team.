import service from 'service';

(() => {
    if (window.location.href.indexOf("dashboard") > -1) {
        let $dashboardMmap = $('#map-dashboard');

        service.get('http://localhost:3005/user')
            .then((data) => {
                let coordinates = {};
                coordinates.sells = data.sells;
                coordinates.rents = data.rents;
                return coordinates;
            })
            .then((coords) => {
                initMap($dashboardMmap, coords);
            });
    } else {
        initMap();
    }


    function initMap($map, coords) {
        $map = $map || $('#map-location');
        const options = {
            zoom: 7,
            center: new google.maps.LatLng(42.733883, 25.485829999999964)
        }

        let marker;
        let infoWindow;

        const drawingManager = new google.maps.drawing.DrawingManager();
        const map = new google.maps.Map($map[0], options);
        drawingManager.setMap(map);

        // add place
        if ($map[0].id === 'map-location') {
            const searchBox = new google.maps.places.SearchBox(document.getElementById('address'));
            google.maps.event.addListener(searchBox, 'places_changed', () => {
                const places = searchBox.getPlaces();

                const bounds = new google.maps.LatLngBounds();
                let i, place;

                for (i = 0; place = places[i]; i++) {

                    bounds.extend(place.geometry.location);
                    addMarker(map, {
                        coords: place.geometry.location,
                        content: `<div><strong>${place.name}</strong><br>
                ${place.formatted_address}</div>`
                    });
                    document.getElementById('lat').value = place.geometry.location.lat();
                    document.getElementById('lng').value = place.geometry.location.lng();
                }

                map.fitBounds(bounds);
                map.setZoom(15);

            });
            const geocoder = new google.maps.Geocoder();
            google.maps.event.addListener(map, 'click', function(e) {
                const latLng = e.latLng;
                geocoder.geocode({
                    'latLng': latLng
                }, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            addMarker(map, {
                                    coords: latLng,
                                    content: `<div><strong>${results[0].formatted_address}</strong></div>`
                                }

                            );
                        }
                    }
                });

            });
        } else if ($map[0].id === 'map-dashboard') {

            Promise.resolve(coords)
                .then((coords) => {
                    coords.sells.forEach((coord) => {
                        const props = {};
                        let latLng = new google.maps.LatLng(parseFloat(coord.lat), parseFloat(coord.lng));
                        props.coords = latLng;
                        props.content = coord.address;
                        addMarker(map, props);
                    });

                    return coords;
                })
                .then((coords) => {
                    coords.rents.forEach((coord) => {
                        const props = {};
                        let latLng = new google.maps.LatLng(parseFloat(coord.lat), parseFloat(coord.lng));
                        props.coords = latLng;
                        props.content = coord.address;
                        addMultipleMarkers(map, props);
                    });
                });
        }
        // add marker
        function addMultipleMarkers(map, props) {
            let markers = new google.maps.Marker({
                position: props.coords,
                icon: '/static/pictures/house-02.png',
                map: map,
                draggable: true
            });


            let infoWindows = new google.maps.InfoWindow({ content: props.content });
            markers.addListener('click', () => {
                infoWindows.open(map, markers);
            });
        }

        // add marker
        function addMarker(map, props) {
            if (!marker) {
                marker = new google.maps.Marker({
                    position: props.coords,
                    icon: '/static/pictures/house-02.png',
                    map: map,
                    draggable: true
                });


                infoWindow = new google.maps.InfoWindow({ content: props.content });
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
            } else {
                marker.setPosition(props.coords);
                infoWindow.setContent(props.content);
            }
        }

    }

})();
