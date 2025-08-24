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
  const { request, env } = context;
  const url = new URL(request.url);
  const theme = url.searchParams.get('theme') || 'pink';
  
  try {
    // fetch base css from assets
    const baseCssResponse = await env.ASSETS.fetch(new URL('/style.css', url.origin));
    if (!baseCssResponse.ok) {
      throw new Error(`Failed to fetch base CSS: ${baseCssResponse.status}`);
    }
    const baseCss = await baseCssResponse.text();
    
    if (theme === 'pastel') {
      // generate random pastel color to replace white
      const pastelColor = generateRandomPastelColor();
      const pastelRgb = hslToRgb(pastelColor.h, pastelColor.s, pastelColor.l);
      
      // replace all white (255, 255, 255) with the random pastel color
      const pastelCss = baseCss.replace(/255, 255, 255/g, `${pastelRgb.r}, ${pastelRgb.g}, ${pastelRgb.b}`);
      
      // also replace #ffffff and #f0f0f0 with pastel equivalents
      const pastelHex = `#${pastelRgb.r.toString(16).padStart(2, '0')}${pastelRgb.g.toString(16).padStart(2, '0')}${pastelRgb.b.toString(16).padStart(2, '0')}`;
      const lighterPastelRgb = {
        r: Math.min(255, Math.round(pastelRgb.r * 1.1)),
        g: Math.min(255, Math.round(pastelRgb.g * 1.1)),
        b: Math.min(255, Math.round(pastelRgb.b * 1.1))
      };
      const lighterPastelHex = `#${lighterPastelRgb.r.toString(16).padStart(2, '0')}${lighterPastelRgb.g.toString(16).padStart(2, '0')}${lighterPastelRgb.b.toString(16).padStart(2, '0')}`;
      
      const finalCss = pastelCss
         .replace(/#ffffff/g, pastelHex)
         .replace(/#f0f0f0/g, lighterPastelHex);
       
       return new Response(finalCss, {
        headers: {
          'Content-Type': 'text/css',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
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