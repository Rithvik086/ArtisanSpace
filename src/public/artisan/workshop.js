document.addEventListener("DOMContentLoaded", () => {
  // Get all accept buttons
  const acceptButtons = document.querySelectorAll(".accept-btn")
  
  // Add click event listener to each accept button
  acceptButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const workshopId = this.getAttribute("data-id")
      acceptWorkshop(workshopId)
    })
  })

  
    // Function to accept a workshop
    async function acceptWorkshop(workshopId) {
      try {
        const response = await fetch("/workshops/accept", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workshopId
            // No need to send artisanId, server will get it from the request
          }),
        })
        
        const data = await response.json()
        
        if (data.success) {
          showNotification("Workshop accepted successfully!", "success")
          
          // Refresh the page to update the lists
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } else {
          showNotification(data.message || "Failed to accept workshop", "error")
        }
      } catch (error) {
        console.error("Error accepting workshop:", error)
        showNotification("An error occurred. Please try again.", "error")
      }
    }
  
    // Function to show notification
    function showNotification(message, type) {
      // Check if notification container exists, if not create it
      let notificationContainer = document.querySelector(".notification-container")
  
      if (!notificationContainer) {
        notificationContainer = document.createElement("div")
        notificationContainer.className = "notification-container"
        document.body.appendChild(notificationContainer)
      }
  
      // Create notification element
      const notification = document.createElement("div")
      notification.className = `notification ${type}`
      notification.textContent = message
  
      // Add notification to container
      notificationContainer.appendChild(notification)
  
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.classList.add("fade-out")
        setTimeout(() => {
          notification.remove()
        }, 500)
      }, 3000)
    }
  
    // Add styles for notifications
    const style = document.createElement("style")
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
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
    `
  
    document.head.appendChild(style)
  })
  
  