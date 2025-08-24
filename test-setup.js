#!/usr/bin/env node

// simple test script to verify cloudflare pages setup
// checks if all required files are in place

import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Cloudflare Pages setup...');

// check required files and directories
const requiredFiles = [
  'public/index.html',
  'public/style.css',
  'public/cursor.png',
  'public/noise.png',
  'public/robots.txt',
  'functions/index.js',
  'functions/style.css.js',
  '_routes.json',
  'package.json',
  'wrangler.toml'
];

const requiredDirs = [
  'public',
  'functions'
];

console.log('\n📁 Checking directories...');
for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ exists`);
  } else {
    console.log(`❌ ${dir}/ missing`);
    process.exit(1);
  }
}

console.log('\n📄 Checking files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    process.exit(1);
  }
}

// validate package.json
console.log('\n📦 Validating package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (packageJson.type === 'module') {
  console.log('✅ ES modules configured');
} else {
  console.log('❌ ES modules not configured');
  process.exit(1);
}

if (packageJson.scripts && packageJson.scripts.dev && packageJson.scripts.deploy) {
  console.log('✅ Wrangler scripts configured');
} else {
  console.log('❌ Wrangler scripts missing');
  process.exit(1);
}

if (packageJson.devDependencies && packageJson.devDependencies.wrangler) {
  console.log('✅ Wrangler dependency configured');
} else {
  console.log('❌ Wrangler dependency missing');
  process.exit(1);
}

// validate wrangler.toml
console.log('\n⚙️  Validating wrangler.toml...');
const wranglerConfig = fs.readFileSync('wrangler.toml', 'utf8');

if (wranglerConfig.includes('nodejs_compat')) {
  console.log('✅ Node.js compatibility enabled');
} else {
  console.log('❌ Node.js compatibility not enabled');
  process.exit(1);
}

if (wranglerConfig.includes('pages_build_output_dir')) {
  console.log('✅ Pages build output directory configured');
} else {
  console.log('❌ Pages build output directory missing');
  process.exit(1);
}

console.log('\n🎉 All checks passed! Cloudflare Pages setup is ready for deployment.');
console.log('\n🔗 useful commands:');
console.log('- test locally: wrangler pages dev public --compatibility-date=2023-05-18');
console.log('- deploy: wrangler pages publish public');
console.log('- check functions: wrangler pages functions list');