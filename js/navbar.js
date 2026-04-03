function initNavbar() {
    const accountBtn = document.getElementById("accountBtn");
    if (!accountBtn) return;

    accountBtn.addEventListener("click", () => {
        window.location.href = "../html/signup.html";
    });
}