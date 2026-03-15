document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn = document.getElementById("profileBtn");
    const filterBtn = document.getElementById("filterBtn");
    const searchInput = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    //CLAIM APPS SCRIPT URL HERE
    const CLAIM_URL = "https://script.google.com/macros/s/AKfycbztV_dRX9yMCD5-_rHMlEHFfcumogCBqJRknvihNNOf9_7OUGb0juFu8s1QG-uJ4P2pVg/exec";

    // Redirect Buttons
    reportLostBtn.addEventListener("click", () => window.location.href = "report-lost-1.html");
    reportFoundBtn.addEventListener("click", () => window.location.href = "report-found.html");
    profileBtn.addEventListener("click", () => window.location.href = "profile.html");

    // Fetch helper
    async function fetchClaims() {
        const response = await fetch(CLAIM_URL);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    async function loadClaims() {
        try {

            const claims = await fetchClaims();

            // Sort by latest Timestamp
            claims.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

            itemsContainer.innerHTML = "";

            if (claims.length === 0) {
                itemsContainer.innerHTML = "<p>No claim requests available.</p>";
                return;
            }

            claims.forEach(claim => {

                const card = document.createElement("div");
                card.className = "item-card";

                card.innerHTML = `
                    <div class="item-details">
                        <p><strong>Name:</strong> ${claim["Full Name"] || ""}</p>
                        <p><strong>Description:</strong> ${claim.Description || ""}</p>
                        <p><strong>Date Lost:</strong> ${claim["Date Lost"] || ""}</p>
                        <p><strong>Status:</strong> ${claim.Status || "Pending"}</p>
                        <button class="proof-btn">View Proof</button>
                    </div>
                `;

                // Open proof file in new tab
                card.querySelector(".proof-btn").addEventListener("click", () => {
                    if (claim["Proof File URL"]) {
                        window.open(claim["Proof File URL"], "_blank");
                    } else {
                        alert("No proof file uploaded.");
                    }
                });

                itemsContainer.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching claim data:", error);
            itemsContainer.innerHTML = `<p>Failed to load claim requests.</p>`;
        }
    }

    loadClaims();

    // Search functionality
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".item-card");

        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(value) ? "flex" : "none";
        });
    });

    filterBtn.addEventListener("click", () => {
        alert("Filter function coming soon.");
    });

});