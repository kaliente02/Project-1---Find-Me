document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn = document.getElementById("profileBtn");
    const filterBtn = document.getElementById("filterBtn");
    const printBtn = document.getElementById("printBtn");
    const searchInput = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    const LOST_URL = "https://script.google.com/macros/s/AKfycbwlDsBZv9NJFS4DvFEqioEyTvUMLmH2ckjjLVJUhIOpja8bC9X4qt6lifsQXFAVL8fK/exec";
    const FOUND_URL = "https://script.google.com/macros/s/AKfycbzo2DgJ47oOdRGzOMBZCNt0wPn1jsdUTvdM2nJ5y6sd-7FXSzwPmvUJfbmdtPNG-PAIqQ/exec";

    // NAVIGATION
    reportFoundBtn.addEventListener("click", () => window.location.href = "admin-claim-request.html");
    reportLostBtn.addEventListener("click", () => window.location.href = "admin-home.html");
    profileBtn.addEventListener("click", () => window.location.href = "admin-profile.html");
    printBtn.addEventListener("click", () => window.print());

    // FETCH ITEMS
    async function fetchItems(url, type) {
        const response = await fetch(url);
        const data = await response.json();
        return Array.isArray(data) ? data.map(item => ({ ...item, type })) : [];
    }

    async function loadItems() {
        try {
            const [lostItems, foundItems] = await Promise.all([
                fetchItems(LOST_URL, "lost"),
                fetchItems(FOUND_URL, "found")
            ]);

            // Combine lost and found items, newest first
            const allItems = [...lostItems, ...foundItems];
            allItems.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));

            itemsContainer.innerHTML = "";

            // Filter items with images
            let itemsWithImages = allItems.filter(item => item.imageUrl);

            // Remove duplicates based on itemName + imageUrl + type + reportedBy + dateReported + location
            const seen = new Set();
            itemsWithImages = itemsWithImages.filter(item => {
                const key = (
                    (item.itemName || '') + "|" +
                    (item.imageUrl || '') + "|" +
                    (item.type || '') + "|" +
                    (item.reportedBy || '') + "|" +
                    (item.dateReported || '') + "|" +
                    (item.location || '')
                ).toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            if (itemsWithImages.length === 0) {
                itemsContainer.innerHTML = "<p>No items with images found.</p>";
                return;
            }

            // Render cards
            itemsWithImages.forEach(item => {
                const card = document.createElement("div");
                card.className = "item-card";

                card.innerHTML = `
                    <div class="item-image">
                        <img src="${item.imageUrl}" alt="${item.itemName}">
                    </div>
                    <div class="item-details">
                        <p><strong>Item Name:</strong> ${item.itemName || ''}</p>
                        <p><strong>Status:</strong> ${item.type.toUpperCase()}</p>
                        <p><strong>Date Reported:</strong> ${item.dateReported || ''}</p>
                        <button class="details-btn">View Full Details</button>

                        <div class="print-only-details">
                            <p><strong>Category:</strong> ${item.category || ''}</p>
                            <p><strong>Description:</strong> ${item.description || ''}</p>
                            <p><strong>Location:</strong> ${item.location || ''}</p>
                            <p><strong>Reported By:</strong> ${item.reportedBy || ''}</p>
                            <p><strong>Item ID:</strong> ${item.itemId || ''}</p>
                        </div>
                    </div>
                `;

                card.querySelector(".details-btn").addEventListener("click", () => {
                    const params = new URLSearchParams({
                        itemName:     item.itemName     || '',
                        category:     item.category     || '',
                        description:  item.description  || '',
                        dateReported: item.dateReported || '',
                        location:     item.location     || '',
                        status:       item.type         || '',
                        itemId:       item.itemId       || '',
                        reportedBy:   item.reportedBy   || '',
                        imageUrl:     item.imageUrl     || ''
                    });
                    window.location.href = `recent-items.html?${params.toString()}`;
                });

                itemsContainer.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching items:", error);
            itemsContainer.innerHTML = `<p>Failed to load items. ${error}</p>`;
        }
    }

    loadItems();

    // SEARCH FUNCTION
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".item-card");
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(value) ? "flex" : "none";
        });
    });

    // FILTER BUTTON (placeholder)
    filterBtn.addEventListener("click", () => alert("Filter function coming soon."));

});