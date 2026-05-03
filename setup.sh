#!/bin/bash

# Project Setup Script for AI Marketing Dashboard
# Features: Node.js, TypeScript, Tailwind CSS

PROJECT_NAME=${1:-"ads-autonomous-cli"}

echo "🚀 Initializing project: $PROJECT_NAME"

# Create project directory
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Initialize NPM
npm init -y

# Install Dependencies
echo "📦 Installing dependencies..."
npm install -D typescript ts-node @types/node nodemon
npm install -D tailwindcss postcss autoprefixer
npm install -D prettier eslint eslint-config-prettier

# Initialize TypeScript
npx tsc --init --outDir dist --rootDir src --module esnext --target es2020 --moduleResolution node --allowSyntheticDefaultImports true

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create Folder Structure
echo "📂 Creating folder structure..."
mkdir -p src/{components,pages,services,layouts,hooks,utils,types,styles,assets}
mkdir -p src/api

# Create initial files
echo "📄 Creating initial files..."

# Tailwind CSS input file
cat <<EOF > src/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Main entry point
cat <<EOF > src/index.ts
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Marketing Dashboard API is running' });
});

app.listen(PORT, () => {
  console.log(\`✅ Server is running on http://localhost:\${PORT}\`);
});
EOF

# Basic Tailwind Config
cat <<EOF > tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f59e0b',
          dark: '#1f2937',
        }
      }
    },
  },
  plugins: [],
}
EOF

# Update package.json scripts
echo "🔧 Updating package.json scripts..."
npx npm-add-script \
  -k "dev" -v "nodemon src/index.ts" \
  -k "build" -v "npm run build:css && tsc" \
  -k "build:css" -v "tailwindcss -i ./src/styles/globals.css -o ./public/styles.css" \
  -k "start" -v "node dist/index.js"

# Add basic README
cat <<EOF > README.md
# $PROJECT_NAME

AI Marketing Dashboard powered by Node.js, TypeScript, and Tailwind CSS.

## Getting Started

1. Install dependencies: \`npm install\`
2. Run development server: \`npm run dev\`
3. Build for production: \`npm run build\`
EOF

# Install Express for the example
npm install express @types/express

echo "✅ Setup complete! To get started:"
echo "   cd $PROJECT_NAME"
echo "   npm run dev"
