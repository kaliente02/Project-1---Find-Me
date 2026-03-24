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

    reportLostBtn.addEventListener("click", () => window.location.href = "report-lost-1.html");
    reportFoundBtn.addEventListener("click", () => window.location.href = "report-found.html");
    profileBtn.addEventListener("click", () => window.location.href = "profile.html");
    printBtn.addEventListener("click", () => window.print());

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

            const allItems = [...lostItems, ...foundItems];
            allItems.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));

            itemsContainer.innerHTML = "";

            if (allItems.length === 0) {
                itemsContainer.innerHTML = "<p>No items found.</p>";
                return;
            }

            allItems.forEach(item => {
                const card = document.createElement("div");
                card.className = "item-card";

                card.innerHTML = `
                    <div class="item-image">
                        <img src="${item.imageUrl || '../assets/images/placeholder.jpg'}" alt="${item.itemName}">
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

    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".item-card");
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(value) ? "flex" : "none";
        });
    });

    filterBtn.addEventListener("click", () => alert("Filter function coming soon."));

});