function flipCard(route) {
  const card = document.querySelector(".cardpar");
  card.classList.toggle("flipped");
  history.pushState(null, "", "/" + route);
}

window.addEventListener("popstate", () => {
  updateCardFlip();
});

// Ensure correct card state on page load
window.addEventListener("DOMContentLoaded", () => {
  updateCardFlip();
  document.querySelectorAll(".carousel").forEach(initCarousel);
});

function updateCardFlip() {
  const path = window.location.pathname;
  const card = document.querySelector(".cardpar");

  if (path === "/login") {
    card.classList.add("flipped");
  } else {
    card.classList.remove("flipped");
  }
}

// Carousel functionality
function initCarousel(carouselElement) {
  const inner = carouselElement.querySelector(".carousel-inner");
  const items = inner.querySelectorAll(".carousel-item");
  const dotsContainer = carouselElement.querySelector(".carousel-dots");
  let currentSlide = 0;

  // Create dots
  items.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    inner.style.transform = `translateX(-${index * 100}%)`;
    currentSlide = index;
    updateDots();
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % items.length;
    goToSlide(currentSlide);
  }

  // Auto-advance slides
  setInterval(nextSlide, 3000);
}

document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    const inputs = this.querySelectorAll("input");
    const password = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");
    const username = document.getElementById("username"); // Define username element
    const usernameError = document.getElementById("usernameError");
    const name = document.getElementById("name");
    const nameError = document.getElementById("nameError");
    const email = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const mobile_no = document.getElementById("mobile_no");
    const mobile_noError = document.getElementById("mobile_noError");

    password.value = password.value.trim();
    // Define regex for username
    let usernameregex = /^[a-zA-Z0-9_.]+$/; // Updated regex to allow a-z, A-Z, 0-9, _, and .
    if (
      !usernameregex.test(username.value) ||
      username.value.length < 3 ||
      username.value.length > 20
    ) {
      event.preventDefault();
      usernameError.style.display = "block";
    } else {
      usernameError.style.display = "none";
    }
    //name regex
    let nameregex = /^[a-zA-Z ]+$/;
    if (
      !nameregex.test(name.value) ||
      name.value.length < 1 ||
      name.value.length > 20
    ) {
      event.preventDefault();
      nameError.style.display = "block";
    } else {
      nameError.style.display = "none";
    }
    //email validation
    let emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    if (!emailregex.test(email.value)) {
      event.preventDefault();
      emailError.style.display = "block";
    } else {
      emailError.style.display = "none";
    }
    let mobileregex = /^[0-9]+$/;
    if (
      !mobileregex.test(mobile_no.value) ||
      mobile_no.value.length < 10 ||
      mobile_no.value.length > 10
    ) {
      event.preventDefault();
      mobile_noError.style.display = "block";
    } else {
      mobile_noError.style.display = "none";
    }

    //password validation

    if (password.value.length < 8) {
      event.preventDefault();
      passwordError.style.display = "block";
    } else {
      passwordError.style.display = "none";
    }

    inputs.forEach((input) => {
      if (input.type !== "password") {
        input.value = input.value.trim().toLowerCase();
      } else {
        input.value = input.value.trim();
      }
    });
  });

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    const inputs = this.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = input.value.trim().toLowerCase();
    });
  });
