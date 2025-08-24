document.addEventListener('DOMContentLoaded', () => {
    // Function to generate random pastel color
    function generateRandomPastelColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 30 + Math.floor(Math.random() * 40); // 30-70% saturation
        const lightness = 70 + Math.floor(Math.random() * 20); // 70-90% lightness
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // Function to apply random pastel theme
    function applyRandomPastelTheme() {
        const pastelColor = generateRandomPastelColor();
        const root = document.documentElement;
        
        // Convert HSL to RGB for alpha calculations
        const tempDiv = document.createElement('div');
        tempDiv.style.color = pastelColor;
        document.body.appendChild(tempDiv);
        const rgbColor = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        
        // Extract RGB values
        const rgbMatch = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const [, r, g, b] = rgbMatch;
            
            // Set CSS custom properties for pastel theme
            root.style.setProperty('--background', '#000000');
            root.style.setProperty('--text', `rgba(${r}, ${g}, ${b}, 0.85)`);
            root.style.setProperty('--text-muted', `rgba(${r}, ${g}, ${b}, 0.5)`);
            root.style.setProperty('--text-bright', `rgba(${r}, ${g}, ${b}, 0.95)`);
            root.style.setProperty('--card-bg', `rgba(${r}, ${g}, ${b}, 0.1)`);
            root.style.setProperty('--card-hover', `rgba(${r}, ${g}, ${b}, 0.15)`);
            root.style.setProperty('--border', `rgba(${r}, ${g}, ${b}, 0.2)`);
            root.style.setProperty('--hover-border', `rgba(${r}, ${g}, ${b}, 0.4)`);
            root.style.setProperty('--button-bg', `rgba(${r}, ${g}, ${b}, 0.15)`);
            root.style.setProperty('--button-hover', `rgba(${r}, ${g}, ${b}, 0.25)`);
            root.style.setProperty('--link-color', pastelColor);
            root.style.setProperty('--link-hover', `rgba(${r}, ${g}, ${b}, 0.8)`);
            root.style.setProperty('--notification-success-bg', 'rgba(80, 250, 123, 0.8)');
            root.style.setProperty('--notification-error-bg', 'rgba(255, 85, 85, 0.8)');
            root.style.setProperty('--notification-info-bg', `rgba(${r}, ${g}, ${b}, 0.8)`);
        }
    }

    // Error code and theme configuration
    const errorConfigs = [
        {
            code: '404',
            theme: 'pink',
            message: 'invalid subdomain - this page doesn\'t exist',
            description: 'the subdomain you entered is not valid or doesn\'t exist </3'
        },
        {
            code: '501',
            theme: 'white',
            message: 'not implemented - feature unavailable',
            description: 'the subdomain you entered is not valid or doesn\'t exist </3'
        },
        {
            code: '418',
            theme: 'pastel',
            message: 'i\'m a teapot - cannot brew coffee',
            description: 'the subdomain you entered is not valid or doesn\'t exist </3'
        }
    ];

    // Randomly select error configuration
    const randomConfig = errorConfigs[Math.floor(Math.random() * errorConfigs.length)];
    
    // Update DOM elements
    const errorCodeElement = document.getElementById('error-code');
    const errorMessageElement = document.getElementById('error-message');
    const errorDescriptionElement = document.querySelector('.error-description');
    
    if (errorCodeElement) {
        errorCodeElement.textContent = randomConfig.code;
    }
    
    if (errorMessageElement) {
        errorMessageElement.textContent = randomConfig.message;
    }
    
    if (errorDescriptionElement) {
        errorDescriptionElement.textContent = randomConfig.description;
    }
    
    // Apply theme
    if (randomConfig.theme === 'pastel') {
        applyRandomPastelTheme();
        document.documentElement.setAttribute('data-theme', 'pastel');
    } else {
        document.documentElement.setAttribute('data-theme', randomConfig.theme);
    }
    
    // Update page title based on error code
    document.title = `${randomConfig.code} - Invalid Subdomain`;
    
    // Add a class to the body to indicate JS is enabled
    document.body.classList.add('js-enabled');
    
    // Add some interactive effects
    const errorCard = document.querySelector('.error-card');
    if (errorCard) {
        // Add subtle parallax effect on mouse move
        errorCard.addEventListener('mousemove', (e) => {
            const rect = errorCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation values based on mouse position
            const rotateY = -1 * ((rect.width / 2 - x) / (rect.width / 2)) * 5; // Max 5 degrees
            const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 5; // Max 5 degrees
            
            errorCard.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        errorCard.addEventListener('mouseleave', () => {
            errorCard.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
        });
    }
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.home-btn, .main-site-btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(2px) scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
    
    // Easter egg: Konami code to cycle through all themes
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            
            // Cycle through all error configs
            let currentIndex = 0;
            const cycleInterval = setInterval(() => {
                const config = errorConfigs[currentIndex % errorConfigs.length];
                
                // Update elements
                if (errorCodeElement) errorCodeElement.textContent = config.code;
                if (errorMessageElement) errorMessageElement.textContent = config.message;
                if (errorDescriptionElement) errorDescriptionElement.textContent = config.description;
                
                // Apply theme
                if (config.theme === 'pastel') {
                    applyRandomPastelTheme();
                    document.documentElement.setAttribute('data-theme', 'pastel');
                } else {
                    document.documentElement.setAttribute('data-theme', config.theme);
                }
                
                document.title = `${config.code} - Invalid Subdomain`;
                
                currentIndex++;
                
                // Stop after showing all themes twice
                if (currentIndex >= errorConfigs.length * 2) {
                    clearInterval(cycleInterval);
                }
            }, 1000);
            
            konamiCode = []; // Reset
        }
    });
    
    // Add some random glitch effects occasionally
    setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance every interval
            const header = document.querySelector('header h1');
            if (header) {
                header.style.textShadow = '0 0 20px var(--text-bright), 0 0 30px var(--link-color), 2px 2px 0px var(--text)';
                setTimeout(() => {
                    header.style.textShadow = '0 0 7px var(--text-bright), 0 0 15px rgba(255, 184, 201, 0.6)';
                }, 150);
            }
        }
    }, 3000);
});