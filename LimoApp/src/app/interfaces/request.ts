// Define interface for location.
export interface Request {
    name: string,
    time: firebase.default.firestore.Timestamp,
    pickup: string,
    dropoff: string,
    pickupLatLng:  firebase.default.firestore.GeoPoint,
    dropoffLatLng:  firebase.default.firestore.GeoPoint
  }