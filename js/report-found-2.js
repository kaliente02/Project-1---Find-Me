const API_URL = "https://script.google.com/macros/s/AKfycbzo2DgJ47oOdRGzOMBZCNt0wPn1jsdUTvdM2nJ5y6sd-7FXSzwPmvUJfbmdtPNG-PAIqQ/exec";

document.addEventListener("DOMContentLoaded", () => {

  const submitBtn = document.getElementById("submitBtn");
  const turnedInTo = document.getElementById("turnedInTo");
  const imageUpload = document.getElementById("imageUpload");

  submitBtn.addEventListener("click", async () => {

    const step1Data = JSON.parse(localStorage.getItem("reportFoundStep1"));

    if (!step1Data) {
      alert("Missing Step 1 data.");
      return;
    }

    if (!turnedInTo.value.trim()) {
      alert("Please enter where the item was turned in.");
      return;
    }

    let imageBase64 = "";
    let imageType = "";
    let imageName = "";

    const file = imageUpload.files[0];

    if (file) {
      imageBase64 = await toBase64(file);
      imageType = file.type;
      imageName = file.name;
    }

    // ✅ MATCH FIELD NAMES WITH APPS SCRIPT
    const payload = {
      itemName: step1Data.itemName,
      category: step1Data.category,
      description: step1Data.description,
      foundDate: step1Data.foundDate,
      location: step1Data.foundLocation,   // matches sheet column
      features: turnedInTo.value.trim(),  // matches sheet column
      imageBase64,
      imageType,
      imageName
    };

    try {

      // ✅ NO HEADERS (prevents CORS issue)
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      console.log("SERVER RESPONSE:", text);

      const result = JSON.parse(text);

      if (result.status === "success") {
        alert("Found item reported successfully!");
        localStorage.removeItem("reportFoundStep1");
        window.location.href = "home.html";
      } else {
        alert("Server error: " + result.message);
      }

    } catch (error) {
      console.error("FULL ERROR:", error);
      alert("Submission failed. Check Web App deployment.");
    }

  });

});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}