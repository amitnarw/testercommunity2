const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const stat = fs.statSync(filePath);
      filesList.push({ name: filePath, size: stat.size });
    }
  }
  return filesList;
}

const allFiles = [...getFiles('src/app'), ...getFiles('src/components')];
allFiles.sort((a, b) => b.size - a.size);
console.log(allFiles.slice(0, 20).map(f => `${f.size} ${f.name}`).join('\n'));
