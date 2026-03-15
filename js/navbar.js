// navbar.js

document.addEventListener("DOMContentLoaded", () => {
    const accountBtn = document.getElementById("accountBtn");

    if (!accountBtn) return;

    accountBtn.addEventListener("click", () => {
        window.location.href = "../html/signup.html";
    });
});