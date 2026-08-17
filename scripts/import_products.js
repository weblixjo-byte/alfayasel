const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
} catch (e) {}

// Precise variation name mapping based on SKU
const VARIATION_NAME_MAP = {
  // Emulene Cream
  '80030': { ar: 'مرطبان 100 مل', en: '100ml Jar' },
  '80602': { ar: 'تيوب 100 مل', en: '100ml Tube' },

  // SS4 Cream
  '80051': { ar: 'تيوب 100 مل', en: '100ml Tube' },
  '80040': { ar: 'مرطبان 250 مل', en: '250ml Jar' },
  '80012': { ar: 'عبوة ضاغطة 500 مل', en: '500ml Pump Bottle' },
  '80050': { ar: 'مرطبان 100 مل', en: '100ml Jar' },
  '80460': { ar: 'كيس موزع 1000 مل', en: '1000ml Dispenser Bag' },
  '86004': { ar: 'موزع حائط يدوي', en: 'Manual Wall Dispenser' },

  // Alfarep
  '80296': { ar: 'بخاخ حشرات 120 مل', en: '120ml Insect Spray' },
  '80291': { ar: 'كريم حشرات 100 مل', en: '100ml Insect Cream' },
  '80290': { ar: 'إصبع حشرات (Stick)', en: 'Insect Repellent Stick' },

  // Cutell Muscle Cream
  '80280': { ar: 'حجم 85 غرام', en: '85g Size' },
  '80170': { ar: 'حجم 10 غرام', en: '10g Size' },

  // Hand Sanitizer Gell
  '85180': { ar: 'موزع معقم أوتوماتيكي', en: 'Automatic Gel Dispenser' },
  '85184': { ar: 'موزع معقم يدوي', en: 'Manual Gel Dispenser' },
  '80414': { ar: 'عبوة ضاغطة حائط 1000 مل', en: '1000ml Wall Pump' },
  '80923': { ar: 'عبوة جيب 60 مل', en: '60ml Pocket Size' },
  '80612': { ar: 'كيس موزع معقم 1000 مل', en: '1000ml Dispenser Bag' },
  '80495': { ar: 'عبوة عائلية 1000 مل', en: '1000ml Bottle' },
  '80506': { ar: 'عبوة متوسطة 500 مل', en: '500ml Bottle' },
  '80918': { ar: 'جالون 5 لتر', en: '5L Gallon' },

  // Foam Hand Sanitizer
  '80914': { ar: 'جالون 5 لتر', en: '5L Gallon' },
  '80912': { ar: 'كيس موزع رغوة 1000 مل', en: '1000ml Dispenser Bag' },
  '85177': { ar: 'موزع رغوة أوتوماتيكي', en: 'Automatic Foam Dispenser' },
  '80916': { ar: 'موزع رغوة حائط يدوي', en: 'Manual Foam Dispenser' },
  '80421': { ar: 'عبوة ضاغطة 300 مل', en: '300ml Pump Bottle' },
  '80453': { ar: 'عبوة جيب 100 - مل', en: '100ml Pocket Size' },

  // Foaming Hand Soap
  'VAR-SKU-12137': { ar: 'موزع صابون أوتوماتيكي', en: 'Automatic Soap Dispenser' },
  '80415': { ar: 'عبوة 300 مل (جوز الهند)', en: '300ml Bottle (Coconut)' },
  'VAR-SKU-12077': { ar: 'عبوة 300 (فواكه)', en: '300ml Bottle (Fruit Scent)' },
  '80418': { ar: 'عبوة 300 مل (مضاد للجراثيم - ليمون)', en: '300ml Bottle (Antibacterial - Lemon)' },
  'VAR-SKU-12075': { ar: 'عبوة 300 مل (دراق)', en: '300ml Bottle (Peach)' },
  'VAR-SKU-12073': { ar: 'موزع صابون يدوي', en: 'Manual Soap Dispenser' },
  'VAR-SKU-12072': { ar: 'كيس موزع صابون 1000 مل', en: '1000ml Dispenser Bag' },
  'VAR-SKU-12071': { ar: 'جالون صابون 5 لتر', en: '5L Soap Gallon' },

  // General Sanitizer
  '80929': { ar: 'عبوة بخاخ 750 مل', en: '750ml Spray Bottle' },
  '80367': { ar: 'عبوة بخاخ 125 مل', en: '125ml Spray Bottle' },

  // Spray Sanitizer
  '85178': { ar: 'موزع رذاذ حائط يدوي', en: 'Manual Spray Dispenser' },
  '80913': { ar: 'كيس موزع رذاذ 1000 مل', en: '1000ml Dispenser Bag' },
  '80941': { ar: 'عبوة بخاخ 250 مل', en: '250ml Spray' },
  '80940': { ar: 'عبوة بخاخ 150 مل', en: '150ml Spray' },
  '80915': { ar: 'عبوة بخاخ 60 مل', en: '60ml Spray' },

  // Blue Scan Ultra Sound Gell
  '80463': { ar: 'جالون مع مضخة 5 لتر', en: '5L Gallon with Pump' },
  '80610': { ar: 'علبة 250 مل (أزرق)', en: '250ml Blue Bottle' },
  'VAR-SKU-12039': { ar: 'تيوب 450 مل (أزرق)', en: '450ml Blue Tube' },
  'VAR-SKU-12038': { ar: 'بوليتينر شفاف 5 لتر', en: '5L Transparent Politainer' },
  'VAR-SKU-12037': { ar: 'علبة 250 مل (شفاف)', en: '250ml Transparent Bottle' },
  '80090': { ar: 'علبة 250 مل (أزرق - بديل)', en: '250ml Blue Bottle (Alt)' },
  'VAR-SKU-12035': { ar: 'أنبوب 250 مل (أزرق)', en: '250ml Blue Tube' },
  '80121': { ar: 'بوليتينر أزرق 5 لتر', en: '5L Blue Politainer' },
  'VAR-SKU-12034': { ar: 'جالون صب 5 لتر', en: '5L Standard Gallon' },
  '80609': { ar: 'تيوب 450 مل (شفاف)', en: '450ml Transparent Tube' },
  'VAR-SKU-12030': { ar: 'علبة 500 مل (أزرق)', en: '500ml Blue Bottle' },
  '80100': { ar: 'علبة 500 مل (شفاف)', en: '500ml Transparent Bottle' },

  // Liquid Hand Soap
  'VAR-SKU-12162': { ar: 'موزع صابون أوتوماتيكي', en: 'Automatic Soap Dispenser' },
  'VAR-SKU-12161': { ar: 'موزع صابون يدوي', en: 'Manual Soap Dispenser' },
  'VAR-SKU-12160': { ar: 'جالون صابون 5 لتر', en: '5L Soap Gallon' },
  'VAR-SKU-12159': { ar: 'عبوة ضاغطة 500 مل', en: '500ml Pump Bottle' }
};

function parseBackupFile() {
  const content = fs.readFileSync(path.join(process.cwd(), 'PRODUCTS_BACKUP.txt'), 'utf8');
  const productBlocks = content.split(/======================================================================\r?\nالمنتج رقم/g);
  
  const products = [];
  
  productBlocks.forEach((block, index) => {
    if (index === 0) return;
    
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
    
    const skuMatch = block.match(/• رمز المنتج \(SKU\):\s*(.*?)\r?\n/);
    const sku = skuMatch ? skuMatch[1].trim() : '';
    
    const slugMatch = block.match(/• الرابط \(Slug\):\s*(.*?)\r?\n/);
    const slug = slugMatch ? slugMatch[1].trim() : '';
    
    const catMatch = block.match(/• القسم \(Category Slug\):\s*(.*?)\r?\n/);
    const categorySlug = catMatch ? catMatch[1].trim() : '';
    
    const priceMatch = block.match(/• السعر الرئيسي:\s*(.*?)\s*دينار/);
    const price = priceMatch ? parseFloat(priceMatch[1].trim()) : 0;

    const origPriceMatch = block.match(/• السعر قبل الخصم:\s*(.*?)\s*دينار/);
    const originalPrice = origPriceMatch ? parseFloat(origPriceMatch[1].trim()) : undefined;
    
    const stockMatch = block.match(/• حالة التوفر في المخزون:\s*(.*?)\s*\(الكمية:\s*(\d+)\)/);
    const inStock = stockMatch ? !stockMatch[1].includes('غير') : true;
    const stockQuantity = stockMatch ? parseInt(stockMatch[2]) : 50;

    const newArrivalMatch = block.match(/جديد:\s*(نعم|لا)/);
    const isNewArrival = newArrivalMatch ? newArrivalMatch[1] === 'نعم' : false;

    const featuredMatch = block.match(/مميز:\s*(نعم|لا)/);
    const isFeatured = featuredMatch ? featuredMatch[1] === 'نعم' : false;

    const topSellerMatch = block.match(/الأكثر مبيعاً:\s*(نعم|لا)/);
    const isTopSeller = topSellerMatch ? topSellerMatch[1] === 'نعم' : false;
    
    const imagesSection = block.match(/--- الصور ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    const images = [];
    if (imagesSection) {
      const imgLines = imagesSection[1].split('\n');
      imgLines.forEach(line => {
        const m = line.match(/\d+\.\s*(.*?)$/);
        if (m) images.push(m[1].trim());
      });
    }
    
    const descArMatch = block.match(/--- الوصف بالعربية ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    const descriptionAr = descArMatch ? descArMatch[1].trim() : '';

    const descEnMatch = block.match(/--- الوصف بالإنجليزية ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    const descriptionEn = descEnMatch ? descEnMatch[1].trim() : '';

    const usageSection = block.match(/--- طريقة الاستخدام \(Usage\) ---\r?\n([\s\S]*?)(?:\r?\n---|$)/);
    let usageAr = '';
    let usageEn = '';
    if (usageSection) {
      const arUsageMatch = usageSection[1].match(/بالعربية:\s*([\s\S]*?)(?:\r?\nبالإنجليزية:|$)/);
      usageAr = arUsageMatch ? arUsageMatch[1].trim() : '';
      const enUsageMatch = usageSection[1].match(/بالإنجليزية:\s*([\s\S]*?)$/);
      usageEn = enUsageMatch ? enUsageMatch[1].trim() : '';
    }

    const variationsSection = block.match(/--- الأحجام والخيارات المتوفرة \(Variations\) ---\r?\n([\s\S]*?)$/);
    const variations = [];
    if (variationsSection) {
      const varBlocks = variationsSection[1].split(/\[خيار \d+\]/g);
      varBlocks.forEach((vBlock, vIdx) => {
        if (vIdx === 0) return;
        
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

        // Retrieve pre-mapped bilingual names or fallback
        const mappedName = VARIATION_NAME_MAP[vSku] || { ar: 'حجم مخصص', en: 'Custom Size' };

        variations.push({
          sku: vSku,
          name: mappedName,
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

  return products;
}

async function seedProducts() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('No MONGODB_URI found!');
    return;
  }
  
  console.log('Connecting to database...');
  await mongoose.connect(mongoUri);
  console.log('Connected successfully!');

  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // Clear products first
  await Product.deleteMany({});
  console.log('Cleared existing products.');

  const parsedProducts = parseBackupFile();
  console.log(`Parsed ${parsedProducts.length} products successfully.`);

  // Cache categories for fast lookup
  const categories = await Category.find({}).lean();
  console.log(`Loaded ${categories.length} categories.`);

  const productsToInsert = [];

  for (const p of parsedProducts) {
    const cat = categories.find(c => c.slug === p.categorySlug);
    let categoryName = { en: p.categorySlug, ar: p.categorySlug };
    if (cat) {
      categoryName = { en: cat.name.en, ar: cat.name.ar };
    }

    productsToInsert.push({
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      description: p.description,
      usage: p.usage,
      price: p.price,
      originalPrice: p.originalPrice,
      categorySlug: p.categorySlug,
      categoryName,
      images: p.images,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity,
      isNewArrival: p.isNewArrival,
      isFeatured: p.isFeatured,
      isTopSeller: p.isTopSeller,
      isPaused: false,
      rating: 5.0,
      reviewCount: 12,
      variations: p.variations.map(v => ({
        sku: v.sku,
        price: v.price,
        originalPrice: v.originalPrice,
        images: v.images,
        attributes: v.attributes || {},
        inStock: v.inStock,
        stockQuantity: v.stockQuantity,
        name: v.name,
        description: v.description
      }))
    });
  }

  const result = await Product.insertMany(productsToInsert);
  console.log(`Successfully seeded ${result.length} products to database with precise variation names!`);

  await mongoose.disconnect();
}

seedProducts().catch(console.error);
