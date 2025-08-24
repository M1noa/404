// cloudflare pages function for dynamic 404 error handling
// handles theme selection and status codes based on original script.js logic

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

// generate random pastel color for theme
function generateRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 30 + Math.floor(Math.random() * 40); // 30-70% saturation
    const lightness = 70 + Math.floor(Math.random() * 20); // 70-90% lightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// convert hsl to rgb
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// generate css for pastel theme
function generatePastelThemeCSS() {
    const pastelColor = generateRandomPastelColor();
    const hslMatch = pastelColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    
    if (!hslMatch) return '';
    
    const [, h, s, l] = hslMatch.map(Number);
    const [r, g, b] = hslToRgb(h, s, l);
    
    return `
        :root {
            --background: #000000;
            --text: rgba(${r}, ${g}, ${b}, 0.85);
            --text-muted: rgba(${r}, ${g}, ${b}, 0.5);
            --text-bright: rgba(${r}, ${g}, ${b}, 0.95);
            --card-bg: rgba(${r}, ${g}, ${b}, 0.1);
            --card-hover: rgba(${r}, ${g}, ${b}, 0.15);
            --border: rgba(${r}, ${g}, ${b}, 0.2);
            --hover-border: rgba(${r}, ${g}, ${b}, 0.4);
            --button-bg: rgba(${r}, ${g}, ${b}, 0.15);
            --button-hover: rgba(${r}, ${g}, ${b}, 0.25);
            --link-color: ${pastelColor};
            --link-hover: rgba(${r}, ${g}, ${b}, 0.8);
            --notification-success-bg: rgba(80, 250, 123, 0.8);
            --notification-error-bg: rgba(255, 85, 85, 0.8);
            --notification-info-bg: rgba(${r}, ${g}, ${b}, 0.8);
        }
    `;
}

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // handle css requests
    if (url.pathname === '/style.css') {
        const theme = url.searchParams.get('theme') || 'pink';
        
        try {
            // get base css
            const baseCSS = await env.ASSETS.fetch(new URL('/style.css', url.origin));
            let cssContent = await baseCSS.text();
            
            // if pastel theme, inject dynamic css
            if (theme === 'pastel') {
                const pastelCSS = generatePastelThemeCSS();
                cssContent = cssContent.replace(
                    '[data-theme="pastel"] {',
                    `[data-theme="pastel"] {${pastelCSS}`
                );
            }
            
            return new Response(cssContent, {
                headers: {
                    'Content-Type': 'text/css',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        } catch (error) {
            return new Response('/* css error */', {
                status: 500,
                headers: { 'Content-Type': 'text/css' }
            });
        }
    }
    
    // handle main page requests
    try {
        // randomly select error configuration
        const randomConfig = errorConfigs[Math.floor(Math.random() * errorConfigs.length)];
        
        // get base html
        const baseHTML = await env.ASSETS.fetch(new URL('/index.html', url.origin));
        let htmlContent = await baseHTML.text();
        
        // replace placeholders with dynamic content
        htmlContent = htmlContent
            .replace('id="error-code">404', `id="error-code">${randomConfig.code}`)
            .replace('id="error-message">invalid subdomain - this page doesn\'t exist', `id="error-message">${randomConfig.message}`)
            .replace('class="error-description">the subdomain you entered is not valid or doesn\'t exist', `class="error-description">${randomConfig.description}`)
            .replace('<title>404 - Invalid Subdomain</title>', `<title>${randomConfig.code} - Invalid Subdomain</title>`)
            .replace('href="style.css"', `href="/style.css?theme=${randomConfig.theme}"`);
        
        // add theme attribute via script injection
        const themeScript = `
            <script>
                document.documentElement.setAttribute('data-theme', '${randomConfig.theme}');
                document.body.classList.add('js-enabled');
                
                // add interactive effects
                document.addEventListener('DOMContentLoaded', () => {
                    const errorCard = document.querySelector('.error-card');
                    if (errorCard) {
                        errorCard.addEventListener('mousemove', (e) => {
                            const rect = errorCard.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const rotateY = -1 * ((rect.width / 2 - x) / (rect.width / 2)) * 5;
                            const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 5;
                            errorCard.style.transform = \`translateY(-4px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
                        });
                        errorCard.addEventListener('mouseleave', () => {
                            errorCard.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
                        });
                    }
                    
                    // button effects
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
                    
                    // glitch effects
                    setInterval(() => {
                        if (Math.random() < 0.05) {
                            const header = document.querySelector('#error-code');
                            if (header) {
                                header.style.textShadow = '0 0 20px var(--text-bright), 0 0 30px var(--link-color), 2px 2px 0px var(--text)';
                                setTimeout(() => {
                                    header.style.textShadow = '0 0 7px var(--text-bright), 0 0 15px rgba(255, 184, 201, 0.6)';
                                }, 150);
                            }
                        }
                    }, 3000);
                });
            </script>
        `;
        
        htmlContent = htmlContent.replace('</body>', `${themeScript}</body>`);
        
        // determine status code
        const statusCode = parseInt(randomConfig.code);
        
        return new Response(htmlContent, {
            status: statusCode,
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        return new Response('Internal Server Error', {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}