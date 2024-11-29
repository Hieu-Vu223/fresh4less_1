// Import the necessary Firebase Admin SDK and functions from Firebase Functions
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Function to send notification on order status update
exports.sendOrderUpdateNotification = functions.firestore
  .document("customerOrders/{orderId}")
  .onUpdate((change, context) => {
    const newStatus = change.after.data().status;
    const fcmToken = change.after.data().fcmToken; // Ensure each order includes a token

    if (!fcmToken) {
      console.log("No FCM token found, skipping notification.");
      return null;
    }

    const message = {
      notification: {
        title: "Order Update",
        body: `Your order status is now: ${newStatus}`
      },
      token: fcmToken
    };

    // Send the notification using Firebase Admin Messaging
    return admin.messaging().send(message)
      .then((response) => {
        console.log("Successfully sent notification:", response);
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  });

// Function to send notification on new offer creation
exports.sendNewOfferNotification = functions.firestore
  .document("foodOffers/{offerId}")
  .onCreate((snapshot, context) => {
    const offer = snapshot.data();
    const topic = "newOffers"; // Define a topic for new offers notifications

    const message = {
      notification: {
        title: "New Offer Available!",
        body: `Check out our new offer: ${offer.name}`
      },
      topic: topic
    };

    // Send the notification to the topic
    return admin.messaging().send(message)
      .then((response) => {
        console.log("Successfully sent offer notification:", response);
      })
      .catch((error) => {
        console.error("Error sending offer notification:", error);
      });
  });
