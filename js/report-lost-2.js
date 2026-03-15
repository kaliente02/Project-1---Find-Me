submitBtn.addEventListener("click", async () => {
  const step1Data = JSON.parse(localStorage.getItem("reportLostStep1"));
  if (!step1Data) {
    alert("Missing Step 1 data");
    return;
  }

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
      headers: { "Content-Type": "application/json" },
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
    console.error(err);
    alert("Submission error");
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}