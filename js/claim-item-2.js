const API_URL = "https://script.google.com/macros/s/AKfycbztV_dRX9yMCD5-_rHMlEHFfcumogCBqJRknvihNNOf9_7OUGb0juFu8s1QG-uJ4P2pVg/exec";

document.addEventListener("DOMContentLoaded", () => {

    const submitBtn = document.getElementById("submitBtn");
    const homeNavBtn = document.getElementById("homeNavBtn");

    // ==============================
    // NAVIGATION
    // ==============================
    homeNavBtn.addEventListener("click", () => {
        window.location.href = "home.html";
    });

    // ==============================
    // SUBMIT CLAIM
    // ==============================
    submitBtn.addEventListener("click", async () => {

        const description = document.getElementById("itemDescription").value.trim();
        const fileInput = document.getElementById("proofUpload");
        const lostDate = document.getElementById("lostDate").value;
        const lastLocation = document.getElementById("lastLocation").value.trim();

        // Basic validation
        if (!description || !fileInput.files[0] || !lostDate || !lastLocation) {
            alert("Please complete all required fields before submitting.");
            return;
        }

        // Retrieve stored data from Page 1
        const storedData = JSON.parse(sessionStorage.getItem("claimData"));

        if (!storedData) {
            alert("Claim data missing. Please restart the claim process.");
            window.location.href = "claim-item-1.html";
            return;
        }

        const file = fileInput.files[0];

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            const base64 = await toBase64(file);

            const payload = {
                fullName: storedData.fullName,
                idNumber: storedData.idNumber,
                email: storedData.email,
                contact: storedData.contact,
                description,
                lostDate,
                lastLocation,
                fileName: file.name,
                fileType: file.type,
                fileData: base64.split(',')[1]
            };

            const response = await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                alert("Claim request submitted successfully!");
                sessionStorage.removeItem("claimData");
                window.location.href = "home.html";
            } else {
                alert("Submission failed: " + result.error);
                submitBtn.disabled = false;
                submitBtn.textContent = "SUBMIT CLAIM REQUEST";
            }

        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred while submitting your claim.");
            submitBtn.disabled = false;
            submitBtn.textContent = "SUBMIT CLAIM REQUEST";
        }
    });
});

// ==============================
// Convert file to Base64
// ==============================
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}