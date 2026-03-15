document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn = document.getElementById("profileBtn");
    const filterBtn = document.getElementById("filterBtn");
    const searchInput = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    // API URL (FOUND only)
    const FOUND_URL = "https://script.google.com/macros/s/AKfycbzo2DgJ47oOdRGzOMBZCNt0wPn1jsdUTvdM2nJ5y6sd-7FXSzwPmvUJfbmdtPNG-PAIqQ/exec";

    // Redirect Buttons
    reportLostBtn.addEventListener("click", () => window.location.href = "report-lost-1.html");
    reportFoundBtn.addEventListener("click", () => window.location.href = "report-found.html");
    profileBtn.addEventListener("click", () => window.location.href = "profile.html");

    // Fetch helper
    async function fetchItems(url) {
        const response = await fetch(url);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    async function loadItems() {
        try {
            // Fetch only FOUND items
            const foundItems = await fetchItems(FOUND_URL);

            // Sort by most recent
            foundItems.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));

            itemsContainer.innerHTML = "";

            if (foundItems.length === 0) {
                itemsContainer.innerHTML = "<p>No found items available.</p>";
                return;
            }

            foundItems.forEach(item => {
                const card = document.createElement("div");
                card.className = "item-card";

                card.innerHTML = `
                    <div class="item-image">
                        <img src="${item.imageUrl || '../assets/images/placeholder.jpg'}" alt="${item.itemName}">
                    </div>
                    <div class="item-details">
                        <p><strong>Item Name:</strong> ${item.itemName}</p>
                        <p><strong>Status:</strong> FOUND</p>
                        <p><strong>Date Reported:</strong> ${item.dateReported || ''}</p>
                        <button class="details-btn">View Full Details</button>
                    </div>
                `;

                card.querySelector(".details-btn").addEventListener("click", () => {
                    window.location.href = "recent-items.html";
                });

                itemsContainer.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching found items:", error);
            itemsContainer.innerHTML = `<p>Failed to load found items. ${error}</p>`;
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