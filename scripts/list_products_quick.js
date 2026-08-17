const fs = require('fs');
const path = require('path');

function getFullProductList() {
  const content = fs.readFileSync(path.join(process.cwd(), 'PRODUCTS_BACKUP.txt'), 'utf8');
  const productBlocks = content.split(/======================================================================\r?\nالمنتج رقم/g);
  
  const list = [];
  productBlocks.forEach((block, index) => {
    if (index === 0) return;
    const nameMatch = block.match(/^\s*\(\d+\):\s*(.*?)\r?\n/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
    const catMatch = block.match(/• القسم \(Category Slug\):\s*(.*?)\r?\n/);
    const category = catMatch ? catMatch[1].trim() : 'Unknown';
    list.push({ index, name, category });
  });
  
  console.log(JSON.stringify(list, null, 2));
}

getFullProductList();
