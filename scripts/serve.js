import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, '..', 'dist');

const server = createServer((req, res) => {
  let filePath = join(distPath, req.url === '/' ? 'index.html' : req.url);
  
  try {
    const content = readFileSync(filePath);
    const contentType = getContentType(filePath);
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('File not found');
  }
});

function getContentType(filePath) {
  const ext = filePath.split('.').pop();
  const types = {
    'html': 'text/html',
    'js': 'text/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon'
  };
  return types[ext] || 'text/plain';
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
}); 