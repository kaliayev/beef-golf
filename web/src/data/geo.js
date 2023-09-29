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