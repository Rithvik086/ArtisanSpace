document
  .getElementById("booking-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    var statusMessage = document.getElementById("status-message");
    const formData = new FormData(this);
    const formValues = Object.fromEntries(formData.entries());
  try{
    const workshopreq = await fetch('/customer/requestWorkshop',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formValues)
    });

    const result = await workshopreq.json();
    const statusMessage = document.getElementById("status-message");
    statusMessage.innerText =
    "Workshop successfully booked! ";
  statusMessage.classList.add("success");
  statusMessage.style.display = "block";

  if(result.success){
    setTimeout(function () {
      document.getElementById("booking-form").reset();
      statusMessage.style.display = "none";
    }, 3000);

  }
  }catch(error){
    console.error('Error registering workshop', error)
  }

  

   

   
  });
