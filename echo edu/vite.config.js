import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to handle local file saving from the frontend
const saveAnimationPlugin = () => {
  return {
    name: 'save-animation-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/save-animation' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { title, description, category, htmlCode, tags } = data;
              
              const filename = `anim_${Date.now()}.html`;
              // We save directly to the static public folder
              const animDirPath = path.resolve(__dirname, 'public', 'animations');
              
              if (!fs.existsSync(animDirPath)) {
                fs.mkdirSync(animDirPath, { recursive: true });
              }
              
              // Write the HTML code to the new animation file
              fs.writeFileSync(path.join(animDirPath, filename), htmlCode, 'utf8');
              
              // Persist config to content.json so it loads automatically on refresh
              const contentPath = path.resolve(__dirname, 'src', 'data', 'content.json');
              const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
              
              const categoryObj = contentData.categories.find(c => c.id === category);
              if (categoryObj) {
                const tagArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                categoryObj.items.push({
                  title: title,
                  description: description,
                  url: `/animations/${filename}`,
                  thumbnail: "", 
                  tags: tagArray
                });
                
                fs.writeFileSync(contentPath, JSON.stringify(contentData, null, 2), 'utf8');
              }
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: `/animations/${filename}` }));
            } catch (err) {
              console.error(err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else if (req.url && req.url.split('?')[0].startsWith('/animations/') && req.url.split('?')[0].endsWith('.html')) {
          try {
            const parseUrl = req.url.split('?')[0];
            const filePath = path.resolve(__dirname, 'public', parseUrl.slice(1));
            // 绕过 Vite 的 SPA 回退机制，直接将 html 作为纯静态资源返回
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(fs.readFileSync(filePath));
              return;
            }
          } catch(e) {
            console.error(e);
          }
          next();
        } else {
          next();
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), saveAnimationPlugin()],
})
