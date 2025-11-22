import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../src/assets');
const manifestPath = path.join(__dirname, '../src/image-manifest.json');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

const allFiles = getFiles(assetsDir);

const imageFiles = allFiles.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
});

const manifest = imageFiles.map(file => {
  return path.relative(path.join(__dirname, '../src'), file).replace(/\\/g, '/');
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('Image manifest generated successfully!');