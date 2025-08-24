// cloudflare pages function for dynamic css serving
// handles theme-specific css generation

const fs = require('fs');
const path = require('path');

// generate random pastel color
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
/* dynamic pastel theme variables */
[data-theme="pastel"] {
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

/* ensure custom cursor on pastel theme */
[data-theme="pastel"] * {
    cursor: url('cursor.png'), auto !important;
}
    `;
}

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const theme = url.searchParams.get('theme') || 'pink';
    
    try {
        // get base css from public folder
        const baseCSS = await env.ASSETS.fetch(new URL('/style.css', url.origin));
        let cssContent = await baseCSS.text();
        
        // if pastel theme, append dynamic css
        if (theme === 'pastel') {
            const pastelCSS = generatePastelThemeCSS();
            cssContent += pastelCSS;
        }
        
        return new Response(cssContent, {
            headers: {
                'Content-Type': 'text/css',
                'Cache-Control': 'public, max-age=300', // 5 minute cache for dynamic content
                'Vary': 'Accept-Encoding'
            }
        });
    } catch (error) {
        console.error('css generation error:', error);
        return new Response('/* css error */', {
            status: 500,
            headers: { 'Content-Type': 'text/css' }
        });
    }
}