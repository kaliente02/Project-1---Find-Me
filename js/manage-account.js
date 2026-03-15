document.addEventListener("DOMContentLoaded", () => {

    // Example user data (replace later with real session data)
    const userData = {
        fullName: "Juan Dela Cruz",
        role: "User",
        email: "juan@email.com",
        idNumber: "2024-00123",
        contact: "09123456789"
    };

    document.getElementById("fullName").value = userData.fullName;
    document.getElementById("role").value = userData.role;
    document.getElementById("email").value = userData.email;
    document.getElementById("idNumber").value = userData.idNumber;
    document.getElementById("contactNumber").value = userData.contact;

    // Profile image change
    const editBtn = document.getElementById("editProfileBtn");
    const imageInput = document.getElementById("imageInput");
    const profileImage = document.getElementById("profileImage");

    editBtn.addEventListener("click", () => {
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

    // Change password
    document.getElementById("changePasswordBtn").addEventListener("click", () => {
        window.location.href = "change-password.html";
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        // localStorage.clear(); // optional
        window.location.href = "login.html";
    });

});