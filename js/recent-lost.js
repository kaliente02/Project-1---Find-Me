document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn = document.getElementById("profileBtn");
    const filterBtn = document.getElementById("filterBtn");
    const searchInput = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    // API URL for Lost items only
    const LOST_URL = "https://script.google.com/macros/s/AKfycbwlDsBZv9NJFS4DvFEqioEyTvUMLmH2ckjjLVJUhIOpja8bC9X4qt6lifsQXFAVL8fK/exec";

    // Redirect Buttons
    reportLostBtn.addEventListener("click", () => window.location.href = "report-lost-1.html");
    reportFoundBtn.addEventListener("click", () => window.location.href = "report-found.html");
    profileBtn.addEventListener("click", () => window.location.href = "profile.html");

    // Helper to fetch items and tag type
    async function fetchItems(url, type) {
        const response = await fetch(url);
        const data = await response.json();
        return Array.isArray(data) ? data.map(item => ({ ...item, type })) : [];
    }

    async function loadItems() {
        try {
            // Fetch only Lost items
            const lostItems = await fetchItems(LOST_URL, "lost");

            // Sort by dateReported descending
            lostItems.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));

            itemsContainer.innerHTML = "";

            if (lostItems.length === 0) {
                itemsContainer.innerHTML = "<p>No lost items found.</p>";
                return;
            }

            lostItems.forEach(item => {
                const card = document.createElement("div");
                card.className = "item-card";

                card.innerHTML = `
                    <div class="item-image">
                        <img src="${item.imageUrl || '../assets/images/placeholder.jpg'}" alt="${item.itemName}">
                    </div>
                    <div class="item-details">
                        <p><strong>Item Name:</strong> ${item.itemName}</p>
                        <p><strong>Status:</strong> LOST</p>
                        <p><strong>Date Reported:</strong> ${item.dateReported || ''}</p>
                        <button class="details-btn">View Full Details</button>
                    </div>
                `;

                card.querySelector(".details-btn").addEventListener("click", () => {
                    window.location.href = "recent-items.html"; // per-item details page
                });

                itemsContainer.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching lost items:", error);
            itemsContainer.innerHTML = `<p>Failed to load lost items. ${error}</p>`;
        }
    }

    loadItems();

    // Search functionality
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".item-card");
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(value) ? "flex" : "none";
        });
    });

    // Filter button placeholder
    filterBtn.addEventListener("click", () => alert("Filter function coming soon."));

});