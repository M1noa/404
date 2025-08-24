# 404 Error Page - Node.js Server

A dynamic 404 error page with multiple themes and status codes, built with Express.js for Node.js deployment.

## Features

- **Dynamic Themes**: Pink, white, and randomly generated pastel themes
- **Multiple Status Codes**: 404 (Not Found), 501 (Not Implemented), 418 (I'm a Teapot)
- **Interactive Elements**: Clickable cat ASCII art with hover effects
- **Responsive Design**: Works on all device sizes
- **SEO Optimized**: Proper meta tags and Open Graph support
- **Fast Loading**: Optimized Express.js server with static file serving

## Project Structure

```
404/
├── public/                 # Static assets served by Express
│   ├── index.html         # Main HTML template
│   ├── style.css          # Base CSS styles
│   ├── cursor.png         # Custom cursor image
│   ├── noise.png          # Background texture
│   └── robots.txt         # SEO robots file
├── server.js              # Main Express.js server
├── package.json           # Node.js dependencies and scripts
└── README.md              # This file
```

## Installation & Usage

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v18 or later)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 404
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Production Deployment

Deploy to any Node.js hosting platform:

- **Heroku**: `git push heroku main`
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS/GCP/Azure**: Use their Node.js deployment options

Make sure to set the `PORT` environment variable if required by your hosting platform.

## Technical Details

### Express.js Server

This project uses Express.js to handle server-side logic:

- **Dynamic Theme Selection**: Randomly selects from pink, white, or pastel themes
- **Status Code Handling**: Returns appropriate HTTP status codes (404, 501, 418)
- **CSS Generation**: Dynamically generates pastel colors for the pastel theme
- **HTML Templating**: Injects dynamic content into the HTML template
- **Static File Serving**: Serves assets from the `public/` directory

### Theme System

1. **Pink Theme**: Classic pink and purple gradient background
2. **White Theme**: Clean white background with subtle styling
3. **Pastel Theme**: Randomly generated pastel colors using HSL color space

### API Endpoints

- `GET /style.css?theme=<theme>`: Serves dynamic CSS based on theme
- `GET /*`: Catches all other routes and serves the 404 page with random configuration

### Performance Optimizations

- Static assets served efficiently by Express
- Minimal JavaScript for interactive effects
- Optimized CSS with efficient selectors
- Compressed images and assets

## Customization

To customize the error messages or add new themes:

1. Edit `server.js` to modify the `errorConfigs` array
2. Add new CSS themes in the `/style.css` route handler
3. Update the HTML template in `public/index.html`

## Environment Variables

- `PORT`: Server port (default: 3000)

## Author

- **Minoa** - [GitHub](https://github.com/M1noa) - [Website](https://minoa.cat)

## License

MIT License
