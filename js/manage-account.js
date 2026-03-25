import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

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

let currentUser = null;

// ─────────────────────────────
// LOAD USER DATA
// ─────────────────────────────
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    console.log("Logged in UID:", user.uid);

    try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            console.log("Loaded data:", data);

            document.getElementById("fullName").value = data.fullName || "";
            document.getElementById("email").value = data.email || "";
            document.getElementById("idNumber").value = data.idNumber || "";
            document.getElementById("contactNumber").value = data.contact || "";
            document.getElementById("role").value = data.role || "User";

            document.getElementById("displayName").textContent = data.fullName || "—";
            document.getElementById("displayRole").textContent = data.role || "User";

        } else {
            console.warn("No Firestore data. Using fallback.");

            document.getElementById("fullName").value = user.displayName || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("displayName").textContent = user.displayName || "—";
        }

    } catch (error) {
        console.error("Load error:", error);
    }
});

// ─────────────────────────────
// LIVE NAME UPDATE
// ─────────────────────────────
document.getElementById("fullName").addEventListener("input", (e) => {
    document.getElementById("displayName").textContent = e.target.value || "—";
});

// ─────────────────────────────
// PROFILE IMAGE (LOCAL)
// ─────────────────────────────
const imageInput = document.getElementById("imageInput");
const profileImage = document.getElementById("profileImage");

document.getElementById("editProfileBtn").addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            profileImage.src = reader.result;
            // ✅ Save image to localStorage so profile.js can read it
            localStorage.setItem("profileImage", reader.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved image
const savedImage = localStorage.getItem("profileImage");
if (savedImage) profileImage.src = savedImage;

// ─────────────────────────────
// SAVE CHANGES
// ─────────────────────────────
document.getElementById("saveBtn").addEventListener("click", async () => {

    if (!currentUser) return;

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const idNumber = document.getElementById("idNumber").value.trim();
    const contact = document.getElementById("contactNumber").value.trim();

    console.log("Saving...", { fullName, email, idNumber, contact });

    if (!fullName || !email) {
        alert("Full name and email are required.");
        return;
    }

    try {
        // 🔹 Update Auth display name
        await updateProfile(currentUser, {
            displayName: fullName
        });

        // 🔹 Save to Firestore
        await setDoc(doc(db, "users", currentUser.uid), {
            fullName,
            email,
            idNumber,
            contact,
            updatedAt: new Date()
        }, { merge: true });

        // ✅ Sync fullName to localStorage so profile.js can read it
        localStorage.setItem("fullName", fullName);

        console.log("Saved successfully!");
        alert("Profile updated successfully!");

    } catch (error) {
        console.error("Save error:", error);
        alert(error.message);
    }
});

// ─────────────────────────────
// CHANGE PASSWORD
// ─────────────────────────────
document.getElementById("updatePasswordBtn").addEventListener("click", async () => {

    if (!currentUser) return;

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert("All password fields are required.");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match.");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    try {
        // 🔹 Re-authenticate user
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );

        await reauthenticateWithCredential(currentUser, credential);

        // 🔹 Update password
        await updatePassword(currentUser, newPassword);

        alert("Password updated successfully!");

        // Clear fields
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmNewPassword").value = "";

    } catch (error) {
        console.error("Password update error:", error);

        if (error.code === "auth/wrong-password") {
            alert("Current password is incorrect.");
        } else if (error.code === "auth/too-many-requests") {
            alert("Too many attempts. Try again later.");
        } else {
            alert(error.message);
        }
    }
});

// ─────────────────────────────
// LOGOUT
// ─────────────────────────────
document.getElementById("logoutBtn").addEventListener("click", async () => {
    if (confirm("Are you sure you want to log out?")) {
        await signOut(auth);
        window.location.href = "login.html";
    }
});