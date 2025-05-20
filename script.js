// --- Global Constants and Utilities ---
const SELECTORS = {
    loader: '.cutsy-loader',
    mainContent: 'main',
    navLinks: '.cyber-nav .nav-link',
    sections: 'section, footer',
    skillCards3D: '.skill-card-3d',
    priceCards3D: '.price-card-3d',
    sliderTrack: '.slider-track',
    sliderCards: '.slider-card',
    leftArrow: '.left-arrow',
    rightArrow: '.right-arrow',
    glitchText: '.glitch-text',
    cyberWaveCanvas: '.cyber-wave-canvas', // New selector
    particlesCanvas: '.particles-canvas'   // Existing selector
};

const DURATION = {
    loaderHide: 2500, // Time before hiding the loader
    sliderAutoAdvance: 5000 // Time for auto-advancing slider
};

// --- Particle System ---
const particlesCanvas = document.querySelector(SELECTORS.particlesCanvas);
const particlesCtx = particlesCanvas ? particlesCanvas.getContext('2d') : null;
let particles = [];

function initializeParticles() {
    if (!particlesCanvas || !particlesCtx) return;

    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * particlesCanvas.width;
            this.y = Math.random() * particlesCanvas.height;
            this.size = Math.random() * 2 + 1; // Size between 1 and 3
            this.speedX = (Math.random() - 0.5) * 0.5; // Speed between -0.25 and 0.25
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = `rgba(110, 68, 255, ${Math.random() * 0.4 + 0.1})`; // Opacity between 0.1 and 0.5
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > particlesCanvas.width + 20 || this.x < -20 || this.y > particlesCanvas.height + 20 || this.y < -20) {
                this.reset();
            }
        }

        draw() {
            particlesCtx.fillStyle = this.color;
            particlesCtx.beginPath();
            particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            particlesCtx.fill();
        }
    }

    particles = Array(150).fill().map(() => new Particle()); // Increased particles for more density
}

function animateParticles() {
    if (!particlesCtx) return;
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

// --- Cyber Wave Background Animation ---
const cyberWaveCanvas = document.querySelector(SELECTORS.cyberWaveCanvas);
const cyberWaveCtx = cyberWaveCanvas ? cyberWaveCanvas.getContext('2d') : null;
let wavePoints = [];
const numWaves = 3; // Number of distinct waves
const waveHeight = 80; // Max height of the wave peaks
const waveSpeed = 0.5; // Speed of wave movement
let waveOffset = 0;

function initializeCyberWaves() {
    if (!cyberWaveCanvas || !cyberWaveCtx) return;

    cyberWaveCanvas.width = window.innerWidth;
    cyberWaveCanvas.height = window.innerHeight;

    wavePoints = [];
    // Initialize points for each wave
    for (let i = 0; i < numWaves; i++) {
        const points = [];
        for (let x = 0; x <= cyberWaveCanvas.width + 50; x += 50) { // +50 to draw slightly off-screen
            points.push({ 
                x: x, 
                y: cyberWaveCanvas.height / 2 + Math.sin(x * 0.02 + i) * waveHeight * (0.5 + Math.random() * 0.5) // Varied initial height
            });
        }
        wavePoints.push(points);
    }
}

function animateCyberWaves() {
    if (!cyberWaveCtx) return;

    cyberWaveCtx.clearRect(0, 0, cyberWaveCanvas.width, cyberWaveCanvas.height);
    waveOffset += waveSpeed;

    for (let i = 0; i < numWaves; i++) {
        cyberWaveCtx.beginPath();
        cyberWaveCtx.moveTo(wavePoints[i][0].x, wavePoints[i][0].y);

        // Define wave color and glow
        let hue = (i * 60 + waveOffset * 0.1) % 360; // Shift hue over time
        cyberWaveCtx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.5)`; // Dynamic color
        cyberWaveCtx.lineWidth = 2; // Thicker lines
        cyberWaveCtx.shadowBlur = 10;
        cyberWaveCtx.shadowColor = `hsla(${hue}, 100%, 50%, 0.8)`;


        for (let j = 0; j < wavePoints[i].length - 1; j++) {
            const p1 = wavePoints[i][j];
            const p2 = wavePoints[i][j + 1];
            
            // Calculate a control point for smoother curves
            const ctrlX = (p1.x + p2.x) / 2;
            const ctrlY = p1.y + (p2.y - p1.y) * 0.5;

            // Use quadraticCurveTo for smoother waves
            cyberWaveCtx.quadraticCurveTo(ctrlX, ctrlY, p2.x, p2.y);

            // Update y position for animation
            p1.y = cyberWaveCanvas.height / 2 + Math.sin((p1.x + waveOffset * (1 + i * 0.2)) * 0.015 + i * 2) * waveHeight * (0.5 + i * 0.2);
        }
        cyberWaveCtx.stroke();
    }
    requestAnimationFrame(animateCyberWaves);
}

// --- Navigation Smooth Scrolling & Active State ---
function setupNavigation() {
    const navLinks = document.querySelectorAll(SELECTORS.navLinks);
    if (navLinks.length === 0) return;

    navLinks.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll(SELECTORS.sections);
        let currentSection = null;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

// --- 3D Card Mouse Tilt Effect ---
function setup3DCards() {
    const all3DCards = document.querySelectorAll(`${SELECTORS.skillCards3D}, ${SELECTORS.priceCards3D}`);
    if (all3DCards.length === 0) return;

    all3DCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateX = (mouseY / (rect.height / 2)) * -10; 
            const rotateY = (mouseX / (rect.width / 2)) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`; 
        });
    });
}

// --- Skill Slider Logic ---
function setupSkillSlider() {
    const sliderTrack = document.querySelector(SELECTORS.sliderTrack);
    const sliderCards = document.querySelectorAll(SELECTORS.sliderCards);
    const leftArrow = document.querySelector(SELECTORS.leftArrow);
    const rightArrow = document.querySelector(SELECTORS.rightArrow);

    if (!sliderTrack || sliderCards.length === 0 || !leftArrow || !rightArrow) return;

    let currentIndex = 0;
    const totalCards = sliderCards.length;

    function updateSlider() {
        const offset = -currentIndex * 100;
        sliderTrack.style.transform = `translateX(${offset}%)`;

        sliderCards.forEach(card => {
            const span = card.querySelector('span');
            if (span) {
                span.setAttribute('data-text', span.textContent);
            }
        });
    }

    leftArrow.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalCards - 1;
        updateSlider();
    });

    rightArrow.addEventListener('click', () => {
        currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
        updateSlider();
    });

    setInterval(() => {
        currentIndex = (currentIndex < totalCards - 1) ? currentIndex + 1 : 0;
        updateSlider();
    }, DURATION.sliderAutoAdvance);

    updateSlider(); // Initial call
}

// --- DevTools Detection and Warning ---
function detectDevTools() {
    const threshold = 160;
    let devtoolsOpen = false;

    // Check by window size
    window.addEventListener('resize', () => {
        if ((window.outerWidth - window.innerWidth > threshold) || (window.outerHeight - window.innerHeight > threshold)) {
            if (!devtoolsOpen) {
                console.log("%cSTOP LOOKIN' HERE!", "color: red; font-size: 4em; font-weight: bold; text-shadow: 0 0 10px red;");
                console.log("%cThis is a restricted area. Unauthorized access will be flagged.", "color: lime; font-size: 1.2em;");
                devtoolsOpen = true;
            }
        } else {
            devtoolsOpen = false;
        }
    });

    // More aggressive check using a dummy function
    const checkDebugger = () => {
        try {
            const func = new Function('debugger');
            func(); // This will trigger the debugger if DevTools are open
            if (!devtoolsOpen) {
                console.log("%cACCESS DENIED!", "color: red; font-size: 4em; font-weight: bold; text-shadow: 0 0 10px red;");
                console.log("%cLeave this console. You've been warned.", "color: orange; font-size: 1.2em;");
                devtoolsOpen = true;
            }
        } catch (e) {
            devtoolsOpen = false;
        }
    };

    setInterval(checkDebugger, 1000); 
    checkDebugger();
}

// --- Footer Glitch Text Effect ---
function setupFooterGlitch() {
    const glitchElement = document.querySelector(SELECTORS.glitchText);
    if (!glitchElement) return;

    function setGlitchVars() {
        glitchElement.style.setProperty('--glitch-rand1', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand2', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand3', Math.floor(Math.random() * 5));
        glitchElement.style.setProperty('--glitch-rand4', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand5', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand6', Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1));
        glitchElement.style.setProperty('--glitch-rand7', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand8', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand9', Math.floor(Math.random() * 5));
        glitchElement.style.setProperty('--glitch-rand10', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand11', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand12', Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1));
        glitchElement.style.setProperty('--glitch-rand13', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand14', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand15', Math.floor(Math.random() * 5));
        glitchElement.style.setProperty('--glitch-rand16', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand17', Math.floor(Math.random() * 50));
        glitchElement.style.setProperty('--glitch-rand18', Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1));
    }

    function updateGlitch() {
        setGlitchVars();
        requestAnimationFrame(updateGlitch);
    }
    updateGlitch();
}


// --- Main Initialization ---
window.addEventListener('load', () => {
    // Initialize and start all background animations
    initializeParticles();
    animateParticles();
    initializeCyberWaves(); // Initialize new wave background
    animateCyberWaves();   // Animate new wave background

    // Setup all page elements after initial load
    setupNavigation();
    setup3DCards();
    setupSkillSlider();
    setupFooterGlitch(); // Start the footer glitch effect

    // Hide loader and show main content after a delay
    const loader = document.querySelector(SELECTORS.loader);
    const mainContent = document.querySelector(SELECTORS.mainContent);
    
    if (loader && mainContent) {
        setTimeout(() => {
            loader.classList.add('hidden');
            loader.addEventListener('transitionend', () => {
                mainContent.classList.remove('hidden');
            }, { once: true });
        }, DURATION.loaderHide);
    } else {
        console.warn("Loader or main content element not found.");
        if (mainContent) mainContent.classList.remove('hidden');
    }

    // Initialize DevTools detection
    detectDevTools();
});

// Re-initialize canvases on window resize
window.addEventListener('resize', () => {
    initializeParticles();
    initializeCyberWaves(); // Re-initialize waves on resize
});