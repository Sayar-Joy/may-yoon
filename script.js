document.addEventListener('DOMContentLoaded', function () {
    // Create floating gold particles
    createParticles();

    // Create campfire embers
    createEmbers();

    // Intersection Observer for scroll animations
    observeCards();

    // Spotlight the card nearest to center of viewport
    spotlightCards();
});

// Floating Gold Particles (background)
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 15;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        container.appendChild(particle);
    }
}

// Campfire Rising Embers / Ashes
function createEmbers() {
    const container = document.getElementById('embers');
    if (!container) return;

    const emberCount = 40;

    for (let i = 0; i < emberCount; i++) {
        const ember = document.createElement('div');

        // Pick a random type, weighted toward ash and dim
        const typeRoll = Math.random();
        let type;
        if (typeRoll < 0.12) type = 'bright';
        else if (typeRoll < 0.3) type = 'warm';
        else if (typeRoll < 0.55) type = 'dim';
        else type = 'ash';

        ember.classList.add('ember', `ember--${type}`);

        // Randomize size
        let size;
        switch (type) {
            case 'bright': size = Math.random() * 5 + 4; break;
            case 'warm':   size = Math.random() * 4 + 3; break;
            case 'dim':    size = Math.random() * 3 + 2; break;
            case 'ash':    size = Math.random() * 2.5 + 1.5; break;
        }

        // Full viewport horizontal spread
        const left = 5 + Math.random() * 90; // 5% to 95%

        // Slower rise to cover full page height
        const duration = Math.random() * 10 + 8;  // 8–18 seconds
        const delay = Math.random() * 12;          // stagger across 12s

        // Wider horizontal drift
        const driftX = (Math.random() - 0.5) * 120; // -60px to +60px

        ember.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --drift-x: ${driftX}px;
        `;

        container.appendChild(ember);
    }
}

// Intersection Observer for card fade-in
function observeCards() {
    const cards = document.querySelectorAll('.promo-card');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }
}

// Spotlight — glow the card closest to the viewport center
function spotlightCards() {
    const cards = document.querySelectorAll('.promo-card');
    if (!cards.length) return;

    let ticking = false;

    function updateSpotlight() {
        const viewportCenter = window.innerHeight / 2;
        let closestCard = null;
        let closestDist = Infinity;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const dist = Math.abs(cardCenter - viewportCenter);

            if (dist < closestDist) {
                closestDist = dist;
                closestCard = card;
            }
        });

        cards.forEach(card => {
            if (card === closestCard) {
                card.classList.add('card-spotlight');
            } else {
                card.classList.remove('card-spotlight');
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateSpotlight);
        }
    }, { passive: true });

    // Run once on load
    updateSpotlight();
}
