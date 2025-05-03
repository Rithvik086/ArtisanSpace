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

  // Orders table filter functionality
  const orderStatusFilter = document.getElementById("order-status-filter");
  if (orderStatusFilter) {
    orderStatusFilter.addEventListener("change", function () {
      const filterValue = this.value;
      const orderRows = document.querySelectorAll("#orders-table-body tr");

      orderRows.forEach((row) => {
        const statusCell = row.querySelector("td:nth-child(6)");
        if (!statusCell) return;

        const statusBadge = statusCell.querySelector(".status-badge");
        if (!statusBadge) return;

        const status = statusBadge.textContent.toLowerCase();

        if (filterValue === "all" || status === filterValue) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  // Order View button functionality
  const viewOrderBtns = document.querySelectorAll(".view-btn");
  viewOrderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      window.location.href = `/admin/orders/${this.getAttribute("data-id")}`;
    });
  });

  // Order delete button functionality
  const deleteOrderBtns = document.querySelectorAll(".delete-order-btn");
  deleteOrderBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const orderId = this.getAttribute("data-id");

      fetch(`/admin/orders/${orderId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            showNotification(
              "Order deleted successfully. Refreshing the page...",
              "success"
            );
            window.location.reload();
          } else {
            console.error("Failed to delete order");
            showNotification(
              "Failed to delete order. Please try again.",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
    // Check if data exists and has the expected format
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Invalid customer data received:", data);
      return;
    }

    // Make sure registeredAt is a valid date string
    const validData = data.filter((item) => item && item.registeredAt);

    // Group the data by 2-day intervals and calculate cumulative counts
    const grouped = groupByTwoDayIntervals(validData);

    const labels = Object.keys(grouped).sort();
    const values = labels.map((label) => grouped[label]);

    const customerData = {
      labels: labels.map(formatDateLabel),
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
      document.getElementById("customersChart").innerHTML =
        '<div style="text-align:center;padding:20px;">No customer data available</div>';
    }
  })
  .catch((err) => {
    console.error("Error loading customer chart:", err);
    document.getElementById("customersChart").innerHTML =
      '<div style="text-align:center;padding:20px;">Error loading customer data</div>';
  });

// Improved function to group data by 2-day intervals
function groupByTwoDayIntervals(data) {
  // Return empty object if no data
  if (!data || data.length === 0) return {};

  // Convert all registration dates to Date objects and count them by date
  const dateCountMap = {};

  data.forEach((item) => {
    if (!item || !item.registeredAt) return;

    const date = new Date(item.registeredAt);
    if (isNaN(date.getTime())) return;

    // Convert to YYYY-MM-DD format
    const dateKey = date.toISOString().split("T")[0];

    // Initialize or increment the count
    dateCountMap[dateKey] = (dateCountMap[dateKey] || 0) + 1;
  });

  // Get all unique dates and find min/max
  const uniqueDates = Object.keys(dateCountMap).sort();
  if (uniqueDates.length === 0) return {};

  const minDate = new Date(uniqueDates[0]);
  const maxDate = new Date(uniqueDates[uniqueDates.length - 1]);

  // Create two-day intervals from min date to max date
  const intervals = {};

  // Start from the exact date of first registration
  // No need to normalize to odd days
  for (
    let current = new Date(minDate);
    current <= maxDate;
    current.setDate(current.getDate() + 2)
  ) {
    const key = current.toISOString().split("T")[0];
    intervals[key] = 0;
  }

  // For each actual date with registrations, find its interval
  Object.keys(dateCountMap).forEach((dateStr) => {
    const regDate = new Date(dateStr);

    // Find which interval this date belongs to
    let intervalFound = false;
    for (const intervalKey of Object.keys(intervals)) {
      const intervalDate = new Date(intervalKey);
      const nextIntervalDate = new Date(intervalDate);
      nextIntervalDate.setDate(nextIntervalDate.getDate() + 2);

      // If registration date falls in this interval
      if (regDate >= intervalDate && regDate < nextIntervalDate) {
        intervals[intervalKey] += dateCountMap[dateStr];
        intervalFound = true;
        break;
      }
    }

    // If no interval found (edge case), create one
    if (!intervalFound) {
      const key = dateStr;
      intervals[key] = dateCountMap[dateStr];
    }
  });

  // Calculate cumulative totals
  let cumulative = 0;
  const result = {};

  Object.keys(intervals)
    .sort()
    .forEach((key) => {
      cumulative += intervals[key];
      result[key] = cumulative;
    });

  return result;
}

// Format date label for display
function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
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
