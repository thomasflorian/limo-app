import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const addRequest = functions.region("us-central1").https.onCall(async (data) => {
    // Get all driver queues.
    const drivers = (await db.collection("drivers").get()).docs;
    // Logic for choosing which queue to add request to. Currently adds request to smallest queue.
    let choosenDriver = drivers[0];
    for (let i = 1; i < drivers.length; i++) {
        if (drivers[i].data().requests.length < choosenDriver.data().requests.length ) {
            choosenDriver = drivers[i];
        }
    }
    // Update choosen queue.
    const updatedRequests = choosenDriver.data().requests.concat([data]);
    const updatedQueuedRiders = choosenDriver.data().queuedRiders + 1;
    
    // Update driver information
    await db.collection("drivers").doc(choosenDriver.id).update({requests: updatedRequests, queuedRiders: updatedQueuedRiders});
    await db.collection("requests").doc(data.id).set({driverId: choosenDriver.id, pickedUp: false, pickup: data.pickup, dropoff: data.dropoff});
    // Return driver information.
    return {driverID: choosenDriver.id};
});

export const cancelRequest = functions.region("us-central1").https.onCall(async (data) => {
    // get driver list.
    const driver = await db.collection("drivers").doc(data.driverId).get();
    let requests = driver.get("requests");
    let queuedRiders = driver.get("queuedRiders");

    // find and delete cancelled request.
    for (let i = requests.length-1; i >= 0; i--){
        if (requests[i].id == data.id) {
            requests.splice(i,1);
            queuedRiders -= 1;
            break;
        }
    }
    // Update driver information
    await db.collection("drivers").doc(data.driverId).update({requests: requests, queuedRiders: queuedRiders});
    await db.collection("requests").doc(data.id).delete();
});

