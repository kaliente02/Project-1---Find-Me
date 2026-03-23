document.addEventListener("DOMContentLoaded", () => {

    const reportLostBtn = document.getElementById("reportLostBtn");
    const reportFoundBtn = document.getElementById("reportFoundBtn");
    const profileBtn = document.getElementById("profileBtn");
    const filterBtn = document.getElementById("filterBtn");
    const searchInput = document.getElementById("searchInput");
    const itemsContainer = document.getElementById("itemsContainer");

    const modal = document.getElementById("claimModal");
    const modalClose = document.getElementById("modalClose");
    const modalImage = document.getElementById("modalImage");
    const modalBody = document.getElementById("modalBody");

    // CLAIM APPS SCRIPT URL
    const CLAIM_URL = "https://script.google.com/macros/s/AKfycbztV_dRX9yMCD5-_rHMlEHFfcumogCBqJRknvihNNOf9_7OUGb0juFu8s1QG-uJ4P2pVg/exec";

    // Redirect Buttons
    reportLostBtn.addEventListener("click", () => window.location.href = "report-lost-1.html");
    reportFoundBtn.addEventListener("click", () => window.location.href = "report-found.html");
    profileBtn.addEventListener("click", () => window.location.href = "profile.html");

    // Extract Google Drive file ID from any Drive URL format
    function getDriveFileId(url) {
        if (!url) return null;

        // /file/d/FILE_ID/view
        const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match1) return match1[1];

        // ?id=FILE_ID or &id=FILE_ID
        const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match2) return match2[1];

        // already just an ID (no slashes or dots)
        if (/^[a-zA-Z0-9_-]{25,}$/.test(url.trim())) return url.trim();

        return null;
    }

    // Convert Google Drive share link → embeddable image URL
    // Tries thumbnail endpoint first (most reliable), falls back to uc?export=view
    function getDriveImageUrl(url) {
        if (!url) return null;
        const id = getDriveFileId(url);
        if (!id) return url;
        // sz=w400 gives a 400px-wide thumbnail — works without login if file is public
        return `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
    }

    // Format ISO date → "March 15, 2026"
    function formatDate(raw) {
        try {
            const d = new Date(raw);
            if (isNaN(d)) return raw;
            return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        } catch (e) {
            return raw;
        }
    }

    // Fetch claims
    async function fetchClaims() {
        const response = await fetch(CLAIM_URL);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    async function loadClaims() {
        try {
            const claims = await fetchClaims();

            // Sort newest first
            claims.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

            itemsContainer.innerHTML = "";

            if (claims.length === 0) {
                itemsContainer.innerHTML = `<p class="empty-state">No claim requests available.</p>`;
                return;
            }

            claims.forEach(claim => {
                const card = document.createElement("div");
                card.className = "item-card";

                const imageUrl = getDriveImageUrl(claim["Proof File URL"]);
                const itemName = claim["Full Name"] || "—";
                const status = claim["Status"] || "Pending";
                const rawDate = claim["Date Lost"] || claim["Timestamp"] || "";
                const dateReported = rawDate ? formatDate(rawDate) : "—";

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
                            <p><strong>Date Reported:</strong> ${dateReported}</p>
                        </div>
                        <div class="claim-btn-row">
                            <button class="claim-btn">View Claim Request</button>
                        </div>
                    </div>
                `;

                // Open modal on "View Claim Request"
                card.querySelector(".claim-btn").addEventListener("click", () => {
                    openModal(claim, imageUrl);
                });

                itemsContainer.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching claim data:", error);
            itemsContainer.innerHTML = `<p class="empty-state">Failed to load claim requests. Please try again later.</p>`;
        }
    }

    // Build and show modal with full claim details
    function openModal(claim, imageUrl) {
        // Set image
        if (imageUrl) {
            modalImage.src = imageUrl;
            modalImage.style.display = "block";
            modalImage.onerror = () => {
                modalImage.style.display = "none";
            };
        } else {
            modalImage.style.display = "none";
        }

        // Build detail rows — show all available fields
        const fieldsToShow = [
            { label: "Full Name",       key: "Full Name" },
            { label: "Item Name",       key: "Item Name" },
            { label: "Description",     key: "Description" },
            { label: "Date Lost",       key: "Date Lost" },
            { label: "Location Lost",   key: "Location Lost" },
            { label: "Status",          key: "Status" },
            { label: "Contact",         key: "Contact" },
            { label: "Email",           key: "Email" },
            { label: "Date Submitted",  key: "Timestamp" },
        ];

        let html = "";
        fieldsToShow.forEach(({ label, key }) => {
            const value = claim[key];
            if (!value) return; // skip empty fields

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

        // Fallback if no fields matched
        if (!html) {
            html = `<p style="color:#888;">No additional details available.</p>`;
        }

        modalBody.innerHTML = html;
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    // Close modal
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    loadClaims();

    // Live search
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase();
        document.querySelectorAll(".item-card").forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(value) ? "flex" : "none";
        });
    });

    filterBtn.addEventListener("click", () => {
        alert("Filter function coming soon.");
    });

});