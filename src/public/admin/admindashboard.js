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

  // Modal Handling
  const addUserBtn = document.getElementById("add-user-btn");
  const addUserModal = document.getElementById("add-user-modal");
  const deleteModal = document.getElementById("delete-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const cancelBtns = document.querySelectorAll(".cancel-btn");

  // Open Add User Modal
  addUserBtn.addEventListener("click", () => {
    addUserModal.classList.add("active");
  });

  // Close Modal on X click
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      addUserModal.classList.remove("active");
    });
  }

  // Close Modals on Cancel button click
  cancelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addUserModal.classList.remove("active");
      deleteModal.classList.remove("active");
    });
  });

  // Close Modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === addUserModal) {
      addUserModal.classList.remove("active");
    }
    if (e.target === deleteModal) {
      deleteModal.classList.remove("active");
    }
  });

  // Handle Add User Form Submission
  // const addUserForm = document.getElementById("add-user-form")
  // if (addUserForm) {
  //   addUserForm.addEventListener("submit", (e) => {
  //     e.preventDefault()

  //     // Get form data
  //     const formData = new FormData(addUserForm)
  //     const userData = {
  //       name: formData.get("name"),
  //       email: formData.get("email"),
  //       role: formData.get("role"),
  //       status: formData.get("status"),
  //     }

  //     // Here you would typically send this data to your server
  //     console.log("Adding new user:", userData)

  //     // For demo purposes, let's add the user to the table
  //     addUserToTable(userData)

  //     // Reset form and close modal
  //     addUserForm.reset()
  //     addUserModal.classList.remove("active")
  //   })
  // }

  const addUserForm = document.getElementById("add-user-form");

  if (addUserForm) {
    addUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(addUserForm);
      const userData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value,
        pass: document.getElementById("pass").value,
      };

      console.log("Form data:", userData);

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
          addUserToTable(userData); // Update table in UI
          addUserForm.reset(); // Clear the form
          addUserModal.classList.remove("active"); // Close modal if applicable
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
      console.log("test", userIdToDelete);
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

            // Remove the row from the table
            const row = document.querySelector(
              `tr[data-id="${userIdToDelete}"]`
            );
            if (row) {
              row.remove();
            }

            // Close modal and reset userIdToDelete
            deleteModal.classList.remove("active");
            userIdToDelete = null;
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

  // Function to add a new user to the table
  function addUserToTable(userData) {
    const tableBody = document.getElementById("users-table-body");
    if (!tableBody) return;

    // Generate a random ID for demo purposes
    const userId = Math.floor(Math.random() * 1000);

    // Create new row
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", userId);

    // Set row HTML
    newRow.innerHTML = `
              <td>${userId}</td>
              <td>${userData.name}</td>
              <td>${userData.email}</td>
              <td>${userData.role}</td>
        
              <td class="actions">
                  <button class="edit-btn" data-id="${userId}">Edit</button>
                  <button class="delete-btn" data-id="${userId}">Delete</button>
              </td>
          `;

    // Add row to table
    tableBody.appendChild(newRow);

    // Add event listener to the new delete button
    const newDeleteBtn = newRow.querySelector(".delete-btn");
    newDeleteBtn.addEventListener("click", () => {
      userIdToDelete = userId;
      deleteModal.classList.add("active");
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

    const grouped = groupBy5DayInterval(validData);
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
function groupBy5DayInterval(data) {
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

// new Chart(document.getElementById("customersChart"), {
//   type: "line",
//   data: customersData,
//   options: commonOptions,
// });
