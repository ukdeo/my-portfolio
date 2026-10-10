/* ============================================================
   UDAY KUMAR DEV — Premium Portfolio JS
   ============================================================ */

'use strict';

/* ── Custom Cursor ────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    const ease = 0.12;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Enlarge ring on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-badge, .hobby-pill, .contact-link');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
}

/* ── Navigation ───────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const navItems  = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - section.clientHeight / 3) {
            current = section.id;
        }
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
});

/* ── Hero Canvas — Particle Web ───────────────────────────── */
(function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 80;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x:    Math.random() * canvas.width,
            y:    Math.random() * canvas.height,
            vx:   (Math.random() - 0.5) * 0.4,
            vy:   (Math.random() - 0.5) * 0.4,
            r:    Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.4 + 0.1,
        });
    }

    let mouseX = -9999, mouseY = -9999;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;

            // Draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.fill();

            // Draw connecting lines
            for (let j = i + 1; j < particles.length; j++) {
                const q    = particles[j];
                const dist = Math.hypot(p.x - q.x, p.y - q.y);
                if (dist < 130) {
                    const alpha = (1 - dist / 130) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse repulsion
            const mDist = Math.hypot(p.x - mouseX, p.y - mouseY);
            if (mDist < 120) {
                const force = (120 - mDist) / 120;
                const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
                p.vx += Math.cos(angle) * force * 0.08;
                p.vy += Math.sin(angle) * force * 0.08;
            }

            // Dampen velocity
            p.vx *= 0.998;
            p.vy *= 0.998;
        });

        requestAnimationFrame(draw);
    }
    draw();
})();

/* ── Projects Canvas — Monochrome Moving Lines ────────────── */
(function initProjectsCanvas() {
    const canvas  = document.getElementById('projects-canvas');
    const section = document.getElementById('projects');
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const lines = Array.from({ length: 8 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        length: 100 + Math.random() * 150,
        width:  0.5 + Math.random() * 1,
        alpha:  0.08 + Math.random() * 0.12,
    }));

    let visible = false;

    function drawLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(l => {
            l.x += Math.cos(l.angle) * l.speed;
            l.y += Math.sin(l.angle) * l.speed;
            if (l.x < 0 || l.x > canvas.width)  l.angle = Math.PI - l.angle;
            if (l.y < 0 || l.y > canvas.height)  l.angle = -l.angle;

            const grd = ctx.createLinearGradient(
                l.x, l.y,
                l.x + Math.cos(l.angle) * l.length,
                l.y + Math.sin(l.angle) * l.length
            );
            grd.addColorStop(0, `rgba(255,255,255,${l.alpha})`);
            grd.addColorStop(1, `rgba(255,255,255,0)`);

            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(
                l.x + Math.cos(l.angle) * l.length,
                l.y + Math.sin(l.angle) * l.length
            );
            ctx.strokeStyle = grd;
            ctx.lineWidth   = l.width;
            ctx.stroke();
        });
        if (visible) requestAnimationFrame(drawLines);
    }

    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) drawLines();
    }, { threshold: 0 }).observe(section);
})();

/* ── Skills Canvas — Floating Text Particles ──────────────── */
(function initSkillsCanvas() {
    const canvas  = document.getElementById('skills-canvas');
    const section = document.getElementById('skills');
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = section.offsetWidth;
        canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const words = ['Python','JavaScript','React','FastAPI','Docker','MongoDB',
                   'C++','Django','TensorFlow','Node.js','Scikit-Learn','Git',
                   'SQL','Firebase','PostgreSQL','Streamlit','GitHub','C'];

    const particles = [];
    words.forEach(w => {
        [0, 1].forEach(() => {
            particles.push({
                label:    w,
                x:        Math.random() * canvas.width,
                y:        Math.random() * canvas.height,
                dx:       (Math.random() - 0.5) * 0.5,
                dy:       (Math.random() - 0.5) * 0.5,
                fontSize: 11 + Math.random() * 9,
                alpha:    0.05 + Math.random() * 0.1,
                pulse:    Math.random() * Math.PI * 2,
            });
        });
    });

    let visible = false;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.pulse += 0.015;
            p.alpha = 0.04 + Math.abs(Math.sin(p.pulse)) * 0.1;
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < -120 || p.x > canvas.width + 120) p.dx *= -1;
            if (p.y < -30  || p.y > canvas.height + 30)  p.dy *= -1;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.font = `600 ${p.fontSize}px 'Space Grotesk', sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.letterSpacing = '1px';
            ctx.fillText(p.label, p.x, p.y);
            ctx.restore();
        });
        if (visible) requestAnimationFrame(draw);
    }

    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) draw();
    }, { threshold: 0 }).observe(section);
})();

/* ── Counter Animation ────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
    let start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        el.textContent = Math.floor(progress * target) + (progress < 1 ? '' : '+');
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const yearsEl    = document.getElementById('years-counter');
const projectsEl = document.getElementById('projects-counter');

if (yearsEl && projectsEl) {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounter(yearsEl, 1);
            animateCounter(projectsEl, 8);
            observer.disconnect();
        }
    }, { threshold: 0.5 });
    observer.observe(document.querySelector('.hero-stats') || document.querySelector('.hero-visual'));
}

/* ── Scroll Reveal ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Staggered Card Reveal ────────────────────────────────── */
const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(() => entry.target.classList.add('active'), delay);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.card-reveal').forEach(el => cardObserver.observe(el));

/* ── Hero Image Parallax ──────────────────────────────────── */
const heroImg = document.getElementById('hero-img');
if (heroImg) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        heroImg.style.transform = `translateY(${scrollY * 0.15}px)`;
    });
}

/* ── Chatbot ──────────────────────────────────────────────── */
const chatToggle  = document.getElementById('chat-toggle');
const chatWindow  = document.getElementById('chat-window');
const closeChat   = document.getElementById('close-chat');
const chatInput   = document.getElementById('chat-input');
const sendChat    = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');
const chatDot     = document.getElementById('chat-dot');

let chatOpen = false;

function toggleChat() {
    chatOpen = !chatOpen;
    if (chatOpen) {
        chatWindow.classList.add('open');
        if (chatDot) chatDot.style.display = 'none';
        chatInput.focus();
    } else {
        chatWindow.classList.remove('open');
    }
}

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

function addMessage(text, isUser = false) {
    const div = document.createElement('div');
    div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatInput.value = '';

    setTimeout(() => {
        const q = text.toLowerCase();
        let reply = "Try asking about 'skills', 'projects', 'contact', or 'experience'!";

        if (q.match(/skill|language|tool|tech/)) {
            reply = "Uday is skilled in Python, JavaScript, React, C++, FastAPI, Django, Docker, MongoDB, PostgreSQL, TensorFlow, and Scikit-Learn.";
        } else if (q.match(/project|work|portfolio|palo|queue|bank|voting|care|diabet|stock|database|habit/)) {
            reply = "He's built 8 featured projects: Pālo Queue System, E-Voting System, Care Connect, Diabetes Checker, Stock Prediction, Self-Healing DB, Bank System & Habit Tracker!";
        } else if (q.match(/contact|email|phone|hire|reach/)) {
            reply = "📧 udayd468@gmail.com | 📞 +977-9825967719 | GitHub: @ukdeo | LinkedIn: Uday Kumar Dev";
        } else if (q.match(/education|study|college|school|degree/)) {
            reply = "Uday holds a Bachelor in Computer Engineering from Pathivara Engineering College, and participated in ACES Techfest Hackathon v7.0 and IIc QUEST 4.0.";
        } else if (q.match(/experience|year/)) {
            reply = "Uday has 1+ years of experience in full stack development, AI engineering, and system architecture.";
        } else if (q.match(/hello|hi|hey|yo/)) {
            reply = "Hello! 👋 I'm here to help you explore Uday's portfolio. What would you like to know?";
        }

        addMessage(reply, false);
    }, 600);
}

sendChat.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleChat();
});

/* ── Typing Effect for hero role ──────────────────────────── */
(function typingEffect() {
    const roles = [
        'Full Stack Developer',
        'AI Engineer',
        'ML Practitioner',
    ];
    const el = document.querySelector('.hero-role strong');
    if (!el) return;

    let rIdx = 0, cIdx = 0, deleting = false;

    function type() {
        const current = roles[rIdx];
        el.textContent = current.substring(0, cIdx);

        if (!deleting && cIdx < current.length) {
            cIdx++;
            setTimeout(type, 90);
        } else if (deleting && cIdx > 0) {
            cIdx--;
            setTimeout(type, 45);
        } else if (!deleting && cIdx === current.length) {
            deleting = true;
            setTimeout(type, 1800);
        } else {
            deleting = false;
            rIdx = (rIdx + 1) % roles.length;
            setTimeout(type, 300);
        }
    }

    // Start after initial animation
    setTimeout(type, 1200);
})();

/* ── Section entrance: tilt on mouse for project cards ─────── */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const cx     = rect.width / 2;
        const cy     = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -4;
        const rotateY = ((x - cx) / cx) *  4;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ── Smooth scroll ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
