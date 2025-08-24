#!/usr/bin/env node

// simple test script to verify cloudflare pages setup
// checks if all required files are in place

import fs from 'fs';
import path from 'path';

const requiredFiles = [
    'functions/index.js',
    'functions/style.css.js',
    'public/index.html',
    'public/style.css',
    'public/cursor.png',
    'public/noise.png',
    'public/robots.txt',
    'package.json',
    'wrangler.toml',
    '_routes.json'
];

const requiredDirs = [
    'functions',
    'public'
];

console.log('🔍 checking cloudflare pages setup...');

// check directories
let allGood = true;
for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
        console.error(`❌ missing directory: ${dir}`);
        allGood = false;
    } else {
        console.log(`✅ directory exists: ${dir}`);
    }
}

// check files
for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.error(`❌ missing file: ${file}`);
        allGood = false;
    } else {
        console.log(`✅ file exists: ${file}`);
    }
}

// check package.json structure
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.type === 'module') {
        console.log('✅ package.json configured for es modules');
    } else {
        console.warn('⚠️  package.json not configured for es modules');
    }
    
    if (pkg.scripts && pkg.scripts.dev) {
        console.log('✅ dev script configured');
    } else {
        console.warn('⚠️  dev script not configured');
    }
} catch (error) {
    console.error('❌ error reading package.json:', error.message);
    allGood = false;
}

// check wrangler.toml
try {
    const wrangler = fs.readFileSync('wrangler.toml', 'utf8');
    if (wrangler.includes('compatibility_flags = ["nodejs_compat"]')) {
        console.log('✅ wrangler.toml configured for node.js compatibility');
    } else {
        console.warn('⚠️  wrangler.toml missing nodejs_compat flag');
    }
} catch (error) {
    console.error('❌ error reading wrangler.toml:', error.message);
    allGood = false;
}

if (allGood) {
    console.log('\n🎉 cloudflare pages setup looks good!');
    console.log('\n📝 next steps:');
    console.log('1. install wrangler: npm install -g wrangler');
    console.log('2. run locally: npm run dev');
    console.log('3. deploy: npm run deploy');
} else {
    console.log('\n❌ setup incomplete - please fix the issues above');
    process.exit(1);
}

console.log('\n🔗 useful commands:');
console.log('- test locally: wrangler pages dev public --compatibility-date=2023-05-18');
console.log('- deploy: wrangler pages publish public');
console.log('- check functions: wrangler pages functions list');