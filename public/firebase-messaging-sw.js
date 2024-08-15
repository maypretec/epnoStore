/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBljKN8_1nd7bf89I95QoZdtDA1ncG5Fks",
  authDomain: "app-epno.firebaseapp.com",
  databaseURL: "https://app-epno-default-rtdb.firebaseio.com",
  projectId: "app-epno",
  storageBucket: "app-epno.appspot.com",
  messagingSenderId: "104008859862",
  appId: "1:104008859862:web:11efa043314b8fe0f0c977",
  measurementId: "G-VGWQ1VMBF4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
