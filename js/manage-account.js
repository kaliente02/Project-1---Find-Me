document.addEventListener("DOMContentLoaded", () => {

    // ── Sample user data (replace with real session/backend data) ──
    const userData = {
        fullName: "Juan Dela Cruz",
        role: "User",
        email: "juan@email.com",
        idNumber: "2024-00123",
        contact: "09123456789"
    };

    // ── Populate fields ──
    document.getElementById("fullName").value = userData.fullName;
    document.getElementById("role").value = userData.role;
    document.getElementById("email").value = userData.email;
    document.getElementById("idNumber").value = userData.idNumber;
    document.getElementById("contactNumber").value = userData.contact;

    // ── Sync display name live as user types ──
    document.getElementById("fullName").addEventListener("input", (e) => {
        document.getElementById("displayName").textContent = e.target.value || "—";
    });

    // ── Profile image change ──
    const editProfileBtn = document.getElementById("editProfileBtn");
    const imageInput = document.getElementById("imageInput");
    const profileImage = document.getElementById("profileImage");

    editProfileBtn.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                profileImage.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // ── Change password ──
    document.getElementById("changePasswordBtn").addEventListener("click", () => {
        window.location.href = "change-password.html";
    });

    // ── Logout ──
    document.getElementById("logoutBtn").addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            // localStorage.clear(); // optional: clear session
            window.location.href = "login.html";
        }
    });

});