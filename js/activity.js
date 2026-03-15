document.addEventListener("DOMContentLoaded", () => {

    const lostBtn = document.getElementById("lostBtn");
    const foundBtn = document.getElementById("foundBtn");
    const claimBtn = document.getElementById("claimBtn");

    const buttons = [lostBtn, foundBtn, claimBtn];

    function setActive(activeButton) {
        buttons.forEach(btn => btn.classList.remove("active"));
        activeButton.classList.add("active");
    }

    lostBtn.addEventListener("click", () => {
        setActive(lostBtn);
        window.location.href = "recent-lost.html";
    });

    foundBtn.addEventListener("click", () => {
        setActive(foundBtn);
        window.location.href = "recent-found.html";
    });

    claimBtn.addEventListener("click", () => {
        setActive(claimBtn);
        window.location.href = "recent-claim.html";
    });

});