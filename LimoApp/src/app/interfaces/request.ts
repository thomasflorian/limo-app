import { Location } from "./location";

// Define interface for location.
export interface RideRequest {
    id: string,
    name: string,
    time: firebase.default.firestore.Timestamp,
    pickup: Location,
    dropoff: Location,
}

export interface CancelRequest {
    id: string,
    driverId: string
}