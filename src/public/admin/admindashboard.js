

document.addEventListener("DOMContentLoaded", () => {
    // Tab Switching
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Add active class to clicked button and corresponding content
        button.classList.add("active")
        const tabId = button.getAttribute("data-tab")
        document.getElementById(`${tabId}-content`).classList.add("active")
      })
    })
  
    // Modal Handling
    const addUserBtn = document.getElementById("add-user-btn")
    const addUserModal = document.getElementById("add-user-modal")
    const deleteModal = document.getElementById("delete-modal")
    const closeModalBtn = document.querySelector(".close-modal")
    const cancelBtns = document.querySelectorAll(".cancel-btn")
  
    // Open Add User Modal
    addUserBtn.addEventListener("click", () => {
      addUserModal.classList.add("active")
    })
  
    // Close Modal on X click
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        addUserModal.classList.remove("active")
      })
    }
  
    // Close Modals on Cancel button click
    cancelBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        addUserModal.classList.remove("active")
        deleteModal.classList.remove("active")
      })
    })
  
    // Close Modal on outside click
    window.addEventListener("click", (e) => {
      if (e.target === addUserModal) {
        addUserModal.classList.remove("active")
      }
      if (e.target === deleteModal) {
        deleteModal.classList.remove("active")
      }
    })
  
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
          pass: document.getElementById("pass").value
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
    const deleteButtons = document.querySelectorAll(".delete-btn")
    let userIdToDelete = null
  
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        userIdToDelete = btn.getAttribute("data-id")
        deleteModal.classList.add("active")
      })
    })
  
    // Confirm Delete
    const deleteConfirmBtn = document.querySelector(".delete-confirm-btn")
    if (deleteConfirmBtn) {
      deleteConfirmBtn.addEventListener("click", async () => {
        if (userIdToDelete) {
          try {
            // Send delete request to backend API
            const response = await fetch(`/admin/delete-user/${userIdToDelete}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              }
            });
    
            const result = await response.json();
    
            if (result.success) {
              console.log("User deleted successfully:", userIdToDelete);
              
              // Remove the row from the table
              const row = document.querySelector(`tr[data-id="${userIdToDelete}"]`);
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
      const tableBody = document.getElementById("users-table-body")
      if (!tableBody) return
  
      // Generate a random ID for demo purposes
      const userId = Math.floor(Math.random() * 1000)
  
      // Create new row
      const newRow = document.createElement("tr")
      newRow.setAttribute("data-id", userId)
  
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
          `
  
      // Add row to table
      tableBody.appendChild(newRow)
  
      // Add event listener to the new delete button
      const newDeleteBtn = newRow.querySelector(".delete-btn")
      newDeleteBtn.addEventListener("click", () => {
        userIdToDelete = userId
        deleteModal.classList.add("active")
      })
    }
  })