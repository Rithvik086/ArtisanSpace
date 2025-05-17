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

// Fetch orders data for the chart - keeping dynamic data only
fetch("/api/orders_chart")
  .then((res) => res.json())
  .then((data) => {
    // Check if data exists and has the expected format
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Invalid order data received:", data);
      document.getElementById("monthlyOrdersChart").innerHTML =
        '<div style="text-align:center;padding:20px;">No orders data available</div>';
      return;
    }

    // Filter valid data
    const validData = data.filter((item) => item && item.purchasedAt);

    // Group the data by 5-day intervals
    const grouped = groupByDayIntervals(validData, 5);

    const labels = Object.keys(grouped).sort();
    const values = labels.map((label) => grouped[label].count);

    const ordersData = {
      labels: labels.map(formatDateLabel),
      datasets: [
        {
          label: "Orders",
          data: values,
          borderColor: "green",
          backgroundColor: "rgba(0, 128, 0, 0.1)",
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // Create the chart only if we have data
    if (labels.length > 0) {
      new Chart(document.getElementById("monthlyOrdersChart"), {
        type: "line",
        data: ordersData,
        options: commonOptions,
      });
    } else {
      console.error("No orders data available for chart");
      document.getElementById("monthlyOrdersChart").innerHTML =
        '<div style="text-align:center;padding:20px;">No orders data available</div>';
    }
  })
  .catch((err) => {
    console.error("Error loading orders chart:", err);
    document.getElementById("monthlyOrdersChart").innerHTML =
      '<div style="text-align:center;padding:20px;">Error loading orders data</div>';
  });

// Fetch products data for the chart - adding hardcoded historical data
fetch("/api/products_chart")
  .then((res) => res.json())
  .then((data) => {
    // Check if data exists and has expected format
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Invalid product data received:", data);
      document.getElementById("productsChart").innerHTML =
        '<div style="text-align:center;padding:20px;">No products data available</div>';
      return;
    }

    // Filter valid data
    const validData = data.filter((item) => item && item.createdAt);

    // Add some hardcoded historical data points to make chart look better
    // Calculate dates for hardcoded data (30, 25, 20, 15, 10 days before first real data point)
    let firstDataDate = new Date();
    if (validData.length > 0) {
      firstDataDate = new Date(validData[0].createdAt);
    }

    const hardcodedData = [
      {
        createdAt: new Date(
          firstDataDate.getTime() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        name: "Initial Product 1",
      },
      {
        createdAt: new Date(
          firstDataDate.getTime() - 25 * 24 * 60 * 60 * 1000
        ).toISOString(),
        name: "Initial Product 2",
      },
      {
        createdAt: new Date(
          firstDataDate.getTime() - 20 * 24 * 60 * 60 * 1000
        ).toISOString(),
        name: "Initial Product 3",
      },
      {
        createdAt: new Date(
          firstDataDate.getTime() - 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        name: "Initial Product 4",
      },
      {
        createdAt: new Date(
          firstDataDate.getTime() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        name: "Initial Product 5",
      },
    ];

    // Combine hardcoded and real data
    const combinedData = [...hardcodedData, ...validData];

    // Group the data by 5-day intervals
    const grouped = groupByDayIntervals(combinedData, 5);

    const labels = Object.keys(grouped).sort();
    const values = labels.map((label) => grouped[label].count);

    const productsData = {
      labels: labels.map(formatDateLabel),
      datasets: [
        {
          label: "Products",
          data: values,
          borderColor: "orange",
          backgroundColor: "rgba(255, 165, 0, 0.1)",
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // Create the chart only if we have data
    if (labels.length > 0) {
      new Chart(document.getElementById("productsChart"), {
        type: "line",
        data: productsData,
        options: commonOptions,
      });
    } else {
      console.error("No products data available for chart");
      document.getElementById("productsChart").innerHTML =
        '<div style="text-align:center;padding:20px;">No products data available</div>';
    }
  })
  .catch((err) => {
    console.error("Error loading products chart:", err);
    document.getElementById("productsChart").innerHTML =
      '<div style="text-align:center;padding:20px;">Error loading products data</div>';
  });

// Fetch customer data for the chart
fetch("/api/customer_chart")
  .then((res) => res.json())
  .then((data) => {
    // Check if data exists and has the expected format
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Invalid customer data received:", data);
      document.getElementById("customersChart").innerHTML =
        '<div style="text-align:center;padding:20px;">No customer data available</div>';
      return;
    }

    // Make sure registeredAt is a valid date string
    const validData = data.filter((item) => item && item.registeredAt);

    // Group the data by 2-day intervals and calculate cumulative counts
    const grouped = groupByTwoDayIntervals(validData);

    const labels = Object.keys(grouped).sort();
    const values = labels.map((label) => grouped[label]);

    const customersData = {
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
        data: customersData,
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

// Group data by specified day intervals
function groupByDayIntervals(data, intervalDays) {
  const dayMap = {};

  // Return empty object if no data
  if (!data || data.length === 0) return {};

  // Convert all dates to Date objects and count them by date
  const dateCountMap = {};

  data.forEach((item) => {
    if (!item) return;

    const date = new Date(
      item.purchasedAt || item.createdAt || item.registeredAt
    );
    if (isNaN(date.getTime())) return;

    // Convert to YYYY-MM-DD format
    const dateKey = date.toISOString().split("T")[0];

    // Initialize or increment the count
    if (!dateCountMap[dateKey]) {
      dateCountMap[dateKey] = {
        count: 0,
        total: 0,
      };
    }

    dateCountMap[dateKey].count++;

    // If it's an order, also track the amount
    if (item.amount) {
      dateCountMap[dateKey].total += parseFloat(item.amount);
    }
  });

  // Get all unique dates and find min/max
  const uniqueDates = Object.keys(dateCountMap).sort();
  if (uniqueDates.length === 0) return {};

  const minDate = new Date(uniqueDates[0]);
  const maxDate = new Date(uniqueDates[uniqueDates.length - 1]);

  // Create intervals from min date to max date
  const intervals = {};

  // Start from the exact date of first item
  for (
    let current = new Date(minDate);
    current <= maxDate;
    current.setDate(current.getDate() + intervalDays)
  ) {
    const key = current.toISOString().split("T")[0];
    intervals[key] = { count: 0, total: 0 };
  }

  // For each actual date with items, find its interval
  Object.keys(dateCountMap).forEach((dateStr) => {
    const itemDate = new Date(dateStr);

    // Find which interval this date belongs to
    let intervalFound = false;
    for (const intervalKey of Object.keys(intervals)) {
      const intervalDate = new Date(intervalKey);
      const nextIntervalDate = new Date(intervalDate);
      nextIntervalDate.setDate(nextIntervalDate.getDate() + intervalDays);

      // If date falls in this interval
      if (itemDate >= intervalDate && itemDate < nextIntervalDate) {
        intervals[intervalKey].count += dateCountMap[dateStr].count;
        intervals[intervalKey].total += dateCountMap[dateStr].total;
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

  return intervals;
}

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
      ticks: {
        stepSize: 1, // Force step size to be 1 unit
        precision: 0, // Display integers only, no decimals
      },
    },
  },
};

new Chart(document.getElementById("totalSalesChart"), {
  type: "line",
  data: salesData,
  options: commonOptions,
});

// tab switching

document.addEventListener("DOMContentLoaded", () => {
  const usersTabBtn = document.getElementById("usersTabBtn");
  const productsTabBtn = document.getElementById("productsTabBtn");
  const usersTab = document.getElementById("usersTab");
  const productsTab = document.getElementById("productsTab");

  usersTabBtn.addEventListener("click", () => {
    usersTab.style.display = "block";
    productsTab.style.display = "none";
    usersTabBtn.classList.add("active");
    productsTabBtn.classList.remove("active");
  });

  productsTabBtn.addEventListener("click", () => {
    usersTab.style.display = "none";
    productsTab.style.display = "block";
    usersTabBtn.classList.remove("active");
    productsTabBtn.classList.add("active");
  });
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
  let notificationContainer = document.querySelector(".notification-container");

  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
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
