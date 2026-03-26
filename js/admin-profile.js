// profile.js
document.addEventListener("DOMContentLoaded", () => {

    // ────────────── DISPLAY NAME ──────────────
    const fullNameEl = document.getElementById("fullName");
    const savedName = localStorage.getItem("fullName"); // synced from manage-account.js
    fullNameEl.textContent = savedName || "Full Name";

    // ────────────── PROFILE IMAGE ──────────────
    const profileImageContainer = document.querySelector(".profile-image");
    const savedImage = localStorage.getItem("profileImage"); // synced from manage-account.js

    if (savedImage) {
        // Remove placeholder SVG if exists
        const placeholder = profileImageContainer.querySelector(".avatar-placeholder");
        if (placeholder) placeholder.remove();

        // Remove any existing img to avoid duplicates
        const existingImg = profileImageContainer.querySelector("img");
        if (existingImg) existingImg.remove();

        // Create img element
        const img = document.createElement("img");
        img.src = savedImage;
        img.alt = "Profile Picture";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.borderRadius = "50%";

        profileImageContainer.appendChild(img);
    }

    // ────────────── BUTTON LOGIC ──────────────
    const manageBtn = document.getElementById("manageAccountBtn");
    const activityBtn = document.getElementById("myActivityBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const homeBtn = document.getElementById("homeBtn");

    manageBtn.addEventListener("click", () => {
        window.location.href = "../html/manage-account.html";
    });

    activityBtn.addEventListener("click", () => {
        window.location.href = "../html/admin-activity.html";
    });

    logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            window.location.href = "../html/login.html";
        }
    });

    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            window.location.href = "../html/admin-homepage.html";
        });
    }

});