document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn  = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn     = document.getElementById("profileBtn");
    const filterBtn      = document.getElementById("filterBtn");
    const searchInput    = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    const modal      = document.getElementById("claimModal");
    const modalClose = document.getElementById("modalClose");
    const modalImage = document.getElementById("modalImage");
    const modalBody  = document.getElementById("modalBody");

    const filterPanel    = document.getElementById("filterPanel");
    const applyFilterBtn = document.getElementById("applyFilterBtn");
    const clearFilterBtn = document.getElementById("clearFilterBtn");
    const filterToast    = document.getElementById("filterToast");

    const CLAIM_URL = "https://script.google.com/macros/s/AKfycbztV_dRX9yMCD5-_rHMlEHFfcumogCBqJRknvihNNOf9_7OUGb0juFu8s1QG-uJ4P2pVg/exec";

    let allLoadedClaims = [];
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

    // ── HELPERS ─────────────────────────────────────────────────────
    function getDriveFileId(url) {
        if (!url) return null;
        const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match1) return match1[1];
        const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match2) return match2[1];
        if (/^[a-zA-Z0-9_-]{25,}$/.test(url.trim())) return url.trim();
        return null;
    }

    function getDriveImageUrl(url) {
        if (!url) return null;
        const id = getDriveFileId(url);
        if (!id) return url;
        return `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
    }

    function formatDate(raw) {
        try {
            const d = new Date(raw);
            if (isNaN(d)) return raw;
            return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        } catch (e) {
            return raw;
        }
    }

    function toISODate(raw) {
        if (!raw) return "";
        try {
            const d = new Date(raw);
            if (isNaN(d)) return "";
            return d.toISOString().slice(0, 10);
        } catch (e) {
            return "";
        }
    }

    // ── FETCH CLAIMS ────────────────────────────────────────────────
    async function fetchClaims() {
        const response = await fetch(CLAIM_URL);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    async function loadClaims() {
        try {
            const claims = await fetchClaims();
            claims.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
            allLoadedClaims = claims;
            renderCards(allLoadedClaims);
        } catch (error) {
            console.error("Error fetching claim data:", error);
            itemsContainer.innerHTML = `<p class="empty-state">Failed to load claim requests. Please try again later.</p>`;
        }
    }

    // ── RENDER CARDS ────────────────────────────────────────────────
    function renderCards(claims) {
        itemsContainer.innerHTML = "";

        if (claims.length === 0) {
            itemsContainer.innerHTML = `<p class="empty-state">No claim requests match your filters.</p>`;
            return;
        }

        claims.forEach(claim => {
            const card = document.createElement("div");
            card.className = "item-card";

            const imageUrl    = getDriveImageUrl(claim["Proof File URL"]);
            const itemName    = claim["Full Name"] || "—";
            const status      = claim["Status"] || "Pending";
            const rawDate     = claim["Date Lost"] || claim["Timestamp"] || "";
            const dateDisplay = rawDate ? formatDate(rawDate) : "—";

            card.innerHTML = `
                <div class="item-image">
                    ${imageUrl
                        ? `<img src="${imageUrl}" alt="Item" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <span class="img-placeholder" style="display:none;">No Image</span>`
                        : `<span class="img-placeholder">No Image</span>`
                    }
                </div>
                <div class="item-details">
                    <div class="labels">
                        <p><strong>Item Name:</strong> ${itemName}</p>
                        <p><strong>Status:</strong> ${status}</p>
                        <p><strong>Date Reported:</strong> ${dateDisplay}</p>
                    </div>
                    <div class="claim-btn-row">
                        <button class="claim-btn">View Claim Request</button>
                    </div>
                </div>
            `;

            card.querySelector(".claim-btn").addEventListener("click", () => openModal(claim, imageUrl));
            itemsContainer.appendChild(card);
        });
    }

    // ── APPLY FILTERS ────────────────────────────────────────────────
    function getFilterValues() {
        return {
            search:   searchInput.value.trim().toLowerCase(),
            status:   document.getElementById("filterStatus").value.toLowerCase(),
            name:     document.getElementById("filterName").value.trim().toLowerCase(),
            item:     document.getElementById("filterItem").value.trim().toLowerCase(),
            location: document.getElementById("filterLocation").value.trim().toLowerCase(),
            date:     document.getElementById("filterDate").value,
        };
    }

    function applyFilters() {
        const f = getFilterValues();

        const filtered = allLoadedClaims.filter(claim => {
            const name     = (claim["Full Name"]     || '').toLowerCase();
            const itemName = (claim["Item Name"]     || '').toLowerCase();
            const status   = (claim["Status"]        || '').toLowerCase();
            const location = (claim["Location Lost"] || '').toLowerCase();
            const dateLost = toISODate(claim["Date Lost"]);
            const desc     = (claim["Description"]   || '').toLowerCase();

            if (f.search && !name.includes(f.search) && !itemName.includes(f.search) && !desc.includes(f.search) && !location.includes(f.search)) return false;
            if (f.status   && !status.includes(f.status))     return false;
            if (f.name     && !name.includes(f.name))         return false;
            if (f.item     && !itemName.includes(f.item))     return false;
            if (f.location && !location.includes(f.location)) return false;
            if (f.date     && dateLost !== f.date)            return false;

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
        document.getElementById("filterStatus").selectedIndex = 0;
        document.getElementById("filterName").value     = '';
        document.getElementById("filterItem").value     = '';
        document.getElementById("filterLocation").value = '';
        document.getElementById("filterDate").value     = '';

        renderCards(allLoadedClaims);
        showToast('Filters cleared');
    });

    // ── LIVE SEARCH ──────────────────────────────────────────────────
    searchInput.addEventListener("keyup", () => {
        if (!filterPanel.classList.contains("open")) {
            const value = searchInput.value.toLowerCase();
            document.querySelectorAll(".item-card").forEach(card => {
                card.style.display = card.innerText.toLowerCase().includes(value) ? "flex" : "none";
            });
        }
    });

    // ── MODAL ────────────────────────────────────────────────────────
    function openModal(claim, imageUrl) {
        if (imageUrl) {
            modalImage.src = imageUrl;
            modalImage.style.display = "block";
            modalImage.onerror = () => { modalImage.style.display = "none"; };
        } else {
            modalImage.style.display = "none";
        }

        const fieldsToShow = [
            { label: "Full Name",      key: "Full Name" },
            { label: "Item Name",      key: "Item Name" },
            { label: "Description",    key: "Description" },
            { label: "Date Lost",      key: "Date Lost" },
            { label: "Location Lost",  key: "Location Lost" },
            { label: "Status",         key: "Status" },
            { label: "Contact",        key: "Contact" },
            { label: "Email",          key: "Email" },
            { label: "Date Submitted", key: "Timestamp" },
        ];

        let html = "";
        fieldsToShow.forEach(({ label, key }) => {
            const value = claim[key];
            if (!value) return;
            const displayValue = key === "Status"
                ? `<span class="status-badge">${value}</span>`
                : (key === "Timestamp" || key === "Date Lost") ? formatDate(value) : value;
            html += `
                <div class="modal-row">
                    <span class="label">${label}</span>
                    <span class="value">${displayValue}</span>
                </div>
            `;
        });

        if (!html) html = `<p style="color:#888;">No additional details available.</p>`;
        modalBody.innerHTML = html;

        // ── Accept button ────────────────────────────────────────────
        const acceptBtn = document.getElementById("modalAcceptBtn");
        const alreadyApproved = (claim["Status"] || "").toLowerCase() === "approved";

        const freshAccept = acceptBtn.cloneNode(true);
        acceptBtn.replaceWith(freshAccept);
        freshAccept.disabled    = alreadyApproved;
        freshAccept.textContent = alreadyApproved ? "Already Approved" : "Accept Request";
        freshAccept.addEventListener("click", () => acceptClaim(claim, freshAccept));

        // ── Home button ──────────────────────────────────────────────
        const homeBtn   = document.getElementById("modalHomeBtn");
        const freshHome = homeBtn.cloneNode(true);
        homeBtn.replaceWith(freshHome);
        freshHome.addEventListener("click", () => window.location.href = "admin-home.html");

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    // ── ACCEPT CLAIM ─────────────────────────────────────────────────
    // Uses URLSearchParams (no Content-Type: application/json header)
    // This avoids the CORS preflight that blocks requests from localhost
    async function acceptClaim(claim, btn) {
        const confirmed = confirm(`Approve the claim request for "${claim["Full Name"]}"?\n\nThis will mark the status as Approved.`);
        if (!confirmed) return;

        btn.disabled    = true;
        btn.textContent = "Processing…";
        btn.style.textDecoration = "none";

        try {
            const res = await fetch(CLAIM_URL, {
                method: "POST",
                body: new URLSearchParams({
                    action:    "updateStatus",
                    timestamp: claim["Timestamp"],
                    status:    "Approved"
                })
            });

            const rawText = await res.text();

            let result;
            try {
                result = JSON.parse(rawText);
            } catch (_) {
                console.error("Non-JSON response:", rawText);
                showToast("❌ Unexpected server response.");
                btn.disabled    = false;
                btn.textContent = "Accept Request";
                btn.style.textDecoration = "underline";
                return;
            }

            if (result.success) {
                claim["Status"] = "Approved";

                const statusBadge = modalBody.querySelector(".status-badge");
                if (statusBadge) statusBadge.textContent = "Approved";

                btn.textContent = "Already Approved";
                showToast("✅ Claim approved successfully!");
                renderCards(allLoadedClaims);
            } else {
                const msg = result.message || result.error || "Unknown server error.";
                console.error("Server error:", msg);
                showToast("❌ " + msg);
                btn.disabled    = false;
                btn.textContent = "Accept Request";
                btn.style.textDecoration = "underline";
            }

        } catch (err) {
            console.error("Network error:", err);
            showToast("❌ Network error. Check your connection.");
            btn.disabled    = false;
            btn.textContent = "Accept Request";
            btn.style.textDecoration = "underline";
        }
    }

    // ── CLOSE MODAL ──────────────────────────────────────────────────
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    // ── TOAST ────────────────────────────────────────────────────────
    function showToast(msg) {
        clearTimeout(toastTimer);
        filterToast.textContent = msg;
        filterToast.classList.add("show");
        toastTimer = setTimeout(() => filterToast.classList.remove("show"), 2400);
    }

    // ── INIT ─────────────────────────────────────────────────────────
    loadClaims();

});