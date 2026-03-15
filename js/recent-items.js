document.addEventListener("DOMContentLoaded", () => {

    const claimBtn = document.getElementById("claimBtn");
    const homeBtn = document.getElementById("homeBtn");

    // TEMPORARY DATA (replace later with Google Sheets data)
    document.getElementById("itemName").textContent = "Pink Wallet";
    document.getElementById("itemCategory").textContent = "Accessories";
    document.getElementById("itemDescription").textContent = "Leather wallet with multiple cards inside.";
    document.getElementById("itemDate").textContent = "02/01/2026";
    document.getElementById("itemLocation").textContent = "University Lobby";
    document.getElementById("itemStatus").textContent = "Found";
    document.getElementById("itemId").textContent = "ITM-2026-001";
    document.getElementById("reportedBy").textContent = "Admin";

    // BUTTON ACTIONS
    claimBtn.addEventListener("click", () => {
        window.location.href = "claim-item-1.html";
    });

    homeBtn.addEventListener("click", () => {
        window.location.href = "home.html";
    });

});