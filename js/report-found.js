document.addEventListener("DOMContentLoaded", () => {
  const proceedBtn = document.getElementById("proceedBtn");

  const itemName = document.getElementById("itemName");
  const category = document.getElementById("category");
  const description = document.getElementById("description");
  const foundDate = document.getElementById("foundDate");
  const foundLocation = document.getElementById("foundLocation");

  // PROCEED BUTTON LOGIC
  proceedBtn.addEventListener("click", () => {
    const data = {
      itemName: itemName.value.trim(),
      category: category.value,
      description: description.value.trim(),
      foundDate: foundDate.value,
      foundLocation: foundLocation.value.trim()
    };

    if (!data.itemName || !data.category || !data.foundDate || !data.foundLocation) {
      alert("Please fill out all required fields.");
      return;
    }

    localStorage.setItem("reportFoundStep1", JSON.stringify(data));
    window.location.href = "report-found-2.html";
  });

  // HOME BUTTON LOGIC
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "../html/home.html";
    });
  }
});