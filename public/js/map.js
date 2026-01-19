

    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

        // console.log(coordinates);

    const marker = new mapboxgl.Marker({color: 'black'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
            `<br><h5>${listing.title}</h5> <p>Exact Location will be provided After Booking</p>`
        ))
        .addTo(map);