import { initializeApp } from '@firebase/app';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';
import UserService from '../api/users';
import { message as antdMessage } from 'antd'; // Import AntD message for notifications

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

const setupNotifications = async (foregroundNotificationCallback) => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Retrieve the FCM token
      const token = await getToken(messaging);
      localStorage.setItem("fcm", token);
      console.log('FCM Token:', token);
      
      const user = JSON.parse(localStorage.getItem('user'));
      UserService.SaveToken({ token, userId: user.id })
        .then(response => {
          console.log('Token saved:', response);
        })
        .catch(error => console.error('Error saving the token:', error));
    } else {
      console.log('Notification permission denied.');
    }

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Use the callback passed to the function to handle the foreground notification
      if (foregroundNotificationCallback) {
        foregroundNotificationCallback(payload);
      }

      // Optionally, show a toast message using AntD
      antdMessage.info({
        content: `${payload.data.title}: ${payload.data.body}`, // Customize based on your notification structure
        duration: 2, // Duration in seconds for the message
        style: { marginTop: '10vh' }, // Optional: Custom style for the message
      });
    });
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};

export { messaging, setupNotifications };
