const highAccuracyOptions = {
    enableHighAccuracy: true,
    maximumAge: 8000,
    timeout: 5000
}
function getGeoCallback() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                return {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitude_accuracy: position.coords.altitudeAccuracy
                }
            },
            (error) => {
                console.log(error)
            },
            highAccuracyOptions
        )
    } else {
        console.log('geolocation not available')
    }
}

export function getGeo() {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitude_accuracy: position.coords.altitudeAccuracy
                    })
                },
                (error) => {
                    console.log(error)
                    //reject(error)
                },
                highAccuracyOptions
            )
        } else {
            console.log('geolocation not available')
            reject()
        }
    })
}

export function haversine_distance(mk1, mk2) {
    let R = 6371.0710; // Radius of the Earth in kilometers
    let rlat1 = mk1.latitude * (Math.PI/180); // Convert degrees to radians
    let rlat2 = mk2.latitude * (Math.PI/180); // Convert degrees to radians
    let difflat = rlat2-rlat1; // Radian difference (latitudes)
    let difflon = (mk2.longitude-mk1.longitude) * (Math.PI/180); // Radian difference (longitudes)
    let d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));

    let km_to_yards = 1093.6132983377
    return d * km_to_yards
}

/***
 *
 * @param {Object} position
 * @param {number} position.coords.latitude
 * @param {number} position.coords.longitude
 * @param {number} position.coords.accuracy
 *
 */
export function getDistance() {
    return 0;
}