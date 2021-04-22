import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const addRequest = functions.region("us-central1").https.onCall(async (data) => {
    // Get all driver queues.
    const drivers = await db.collection("drivers").get();
    const queues = drivers.docs;
    // Logic for choosing which queue to add request to. Currently adds request to smallest queue.
    let choosenQueue = queues[0];
    for (let i = 1; i < queues.length; i++) {
        if (queues[i].data().requests.length < choosenQueue.data().requests.length ) {
            choosenQueue = queues[i];
        }
    }
    // Update choosen queue.
    const updatedRequests = choosenQueue.data().requests.concat([data]);
    await db.collection("drivers").doc(choosenQueue.id).set({requests: updatedRequests});
    // Return driver information.
    return {driverID: choosenQueue.id};
});

export const cancelRequest = functions.region("us-central1").https.onCall(async (data) => {
    // get driver list.
    const driver = await db.collection("drivers").doc(data.driverId).get();
    const list = driver.get("requests");
    
    functions.logger.log(driver)
    functions.logger.log(list)

    // find and delete cancelled request.
    for (let i = list.length-1; i >= 0; i--){
        if (list[i].id == data.id) {
            list.splice(i,1);
            break;
        }
    }
    await db.collection("drivers").doc(data.driverId).set({requests: list});
});

