const fs = require('fs');
const path = require('path');

function analyzeBackup() {
  const content = fs.readFileSync(path.join(process.cwd(), 'PRODUCTS_BACKUP.txt'), 'utf8');
  
  // Split products by the major separator
  const productBlocks = content.split(/======================================================================\r?\nالمنتج رقم/g);
  
  console.log(`Total blocks found: ${productBlocks.length}`);
  
  const results = [];
  
  productBlocks.forEach((block, index) => {
    if (index === 0) return; // skip header before first product
    
    // Extract name
    const nameMatch = block.match(/^\s*\(\d+\):\s*(.*?)\r?\n/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
    
    // Extract category slug
    const catMatch = block.match(/• القسم \(Category Slug\):\s*(.*?)\r?\n/);
    const category = catMatch ? catMatch[1].trim() : 'Unknown';
    
    // Extract description snippet to check contents
    const descMatch = block.match(/--- الوصف بالعربية ---\r?\n([\s\S]*?)\r?\n---/);
    const desc = descMatch ? descMatch[1].trim().slice(0, 150) : '';
    
    // Try to guess proper category
    let suggestedCategory = category;
    const lowerDesc = desc.toLowerCase() + name.toLowerCase();
    
    if (lowerDesc.includes('شعر') || lowerDesc.includes('فروة الرأس') || lowerDesc.includes('صلع') || lowerDesc.includes('قشرة') || lowerDesc.includes('ثعلبة') || lowerDesc.includes('hair') || lowerDesc.includes('shampoo') || lowerDesc.includes('conditioner') || lowerDesc.includes('شامبو') || lowerDesc.includes('بلسم') || lowerDesc.includes('ترايكو')) {
      suggestedCategory = 'hair-care-product';
    } else if (lowerDesc.includes('بشرة') || lowerDesc.includes('ترطيب') || lowerDesc.includes('وجه') || lowerDesc.includes('جلد') || lowerDesc.includes('اكزيما') || lowerDesc.includes('تشقق') || lowerDesc.includes('حب الشباب') || lowerDesc.includes('skin') || lowerDesc.includes('lotion') || lowerDesc.includes('cream') || lowerDesc.includes('كريم') || lowerDesc.includes('لوشن') || lowerDesc.includes('عناية بالبشرة') || lowerDesc.includes('صابون') || lowerDesc.includes('زيوان') || lowerDesc.includes('رؤوس سوداء')) {
      suggestedCategory = 'skin-care-product';
    } else if (lowerDesc.includes('معقم') || lowerDesc.includes('كحول') || lowerDesc.includes('سانيتايزر') || lowerDesc.includes('sanitizer') || lowerDesc.includes('جيل') || lowerDesc.includes('جل') || lowerDesc.includes('ايدي') || lowerDesc.includes('يدين')) {
      suggestedCategory = 'sanitizers-disinfectants';
    }
    
    // Check if category matches suggested
    const isMismatched = category !== suggestedCategory && 
                         !(category === 'tricho-cream' && suggestedCategory === 'hair-care-product') &&
                         !(category === 'urelol-lotion' && suggestedCategory === 'skin-care-product') &&
                         !(category === 'urelol-cream' && suggestedCategory === 'skin-care-product') &&
                         !(category === 'ss4-cream' && suggestedCategory === 'skin-care-product');
    
    results.push({
      id: index,
      name,
      category,
      suggestedCategory,
      isMismatched,
      descSnippet: desc.slice(0, 100).replace(/\n/g, ' ')
    });
  });
  
  console.log(JSON.stringify(results, null, 2));
}

analyzeBackup();
