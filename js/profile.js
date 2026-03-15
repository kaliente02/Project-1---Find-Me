document.addEventListener("DOMContentLoaded", () => {

    // Example: dynamically load user name (replace later with real data)
    const fullName = "Shane Hollander";
    document.getElementById("fullName").textContent = fullName;

    document.getElementById("manageAccountBtn").addEventListener("click", () => {
        window.location.href = "manage-account.html";
    });

    document.getElementById("myActivityBtn").addEventListener("click", () => {
        window.location.href = "activity.html";
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        // Optional: clear session/localStorage here
        // localStorage.clear();

        window.location.href = "login.html";
    });

});