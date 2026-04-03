document.addEventListener("DOMContentLoaded", () => {

    const homeBtn = document.getElementById("homeBtn");

    // Read ALL item data from URL query parameters
    const params = new URLSearchParams(window.location.search);

    const itemName    = params.get("itemName")    || "Unknown Item";
    const category    = params.get("category")    || "—";
    const description = params.get("description") || "—";
    const dateReported= params.get("dateReported")|| "—";
    const location    = params.get("location")    || "—";
    const status      = params.get("status")      || "—";
    const itemId      = params.get("itemId")      || "—";
    const reportedBy  = params.get("reportedBy")  || "—";
    const imageUrl    = params.get("imageUrl")    || "";

    // Populate the page
    document.getElementById("itemName").textContent        = itemName;
    document.getElementById("itemCategory").textContent    = category;
    document.getElementById("itemDescription").textContent = description;
    document.getElementById("itemDate").textContent        = dateReported;
    document.getElementById("itemLocation").textContent    = location;
    document.getElementById("itemStatus").textContent      = status.toUpperCase();
    document.getElementById("itemId").textContent          = itemId;
    document.getElementById("reportedBy").textContent      = reportedBy;

    // Only set image if URL exists
    const itemImage = document.getElementById("itemImage");
    if (imageUrl) {
        itemImage.src = imageUrl;
        itemImage.alt = itemName;
    }

    homeBtn.addEventListener("click", () => {
        window.location.href = "admin-home.html";
    });

});