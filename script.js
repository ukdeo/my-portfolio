/* ============================================================
   UDAY KUMAR DEV — Premium Portfolio JavaScript
   Ultra-Smooth, Hardware-Accelerated & Mobile-Optimized
   ============================================================ */

'use strict';

/* ── Circular Favicon ─────────────────────────────────────── */
(function createCircularFavicon() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const img = new Image();
        img.src = '474800178_1292461398633854_1106197501179038931_n.jpg';
        img.onload = () => {
            ctx.beginPath();
            ctx.arc(64, 64, 64, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            
            const size = Math.min(img.width, img.height);
            const xOffset = (img.width - size) / 2;
            const yOffset = (img.height - size) / 2;
            
            ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, 128, 128);
            
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.type = 'image/png';
            link.href = canvas.toDataURL('image/png');
        };
    } catch (e) {
        // Fallback silently if canvas blocked
    }
})();

/* ── Custom Cursor (Desktop Only) ─────────────────────────── */
(function initCustomCursor() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (!isFinePointer || !cursorDot || !cursorRing) return;

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let isVisible = false;
    const ease = 0.15;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
            isVisible = true;
        }
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top  = `${mouseY}px`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
        isVisible = false;
    });

    function animateRing() {
        if (isVisible) {
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top  = `${ringY}px`;
        }
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Enlarge ring on interactive elements
    const hoverSelectors = 'a, button, [role="button"], [role="link"], input, .project-card, .skill-badge, .hobby-pill, .contact-link';
    document.querySelectorAll(hoverSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
    });
})();

/* ── Navigation & Mobile Drawer ───────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');
const navItems   = document.querySelectorAll('.nav-links li a');
const sections   = document.querySelectorAll('section[id], header[id]');

function setMobileNavState(isOpen) {
    if (!hamburger || !navLinks) return;
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navLinks.classList.toggle('active', isOpen);
    if (navOverlay) navOverlay.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
}

if (hamburger) {
    hamburger.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = navLinks && navLinks.classList.contains('active');
        setMobileNavState(!isOpen);
    });
}

if (navOverlay) {
    navOverlay.addEventListener('click', () => setMobileNavState(false));
}

navItems.forEach(item => {
    item.addEventListener('click', () => setMobileNavState(false));
});

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        setMobileNavState(false);
        if (typeof toggleChat === 'function' && chatOpen) toggleChat(false);
    }
});

/* ── Smooth Scrolling with Offset ──────────────────────────── */
const NAVBAR_HEIGHT = 76;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            setMobileNavState(false);
            
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;
            window.scrollTo({
                top: Math.max(0, targetPos),
                behavior: 'smooth'
            });
            
            if (history.pushState) {
                history.pushState(null, '', href);
            }
        }
    });
});

/* ── Navbar Scroll & Active Link Indicator ─────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollPos = window.scrollY;
            if (navbar) {
                navbar.classList.toggle('scrolled', scrollPos > 50);
            }

            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - NAVBAR_HEIGHT - 60;
                if (scrollPos >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

/* ── Hero Canvas — High-Performance Particle Web ──────────── */
(function initHeroCanvas() {
    const canvas  = document.getElementById('hero-canvas');
    const heroSec = document.getElementById('home');
    if (!canvas || !heroSec) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    let width = 0, height = 0;

    function resize() {
        width  = canvas.width  = heroSec.offsetWidth;
        height = canvas.height = heroSec.offsetHeight;
    }
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            createParticles();
        }, 150);
    }, { passive: true });

    let particles = [];
    function createParticles() {
        const count = window.innerWidth < 768 ? 32 : 65;
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x:     Math.random() * width,
                y:     Math.random() * height,
                vx:    (Math.random() - 0.5) * 0.35,
                vy:    (Math.random() - 0.5) * 0.35,
                r:     Math.random() * 1.5 + 0.4,
                alpha: Math.random() * 0.35 + 0.15,
            });
        }
    }
    createParticles();

    let mouseX = -9999, mouseY = -9999;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });
    }

    const maxDist = 120;
    function draw() {
        if (!isVisible) return;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width)  p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDist * maxDist) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / maxDist) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }

            // Subtle mouse repulsion on desktop
            const mdx = p.x - mouseX;
            const mdy = p.y - mouseY;
            const mDistSq = mdx * mdx + mdy * mdy;
            if (mDistSq < 10000) {
                const mDist = Math.sqrt(mDistSq);
                const force = (100 - mDist) / 100;
                const angle = Math.atan2(mdy, mdx);
                p.vx += Math.cos(angle) * force * 0.06;
                p.vy += Math.sin(angle) * force * 0.06;
            }

            p.vx *= 0.998;
            p.vy *= 0.998;
        }

        requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver(entries => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) requestAnimationFrame(draw);
    }, { threshold: 0 });
    observer.observe(heroSec);
})();

/* ── Projects Canvas — Subtle Ambient Lines ───────────────── */
(function initProjectsCanvas() {
    const canvas  = document.getElementById('projects-canvas');
    const section = document.getElementById('projects');
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    function resize() {
        width  = canvas.width  = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    }
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    const lines = Array.from({ length: 6 }, () => ({
        x:      Math.random() * width,
        y:      Math.random() * height,
        angle:  Math.random() * Math.PI * 2,
        speed:  0.25 + Math.random() * 0.35,
        length: 90 + Math.random() * 120,
        width:  0.6 + Math.random() * 0.8,
        alpha:  0.06 + Math.random() * 0.08,
    }));

    let visible = false;

    function drawLines() {
        if (!visible) return;
        ctx.clearRect(0, 0, width, height);

        lines.forEach(l => {
            l.x += Math.cos(l.angle) * l.speed;
            l.y += Math.sin(l.angle) * l.speed;
            if (l.x < 0 || l.x > width)  l.angle = Math.PI - l.angle;
            if (l.y < 0 || l.y > height) l.angle = -l.angle;

            const endX = l.x + Math.cos(l.angle) * l.length;
            const endY = l.y + Math.sin(l.angle) * l.length;

            const grd = ctx.createLinearGradient(l.x, l.y, endX, endY);
            grd.addColorStop(0, `rgba(255,255,255,${l.alpha})`);
            grd.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = grd;
            ctx.lineWidth   = l.width;
            ctx.stroke();
        });

        requestAnimationFrame(drawLines);
    }

    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) requestAnimationFrame(drawLines);
    }, { threshold: 0 }).observe(section);
})();

/* ── Skills Canvas — Floating Tech Badges ─────────────────── */
(function initSkillsCanvas() {
    const canvas  = document.getElementById('skills-canvas');
    const section = document.getElementById('skills');
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    function resize() {
        width  = canvas.width  = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
    }
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    const words = ['Python','React','FastAPI','Docker','MongoDB','C++',
                   'Django','TensorFlow','Node.js','PostgreSQL','Streamlit'];

    const particles = [];
    words.forEach(w => {
        particles.push({
            label:    w,
            x:        Math.random() * (width || 800),
            y:        Math.random() * (height || 600),
            dx:       (Math.random() - 0.5) * 0.35,
            dy:       (Math.random() - 0.5) * 0.35,
            fontSize: 12 + Math.random() * 6,
            pulse:    Math.random() * Math.PI * 2,
        });
    });

    let visible = false;

    function draw() {
        if (!visible) return;
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.pulse += 0.015;
            const alpha = 0.04 + Math.abs(Math.sin(p.pulse)) * 0.06;
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < -100 || p.x > width + 100) p.dx *= -1;
            if (p.y < -30  || p.y > height + 30) p.dy *= -1;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.font = `600 ${p.fontSize}px 'Space Grotesk', sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(p.label, p.x, p.y);
            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) requestAnimationFrame(draw);
    }, { threshold: 0 }).observe(section);
})();

/* ── Stat Counters Animation ──────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
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
    const statsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounter(yearsEl, 1);
            animateCounter(projectsEl, 6);
            statsObserver.disconnect();
        }
    }, { threshold: 0.3 });

    const statsTrigger = document.querySelector('.hero-stats') || document.querySelector('.hero-visual');
    if (statsTrigger) statsObserver.observe(statsTrigger);
}

/* ── Scroll Reveal System ─────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Staggered Card Reveal ────────────────────────────────── */
const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay, 10) || 0;
            setTimeout(() => {
                entry.target.classList.add('active');
            }, delay);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.06 });

document.querySelectorAll('.card-reveal').forEach(el => cardObserver.observe(el));

/* ── Hero Image Desktop Parallax ──────────────────────────── */
const heroImg = document.getElementById('hero-img');
if (heroImg) {
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            window.requestAnimationFrame(() => {
                if (window.innerWidth > 900) {
                    const scrollY = window.scrollY;
                    const shift = Math.min(scrollY * 0.12, 120);
                    heroImg.style.transform = `translateY(${shift}px)`;
                } else {
                    heroImg.style.transform = '';
                }
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });
}

/* ── Project Cards: Full-Card Clickable & Desktop Tilt ─────── */
document.querySelectorAll('.project-card').forEach(card => {
    const url = card.dataset.url;
    if (url) {
        card.addEventListener('click', e => {
            // Don't duplicate click if the user clicked directly on the anchor inside
            if (e.target.closest('a')) return;
            window.open(url, '_blank', 'noopener,noreferrer');
        });

        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    }

    // 3D Tilt Effect on Desktop
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x    = e.clientX - rect.left;
            const y    = e.clientY - rect.top;
            const cx   = rect.width / 2;
            const cy   = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -4;
            const rotateY = ((x - cx) / cx) *  4;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }
});

/* ── Chatbot Assistant ────────────────────────────────────── */
const chatToggle      = document.getElementById('chat-toggle');
const chatWindow      = document.getElementById('chat-window');
const closeChat       = document.getElementById('close-chat');
const chatInput       = document.getElementById('chat-input');
const sendChat        = document.getElementById('send-chat');
const chatMessages    = document.getElementById('chat-messages');
const chatDot         = document.getElementById('chat-dot');
const chatSuggestions = document.getElementById('chat-suggestions');

let chatOpen = false;

function toggleChat(forceState) {
    if (!chatWindow) return;
    chatOpen = typeof forceState === 'boolean' ? forceState : !chatOpen;
    
    if (chatOpen) {
        chatWindow.classList.add('open');
        chatWindow.setAttribute('aria-hidden', 'false');
        if (chatToggle) chatToggle.setAttribute('aria-expanded', 'true');
        if (chatDot) chatDot.style.display = 'none';
        setTimeout(() => {
            if (chatInput) chatInput.focus();
        }, 150);
    } else {
        chatWindow.classList.remove('open');
        chatWindow.setAttribute('aria-hidden', 'true');
        if (chatToggle) chatToggle.setAttribute('aria-expanded', 'false');
    }
}

if (chatToggle) {
    chatToggle.addEventListener('click', e => {
        e.stopPropagation();
        toggleChat();
    });
}

if (closeChat) {
    closeChat.addEventListener('click', e => {
        e.stopPropagation();
        toggleChat(false);
    });
}

// Close chat when clicking outside
document.addEventListener('click', e => {
    if (chatOpen && !e.target.closest('#chatbot-container')) {
        toggleChat(false);
    }
});

function addChatMessage(text, isUser = false) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat(customQuery) {
    const text = (typeof customQuery === 'string' ? customQuery : (chatInput ? chatInput.value : '')).trim();
    if (!text) return;

    addChatMessage(text, true);
    if (chatInput) chatInput.value = '';

    setTimeout(() => {
        const q = text.toLowerCase();
        let reply = "Try asking about 'skills', 'projects', 'contact', or 'experience'!";

        if (q.match(/skill|language|tool|tech|stack/)) {
            reply = "Uday is proficient in Python, JavaScript, React, FastAPI, Django, Docker, MongoDB, PostgreSQL, C++, and Machine Learning (Scikit-Learn, TensorFlow).";
        } else if (q.match(/project|work|portfolio|palo|queue|fleet|voting|care|diabet|database/)) {
            reply = "Featured projects: 1) Pālo Queue System, 2) Fleet Management System, 3) E-Voting System, 4) Care Connect, 5) Diabetes Health Checker, & 6) Self-Healing Database. Click any card to view its GitHub code!";
        } else if (q.match(/contact|email|phone|hire|reach|call|message/)) {
            reply = "📧 Email: udayd468@gmail.com | 📞 Phone: +977-9825967719 | GitHub: github.com/ukdeo | LinkedIn: Uday Kumar Dev";
        } else if (q.match(/education|study|college|school|degree|certif/)) {
            reply = "Uday is pursuing a Bachelor in Computer Engineering at Pathivara Engineering College. Key achievements include ACES Techfest Hackathon v7.0 and IIc QUEST 4.0.";
        } else if (q.match(/experience|year/)) {
            reply = "Uday has 1+ years of hands-on experience building full-stack web applications, REST APIs, and machine learning models.";
        } else if (q.match(/hello|hi|hey|yo|namaste|sup/)) {
            reply = "Hello! 👋 I'm here to help you explore Uday's portfolio. What would you like to know?";
        }

        addChatMessage(reply, false);
    }, 450);
}

if (sendChat) {
    sendChat.addEventListener('click', () => handleChat());
}

if (chatInput) {
    chatInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleChat();
    });
}

// Quick Suggestion Chips
if (chatSuggestions) {
    chatSuggestions.querySelectorAll('.chat-chip').forEach(chip => {
        chip.addEventListener('click', e => {
            e.stopPropagation();
            const query = chip.dataset.query || chip.textContent;
            handleChat(query);
        });
    });
}

/* ── Hero Role Typing Effect ──────────────────────────────── */
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
            setTimeout(type, 85);
        } else if (deleting && cIdx > 0) {
            cIdx--;
            setTimeout(type, 40);
        } else if (!deleting && cIdx === current.length) {
            deleting = true;
            setTimeout(type, 1800);
        } else {
            deleting = false;
            rIdx = (rIdx + 1) % roles.length;
            setTimeout(type, 300);
        }
    }

    setTimeout(type, 1000);
})();
