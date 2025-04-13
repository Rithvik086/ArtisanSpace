const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const salesData = {
  labels: labels,
  datasets: [
    {
      label: "Total Sales (₹)",
      data: [12000, 15000, 14000, 17000, 16000, 18000],
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.1)",
      fill: true,
      tension: 0.3,
    },
  ],
};

const ordersData = {
  labels: labels,
  datasets: [
    {
      label: "Monthly Orders",
      data: [300, 400, 350, 500, 450, 600],
      borderColor: "green",
      backgroundColor: "rgba(0, 128, 0, 0.1)",
      fill: true,
      tension: 0.3,
    },
  ],
};

const productsData = {
  labels: labels,
  datasets: [
    {
      label: "Products",
      data: [50, 60, 70, 80, 90, 100],
      borderColor: "orange",
      backgroundColor: "rgba(255, 165, 0, 0.1)",
      fill: true,
      tension: 0.3,
    },
  ],
};

const customersData = {
  labels: labels,
  datasets: [
    {
      label: "Customers",
      data: [200, 220, 210, 250, 240, 270],
      borderColor: "purple",
      backgroundColor: "rgba(128, 0, 128, 0.1)",
      fill: true,
      tension: 0.3,
    },
  ],
};

const commonOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

new Chart(document.getElementById("totalSalesChart"), {
  type: "line",
  data: salesData,
  options: commonOptions,
});

new Chart(document.getElementById("monthlyOrdersChart"), {
  type: "line",
  data: ordersData,
  options: commonOptions,
});

new Chart(document.getElementById("productsChart"), {
  type: "line",
  data: productsData,
  options: commonOptions,
});

new Chart(document.getElementById("customersChart"), {
  type: "line",
  data: customersData,
  options: commonOptions,
});

// general functions

function closeModal() {
  document.getElementById("deleteModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("deleteModal");
  if (event.target === modal) {
    closeModal();
  }

  const editModal = document.getElementById("editModal");
  if (event.target === editModal) {
    closeEditModal();
  }
};

// User section

window.deleteUser = async function deleteUser(userId) {
  try {
    const response = await fetch(`/manager/delete-user/${userId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showNotification(
        "User deleted successfully. Refreshing the page...",
        "success"
      );
      window.location.reload();
    } else {
      console.error("Failed to delete uses");
      showNotification("Failed to delete user. Please try again.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  closeModal();
};

function confirmUserDelete(userId) {
  const modal = document.getElementById("deleteModal");
  document.getElementById("deleteModalText").textContent =
    "Are you sure you want to delete this user?";

  document.getElementById("confirmDeleteBtn").onclick = () =>
    deleteUser(userId);

  modal.style.display = "flex";
}

// Product section

window.deleteProduct = async function deleteProduct(productId) {
  try {
    const response = await fetch(`/artisan/delete-product/${productId}`, {
      method: "POST",
    });

    if (response.ok) {
      showNotification(
        "Product deleted successfully. Refreshing the page...",
        "success"
      );
      window.location.reload();
    } else {
      console.error("Failed to delete product");
      showNotification("Failed to delete product. Please try again.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  closeModal();
};

function confirmDelete(productId) {
  const modal = document.getElementById("deleteModal");
  document.getElementById("deleteModalText").textContent =
    "Are you sure you want to delete this item?";

  document.getElementById("confirmDeleteBtn").onclick = () =>
    deleteProduct(productId);

  modal.style.display = "flex";
}

function openEditModal(
  productId,
  name,
  oldPrice,
  newPrice,
  quantity,
  description
) {
  document.getElementById("editProductName").value = name;
  document.getElementById("editProductOldPrice").value = oldPrice;
  document.getElementById("editProductNewPrice").value = newPrice;
  document.getElementById("editProductQuantity").value = quantity;
  document.getElementById("editProductDescription").value = description;

  const productNameregex = /^[a-zA-Z0-9\s-]+$/;
  const priceregex = /^\d+(\.\d{1,2})?$/;
  const descriptionregex = /^[a-zA-Z0-9\s.,'"\-!?()]+$/;
  const quantityregex = /^[1-9][0-9]*$/;

  const editForm = document.getElementById("editProductForm");
  editForm.onsubmit = function (event) {
    event.preventDefault();

    let hasError = false;

    // Reset previous error states
    document.getElementById("editProductName").classList.remove("error-input");
    document.getElementById("editProductNameError").style.display = "none";
    document
      .getElementById("editProductOldPrice")
      .classList.remove("error-input");
    document.getElementById("editProductOldPriceError").style.display = "none";
    document
      .getElementById("editProductNewPrice")
      .classList.remove("error-input");
    document.getElementById("editProductNewPriceError").style.display = "none";
    document
      .getElementById("editProductDescription")
      .classList.remove("error-input");
    document.getElementById("editProductDescriptionError").style.display =
      "none";
    document
      .getElementById("editProductQuantity")
      .classList.remove("error-input");
    document.getElementById("editProductQuantityError").style.display = "none";

    if (
      !productNameregex.test(document.getElementById("editProductName").value)
    ) {
      document.getElementById("editProductNameError").style.display = "block";
      document.getElementById("editProductName").classList.add("error-input");
      document.getElementById("editProductName").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasError = true;
    }

    if (
      !priceregex.test(document.getElementById("editProductOldPrice").value)
    ) {
      document.getElementById("editProductOldPriceError").style.display =
        "block";
      document
        .getElementById("editProductOldPrice")
        .classList.add("error-input");
      document.getElementById("editProductOldPrice").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasError = true;
    }

    if (
      !priceregex.test(document.getElementById("editProductNewPrice").value) ||
      parseFloat(document.getElementById("editProductNewPrice").value) >
        parseFloat(document.getElementById("editProductOldPrice").value)
    ) {
      document.getElementById("editProductNewPriceError").style.display =
        "block";
      document
        .getElementById("editProductNewPrice")
        .classList.add("error-input");
      document.getElementById("editProductNewPrice").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasError = true;
    }

    if (
      !descriptionregex.test(
        document.getElementById("editProductDescription").value
      )
    ) {
      document.getElementById("editProductDescriptionError").style.display =
        "block";
      document
        .getElementById("editProductDescription")
        .classList.add("error-input");
      document.getElementById("editProductDescription").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasError = true;
    }

    if (
      !quantityregex.test(document.getElementById("editProductQuantity").value)
    ) {
      document.getElementById("editProductQuantityError").style.display =
        "block";
      document
        .getElementById("editProductQuantityError")
        .classList.add("error-input");
      quantity.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasError = true;
    }

    if (hasError) return;

    event.preventDefault();
    const updatedProduct = {
      id: productId,
      name: document.getElementById("editProductName").value,
      oldPrice: document.getElementById("editProductOldPrice").value,
      newPrice: document.getElementById("editProductNewPrice").value,
      quantity: document.getElementById("editProductQuantity").value,
      description: document.getElementById("editProductDescription").value,
    };
    updateProduct(updatedProduct);
  };

  document.getElementById("editModal").style.display = "flex";
}

// Function to close the edit modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// Function to send updated product data to the server
function updateProduct(product) {
  fetch(`/artisan/edit-product/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => {
      if (response.ok) {
        showNotification("Product updated successfully!", "success");
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        showNotification(
          "Failed to update product. Please check your input.",
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    });
}

function showNotification(message, type) {
  console.log("Showing notification:", message, type);
  let notificationContainer = document.querySelector(".notification-container");

  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
  }

  // Avoid duplicate notifications of the same message
  if (
    [...notificationContainer.children].some((n) => n.textContent === message)
  ) {
    return;
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Add styles for notifications only if not already added
if (!document.querySelector("#notification-style")) {
  const style = document.createElement("style");
  style.id = "notification-style";
  style.textContent = `
.notification-container {
  position: fixed;
  top: 20px;
  right: 40px;
  z-index: 1000;
}

.notification {
  padding: 12px 20px;
  margin-bottom: 10px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slide-in 0.3s ease-out forwards;
}

.notification.success {
  background-color: #28a745;
}

.notification.error {
  background-color: #dc3545;
}

.notification.fade-out {
  animation: fade-out 0.5s ease-out forwards;
}

@keyframes slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
`;
  document.head.appendChild(style);
}
