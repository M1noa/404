// cloudflare pages function for dynamic css serving

// generate random pastel color
function generateRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 25; // 25-55%
  const lightness = Math.floor(Math.random() * 20) + 70;  // 70-90%
  return { h: hue, s: saturation, l: lightness };
}

// convert hsl to rgb
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const theme = url.searchParams.get('theme') || 'pink';
  
  try {
    // fetch base css from public folder
    const baseCssResponse = await fetch(new URL('/style.css', url.origin));
    const baseCss = await baseCssResponse.text();
    
    if (theme === 'pastel') {
      // generate random pastel colors
      const primaryColor = generateRandomPastelColor();
      const secondaryColor = generateRandomPastelColor();
      const accentColor = generateRandomPastelColor();
      
      const primaryRgb = hslToRgb(primaryColor.h, primaryColor.s, primaryColor.l);
      const secondaryRgb = hslToRgb(secondaryColor.h, secondaryColor.s, secondaryColor.l);
      const accentRgb = hslToRgb(accentColor.h, accentColor.s, accentColor.l);
      
      // append dynamic pastel css
      const dynamicCss = `

/* dynamic pastel theme */
:root {
  --primary-color: rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b});
  --secondary-color: rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b});
  --accent-color: rgb(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b});
}

body {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: #333;
}

.error-code {
  color: var(--accent-color);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.error-message {
  color: #444;
}

.error-submessage {
  color: #666;
}

a {
  color: var(--accent-color);
}

a:hover {
  color: #333;
  background-color: var(--accent-color);
}

.cat-art {
  color: var(--accent-color);
  opacity: 0.8;
}
`;
      
      return new Response(baseCss + dynamicCss, {
        headers: {
          'Content-Type': 'text/css',
          'Cache-Control': 'public, max-age=300'
        }
      });
    } else {
      // serve base css for other themes
      return new Response(baseCss, {
        headers: {
          'Content-Type': 'text/css',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  } catch (error) {
    return new Response('/* error loading css */', {
      status: 500,
      headers: { 'Content-Type': 'text/css' }
    });
  }
}