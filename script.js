// Navigation scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

// Add scrolled class to navbar when scrolling down
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active link highlighting based on scroll position
const sections = document.querySelectorAll('section, header');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
});

// Video sound control and scroll reveal
const video = document.querySelector('.bg-video');
const revealElements = document.querySelectorAll('.reveal');

let hasInteracted = false;

const soundBtn = document.getElementById('enable-sound-btn');

// The video will natively autoplay muted thanks to the HTML attributes.
// Listen for an explicit button click or a body click to unmute it.
const enableSound = () => {
    if (video && video.muted) {
        video.muted = false;
        video.volume = 1.0;
        hasInteracted = true;
        video.play().catch(e => console.log('Playback failed:', e));
        if (soundBtn) soundBtn.style.display = 'none';
    }
};

if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent body click
        enableSound();
    });
}

document.body.addEventListener('click', enableSound);

let isVideoFaded = false;
// Mute video on scroll and add smooth effects
window.addEventListener('scroll', () => {
    if (!video) return;
    const shouldFade = window.scrollY > window.innerHeight * 0.3;
    
    if (shouldFade && !isVideoFaded) {
        if (!video.muted) video.muted = true;
        video.style.opacity = '0.3';
        isVideoFaded = true;
    } else if (!shouldFade && isVideoFaded) {
        if (hasInteracted) {
            video.muted = false;
            video.play().catch(()=>{});
        }
        video.style.opacity = '1';
        isVideoFaded = false;
    }
});

// Mute video when clicking a nav link and add smooth effects
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!video || isVideoFaded) return;
        if (!video.muted) video.muted = true;
        video.style.opacity = '0.3';
        isVideoFaded = true;
    });
});

// Intersection Observer for scroll animations
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Staggered card-reveal observer
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(() => {
                entry.target.classList.add('active');
            }, delay);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card-reveal').forEach(el => cardObserver.observe(el));

// Laser canvas animation
const canvas = document.getElementById('laser-canvas');
const ctx = canvas.getContext('2d');
const projectsSection = document.getElementById('projects');

function resizeCanvas() {
    canvas.width = projectsSection.offsetWidth;
    canvas.height = projectsSection.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const lasers = Array.from({ length: 6 }, (_, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    angle: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.6,
    length: 120 + Math.random() * 180,
    width: 1.5 + Math.random() * 2,
    hue: 190 + Math.random() * 50,   // cyan-blue range
    alpha: 0.5 + Math.random() * 0.4,
}));

function drawLasers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lasers.forEach(l => {
        l.x += Math.cos(l.angle) * l.speed;
        l.y += Math.sin(l.angle) * l.speed;

        // Bounce off walls
        if (l.x < 0 || l.x > canvas.width)  l.angle = Math.PI - l.angle;
        if (l.y < 0 || l.y > canvas.height) l.angle = -l.angle;

        const grd = ctx.createLinearGradient(
            l.x, l.y,
            l.x + Math.cos(l.angle) * l.length,
            l.y + Math.sin(l.angle) * l.length
        );
        grd.addColorStop(0, `hsla(${l.hue}, 100%, 70%, ${l.alpha})`);
        grd.addColorStop(1, `hsla(${l.hue}, 100%, 70%, 0)`);

        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(
            l.x + Math.cos(l.angle) * l.length,
            l.y + Math.sin(l.angle) * l.length
        );
        ctx.strokeStyle = grd;
        ctx.lineWidth = l.width;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${l.hue}, 100%, 70%, 0.8)`;
        ctx.stroke();
    });
    if (isLasersVisible) {
        requestAnimationFrame(drawLasers);
    }
}

let isLasersVisible = false;
const lasersObserver = new IntersectionObserver((entries) => {
    isLasersVisible = entries[0].isIntersecting;
    if (isLasersVisible) drawLasers();
}, { threshold: 0 });
lasersObserver.observe(projectsSection);

// ─── Skills Canvas: floating skill name text ──────────────────────────────────
const skillsCanvas  = document.getElementById('skills-canvas');
const skillsSection = document.getElementById('skills');
const sCtx          = skillsCanvas.getContext('2d');

function resizeSkillsCanvas() {
    skillsCanvas.width  = skillsSection.offsetWidth;
    skillsCanvas.height = skillsSection.offsetHeight;
}
resizeSkillsCanvas();
window.addEventListener('resize', resizeSkillsCanvas);

const floatingSkills = [
    { label: 'Python',          color: '#f59e0b' },
    { label: 'JavaScript',      color: '#38bdf8' },
    { label: 'C++',             color: '#10b981' },
    { label: 'C',               color: '#ef4444' },
    { label: 'React',           color: '#ec4899' },
    { label: 'HTML5',           color: '#38bdf8' },
    { label: 'CSS3',            color: '#a855f7' },
    { label: 'Tailwind',        color: '#a855f7' },
    { label: 'Git',             color: '#f59e0b' },
    { label: 'Docker',          color: '#38bdf8' },
    { label: 'MongoDB',         color: '#10b981' },
    { label: 'SQL',             color: '#a855f7' },
    { label: 'Node.js',         color: '#10b981' },
    { label: 'Scikit-Learn',    color: '#ef4444' },
    { label: 'TensorFlow',      color: '#f59e0b' },
    { label: 'Django',          color: '#38bdf8' },
    { label: 'Streamlit',       color: '#ec4899' },
    { label: 'GitHub',          color: '#f59e0b' },
];

// Build moving particles – one per skill, duplicated for density
const textParticles = [];
floatingSkills.forEach((s, i) => {
    // spawn 1-2 copies of each
    [0, 1].forEach(copy => {
        const fontSize = 13 + Math.random() * 10;
        textParticles.push({
            label:    s.label,
            color:    s.color,
            x:        Math.random() * skillsCanvas.width,
            y:        Math.random() * skillsCanvas.height,
            dx:       (Math.random() - 0.5) * 0.6,
            dy:       (Math.random() - 0.5) * 0.6,
            fontSize,
            alpha:    0.5 + Math.random() * 0.4,
            pulse:    Math.random() * Math.PI * 2,
        });
    });
});

function drawSkillText() {
    sCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

    textParticles.forEach(p => {
        p.pulse += 0.018;
        p.alpha = 0.45 + Math.sin(p.pulse) * 0.3;

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -120 || p.x > skillsCanvas.width  + 120) p.dx *= -1;
        if (p.y < -30  || p.y > skillsCanvas.height + 30)  p.dy *= -1;

        sCtx.save();
        sCtx.globalAlpha = Math.max(0.1, p.alpha);
        sCtx.font        = `bold ${p.fontSize}px 'Space Grotesk', sans-serif`;
        sCtx.fillStyle   = p.color;
        sCtx.shadowBlur  = 14;
        sCtx.shadowColor = p.color;
        sCtx.fillText(p.label, p.x, p.y);
        sCtx.restore();
    });

    if (isSkillsVisible) {
        requestAnimationFrame(drawSkillText);
    }
}

let isSkillsVisible = false;
const skillsObserver = new IntersectionObserver((entries) => {
    isSkillsVisible = entries[0].isIntersecting;
    if (isSkillsVisible) drawSkillText();
}, { threshold: 0 });
skillsObserver.observe(skillsSection);

// ─── Smooth video playback ────────────────────────────────────────────────────
const bgVideo = document.querySelector('.bg-video');
if (bgVideo) {
    bgVideo.setAttribute('playsinline', '');
    bgVideo.setAttribute('preload', 'auto');
    // Resume play if interrupted (e.g. browser throttle)
    bgVideo.addEventListener('pause', () => {
        if (window.scrollY < window.innerHeight * 0.3) {
            bgVideo.play().catch(() => {});
        }
    });
    bgVideo.addEventListener('stalled', () => bgVideo.load());
    bgVideo.play().catch(() => {});
}

// ─── Chatbot Logic ───────────────────────────────────────────────────────────
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');

// Toggle chat window
function toggleChat() {
    const isHidden = chatWindow.classList.contains('hidden');
    const tooltip = document.getElementById('chat-tooltip');

    if (isHidden) {
        // Opening chat: Hide tooltip
        if (tooltip) tooltip.style.display = 'none';
        
        chatWindow.classList.remove('hidden');
        // trigger reflow
        void chatWindow.offsetWidth;
        chatWindow.classList.remove('scale-95', 'opacity-0');
        chatWindow.classList.add('scale-100', 'opacity-100');
        // remove notification dot
        const dots = chatToggle.querySelectorAll('span.absolute');
        dots.forEach(d => d.style.display = 'none');
    } else {
        // Closing chat: Show tooltip again
        if (tooltip) tooltip.style.display = '';

        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => chatWindow.classList.add('hidden'), 300);
    }
}

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

// Handle sending messages
function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `p-3 rounded-xl max-w-[85%] text-sm ${isUser ? 'bg-cyan-600 text-white self-end rounded-tr-sm' : 'bg-white/10 text-gray-200 self-start rounded-tl-sm border border-white/5'}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    chatInput.value = '';

    // Simple bot logic
    setTimeout(() => {
        const lowerText = text.toLowerCase();
        let reply = "I'm not sure about that. Try asking about 'skills', 'projects', or 'contact'!";
        
        if (lowerText.includes('skill') || lowerText.includes('language') || lowerText.includes('tools')) {
            reply = "Uday is an expert in Python, JavaScript, C++, React, and Tailwind CSS. He also uses tools like Docker, Git, MongoDB, and SQL.";
        } else if (lowerText.includes('project') || lowerText.includes('work') || lowerText.includes('portfolio') || lowerText.includes('palo') || lowerText.includes('queue')) {
            reply = "He has built the Pālo Queue Management System, an E-Voting System, a Care Connect healthcare app (Hackathon Winner!), and a Self-Healing Database. Check the Featured Projects section above!";
        } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('phone') || lowerText.includes('hire')) {
            reply = "You can reach him at udayd468@gmail.com or +977-9825967719. His GitHub is @ukdeo and he's also on LinkedIn!";
        } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
            reply = "Hello! How can I help you navigate Uday's portfolio?";
        }

        addMessage(reply, false);
    }, 600);
}

sendChat.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});
