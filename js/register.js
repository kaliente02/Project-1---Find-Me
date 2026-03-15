// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCvKJHcpPYl1vpQCxEHGTG3zLFr-1Mwdv4",
    authDomain: "find-me-9f46b.firebaseapp.com",
    projectId: "find-me-9f46b",
    storageBucket: "find-me-9f46b.firebasestorage.app",
    messagingSenderId: "256369843170",
    appId: "1:256369843170:web:10c98a8b032d7ae4cc77bb",
    measurementId: "G-1H6MCYMWWM"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);