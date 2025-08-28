// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            navLinks.classList.remove('active');
        }
    });
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Animated counters
function animateCounter(id, target, duration = 2000) {
    const element = document.getElementById(id);
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (id === 'success-rate' ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (id === 'success-rate' ? '%' : '');
        }
    }, 16);
}

// Trigger counters when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter('students-count', 15420);
            animateCounter('success-rate', 94);
            animateCounter('lessons-count', 2847);
            animateCounter('cities-count', 87);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Interactive alphabet demo
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const alphabetGrid = document.getElementById('alphabetGrid');
const progressFill = document.getElementById('progressFill');
const demoMessage = document.getElementById('demo-message');

let clickedLetters = new Set();

// Generate alphabet grid
alphabet.forEach(letter => {
    const letterCard = document.createElement('div');
    letterCard.className = 'letter-card';
    letterCard.textContent = letter;
    letterCard.addEventListener('click', () => handleLetterClick(letter, letterCard));
    alphabetGrid.appendChild(letterCard);
});

function handleLetterClick(letter, element) {
    if (!clickedLetters.has(letter)) {
        clickedLetters.add(letter);
        element.style.background = 'var(--primary-blue)';
        element.style.transform = 'scale(1.2)';
        
        // Update progress
        const progress = (clickedLetters.size / alphabet.length) * 100;
        progressFill.style.width = progress + '%';
        
        // Update message
        if (clickedLetters.size === 1) {
            demoMessage.textContent = 'Ótimo! Continue clicando em mais letras!';
        } else if (clickedLetters.size === alphabet.length) {
            demoMessage.textContent = '🎉 Parabéns! Você conhece todo o alfabeto!';
            showCelebration();
        } else if (clickedLetters.size > alphabet.length / 2) {
            demoMessage.textContent = 'Você está indo muito bem! Quase lá!';
        } else {
            demoMessage.textContent = `Excelente progresso! ${clickedLetters.size}/${alphabet.length} letras`;
        }
    }
}

function showCelebration() {
    // Simple celebration animation
    document.querySelectorAll('.letter-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'bounce 0.6s ease';
        }, index * 50);
    });
}

// Add bounce animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
`;
document.head.appendChild(style);

// Reset demo function
function resetDemo() {
    clickedLetters.clear();
    progressFill.style.width = '0%';
    demoMessage.textContent = 'Comece clicando em qualquer letra!';
    document.querySelectorAll('.letter-card').forEach(card => {
        card.style.background = 'var(--primary-green)';
        card.style.transform = 'scale(1)';
        card.style.animation = 'none';
    });
}

// Add reset button to demo
const resetButton = document.createElement('button');
resetButton.textContent = 'Recomeçar Demo';
resetButton.className = 'btn btn-primary';
resetButton.style.marginTop = '1rem';
resetButton.addEventListener('click', resetDemo);

// Wait for DOM to be fully loaded before adding the reset button
document.addEventListener('DOMContentLoaded', () => {
    const demoContainer = document.querySelector('.demo-container');
    if (demoContainer) {
        demoContainer.appendChild(resetButton);
    }

    // Add subtle parallax to hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});