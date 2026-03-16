document.addEventListener("DOMContentLoaded", () => {

    // ── Navbar Home button ──
    document.getElementById("homeNavBtn").addEventListener("click", () => {
        window.location.href = "home.html";
    });

    // ── Read item data from URL params (passed from recent-items.js) ──
    const params = new URLSearchParams(window.location.search);

    const itemName = params.get("itemName") || "—";
    const itemId   = params.get("itemId")   || "—";
    const status   = params.get("status")   || "—";
    const imageUrl = params.get("imageUrl") || "";

    // ── Populate the "Item Being Claimed" section ──
    document.getElementById("itemName").textContent   = itemName;
    document.getElementById("itemId").textContent     = itemId;
    document.getElementById("itemStatus").textContent = status.toUpperCase();

    // Only show image if a URL was passed
    const itemImage = document.getElementById("itemImage");
    if (imageUrl) {
        itemImage.src          = imageUrl;
        itemImage.alt          = itemName;
        itemImage.style.display = "block";
    }

    // ── Proceed button ──
    document.getElementById("proceedBtn").addEventListener("click", () => {

        const fullName = document.getElementById("fullName").value.trim();
        const idNumber = document.getElementById("idNumber").value.trim();
        const email    = document.getElementById("email").value.trim();
        const contact  = document.getElementById("contact").value.trim();

        if (!fullName || !idNumber || !email || !contact) {
            alert("Please fill in all required fields.");
            return;
        }

        // Save claimant info AND item info to sessionStorage for claim-item-2
        sessionStorage.setItem("claimData", JSON.stringify({
            fullName,
            idNumber,
            email,
            contact,
            itemName,
            itemId,
            status,
            imageUrl
        }));

        window.location.href = "claim-item-2.html";
    });

});