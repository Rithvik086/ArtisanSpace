document
  .getElementById("booking-form")
  .addEventListener("submit", function (event) {
    var statusMessage = document.getElementById("status-message");
    const inputs = this.querySelectorAll("input");
    const phoneError = document.getElementById("phoneError");
    const mobileNo = document.getElementById("phone");

    let isValid = true;

    inputs.forEach((input) => {
      if (input.name === "email") {
        input.value = input.value.trim().toLowerCase();
      } else {
        input.value = input.value.trim();
      }
    });

    if (mobileNo.value.length !== 10) {
      phoneError.style.display = "block";
      isValid = false;
    } else {
      phoneError.style.display = "none";
    }

    if (!isValid) {
      event.preventDefault();
      return;
    }

    statusMessage.innerText =
      "Workshop successfully booked! A confirmation email will be sent shortly.";
    statusMessage.classList.add("success");
    statusMessage.style.display = "block";

    setTimeout(function () {
      document.getElementById("booking-form").reset();
      statusMessage.style.display = "none";
    }, 3000);
  });
