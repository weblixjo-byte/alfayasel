const fs = require('fs');
const path = require('path');

function auditProducts() {
  const content = fs.readFileSync(path.join(process.cwd(), 'PRODUCTS_BACKUP.txt'), 'utf8');
  
  // Split products by the major separator
  const productBlocks = content.split(/======================================================================\r?\nالمنتج رقم/g);
  
  const products = [];
  productBlocks.forEach((block, index) => {
    if (index === 0) return; // skip header
    
    // Extract name
    const nameMatch = block.match(/^\s*\(\d+\):\s*(.*?)\r?\n/);
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
    
    // Extract category slug
    const catMatch = block.match(/• القسم \(Category Slug\):\s*(.*?)\r?\n/);
    const category = catMatch ? catMatch[1].trim() : 'Unknown';
    
    products.push({ index, name, category });
  });

  // DB Categories we retrieved from show_categories.js
  const dbCategories = [
    { slug: "cutell-family", parent: null },
    { slug: "mums-and-babies", parent: null },
    { slug: "nipple-cream", parent: "mums-and-babies" },
    { slug: "nappy-rash-cream", parent: "mums-and-babies" }, // should be mums-and-babies
    { slug: "hand-cream", parent: "cutell-family" },
    { slug: "foot-cream", parent: "cutell-family" },
    { slug: "excessive-dryness-cream", parent: "cutell-family" },
    { slug: "whitening-cream", parent: "cutell-family" },
    { slug: "sun-block-50", parent: "cutell-family" },
    { slug: "sun-block-35", parent: "cutell-family" },
    { slug: "muscle-cream", parent: "cutell-family" },
    { slug: "personal-lubricant", parent: null },
    { slug: "ever-wet", parent: "personal-lubricant" },
    { slug: "paramedical-product", parent: null },
    { slug: "k-jelly", parent: "paramedical-product" },
    { slug: "soap-sanitizer", parent: null },
    { slug: "hand-gel-sanitizer", parent: "soap-sanitizer" },
    { slug: "foaming-hand-sanitizer", parent: "soap-sanitizer" },
    { slug: "foaming-soap", parent: "soap-sanitizer" },
    { slug: "general-sanitizer", parent: "soap-sanitizer" },
    { slug: "spray-sanitizer", parent: "soap-sanitizer" },
    { slug: "ultra-sound-gel", parent: "paramedical-product" },
    { slug: "bluescan-ultra-sound-gel", parent: "ultra-sound-gel" },
    { slug: "germclear", parent: "paramedical-product" },
    { slug: "skin-care-product", parent: null },
    { slug: "vaginal-douche", parent: "skin-care-product" },
    { slug: "liquid-hand-soap", parent: "soap-sanitizer" },
    { slug: "hair-care-product", parent: null },
    { slug: "tricho-cream", parent: "hair-care-product" },
    { slug: "activita-os-hair-oil", parent: "hair-care-product" },
    { slug: "alfatar-shampoo", parent: "hair-care-product" },
    { slug: "alfatar-shampoo-conditioner", parent: "hair-care-product" },
    { slug: "urelol-lotion", parent: "skin-care-product" },
    { slug: "urelol-cream", parent: "skin-care-product" },
    { slug: "emulene-cream-jar", parent: "skin-care-product" },
    { slug: "emulene-cream-tube", parent: "skin-care-product" },
    { slug: "ss4-cream", parent: "skin-care-product" },
    { slug: "clean-face-acne-cream", parent: "skin-care-product" },
    { slug: "clean-face-cleansing-cream", parent: "skin-care-product" },
    { slug: "alfarep", parent: "skin-care-product" },
    { slug: "argentum", parent: "skin-care-product" },
    { slug: "stretch-marks-cream", parent: "mums-and-babies" }
  ];

  console.log("=== Auditing Products ===");
  products.forEach(p => {
    const matchedCat = dbCategories.find(c => c.slug === p.category);
    if (!matchedCat) {
      console.log(`❌ Invalid Category Slug: "${p.name}" uses "${p.category}" which is NOT defined in Category list.`);
      return;
    }
    
    // Check if parent-child hierarchy is logical
    const parent = matchedCat.parent;
    let logicalParent = null;
    const nameLower = p.name.toLowerCase();
    
    if (nameLower.includes('cutell') || nameLower.includes('كيوتل')) {
      logicalParent = 'cutell-family';
      if (nameLower.includes('nappy') || nameLower.includes('rash') || nameLower.includes('طفح') || nameLower.includes('stretch') || nameLower.includes('تشققات')) {
        logicalParent = 'mums-and-babies';
      }
    } else if (nameLower.includes('shampoo') || nameLower.includes('شامبو') || nameLower.includes('بلسم') || nameLower.includes('tricho') || nameLower.includes('ترايكو') || nameLower.includes('activita')) {
      logicalParent = 'hair-care-product';
    } else if (nameLower.includes('sanitizer') || nameLower.includes('معقم') || nameLower.includes('soap') || nameLower.includes('صابون')) {
      logicalParent = 'soap-sanitizer';
    } else if (nameLower.includes('jelly') || nameLower.includes('جيلي') || nameLower.includes('scan') || nameLower.includes('germclear') || nameLower.includes('argentum') || nameLower.includes('نترات')) {
      logicalParent = 'paramedical-product';
    }
    
    if (logicalParent && parent !== logicalParent && parent !== null && p.category !== logicalParent) {
      console.log(`⚠️ Potential Mismatch: "${p.name}" (category: "${p.category}", parent: "${parent}") logically belongs under parent "${logicalParent}".`);
    }
  });
}

auditProducts();
