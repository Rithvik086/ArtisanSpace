

document
  .getElementById("booking-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    
    var statusMessage = document.getElementById("status-message");
    statusMessage.innerText =
      "Workshop successfully booked! A confirmation email will be sent shortly.";
    statusMessage.classList.add("success");
    statusMessage.style.display = "block";
    
    setTimeout(function () {
      document.getElementById("booking-form").reset();
      statusMessage.style.display = "none";
    }, 5000);
  });
