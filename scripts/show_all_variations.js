const fs = require('fs');
const path = require('path');

function showAllProductVariations() {
  const content = fs.readFileSync(path.join(process.cwd(), 'PRODUCTS_BACKUP.txt'), 'utf8');
  const productBlocks = content.split(/======================================================================\r?\nالمنتج رقم/g);
  
  productBlocks.forEach((block, index) => {
    if (index === 0) return;
    const nameMatch = block.match(/^\s*\(\d+\):\s*(.*?)\r?\n/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    
    const variationsSection = block.match(/--- الأحجام والخيارات المتوفرة \(Variations\) ---\r?\n([\s\S]*?)$/);
    if (variationsSection) {
      console.log(`\n=========================================`);
      console.log(`Product #${index}: ${name}`);
      console.log(`=========================================`);
      const varBlocks = variationsSection[1].split(/\[خيار \d+\]/g);
      varBlocks.forEach((vBlock, vIdx) => {
        if (vIdx === 0) return;
        const vSkuMatch = vBlock.match(/-\s*SKU:\s*(.*?)\r?\n/);
        const vSku = vSkuMatch ? vSkuMatch[1].trim() : '';
        const vImgMatch = vBlock.match(/-\s*صور الخيار:\s*(.*?)(?:\r?\n|$)/);
        const vImg = vImgMatch ? vImgMatch[1].trim() : '';
        const vPriceMatch = vBlock.match(/-\s*السعر:\s*(.*?)\s*دينار/);
        const vPrice = vPriceMatch ? vPriceMatch[1].trim() : '';
        console.log(`  Option #${vIdx}: SKU: ${vSku} | Price: ${vPrice} | Image: ${vImg}`);
      });
    }
  });
}

showAllProductVariations();
