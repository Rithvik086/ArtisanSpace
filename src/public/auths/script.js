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
    password.value = password.value.trim();

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
