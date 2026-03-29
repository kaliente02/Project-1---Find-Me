document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn = document.getElementById("profileBtn");
    const filterBtn = document.getElementById("filterBtn");
    const printBtn = document.getElementById("printBtn");
    const searchInput = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    // Filter panel elements
    const filterPanel   = document.getElementById("filterPanel");
    const applyFilterBtn = document.getElementById("applyFilterBtn");
    const clearFilterBtn = document.getElementById("clearFilterBtn");
    const filterToast   = document.getElementById("filterToast");

    const LOST_URL  = "https://script.google.com/macros/s/AKfycbwlDsBZv9NJFS4DvFEqioEyTvUMLmH2ckjjLVJUhIOpja8bC9X4qt6lifsQXFAVL8fK/exec";
    const FOUND_URL = "https://script.google.com/macros/s/AKfycbzo2DgJ47oOdRGzOMBZCNt0wPn1jsdUTvdM2nJ5y6sd-7FXSzwPmvUJfbmdtPNG-PAIqQ/exec";

    // Store all loaded items so we can re-filter without re-fetching
    let allLoadedItems = [];
    let toastTimer;

    // ── NAVIGATION ──────────────────────────────────────────────────
    reportLostBtn.addEventListener("click", () => window.location.href = "report-lost-1.html");
    reportFoundBtn.addEventListener("click", () => window.location.href = "report-found.html");
    profileBtn.addEventListener("click",    () => window.location.href = "profile.html");
    printBtn.addEventListener("click",      () => window.print());

    // ── FILTER PANEL TOGGLE ─────────────────────────────────────────
    filterBtn.addEventListener("click", () => {
        const isOpen = filterPanel.classList.toggle("open");
        filterBtn.classList.toggle("active", isOpen);
    });

    // ── FETCH ITEMS ─────────────────────────────────────────────────
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
            const combined = [...lostItems, ...foundItems];
            combined.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));

            // Filter items with images
            let itemsWithImages = combined.filter(item => item.imageUrl);

            // Remove duplicates
            const seen = new Set();
            itemsWithImages = itemsWithImages.filter(item => {
                const key = (
                    (item.itemName    || '') + "|" +
                    (item.imageUrl    || '') + "|" +
                    (item.type        || '') + "|" +
                    (item.reportedBy  || '') + "|" +
                    (item.dateReported|| '') + "|" +
                    (item.location    || '')
                ).toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            allLoadedItems = itemsWithImages;
            renderCards(allLoadedItems);

        } catch (error) {
            console.error("Error fetching items:", error);
            itemsContainer.innerHTML = `<p>Failed to load items. ${error}</p>`;
        }
    }

    // ── RENDER CARDS ────────────────────────────────────────────────
    function renderCards(items) {
        itemsContainer.innerHTML = "";

        if (items.length === 0) {
            itemsContainer.innerHTML = "<p>No items found matching your filters.</p>";
            return;
        }

        items.forEach(item => {
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
    }

    // ── APPLY FILTERS ────────────────────────────────────────────────
    function getFilterValues() {
        return {
            search:   searchInput.value.trim().toLowerCase(),
            category: document.getElementById("filterCategory").value.toLowerCase(),
            status:   document.getElementById("filterStatus").value.toLowerCase(),
            location: document.getElementById("filterLocation").value.trim().toLowerCase(),
            date:     document.getElementById("filterDate").value,
            color:    document.getElementById("filterColor").value.toLowerCase(),
        };
    }

    function applyFilters() {
        const f = getFilterValues();

        const filtered = allLoadedItems.filter(item => {
            const name     = (item.itemName    || '').toLowerCase();
            const category = (item.category    || '').toLowerCase();
            const type     = (item.type        || '').toLowerCase();
            const location = (item.location    || '').toLowerCase();
            const date     = (item.dateReported|| '');
            const color    = (item.color       || '').toLowerCase();
            const desc     = (item.description || '').toLowerCase();

            // Search bar — matches name, description, location
            if (f.search && !name.includes(f.search) && !desc.includes(f.search) && !location.includes(f.search)) return false;

            // Category dropdown
            if (f.category && !category.includes(f.category)) return false;

            // Status (lost / found)
            if (f.status && type !== f.status) return false;

            // Location text input
            if (f.location && !location.includes(f.location)) return false;

            // Date — exact match on dateReported (format: YYYY-MM-DD)
            if (f.date && date !== f.date) return false;

            // Color
            if (f.color && !color.includes(f.color)) return false;

            return true;
        });

        renderCards(filtered);

        // Count active filters for toast
        const active = Object.entries(f).filter(([, v]) => v).length;
        showToast(active
            ? `Showing ${filtered.length} result${filtered.length !== 1 ? 's' : ''} · ${active} filter${active !== 1 ? 's' : ''} applied`
            : 'No filters applied');
    }

    applyFilterBtn.addEventListener("click", applyFilters);

    // ── CLEAR FILTERS ────────────────────────────────────────────────
    clearFilterBtn.addEventListener("click", () => {
        searchInput.value = '';
        ['filterCategory', 'filterStatus', 'filterColor'].forEach(id => {
            document.getElementById(id).selectedIndex = 0;
        });
        document.getElementById("filterLocation").value = '';
        document.getElementById("filterDate").value = '';

        renderCards(allLoadedItems);
        showToast('Filters cleared');
    });

    // ── SEARCH BAR (live, no filter panel needed) ────────────────────
    searchInput.addEventListener("keyup", () => {
        // If filter panel is open, let Apply handle it; otherwise do live search
        if (!filterPanel.classList.contains("open")) {
            const value = searchInput.value.toLowerCase();
            const cards = document.querySelectorAll(".item-card");
            cards.forEach(card => {
                card.style.display = card.innerText.toLowerCase().includes(value) ? "flex" : "none";
            });
        }
    });

    // ── TOAST ────────────────────────────────────────────────────────
    function showToast(msg) {
        clearTimeout(toastTimer);
        filterToast.textContent = msg;
        filterToast.classList.add("show");
        toastTimer = setTimeout(() => filterToast.classList.remove("show"), 2400);
    }

    // ── INIT ─────────────────────────────────────────────────────────
    loadItems();

});