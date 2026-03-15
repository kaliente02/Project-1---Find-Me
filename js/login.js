import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
   apiKey: "AIzaSyCvKJHcpPYl1vpQCxEHGTG3zLFr-1Mwdv4",
  authDomain: "find-me-9f46b.firebaseapp.com",
  projectId: "find-me-9f46b",
  storageBucket: "find-me-9f46b.firebasestorage.app",
  messagingSenderId: "256369843170",
  appId: "1:256369843170:web:10c98a8b032d7ae4cc77bb",
  measurementId: "G-1H6MCYMWWM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('loginBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msgEl = document.getElementById('loginMsg');

  if (!email || !password) {
    msgEl.innerText = "Email and password are required.";
    msgEl.style.color = 'red';
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem('userEmail', userCredential.user.email);
    window.location.href = "../html/home.html";
  } catch (error) {
    console.error(error);
    msgEl.innerText = error.message;
    msgEl.style.color = 'red';
  }
});