// node.js express server for dynamic 404 error handling
import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from public directory
app.use(express.static(join(__dirname, 'public')));

// error configurations with themes and status codes
const errorConfigs = [
  { theme: 'pink', status: 404, message: 'page not found', submessage: 'the page you are looking for does not exist' },
  { theme: 'white', status: 404, message: 'not found', submessage: 'this page has vanished into the void' },
  { theme: 'pastel', status: 404, message: 'oops! page missing', submessage: 'looks like this page took a wrong turn' },
  { theme: 'pink', status: 501, message: 'not implemented', submessage: 'this feature is still in development' },
  { theme: 'white', status: 501, message: 'coming soon', submessage: 'we are working on this page' },
  { theme: 'pastel', status: 501, message: 'under construction', submessage: 'this page is being built' },
  { theme: 'pink', status: 418, message: 'i am a teapot', submessage: 'short and stout, here is my handle' },
  { theme: 'white', status: 418, message: 'teapot mode', submessage: 'brewing some digital tea' },
  { theme: 'pastel', status: 418, message: 'tea time!', submessage: 'this server prefers coffee anyway' }
];

// function to generate random pastel color
function generatePastelColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 25; // 25-55%
  const lightness = Math.floor(Math.random() * 20) + 70;  // 70-90%
  return { h: hue, s: saturation, l: lightness };
}

// function to convert hsl to rgb
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

// route to serve dynamic css based on theme
app.get('/style.css', (req, res) => {
  const theme = req.query.theme || 'pink';
  
  try {
    // read base css file
    const baseCss = readFileSync(join(__dirname, 'public', 'style.css'), 'utf-8');
    
    if (theme === 'pastel') {
      // generate random pastel colors
      const primaryColor = generatePastelColor();
      const secondaryColor = generatePastelColor();
      const accentColor = generatePastelColor();
      
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
      
      res.setHeader('Content-Type', 'text/css');
      res.send(baseCss + dynamicCss);
    } else {
      // serve base css for other themes
      res.setHeader('Content-Type', 'text/css');
      res.send(baseCss);
    }
  } catch (error) {
    res.status(500).send('/* error loading css */');
  }
});

// main route handler for all other requests
app.get('*', (req, res) => {
  try {
    // read the html template
    const htmlTemplate = readFileSync(join(__dirname, 'public', 'index.html'), 'utf-8');
    
    // select random error configuration
    const config = errorConfigs[Math.floor(Math.random() * errorConfigs.length)];
    
    // replace placeholders in html
    let html = htmlTemplate
      .replace(/{{ERROR_CODE}}/g, config.status.toString())
      .replace(/{{ERROR_MESSAGE}}/g, config.message)
      .replace(/{{ERROR_SUBMESSAGE}}/g, config.submessage);
    
    // inject theme-specific script and css link
    const themeScript = `
<script>
  // apply theme
  document.documentElement.setAttribute('data-theme', '${config.theme}');
  
  // update css link with theme parameter
  const cssLink = document.querySelector('link[rel="stylesheet"]');
  if (cssLink) {
    cssLink.href = '/style.css?theme=${config.theme}';
  }
  
  // add interactive effects
  document.addEventListener('DOMContentLoaded', function() {
    const catArt = document.querySelector('.cat-art');
    if (catArt) {
      catArt.addEventListener('click', function() {
        this.style.transform = this.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
      });
    }
    
    // add floating animation to error code
    const errorCode = document.querySelector('.error-code');
    if (errorCode) {
      errorCode.style.animation = 'float 3s ease-in-out infinite';
    }
  });
</script>
`;
    
    // inject script before closing body tag
    html = html.replace('</body>', themeScript + '</body>');
    
    // set status code and send response
    res.status(config.status).send(html);
  } catch (error) {
    res.status(500).send('internal server error');
  }
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 404 error page server running on http://localhost:${PORT}`);
  console.log(`📁 serving static files from: ${join(__dirname, 'public')}`);
  console.log(`🎨 dynamic themes: pink, white, pastel`);
  console.log(`📊 status codes: 404, 501, 418`);
});