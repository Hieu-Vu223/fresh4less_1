// src/utils/notifications.js
import { getMessaging, getToken } from 'firebase/messaging';
import { messaging } from '../firebaseConfig'; // Ensure this path is correct based on your structure

export const requestFCMPermission = async () => {
  try {
    // Request FCM token with VAPID key
    const fcmToken = await getToken(messaging, { vapidKey: 'BDlDDGc29dAh_-7T8aNsHV0qlpkgn6__YcY0jHM3oeLuL5LI1J-hWEOvWLVxKn-ISvzpdolDeKyjF5VzjMGW8RY' });
    if (fcmToken) {
      console.log('FCM token:', fcmToken);
      // Optionally, save this FCM token in Firestore associated with the user ID
    } else {
      console.log('No FCM token found. Request permission from the user.');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};
