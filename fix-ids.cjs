const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('id: number')) {
        content = content.replace(/id: number/g, 'id: string');
        fs.writeFileSync(fullPath, content);
      }
      if (content.includes('residentId: number')) {
        content = content.replace(/residentId: number/g, 'residentId: string');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'client', 'src', 'components', 'admin'));
console.log('Done');
