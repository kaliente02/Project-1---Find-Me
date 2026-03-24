/***********************
 * CONFIGURATION
 ***********************/
const API_URL = "https://script.google.com/macros/s/AKfycbwlDsBZv9NJFS4DvFEqioEyTvUMLmH2ckjjLVJUhIOpja8bC9X4qt6lifsQXFAVL8fK/exec";


document.addEventListener("DOMContentLoaded", () => {

  /***********************
   * STEP 1 LOGIC
   ***********************/

  // HOME BUTTON LOGIC
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      // Redirect to home.html
      window.location.href = "../html/home.html";
    });
  }

  const proceedBtn = document.getElementById("proceedBtn");

  if (proceedBtn) {

    const itemName = document.getElementById("itemName");
    const category = document.getElementById("category");
    const description = document.getElementById("description");
    const lostDate = document.getElementById("lostDate");
    const location = document.getElementById("location");

    proceedBtn.addEventListener("click", async () => {

      const data = {
        itemName: itemName.value.trim(),
        category: category.value,
        description: description.value.trim(),
        lostDate: lostDate.value,
        location: location.value.trim()
      };

      if (!data.itemName || !data.category || !data.lostDate) {
        alert("Please fill out required fields.");
        return;
      }

      try {

        const res = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.status === "success") {
          localStorage.setItem("reportLostStep1", JSON.stringify(data));
          window.location.href = "../html/report-lost-2.html";
        } else {
          alert("Failed to save data: " + (result.message || "Unknown error"));
        }

      } catch (err) {
        console.error("Connection error:", err);
        alert("Connection error. Check deployment and Web App access.");
      }

    });
  }


  /***********************
   * STEP 2 LOGIC
   ***********************/
  const submitBtn = document.getElementById("submitBtn");

  if (submitBtn) {

    submitBtn.addEventListener("click", async () => {

      const step1Data = JSON.parse(localStorage.getItem("reportLostStep1"));

      if (!step1Data) {
        alert("Missing Step 1 data");
        return;
      }

      const features = document.getElementById("features");
      const imageUpload = document.getElementById("imageUpload");

      const file = imageUpload.files[0];

      let imageBase64 = "";
      let imageType = "";
      let imageName = "";

      if (file) {
        imageBase64 = await toBase64(file);
        imageType = file.type;
        imageName = file.name;
      }

      const payload = {
        ...step1Data,
        features: features.value.trim(),
        imageBase64,
        imageType,
        imageName
      };

      try {

        const res = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (result.status === "success") {
          alert("Lost item reported successfully!");
          localStorage.removeItem("reportLostStep1");
          window.location.href = "../html/home.html";
        } else {
          alert("Upload failed: " + result.message);
        }

      } catch (err) {
        console.error("Connection error:", err);
        alert("Connection error. Check Web App deployment.");
      }

    });
  }

});


/***********************
 * Convert File to Base64
 ***********************/
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}