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
});
