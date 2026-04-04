document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn  = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn     = document.getElementById("profileBtn");
    const filterBtn      = document.getElementById("filterBtn");
    const searchInput    = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    // Filter panel elements
    const filterPanel    = document.getElementById("filterPanel");
    const applyFilterBtn = document.getElementById("applyFilterBtn");
    const clearFilterBtn = document.getElementById("clearFilterBtn");
    const filterToast    = document.getElementById("filterToast");

    const FOUND_URL = "https://script.google.com/macros/s/AKfycbzo2DgJ47oOdRGzOMBZCNt0wPn1jsdUTvdM2nJ5y6sd-7FXSzwPmvUJfbmdtPNG-PAIqQ/exec";

    let allLoadedItems = [];
    let toastTimer;

    // ── NAVIGATION ──────────────────────────────────────────────────
    reportLostBtn.addEventListener("click",  () => window.location.href = "admin-recent-lost.html");
    reportFoundBtn.addEventListener("click", () => window.location.href = "admin-recent-found.html");
    profileBtn.addEventListener("click",     () => window.location.href = "admin-profile.html");

    // ── FILTER PANEL TOGGLE ─────────────────────────────────────────
    filterBtn.addEventListener("click", () => {
        const isOpen = filterPanel.classList.toggle("open");
        filterBtn.classList.toggle("active", isOpen);
    });

    // ── FETCH ITEMS ─────────────────────────────────────────────────
    async function fetchItems(url) {
        const response = await fetch(url);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    async function loadItems() {
        try {
            const foundItems = await fetchItems(FOUND_URL);
            foundItems.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));

            allLoadedItems = foundItems;
            renderCards(allLoadedItems);

        } catch (error) {
            console.error("Error fetching found items:", error);
            itemsContainer.innerHTML = `<p>Failed to load found items. ${error}</p>`;
        }
    }

    // ── RENDER CARDS ────────────────────────────────────────────────
    function renderCards(items) {
        itemsContainer.innerHTML = "";

        if (items.length === 0) {
            itemsContainer.innerHTML = "<p>No found items match your filters.</p>";
            return;
        }

        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "item-card";

            card.innerHTML = `
                <div class="item-image">
                    <img src="${item.imageUrl || '../assets/images/placeholder.jpg'}" alt="${item.itemName}">
                </div>
                <div class="item-details">
                    <p><strong>Item Name:</strong> ${item.itemName || ''}</p>
                    <p><strong>Status:</strong> FOUND</p>
                    <p><strong>Date Reported:</strong> ${item.dateReported || ''}</p>
                    <button class="details-btn">View Full Details</button>
                </div>
            `;

            card.querySelector(".details-btn").addEventListener("click", () => {
                const params = new URLSearchParams({
                    itemName:     item.itemName     || '',
                    category:     item.category     || '',
                    description:  item.description  || '',
                    dateReported: item.dateReported || '',
                    location:     item.location     || '',
                    status:       'found',
                    itemId:       item.itemId       || '',
                    reportedBy:   item.reportedBy   || '',
                    imageUrl:     item.imageUrl     || ''
                });
                window.location.href = `admin-recent-items.html?${params.toString()}`;
            });

            itemsContainer.appendChild(card);
        });
    }

    // ── APPLY FILTERS ────────────────────────────────────────────────
    function getFilterValues() {
        return {
            search:   searchInput.value.trim().toLowerCase(),
            category: document.getElementById("filterCategory").value.toLowerCase(),
            location: document.getElementById("filterLocation").value.trim().toLowerCase(),
            date:     document.getElementById("filterDate").value,
            color:    document.getElementById("filterColor").value.toLowerCase(),
        };
    }

    function applyFilters() {
        const f = getFilterValues();

        const filtered = allLoadedItems.filter(item => {
            const name     = (item.itemName     || '').toLowerCase();
            const category = (item.category     || '').toLowerCase();
            const location = (item.location     || '').toLowerCase();
            const date     = (item.dateReported || '');
            const color    = (item.color        || '').toLowerCase();
            const desc     = (item.description  || '').toLowerCase();

            if (f.search   && !name.includes(f.search) && !desc.includes(f.search) && !location.includes(f.search)) return false;
            if (f.category && !category.includes(f.category)) return false;
            if (f.location && !location.includes(f.location)) return false;
            if (f.date     && date !== f.date)                return false;
            if (f.color    && !color.includes(f.color))       return false;

            return true;
        });

        renderCards(filtered);

        const active = Object.entries(f).filter(([, v]) => v).length;
        showToast(active
            ? `Showing ${filtered.length} result${filtered.length !== 1 ? 's' : ''} · ${active} filter${active !== 1 ? 's' : ''} applied`
            : 'No filters applied');
    }

    applyFilterBtn.addEventListener("click", applyFilters);

    // ── CLEAR FILTERS ────────────────────────────────────────────────
    clearFilterBtn.addEventListener("click", () => {
        searchInput.value = '';
        ['filterCategory', 'filterColor'].forEach(id => {
            document.getElementById(id).selectedIndex = 0;
        });
        document.getElementById("filterLocation").value = '';
        document.getElementById("filterDate").value = '';

        renderCards(allLoadedItems);
        showToast('Filters cleared');
    });

    // ── SEARCH BAR (live, when filter panel is closed) ───────────────
    searchInput.addEventListener("keyup", () => {
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