document.addEventListener("DOMContentLoaded", function () {
  console.log("[Settings] DOMContentLoaded event fired");
  let userData = JSON.parse(document.getElementById("userData").value);
  console.log("[Settings] Loaded userData:", userData);

  // DOM Elements
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const editButtons = document.querySelectorAll(".btn-edit");
  const toast = document.getElementById("toast");
  const addressFieldsData = [
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "zipCode",
    "country",
  ];
  const addressFields = document.querySelectorAll("#address input");
  const editAddressBtn = document.getElementById("editAddressBtn");
  const saveAddressBtn = document.getElementById("saveAddressBtn");

  const nameError = document.getElementById("fullNameError");
  const mobile_noError = document.getElementById("mobile_noError");

  function loadUserData() {
    console.log("[Settings] Loading user data into input fields");
    document.getElementById("name").value = userData.name || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("mobile_no").value = userData.mobile_no || "";
    document.getElementById("username").value = userData.username || "";

    if (typeof userData.address === "string") {
      const addressParts = userData.address.split("|");
      addressFieldsData.forEach((field, index) => {
        document.getElementById(field).value = addressParts[index] || "";
      });
      console.log("[Settings] Loaded address fields:", addressParts);
    }
  }

  // Tab Switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabId = tab.getAttribute("data-tab");

      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  function validatepno(mobile_no) {
    const pnoRegex = /^[0-9]{10}$/;
    const isValid = pnoRegex.test(mobile_no);
    if (!isValid) {
      mobile_noError.style.display = "block";
    } else {
      mobile_noError.style.display = "none";
    }
    return isValid;
  }

  function validateName(name) {
    const nameRegex = /^[A-Za-z\s'-]{1,}$/;
    const isValid =
      nameRegex.test(name) && name.length >= 1 && name.length <= 20;

    if (!isValid) {
      nameError.style.display = "block";
    } else {
      nameError.style.display = "none";
    }

    return isValid;
  }

  // Load user data into input fields

  // Edit Profile Fields
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const fieldId = button.getAttribute("data-field");
      if (!fieldId) {
        // No data-field attribute, skip this button
        console.warn("[Settings] Edit button missing data-field attribute, skipping.");
        return;
      }
      const field = document.getElementById(fieldId);
      if (!field) {
        console.warn(`[Settings] Field with id '${fieldId}' not found, skipping button.`);
        return;
      }
      if (field.disabled) {
        console.log(`[Settings] Editing field: ${fieldId}`);
        field.disabled = false;
        field.focus();
        button.textContent = "Save";
        field.style.backgroundColor = "white";
      } else {
        if (fieldId === "name") {
          if (!validateName(field.value)) {
            console.warn("[Settings] Name validation failed");
            return;
          }
        }
        if (fieldId === "mobile_no") {
          if (!validatepno(field.value)) {
            console.warn("[Settings] Mobile number validation failed");
            return;
          }
        }
        field.disabled = true;
        button.textContent = "Edit";
        field.style.backgroundColor = "#f5f5f5";
        console.log(`[Settings] Saving field: ${fieldId} with value:`, field.value);
        saveUserData({
          [fieldId]: field.value,
        });
      }
    });
  });

  // Address Edit Button
  editAddressBtn.addEventListener("click", function () {
    console.log("[Settings] Editing address fields");
    toggleAddressFields(false);
    editAddressBtn.style.display = "none";
    saveAddressBtn.style.display = "block";
  });

  // Save Address Button
  saveAddressBtn.addEventListener("click", function () {
    const newAddressArray = addressFieldsData.map(
      (field) => document.getElementById(field).value
    );
    const newAddressString = newAddressArray.join("|");
    console.log("[Settings] Saving address:", newAddressArray);

    toggleAddressFields(true);
    saveAddressBtn.style.display = "none";
    editAddressBtn.style.display = "block";

    saveUserData({
      address: newAddressString,
    });
  });

  // Enable/Disable Address Fields
  function toggleAddressFields(disable) {
    addressFields.forEach((field) => {
      field.disabled = disable;
      field.style.backgroundColor = disable ? "#f5f5f5" : "white";
    });
    console.log(`[Settings] Address fields ${disable ? "disabled" : "enabled"}`);
  }

  // Save All Edited Data to Server
  function saveUserData(updatedFields) {
    showToast("Saving...", "info");
    // Merge existing userData with new updates
    const updatedUserData = {
      ...userData,
      ...updatedFields,
    };
    console.log("[Settings] Sending updated user data to server:", updatedUserData);

    fetch("/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("[Settings] Server response for saveUserData:", data);
        if (data.success) {
          showToast("Saved successfully!", "success");
          setTimeout(() => {
            location.reload(); // Reload only on success
          }, 1000);
        } else {
          showToast("Failed to save. Try again.", "error");
        }
      })
      .catch((err) => {
        showToast("Error saving data.", "error");
        console.error("[Settings] Error saving user data:", err);
      });
  }

  // Toast Notification
  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = "toast " + type;
    toast.style.display = "block";

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => {
        toast.style.display = "none";
        toast.style.animation = "";
      }, 300);
    }, 3000);
  }

  document
    .getElementById("deleteAccountBtn")
    .addEventListener("click", async function () {
      console.log("[Settings] Delete account button clicked");
      if (
        confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      ) {
        try {
          // Perform delete account action (send request to the server)
          console.log("[Settings] Sending delete account request to server");
          const response = await fetch(`/delete-account`);
          if (!response.ok) {
            showToast("Failed to delete account! Please try again.", "error");
            console.error("[Settings] Server returned an error response for delete-account");
            throw new Error("Server returned an error response.");
          }

          const result = await response.json();
          console.log("[Settings] Server response for delete-account:", result);

          if (result.success) {
            showToast("Account deleted successfully!", "success");
            setTimeout(() => {
              window.location.href = "/"; // Redirect after a short delay
            }, 1000);
          } else {
            showToast("Failed to delete account! Please try again.", "error");
          }
        } catch (err) {
          showToast("Error deleting account.", "error");
          console.error("[Settings] Error deleting account:", err);
        }
      } else {
        showToast("Account deletion canceled!", "error");
        console.log("[Settings] Account deletion canceled by user");
      }
    });
  // Initialize User Data
  loadUserData();
  console.log("[Settings] User data loaded and page initialized");
});
