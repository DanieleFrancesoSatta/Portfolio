// --- 1. SCROLL REVEAL ANIMATION ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
            observer.unobserve(entry.target); // Anima solo una volta
        }
    });
}, observerOptions); 

document.querySelectorAll('.hidden-element').forEach((el) => {
    observer.observe(el);
});


// --- 2. CANVAS NEURAL NETWORK BACKGROUND ---
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configurazione
const particleCount = 40; // Numero di nodi
const connectionDistance = 150; // Distanza per connettere le linee

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Velocità X lenta
        this.vy = (Math.random() - 0.5) * 0.5; // Velocità Y lenta
        this.size = 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rimbalzo sui bordi
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#64ffda';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Aggiorna e disegna particelle
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Disegna linee di connessione
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 255, 218, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Inizializzazione
window.addEventListener('resize', () => {
    resize();
    initParticles();
});
resize();
initParticles();
animate();

// --- CONTACT FORM: invio via Formspree (AJAX) ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const form = e.currentTarget;
        const statusEl = document.getElementById('form-status');
        const submitBtn = form.querySelector('.btn-submit');
        statusEl.textContent = 'Invio in corso...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: form.method || 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusEl.textContent = 'Grazie! Messaggio inviato.';
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                statusEl.textContent = data.error || 'Si è verificato un errore. Riprova più tardi.';
            }
        } catch (err) {
            statusEl.textContent = 'Impossibile inviare la richiesta. Controlla la connessione.';
        } finally {
            submitBtn.disabled = false;
            setTimeout(() => { statusEl.textContent = ''; }, 6000);
        }
    });

    // --- HAMBURGER / MOBILE NAV TOGGLE ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const expanded = navLinks.classList.contains('open');
            hamburger.setAttribute('aria-expanded', expanded.toString());
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });

        // Ensure menu is closed when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) navLinks.classList.remove('open');
        });
    }
}