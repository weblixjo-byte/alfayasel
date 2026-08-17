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
} catch (e) {
  console.log('No .env.local file loaded');
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

  // Clear products first (as requested)
  await Product.deleteMany({});
  console.log('Cleared existing products.');

  const parsedProducts = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'parsed_products_test.json'), 'utf8'));
  console.log(`Loading ${parsedProducts.length} products...`);

  // Cache categories for fast lookup
  const categories = await Category.find({}).lean();
  console.log(`Loaded ${categories.length} categories for translation mapping.`);

  const productsToInsert = [];

  for (const p of parsedProducts) {
    // Look up category for names
    const cat = categories.find(c => c.slug === p.categorySlug);
    let categoryName = { en: p.categorySlug, ar: p.categorySlug };
    if (cat) {
      categoryName = { en: cat.name.en, ar: cat.name.ar };
    } else {
      console.log(`⚠️ Warning: Category "${p.categorySlug}" not found in database for product "${p.name.ar}".`);
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
  console.log(`Successfully seeded ${result.length} products to database!`);

  await mongoose.disconnect();
}

seedProducts().catch(console.error);
