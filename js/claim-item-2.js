const API_URL = "https://script.google.com/macros/s/AKfycbztV_dRX9yMCD5-_rHMlEHFfcumogCBqJRknvihNNOf9_7OUGb0juFu8s1QG-uJ4P2pVg/exec";

document.addEventListener("DOMContentLoaded", () => {

    const submitBtn = document.getElementById("submitBtn");
    const homeNavBtn = document.getElementById("homeNavBtn");

    // ── NAVIGATION ──
    homeNavBtn.addEventListener("click", () => {
        window.location.href = "home.html";
    });

    // ── SUBMIT CLAIM ──
    submitBtn.addEventListener("click", async () => {

        const description = document.getElementById("itemDescription").value.trim();
        const fileInput   = document.getElementById("proofUpload");
        const lostDate    = document.getElementById("lostDate").value;
        const lastLocation= document.getElementById("lastLocation").value.trim();

        if (!description || !fileInput.files[0] || !lostDate || !lastLocation) {
            alert("Please complete all required fields.");
            return;
        }

        // Retrieve session data from Page 1
        let storedData;
        try {
            storedData = JSON.parse(sessionStorage.getItem("claimData"));
        } catch {
            alert("Session data corrupted. Please restart the claim process.");
            window.location.href = "claim-item-1.html";
            return;
        }

        if (!storedData) {
            alert("Missing claim data. Please restart the claim process.");
            window.location.href = "claim-item-1.html";
            return;
        }

        const { fullName, idNumber, email, contact, itemName, itemId } = storedData;
        if (!fullName || !idNumber || !email || !contact) {
            alert("Personal details missing. Please restart the claim process.");
            window.location.href = "claim-item-1.html";
            return;
        }

        const file = fileInput.files[0];

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            // Convert file to Base64
            const base64 = await toBase64(file);

            // Use URLSearchParams to avoid CORS preflight
            const formData = new URLSearchParams();
            formData.append("fullName", fullName);
            formData.append("idNumber", idNumber);
            formData.append("email", email);
            formData.append("contact", contact);
            formData.append("itemName", itemName);
            formData.append("itemId", itemId);
            formData.append("description", description);
            formData.append("lostDate", lostDate);
            formData.append("lastLocation", lastLocation);
            formData.append("fileName", file.name);
            formData.append("fileType", file.type);
            formData.append("fileData", base64.split(',')[1]); // Only raw Base64

            console.log("Submitting payload:", Object.fromEntries(formData));

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert("Claim submitted successfully!");
                sessionStorage.removeItem("claimData");
                window.location.href = "home.html";
            } else {
                throw new Error(result.error || "Unknown error from server");
            }

        } catch (error) {
            console.error("Submission error:", error);
            alert("Submission failed: " + error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = "SUBMIT CLAIM REQUEST";
        }

    });
});

// ── HELPER: Convert file to Base64 ──
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}