const fs = require('fs');
const path = require('path');

function checkParentClassifications() {
  const content = fs.readFileSync(path.join(process.cwd(), 'PRODUCTS_BACKUP.txt'), 'utf8');
  const productBlocks = content.split(/======================================================================\r?\nالمنتج رقم/g);
  
  // Build a map of category slug -> parent category name
  const catToParentMap = {
    // Hair care parent
    'hair-care-product': 'Hair Care (منتجات العناية بالشعر)',
    'tricho-cream': 'Hair Care (منتجات العناية بالشعر)',
    'activita-os-hair-oil': 'Hair Care (منتجات العناية بالشعر)',
    'alfatar-shampoo': 'Hair Care (منتجات العناية بالشعر)',
    'alfatar-shampoo-conditioner': 'Hair Care (منتجات العناية بالشعر)',

    // Skin care parent
    'skin-care-product': 'Skin Care (منتجات العناية بالبشرة)',
    'urelol-lotion': 'Skin Care (منتجات العناية بالبشرة)',
    'urelol-cream': 'Skin Care (منتجات العناية بالبشرة)',
    'emulene-cream-jar': 'Skin Care (منتجات العناية بالبشرة)',
    'emulene-cream-tube': 'Skin Care (منتجات العناية بالبشرة)',
    'ss4-cream': 'Skin Care (منتجات العناية بالبشرة)',
    'clean-face-acne-cream': 'Skin Care (منتجات العناية بالبشرة)',
    'clean-face-cleansing-cream': 'Skin Care (منتجات العناية بالبشرة)',
    'alfarep': 'Skin Care (منتجات العناية بالبشرة)',
    'argentum': 'Skin Care (منتجات العناية بالبشرة)',
    'vaginal-douche': 'Skin Care (منتجات العناية بالبشرة)',

    // Cutell Family parent
    'cutell-family': 'Cutell Family (عائلة كيوتل)',
    'hand-cream': 'Cutell Family (عائلة كيوتل)',
    'foot-cream': 'Cutell Family (عائلة كيوتل)',
    'excessive-dryness-cream': 'Cutell Family (عائلة كيوتل)',
    'whitening-cream': 'Cutell Family (عائلة كيوتل)',
    'sun-block-50': 'Cutell Family (عائلة كيوتل)',
    'sun-block-35': 'Cutell Family (عائلة كيوتل)',
    'muscle-cream': 'Cutell Family (عائلة كيوتل)',

    // Mums & Babies parent
    'mums-and-babies': 'Mums & Babies (الأم والطفل)',
    'nipple-cream': 'Mums & Babies (الأم والطفل)',
    'nappy-rash-cream': 'Mums & Babies (الأم والطفل)',
    'stretch-marks-cream': 'Mums & Babies (الأم والطفل)',

    // Personal lubricant parent
    'personal-lubricant': 'Personal Lubricants (مزلقات شخصية)',
    'ever-wet': 'Personal Lubricants (مزلقات شخصية)',

    // Paramedical parent
    'paramedical-product': 'Paramedical Products (منتجات طبية)',
    'k-jelly': 'Paramedical Products (منتجات طبية)',
    'ultra-sound-gel': 'Paramedical Products (منتجات طبية)',
    'bluescan-ultra-sound-gel': 'Paramedical Products (منتجات طبية)',
    'germclear': 'Paramedical Products (منتجات طبية)',

    // Soap & Sanitizer parent
    'soap-sanitizer': 'Soap & Sanitizer (الصابون والمعقمات)',
    'hand-gel-sanitizer': 'Soap & Sanitizer (الصابون والمعقمات)',
    'foaming-hand-sanitizer': 'Soap & Sanitizer (الصابون والمعقمات)',
    'foaming-soap': 'Soap & Sanitizer (الصابون والمعقمات)',
    'general-sanitizer': 'Soap & Sanitizer (الصابون والمعقمات)',
    'spray-sanitizer': 'Soap & Sanitizer (الصابون والمعقمات)',
    'liquid-hand-soap': 'Soap & Sanitizer (الصابون والمعقمات)'
  };

  console.log("=== Parent Category Classification Audit ===");
  const list = [];
  productBlocks.forEach((block, index) => {
    if (index === 0) return;
    const nameMatch = block.match(/^\s*\(\d+\):\s*(.*?)\r?\n/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
    const catMatch = block.match(/• القسم \(Category Slug\):\s*(.*?)\r?\n/);
    const category = catMatch ? catMatch[1].trim() : 'Unknown';
    
    const parentName = catToParentMap[category] || 'Unknown / Unmapped Category';
    list.push({ index, name, category, parentName });
  });

  list.forEach(p => {
    console.log(`Product #${p.index}: [${p.name}] is classified under parent category: [${p.parentName}] (Slug: ${p.category})`);
  });
}

checkParentClassifications();
