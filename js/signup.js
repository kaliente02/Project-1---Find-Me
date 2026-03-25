import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCvKJHcpPYl1vpQCxEHGTG3zLFr-1Mwdv4",
    authDomain: "find-me-9f46b.firebaseapp.com",
    projectId: "find-me-9f46b",
    storageBucket: "find-me-9f46b.firebasestorage.app",
    messagingSenderId: "256369843170",
    appId: "1:256369843170:web:10c98a8b032d7ae4cc77bb"
};

// 🔹 Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 SIGN UP
document.getElementById('signupBtn').addEventListener('click', async () => {

    const fullName = document.getElementById('fullName').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const msgEl = document.getElementById('signupMsg');

    msgEl.innerText = "";

    // 🔹 Validation
    if (!fullName || !idNumber || !email || !password || !confirmPassword) {
        msgEl.innerText = "All fields are required.";
        msgEl.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        msgEl.innerText = "Passwords do not match.";
        msgEl.style.color = "red";
        return;
    }

    try {
        // 🔹 Create Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User created:", user.uid);

        // 🔹 Update Auth profile
        await updateProfile(user, {
            displayName: fullName
        });

        // 🔹 Save to Firestore (ALWAYS CREATES DOCUMENT)
        await setDoc(doc(db, "users", user.uid), {
            fullName,
            idNumber,
            email,
            contact: "",
            role: "User",
            createdAt: new Date()
        }, { merge: true });

        console.log("User saved to Firestore");

        msgEl.innerText = "Account created successfully!";
        msgEl.style.color = "green";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        console.error("Signup error:", error);
        msgEl.innerText = error.message;
        msgEl.style.color = "red";
    }
});