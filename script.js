
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
    cyberWaveCanvas: '.cyber-wave-canvas', 
    particlesCanvas: '.particles-canvas'   
};

const DURATION = {
    loaderHide: 2500, 
    sliderAutoAdvance: 5000 
};


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
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5; 
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = `rgba(110, 68, 255, ${Math.random() * 0.4 + 0.1})`; 
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

    particles = Array(150).fill().map(() => new Particle());
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


const cyberWaveCanvas = document.querySelector(SELECTORS.cyberWaveCanvas);
const cyberWaveCtx = cyberWaveCanvas ? cyberWaveCanvas.getContext('2d') : null;
let wavePoints = [];
const numWaves = 3; 
const waveHeight = 80; 
const waveSpeed = 0.5; 
let waveOffset = 0;

function initializeCyberWaves() {
    if (!cyberWaveCanvas || !cyberWaveCtx) return;

    cyberWaveCanvas.width = window.innerWidth;
    cyberWaveCanvas.height = window.innerHeight;

    wavePoints = [];
    
    for (let i = 0; i < numWaves; i++) {
        const points = [];
        for (let x = 0; x <= cyberWaveCanvas.width + 50; x += 50) { 
            points.push({ 
                x: x, 
                y: cyberWaveCanvas.height / 2 + Math.sin(x * 0.02 + i) * waveHeight * (0.5 + Math.random() * 0.5) 
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

        
        let hue = (i * 60 + waveOffset * 0.1) % 360; 
        cyberWaveCtx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.5)`; 
        cyberWaveCtx.lineWidth = 2; 
        cyberWaveCtx.shadowBlur = 10;
        cyberWaveCtx.shadowColor = `hsla(${hue}, 100%, 50%, 0.8)`;


        for (let j = 0; j < wavePoints[i].length - 1; j++) {
            const p1 = wavePoints[i][j];
            const p2 = wavePoints[i][j + 1];
            
            
            const ctrlX = (p1.x + p2.x) / 2;
            const ctrlY = p1.y + (p2.y - p1.y) * 0.5;

          
            cyberWaveCtx.quadraticCurveTo(ctrlX, ctrlY, p2.x, p2.y);

           
            p1.y = cyberWaveCanvas.height / 2 + Math.sin((p1.x + waveOffset * (1 + i * 0.2)) * 0.015 + i * 2) * waveHeight * (0.5 + i * 0.2);
        }
        cyberWaveCtx.stroke();
    }
    requestAnimationFrame(animateCyberWaves);
}


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

    updateSlider(); 
}


function detectDevTools() {
    const threshold = 160;
    let devtoolsOpen = false;

   
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

    
    const checkDebugger = () => {
        try {
            const func = new Function('debugger');
            func(); 
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



window.addEventListener('load', () => {
  
    initializeParticles();
    animateParticles();
    initializeCyberWaves(); 
    animateCyberWaves();   

    
    setupNavigation();
    setup3DCards();
    setupSkillSlider();
    setupFooterGlitch(); 

    
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

    
    detectDevTools();
});


window.addEventListener('resize', () => {
    initializeParticles();
    initializeCyberWaves(); 
});