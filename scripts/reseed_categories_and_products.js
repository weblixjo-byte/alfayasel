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

const INITIAL_CATEGORIES = [
  {
    slug: 'hair-care-product',
    name: { en: 'Hair care product', ar: 'منتجات العناية بالشعر' },
    subcategories: [
      { slug: 'tricho-cream', name: { en: 'Tricho cream', ar: 'ترايكو كريم' } },
      { slug: 'activita-os-hair-oil', name: { en: "Activita o's hair oil", ar: 'زيت أكتيفيتا أوز للشعر' } },
      { slug: 'alfatar-shampoo', name: { en: 'Alfatar shampoo', ar: 'الفاتار شامبو' } },
      { slug: 'alfatar-shampoo-conditioner', name: { en: 'Alfatar shampoo & conditioner', ar: 'الفاتار شامبو وبلسم' } },
    ],
  },
  {
    slug: 'skin-care-product',
    name: { en: 'Skin care product', ar: 'منتجات العناية بالبشرة' },
    subcategories: [
      { slug: 'clean-face-cleansing-cream', name: { en: 'Clean face cleansing cream', ar: 'كلين فيس كريم تنظيف البشرة' } },
      { slug: 'clean-face-acne-cream', name: { en: 'Clean face acne cream', ar: 'كلين فيس كريم لعلاج حب الشباب' } },
      { slug: 'ss4-cream', name: { en: 'SS4 Cream', ar: 'إس إس 4 كريم' } },
      { slug: 'urelol-lotion', name: { en: 'Urelol lotion', ar: 'يوريلول لوشن' } },
      { slug: 'urelol-cream', name: { en: 'Urelol cream', ar: 'يوريلول كريم' } },
      { slug: 'emulene-cream-jar', name: { en: 'Emulene cream jar', ar: 'إيمولين كريم مرطبان' } },
      { slug: 'emulene-cream-tube', name: { en: 'Emulene cream tube', ar: 'إيمولين كريم تيوب' } },
      { slug: 'alfarep', name: { en: 'Alfarep', ar: 'الفاريب بخاخ حشرات' } },
      { slug: 'argentum', name: { en: 'Argentum', ar: 'أرجينتوم' } },
      { slug: 'vaginal-douche', name: { en: 'Vaginal douche', ar: 'دوش مهبلي' } },
    ],
  },
  {
    slug: 'cutell-family',
    name: { en: 'Cutell family', ar: 'عائلة كيوتيل' },
    subcategories: [
      { slug: 'cutell-hand-cream', name: { en: 'Cutell hand cream', ar: 'كيوتيل كريم اليدين' } },
      { slug: 'cutell-foot-cream', name: { en: 'Cutell foot cream', ar: 'كيوتيل كريم القدمين' } },
      { slug: 'cutell-excessive-dryness', name: { en: 'Cutell excessive dryness cream', ar: 'كيوتيل كريم الجفاف الشديد' } },
      { slug: 'cutell-whitening', name: { en: 'Cutell whitening cream', ar: 'كيوتيل كريم التبييض' } },
      { slug: 'cutell-sunblock-50', name: { en: 'Cutell sunblock 50+', ar: 'كيوتيل واقي شمس 50+' } },
      { slug: 'cutell-sunblock-35', name: { en: 'Cutell sunblock 35+', ar: 'كيوتيل واقي شمس 35+' } },
      { slug: 'cutell-muscle-cream', name: { en: 'Cutell muscle cream', ar: 'كيوتيل كريم العضلات' } },
    ],
  },
  {
    slug: 'mums-and-babies',
    name: { en: 'Mums and babies', ar: 'الأم والطفل' },
    subcategories: [
      { slug: 'stretch-marks-cream', name: { en: 'Stretch marks cream', ar: 'كريم علامات التمدد' } },
      { slug: 'nappy-rash-cream', name: { en: 'Nappy rash cream', ar: 'كريم تسلخات الحفاض' } },
      { slug: 'nipple-cream', name: { en: 'Nipple cream', ar: 'كريم تشققات الحلمة' } },
    ],
  },
  {
    slug: 'personal-lubricant',
    name: { en: 'Personal lubricant', ar: 'المزلقات الشخصية' },
    subcategories: [
      { slug: 'cutell-personal-lubricant', name: { en: 'Cutell personal lubricant', ar: 'كيوتيل مزلق شخصي' } },
    ],
  },
  {
    slug: 'be-clean-products',
    name: { en: 'Be clean products', ar: 'منتجات التطهير والنظافة' },
    subcategories: [
      { slug: 'be-clean-hand-sanitizer', name: { en: 'Be clean hand sanitizer', ar: 'بي كلين مطهر اليدين' } },
      { slug: 'be-clean-surface-disinfectant', name: { en: 'Be clean surface disinfectant', ar: 'بي كلين مطهر الاسطح' } },
    ],
  },
  {
    slug: 'paramedical-product',
    name: { en: 'paramedical product', ar: 'المنتجات الطبية المساندة' },
    subcategories: [
      { slug: 'instrument-sterilizer', name: { en: 'Instrument sterilizer solution', ar: 'محلول تعقيم الأدوات' } },
    ],
  },
  {
    slug: 'ultra-sound-gel',
    name: { en: 'Ultra sound gel', ar: 'جل الألتراساوند' },
    subcategories: [
      { slug: 'blue-scan-ultrasound-gel', name: { en: 'Blue scan ultra sound gel', ar: 'بلو سكان جل الألتراساوند' } },
    ],
  },
];

// Product Category slugs mapping from PRODUCTS_BACKUP.txt to clean subcategory slugs in INITIAL_CATEGORIES
const PRODUCT_CATEGORY_MAP = {
  'tricho-cream': 'tricho-cream',
  'urelol-lotion': 'urelol-lotion',
  'urelol-cream': 'urelol-cream',
  'ss4-cream': 'ss4-cream',
  'stretch-marks-cream': 'stretch-marks-cream',
  'nipple-cream': 'nipple-cream',
  'nappy-rash-cream': 'nappy-rash-cream',
  'hand-cream': 'cutell-hand-cream',
  'foot-cream': 'cutell-foot-cream',
  'excessive-dryness-cream': 'cutell-excessive-dryness',
  'whitening-cream': 'cutell-whitening',
  'sun-block-50': 'cutell-sunblock-50',
  'sun-block-35': 'cutell-sunblock-35',
  'muscle-cream': 'cutell-muscle-cream',
  'personal-lubricant': 'cutell-personal-lubricant',
  'soap-sanitizer': 'be-clean-hand-sanitizer',
  'spray-sanitizer': 'be-clean-hand-sanitizer',
  'ultra-sound-gel': 'blue-scan-ultrasound-gel',
  'paramedical-product': 'instrument-sterilizer',
  'vaginal-douche': 'vaginal-douche',
  'liquid-hand-soap': 'be-clean-hand-sanitizer'
};

// Precise variation name mapping based on SKU
const VARIATION_NAME_MAP = {
  '80030': { ar: 'مرطبان 100 مل', en: '100ml Jar' },
  '80602': { ar: 'تيوب 100 مل', en: '100ml Tube' },
  '80051': { ar: 'تيوب 100 مل', en: '100ml Tube' },
  '80040': { ar: 'مرطبان 250 مل', en: '250ml Jar' },
  '80012': { ar: 'عبوة ضاغطة 500 مل', en: '500ml Pump Bottle' },
  '80050': { ar: 'مرطبان 100 مل', en: '100ml Jar' },
  '80460': { ar: 'كيس موزع 1000 مل', en: '1000ml Dispenser Bag' },
  '86004': { ar: 'موزع حائط يدوي', en: 'Manual Wall Dispenser' },
  '80296': { ar: 'بخاخ حشرات 120 مل', en: '120ml Insect Spray' },
  '80291': { ar: 'كريم حشرات 100 مل', en: '100ml Insect Cream' },
  '80290': { ar: 'إصبع حشرات (Stick)', en: 'Insect Repellent Stick' },
  '80280': { ar: 'حجم 85 غرام', en: '85g Size' },
  '80170': { ar: 'حجم 10 غرام', en: '10g Size' },
  '85180': { ar: 'موزع معقم أوتوماتيكي', en: 'Automatic Gel Dispenser' },
  '85184': { ar: 'موزع معقم يدوي', en: 'Manual Gel Dispenser' },
  '80414': { ar: 'عبوة ضاغطة حائط 1000 مل', en: '1000ml Wall Pump' },
  '80923': { ar: 'عبوة جيب 60 مل', en: '60ml Pocket Size' },
  '80612': { ar: 'كيس موزع معقم 1000 مل', en: '1000ml Dispenser Bag' },
  '80495': { ar: 'عبوة عائلية 1000 مل', en: '1000ml Bottle' },
  '80506': { ar: 'عبوة متوسطة 500 مل', en: '500ml Bottle' },
  '80918': { ar: 'جالون 5 لتر', en: '5L Gallon' },
  '80914': { ar: 'جالون 5 لتر', en: '5L Gallon' },
  '80912': { ar: 'كيس موزع رغوة 1000 مل', en: '1000ml Dispenser Bag' },
  '85177': { ar: 'موزع رغوة أوتوماتيكي', en: 'Automatic Foam Dispenser' },
  '80916': { ar: 'موزع رغوة حائط يدوي', en: 'Manual Foam Dispenser' },
  '80421': { ar: 'عبوة ضاغطة 300 مل', en: '300ml Pump Bottle' },
  '80453': { ar: 'عبوة جيب 100 مل', en: '100ml Pocket Size' },
  'VAR-SKU-12137': { ar: 'موزع صابون أوتوماتيكي', en: 'Automatic Soap Dispenser' },
  '80415': { ar: 'عبوة 300 مل (جوز الهند)', en: '300ml Bottle (Coconut)' },
  'VAR-SKU-12077': { ar: 'عبوة 300 (فواكه)', en: '300ml Bottle (Fruit Scent)' },
  '80418': { ar: 'عبوة 300 مل (مضاد للجراثيم - ليمون)', en: '300ml Bottle (Antibacterial - Lemon)' },
  'VAR-SKU-12075': { ar: 'عبوة 300 مل (دراق)', en: '300ml Bottle (Peach)' },
  'VAR-SKU-12073': { ar: 'موزع صابون يدوي', en: 'Manual Soap Dispenser' },
  'VAR-SKU-12072': { ar: 'كيس موزع صابون 1000 مل', en: '1000ml Dispenser Bag' },
  'VAR-SKU-12071': { ar: 'جالون صابون 5 لتر', en: '5L Soap Gallon' },
  '80929': { ar: 'عبوة بخاخ 750 مل', en: '750ml Spray Bottle' },
  '80367': { ar: 'عبوة بخاخ 125 مل', en: '125ml Spray Bottle' },
  '85178': { ar: 'موزع رذاذ حائط يدوي', en: 'Manual Spray Dispenser' },
  '80913': { ar: 'كيس موزع رذاذ 1000 مل', en: '1000ml Dispenser Bag' },
  '80941': { ar: 'عبوة بخاخ 250 مل', en: '250ml Spray' },
  '80940': { ar: 'عبوة بخاخ 150 مل', en: '150ml Spray' },
  '80915': { ar: 'عبوة بخاخ 60 مل', en: '60ml Spray' },
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
    const originalCategorySlug = catMatch ? catMatch[1].trim() : '';
    
    // Map to the correct clean category slug
    let categorySlug = PRODUCT_CATEGORY_MAP[originalCategorySlug] || originalCategorySlug;
    
    // Fine-tune some specific products
    if (slug === 'activita-os') {
      categorySlug = 'activita-os-hair-oil';
    } else if (slug === 'alfatar-shampoo') {
      categorySlug = 'alfatar-shampoo';
    } else if (slug === 'alfatar-shampoo-conditioner') {
      categorySlug = 'alfatar-shampoo-conditioner';
    } else if (slug === 'emulene-cream') {
      categorySlug = 'emulene-cream-tube';
    } else if (slug === 'clean-face-acne-cream') {
      categorySlug = 'clean-face-acne-cream';
    } else if (slug === 'clean-face-cleansing-cream') {
      categorySlug = 'clean-face-cleansing-cream';
    }
    
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

async function reseed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('No MONGODB_URI found!');
    return;
  }
  
  console.log('Connecting to database...');
  await mongoose.connect(mongoUri);
  console.log('Connected!');

  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
    slug: String,
    name: { en: String, ar: String },
    parentSlug: String,
    order: Number
  }, { strict: false }));
  
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // 1. Wipe both collections
  await Category.deleteMany({});
  console.log('Cleared Category collection.');
  await Product.deleteMany({});
  console.log('Cleared Product collection.');

  // 2. Reseed Category Collection strictly according to INITIAL_CATEGORIES
  const categoriesToInsert = [];
  INITIAL_CATEGORIES.forEach((cat, catIdx) => {
    // Parent category
    categoriesToInsert.push({
      slug: cat.slug,
      name: cat.name,
      parentSlug: null,
      order: catIdx * 10
    });
    
    // Subcategories
    cat.subcategories.forEach((sub, subIdx) => {
      categoriesToInsert.push({
        slug: sub.slug,
        name: sub.name,
        parentSlug: cat.slug,
        order: subIdx * 5
      });
    });
  });

  await Category.insertMany(categoriesToInsert);
  console.log(`Successfully seeded ${categoriesToInsert.length} categories (parents and subcategories).`);

  // 3. Parse and Reseed Products
  const parsedProducts = parseBackupFile();
  const productsToInsert = [];

  for (const p of parsedProducts) {
    // Find category details in INITIAL_CATEGORIES to populate categoryName
    let catName = { en: p.categorySlug, ar: p.categorySlug };
    
    // Check subcategories first
    let foundSub = null;
    let foundParent = null;
    
    for (const c of INITIAL_CATEGORIES) {
      const sub = c.subcategories.find(s => s.slug === p.categorySlug);
      if (sub) {
        foundSub = sub;
        foundParent = c;
        break;
      }
    }
    
    if (foundSub) {
      catName = { en: foundSub.name.en, ar: foundSub.name.ar };
    } else {
      // Check parent category
      const parent = INITIAL_CATEGORIES.find(c => c.slug === p.categorySlug);
      if (parent) {
        catName = { en: parent.name.en, ar: parent.name.ar };
      } else {
        console.log(`⚠️ Warning: Category "${p.categorySlug}" not found in seed structure for product "${p.name.ar}".`);
      }
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
      categoryName: catName,
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
  console.log(`Successfully seeded ${result.length} products with clean category mapping!`);

  await mongoose.disconnect();
}

reseed().catch(console.error);
