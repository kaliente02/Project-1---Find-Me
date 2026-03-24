document.addEventListener("DOMContentLoaded", () => {

    // Replace with real user data
    const fullName = "User Name"; // This should be dynamically set based on logged-in user data
    document.getElementById("fullName").textContent = fullName;

    document.getElementById("manageAccountBtn").addEventListener("click", () => {
        window.location.href = "../html/manage-account.html";
    });

    document.getElementById("myActivityBtn").addEventListener("click", () => {
        window.location.href = "../html/activity.html";
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        // Optional: clear session/localStorage here
        // localStorage.clear();
        window.location.href = "../html/login.html";
    });

});