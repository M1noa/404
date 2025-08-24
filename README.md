# 404 Error Page - Cloudflare Pages

A dynamic 404 error page with multiple themes and status codes, built for Cloudflare Pages with serverless functions.

## Features

- **Dynamic Theme System**: Pink, white, and pastel themes with random color generation
- **Multiple Status Codes**: 404, 501, and 418 (I'm a teapot) error pages
- **Dynamic CSS Generation**: Serverless CSS generation based on theme selection
- **Interactive Elements**: Hover effects and smooth transitions
- **Static File Serving**: Optimized static asset delivery via Cloudflare's CDN
- **Responsive Design**: Works on desktop and mobile devices
- **Edge Computing**: Fast response times with Cloudflare's global network

## Project Structure

```
404/
├── public/                 # Static assets served by Cloudflare Pages
│   ├── index.html         # Main HTML template
│   ├── style.css          # Base CSS styles
│   ├── cursor.png         # Custom cursor image
│   ├── noise.png          # Background noise texture
│   └── robots.txt         # Robots.txt file
├── functions/              # Cloudflare Pages Functions
│   ├── index.js           # Main function handler
│   └── style.css.js       # Dynamic CSS generation function
├── _routes.json           # Cloudflare Pages routing configuration
├── wrangler.toml          # Cloudflare deployment configuration
├── package.json           # Project dependencies and scripts
├── test-setup.js          # Setup verification script
└── README.md              # This file
```

## Installation & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start local development**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Open the local development URL in your browser
   - Try different themes: `?theme=pink`, `?theme=white`, `?theme=pastel`
   - Try different status codes: `?status=404`, `?status=501`, `?status=418`

## Deployment

### Deploy to Cloudflare Pages

1. **Using Wrangler CLI**:
   ```bash
   npm run deploy
   ```

2. **Using Git Integration**:
   - Connect your GitHub repository to Cloudflare Pages
   - Set build command: `echo 'no build required'`
   - Set build output directory: `public`
   - Enable Functions (automatic with `/functions` directory)

## Technical Details

### Cloudflare Pages Functions

The serverless functions handle:
- **Dynamic CSS Serving** (`/style.css.js`): Generates theme-specific CSS on-the-fly
- **Route Handling** (`/index.js`): Serves the main HTML template with dynamic content
- **Theme & Status Code Logic**: Automatically assigns themes and status codes based on URL parameters
- **HTML Template Injection**: Dynamically injects error codes and messages

### Theme System

- **Pink Theme**: Default pink gradient background
- **White Theme**: Clean white background with subtle styling
- **Pastel Theme**: Randomly generated pastel colors using HSL to RGB conversion

### Dynamic CSS Generation

The CSS function generates styles dynamically for the pastel theme:
- Generates random HSL values for pastel colors
- Converts HSL to RGB for CSS compatibility
- Applies colors to various UI elements
- Leverages Cloudflare's edge caching for performance

### Routing Configuration

The `_routes.json` file configures:
- All routes (`/*`) are handled by Functions
- Static assets (`/public/*`) are excluded and served directly
- Optimal performance with CDN delivery

## Testing

Run the setup verification script:
```bash
node test-setup.js
```

This verifies that all required files are present and configurations are correct for Cloudflare Pages deployment.

## Performance

- **Global CDN**: Static assets served from Cloudflare's global network
- **Edge Computing**: Functions run at the edge for minimal latency
- **Caching**: Intelligent caching for both static and dynamic content
- **Zero Cold Starts**: Cloudflare Pages Functions have minimal cold start times

## Author

- **Minoa** - [GitHub](https://github.com/M1noa) - [Website](https://minoa.cat)

## License

MIT License
