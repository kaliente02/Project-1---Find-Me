proceedBtn.addEventListener("click", () => {

    const fullName = document.getElementById("fullName").value.trim();
    const idNumber = document.getElementById("idNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!fullName || !idNumber || !email || !contact) {
        alert("Please fill in all required fields.");
        return;
    }

    sessionStorage.setItem("claimData", JSON.stringify({
        fullName,
        idNumber,
        email,
        contact
    }));

    window.location.href = "claim-item-2.html";
});