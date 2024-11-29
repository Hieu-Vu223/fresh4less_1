importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCdYjWcicM_IoHhBoB5q80o-HVjSOjLahY",
  authDomain: "fresh4less-d3f51.firebaseapp.com",
  projectId: "fresh4less-d3f51",
  storageBucket: "fresh4less-d3f51.appspot.com",
  messagingSenderId: "307206325270",
  appId: "1:307206325270:web:a5e410426709ea5327a137",
  measurementId: "G-15SR8E55VR"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  // Use payload data to construct the notification
  const notificationTitle = payload.notification.title || "Order Status Update"; // Default title if none provided
  const notificationOptions = {
    body: payload.notification.body || "You have a new notification.", // Default body if none provided
    icon: '/firebase-logo.png', // Icon for the notification
    data: {
      // You can add additional data here if needed
      click_action: 'https://your-app-url.com/order-history', // URL to redirect on click
    },
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification
  event.waitUntil(
    clients.openWindow(event.notification.data.click_action) // Open the URL on notification click
  );
});
