const fs = require('fs');
const path = require('path');

function parseBackupFile() {
  const content = fs.readFileSync(path.join(process.cwd(), 'PRODUCTS_BACKUP.txt'), 'utf8');
  
  // Split products by the major separator
  const productBlocks = content.split(/======================================================================\r?\nالمنتج رقم/g);
  
  const products = [];
  
  productBlocks.forEach((block, index) => {
    if (index === 0) return; // skip header
    
    // 1. Extract Arabic & English Names
    const nameMatch = block.match(/^\s*\(\d+\):\s*(.*?)\r?\n/);
    const fullName = nameMatch ? nameMatch[1].trim() : '';
    let nameAr = '';
    let nameEn = '';
    if (fullName.includes('|')) {
      const parts = fullName.split('|');
      nameAr = parts[0].trim();
      nameEn = parts[1].trim();
    } else {
      nameAr = fullName;
      nameEn = fullName;
    }
    
    // 2. Extract SKU
    const skuMatch = block.match(/• رمز المنتج \(SKU\):\s*(.*?)\r?\n/);
    const sku = skuMatch ? skuMatch[1].trim() : '';
    
    // 3. Extract Slug
    const slugMatch = block.match(/• الرابط \(Slug\):\s*(.*?)\r?\n/);
    const slug = slugMatch ? slugMatch[1].trim() : '';
    
    // 4. Extract Category Slug
    const catMatch = block.match(/• القسم \(Category Slug\):\s*(.*?)\r?\n/);
    const categorySlug = catMatch ? catMatch[1].trim() : '';
    
    // 5. Extract Price
    const priceMatch = block.match(/• السعر الرئيسي:\s*(.*?)\s*دينار/);
    const price = priceMatch ? parseFloat(priceMatch[1].trim()) : 0;

    // 6. Extract Original Price
    const origPriceMatch = block.match(/• السعر قبل الخصم:\s*(.*?)\s*دينار/);
    const originalPrice = origPriceMatch ? parseFloat(origPriceMatch[1].trim()) : undefined;
    
    // 7. Extract Stock and pauses
    const stockMatch = block.match(/• حالة التوفر في المخزون:\s*(.*?)\s*\(الكمية:\s*(\d+)\)/);
    const inStock = stockMatch ? !stockMatch[1].includes('غير') : true;
    const stockQuantity = stockMatch ? parseInt(stockMatch[2]) : 50;

    // Flags
    const newArrivalMatch = block.match(/جديد:\s*(نعم|لا)/);
    const isNewArrival = newArrivalMatch ? newArrivalMatch[1] === 'نعم' : false;

    const featuredMatch = block.match(/مميز:\s*(نعم|لا)/);
    const isFeatured = featuredMatch ? featuredMatch[1] === 'نعم' : false;

    const topSellerMatch = block.match(/الأكثر مبيعاً:\s*(نعم|لا)/);
    const isTopSeller = topSellerMatch ? topSellerMatch[1] === 'نعم' : false;
    
    // 8. Extract Images
    const imagesSection = block.match(/--- الصور ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    const images = [];
    if (imagesSection) {
      const imgLines = imagesSection[1].split('\n');
      imgLines.forEach(line => {
        const m = line.match(/\d+\.\s*(.*?)$/);
        if (m) images.push(m[1].trim());
      });
    }
    
    // 9. Extract Description Arabic & English
    const descArMatch = block.match(/--- الوصف بالعربية ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    const descriptionAr = descArMatch ? descArMatch[1].trim() : '';

    const descEnMatch = block.match(/--- الوصف بالإنجليزية ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    const descriptionEn = descEnMatch ? descEnMatch[1].trim() : '';

    // 10. Extract Usage Arabic & English
    const usageSection = block.match(/--- طريقة الاستخدام \(Usage\) ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    let usageAr = '';
    let usageEn = '';
    if (usageSection) {
      const arUsageMatch = usageSection[1].match(/بالعربية:\s*([\s\S]*?)(?:\r?\nبالإنجليزية:|$)/);
      usageAr = arUsageMatch ? arUsageMatch[1].trim() : '';
      const enUsageMatch = usageSection[1].match(/بالإنجليزية:\s*([\s\S]*?)$/);
      usageEn = enUsageMatch ? enUsageMatch[1].trim() : '';
    }

    // 11. Extract Variations
    const variationsSection = block.match(/--- الأحجام والخيارات المتوفرة \(Variations\) ---\r?\n([\s\S]*?)$/);
    const variations = [];
    if (variationsSection) {
      const varBlocks = variationsSection[1].split(/\[خيار \d+\]/g);
      varBlocks.forEach((vBlock, vIdx) => {
        if (vIdx === 0) return; // skip header
        
        const nameMatch = vBlock.match(/-\s*الاسم\s*\/\s*الحجم:\s*(.*?)\r?\n/);
        let nameRaw = nameMatch ? nameMatch[1].trim() : '';
        let vNameAr = '';
        let vNameEn = '';
        if (nameRaw.includes('/')) {
          const parts = nameRaw.split('/');
          vNameAr = parts[0].trim();
          vNameEn = parts[1].trim();
        }

        const vSkuMatch = vBlock.match(/-\s*SKU:\s*(.*?)\r?\n/);
        const vSku = vSkuMatch ? vSkuMatch[1].trim() : '';

        const vPriceMatch = vBlock.match(/-\s*السعر:\s*(.*?)\s*دينار/);
        const vPrice = vPriceMatch ? parseFloat(vPriceMatch[1].trim()) : 0;

        const vOrigPriceMatch = vBlock.match(/-\s*السعر قبل الخصم:\s*(.*?)\s*دينار/);
        const vOrigPrice = vOrigPriceMatch ? parseFloat(vOrigPriceMatch[1].trim()) : undefined;

        const vStockMatch = vBlock.match(/-\s*التوفر:\s*(.*?)\s*\(كمية:\s*(\d+)\)/);
        const vInStock = vStockMatch ? !vStockMatch[1].includes('غير') : true;
        const vStockQty = vStockMatch ? parseInt(vStockMatch[2]) : 50;

        const vImgMatch = vBlock.match(/-\s*صور الخيار:\s*(.*?)(?:\r?\n|$)/);
        const vImages = vImgMatch ? [vImgMatch[1].trim()] : [];

        const vDescArMatch = vBlock.match(/-\s*وصف خاص بالعربية:\s*(.*?)(?:\r?\n|$)/);
        const vDescAr = vDescArMatch ? vDescArMatch[1].trim() : '';

        const vDescEnMatch = vBlock.match(/-\s*وصف خاص بالإنجليزية:\s*(.*?)(?:\r?\n|$)/);
        const vDescEn = vDescEnMatch ? vDescEnMatch[1].trim() : '';

        // Smart name deduction if names are empty
        if (!vNameAr || !vNameEn) {
          const imgLower = vImages[0] ? vImages[0].toLowerCase() : '';
          const skuLower = vSku.toLowerCase();
          
          if (imgLower.includes('tube') || imgLower.includes('انبوب') || skuLower.includes('tube')) {
            vNameAr = 'عبوة أنبوب (Tube)';
            vNameEn = 'Tube Packaging';
          } else if (imgLower.includes('jar') || imgLower.includes('حنجور') || skuLower.includes('jar')) {
            vNameAr = 'عبوة مرطبان (Jar)';
            vNameEn = 'Jar Packaging';
          } else if (imgLower.includes('pump') || skuLower.includes('pump')) {
            vNameAr = 'عبوة ضاغطة (Pump)';
            vNameEn = 'Pump Dispenser';
          } else if (imgLower.includes('bag') || imgLower.includes('carton') || skuLower.includes('bag')) {
            vNameAr = 'كيس معقم 1000 مل';
            vNameEn = '1000ml Dispenser Bag';
          } else if (imgLower.includes('dispenser') || skuLower.includes('dispenser')) {
            vNameAr = 'موزع حائط يدوي';
            vNameEn = 'Manual Wall Dispenser';
          } else if (imgLower.includes('500ml') || skuLower.includes('500ml')) {
            vNameAr = 'حجم 500 مل';
            vNameEn = '500ml size';
          } else if (imgLower.includes('250ml') || skuLower.includes('250ml')) {
            vNameAr = 'حجم 250 مل';
            vNameEn = '250ml size';
          } else if (imgLower.includes('100ml') || skuLower.includes('100ml')) {
            vNameAr = 'حجم 100 ml';
            vNameEn = '100ml size';
          } else {
            vNameAr = 'حجم مخصص';
            vNameEn = 'Custom Size';
          }
        }

        variations.push({
          sku: vSku,
          name: { ar: vNameAr, en: vNameEn },
          price: vPrice,
          originalPrice: vOrigPrice,
          images: vImages,
          inStock: vInStock,
          stockQuantity: vStockQty,
          description: { ar: vDescAr, en: vDescEn }
        });
      });
    }

    products.push({
      sku,
      name: { ar: nameAr, en: nameEn },
      slug,
      categorySlug,
      price,
      originalPrice,
      inStock,
      stockQuantity,
      isNewArrival,
      isFeatured,
      isTopSeller,
      images,
      description: { ar: descriptionAr, en: descriptionEn },
      usage: { ar: usageAr, en: usageEn },
      variations
    });
  });

  fs.writeFileSync('parsed_products_test.json', JSON.stringify(products, null, 2), 'utf8');
  console.log(`Parsed ${products.length} products successfully to parsed_products_test.json`);
}

parseBackupFile();
