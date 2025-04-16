document.addEventListener("DOMContentLoaded", () => {
  // Tab Switching
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(`${tabId}-content`).classList.add("active");
    });
  });

  function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  }

  window.onclick = function (event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) {
        closeModal(modal.id);
      }
    });
  };

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
        showNotification(
          "Failed to delete product. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }

    closeModal("delete-modal");
  };

  window.confirmDelete = function confirmDelete(productId) {
    const modal = document.getElementById("delete-modal");
    const deleteConfirmBtn = document.querySelector(".delete-confirm-btn");

    deleteConfirmBtn.onclick = () => deleteProduct(productId);

    modal.classList.add("active");
  };

  // Modal Handling
  const addUserBtn = document.getElementById("add-user-btn");
  const addUserModal = document.getElementById("add-user-modal");
  const deleteModal = document.getElementById("delete-modal");
  const closeModalBtns = document.querySelectorAll(".close-modal");
  const cancelBtns = document.querySelectorAll(".cancel-btn");

  // Open Add User Modal
  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      addUserModal.classList.add("active");
    });
  }

  // Close Modal on X click
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest(".modal").id);
    });
  });

  // Close Modals on Cancel button click
  cancelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest(".modal").id);
    });
  });

  // Close Modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === addUserModal) {
      closeModal("add-user-modal");
    }
    if (e.target === deleteModal) {
      closeModal("delete-modal");
    }
  });

  const addUserForm = document.getElementById("add-user-form");

  if (addUserForm) {
    addUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const userData = {
        name: document.getElementById("name").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        mobile_no: document.getElementById("mobile_no").value,
        role: document.getElementById("role").value,
        pass: document.getElementById("pass").value,
      };

      try {
        // Send data to backend API
        const response = await fetch("/admin/add-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (result.success) {
          console.log("User added successfully:", userData);
          window.location.reload();
        } else {
          alert("Error adding user: " + result.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to add user. Try again!");
      }
    });
  }

  // Handle Delete User
  const deleteButtons = document.querySelectorAll(".delete-btn");
  let userIdToDelete = null;

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      userIdToDelete = btn.getAttribute("data-id");
      deleteModal.classList.add("active");
    });
  });

  // Confirm Delete
  const deleteConfirmBtn = document.querySelector(".delete-confirm-btn");
  if (deleteConfirmBtn) {
    deleteConfirmBtn.addEventListener("click", async () => {
      if (userIdToDelete) {
        try {
          // Send delete request to backend API
          const response = await fetch(`/admin/delete-user/${userIdToDelete}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const result = await response.json();

          if (result.success) {
            console.log("User deleted successfully:", userIdToDelete);
            window.location.reload();
          } else {
            alert("Error deleting user: " + result.message);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to delete user. Try again!");
        }
      }
    });
  }
});
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

// const customersData = {
//   labels: labels,
//   datasets: [
//     {
//       label: "Customers",
//       data: [200, 220, 210, 250, 240, 270],
//       borderColor: "purple",
//       backgroundColor: "rgba(128, 0, 128, 0.1)",
//       fill: true,
//       tension: 0.3,
//     },
//   ],
// };

// Replace your current customer chart code with this
fetch("/api/customer_chart")
  .then((res) => res.json())
  .then((data) => {
    console.log("Raw customer data:", data); // Debug the raw data

    // Check if data exists and has the expected format
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Invalid customer data received:", data);
      return;
    }

    // Make sure registeredAt is a valid date string
    const validData = data.filter(item => item && item.registeredAt);
    console.log("Valid customer data items:", validData.length);

    const grouped = groupBy2DayInterval(validData);
    console.log("Grouped data:", grouped);

    const labels = Object.keys(grouped).sort();
    const values = labels.map(label => grouped[label]);

    const customerData = {
      labels: labels.map(format5DayLabel), // Format labels for better display
      datasets: [
        {
          label: "Total Users",
          data: values,
          borderColor: "purple",
          backgroundColor: "rgba(128, 0, 128, 0.5)",
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // Create the chart only if we have data
    if (labels.length > 0) {
      new Chart(document.getElementById("customersChart"), {
        type: "line",
        data: customerData,
        options: commonOptions,
      });
    } else {
      console.error("No customer data available for chart");
      // Display a message in the chart area
      document.getElementById("customersChart").innerHTML = 
        '<div style="text-align:center;padding:20px;">No customer data available</div>';
    }
  })
  .catch((err) => {
    console.error("Error loading customer chart:", err);
    document.getElementById("customersChart").innerHTML = 
      '<div style="text-align:center;padding:20px;">Error loading customer data</div>';
  });

// Improved groupByMonth function
function groupBy2DayInterval(data) {
  const counts = {};

  data.forEach((item) => {
    try {
      const date = new Date(item.registeredAt);

      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", item.registeredAt);
        return;
      }

      // Get start of interval
      const day = date.getDate();
      const startDay = Math.floor((day - 1) / 2) * 2 + 1;

      const intervalStart = new Date(date.getFullYear(), date.getMonth(), startDay);
      const key = intervalStart.toISOString().split("T")[0]; // format YYYY-MM-DD

      counts[key] = (counts[key] || 0) + 1;
    } catch (e) {
      console.error("Error processing date:", e, item);
    }
  });

  const sortedKeys = Object.keys(counts).sort();
  let cumulativecount =0;
  const cumulativecounts = {};

  sortedKeys.forEach((key) => {
    cumulativecount += counts[key];
    cumulativecounts[key] = cumulativecount;
  })

  return cumulativecounts;
}

// Format month labels for better display
function format5DayLabel(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${monthNames[date.getMonth()]}`;
}

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
