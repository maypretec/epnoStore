import { initializeApp } from '@firebase/app';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBljKN8_1nd7bf89I95QoZdtDA1ncG5Fks",
  authDomain: "app-epno.firebaseapp.com",
  databaseURL: "https://app-epno-default-rtdb.firebaseio.com",
  projectId: "app-epno",
  storageBucket: "app-epno.appspot.com",
  messagingSenderId: "104008859862",
  appId: "1:104008859862:web:11efa043314b8fe0f0c977",
  measurementId: "G-VGWQ1VMBF4"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const setupNotifications = async () => {
  try {
    // Request permission for notifications
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Get the FCM token
      const token = await getToken(messaging);
      localStorage.setItem("fcm", token)
      console.log('FCM Token:', token);
    } else {
      console.log('Notification permission denied.');
    }
    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      console.log('Foreground Message:', payload);
      // Handle the notification or update your UI
    });
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};
export { messaging, setupNotifications };