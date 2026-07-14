import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(),
    react(),
    // Dev-server plugin: persists portfolio data to public/portfolio-data.json
    // so admin panel changes are permanent even locally (same API as Netlify edge fn)
    {
      name: 'portfolio-data-api',
      configureServer(server) {
        const dataFile = path.resolve(__dirname, 'public/portfolio-data.json');

        server.middlewares.use('/api/portfolio-data', (req, res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
          }

          if (req.method === 'GET') {
            try {
              if (fs.existsSync(dataFile)) {
                const content = fs.readFileSync(dataFile, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(content);
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end('null');
              }
            } catch {
              res.writeHead(500);
              res.end('Error reading data');
            }
            return;
          }

          if (req.method === 'PUT') {
            let body = '';
            req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                // Validate JSON before writing
                JSON.parse(body);
                fs.mkdirSync(path.dirname(dataFile), { recursive: true });
                fs.writeFileSync(dataFile, body, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify({ ok: true }));
              } catch {
                res.writeHead(400);
                res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
              }
            });
            return;
          }

          res.writeHead(405);
          res.end('Method not allowed');
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Radix UI primitives
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-aspect-ratio',
          ],
          // Charts & data viz
          'vendor-charts': ['recharts'],
          // Icons
          'vendor-icons': ['lucide-react'],
          // Misc utilities
          'vendor-utils': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns',
            'cmdk',
            'sonner',
            'vaul',
            'zod',
            'input-otp',
            'embla-carousel-react',
            'react-resizable-panels',
            'react-day-picker',
            'react-hook-form',
            '@hookform/resolvers',
            '@emailjs/browser',
            'next-themes',
          ],
        },
      },
    },
  },
});
