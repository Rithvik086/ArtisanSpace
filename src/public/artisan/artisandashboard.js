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

// Initialize charts and load product data on window load
window.onload = function () {
  // Initialize charts
  new Chart(document.getElementById("totalSalesChart"), {
    type: "line",
    data: salesData,
    options: commonOptions,
  });

  new Chart(document.getElementById("productsChart"), {
    type: "line",
    data: productsData,
    options: commonOptions,
  });
};

function closeModal() {
  document.getElementById("deleteModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("deleteModal");
  if (event.target === modal) {
    closeModal();
  }
};

window.deleteProduct = async function deleteProduct(productId) {
  try {
    const response = await fetch(`/artisan/delete-product/${productId}`, {
      method: "POST",
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.error("Failed to delete product");
      alert("Error: Could not delete product.");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  closeModal();
};

function confirmDelete(productId) {
  console.log("it worked");
  const modal = document.getElementById("deleteModal");
  document.getElementById("deleteModalText").textContent =
    "Are you sure you want to delete this item?";

  document.getElementById("confirmDeleteBtn").onclick = () =>
    deleteProduct(productId);

  modal.style.display = "flex";
}
