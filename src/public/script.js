function flipCard() {
    const card = document.querySelector('.cardpar');
    card.classList.toggle('flipped');
  }

  function flipCard() {
    document.querySelector('.cardpar').classList.toggle('flipped');
}

// Carousel functionality
function initCarousel(carouselElement) {
    const inner = carouselElement.querySelector('.carousel-inner');
    const items = inner.querySelectorAll('.carousel-item');
    const dotsContainer = carouselElement.querySelector('.carousel-dots');
    let currentSlide = 0;

    // Create dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        inner.style.transform = `translateX(-${index * 100}%)`;
        currentSlide = index;
        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % items.length;
        goToSlide(currentSlide);
    }

    // Auto-advance slides
    setInterval(nextSlide, 3000);
}

// Initialize both carousels
document.querySelectorAll('.carousel').forEach(initCarousel);