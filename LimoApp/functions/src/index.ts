import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const addRequest = functions.https.onCall(async (data) => {
    // Get all driver queues
    const drivers = await db.collection("drivers").get();
    const queues = drivers.docs;
    // Logic for choosing which queue to add request to. Currently adds request to smallest queue.
    let choosenQueue = queues[0];
    for (let i = 1; i < queues.length; i++) {
        if (queues[i].data().requests.length < choosenQueue.data().requests.length ) {
            choosenQueue = queues[i];
        }
    }
    // Update choosen queue
    const updatedRequests = choosenQueue.data().requests.concat([data]);
    await db.collection("drivers").doc(choosenQueue.id).set({requests: updatedRequests});
});

