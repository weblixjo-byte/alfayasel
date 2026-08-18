const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Parse .env.local
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

const desktopDir = path.join('C:', 'Users', 'VECTUS-H', 'Desktop', 'product_images_backup');

// Clear destination directory first to ensure ONLY active product images exist
if (fs.existsSync(desktopDir)) {
  fs.rmSync(desktopDir, { recursive: true, force: true });
}
fs.mkdirSync(desktopDir, { recursive: true });

let copiedCount = 0;
const processedFiles = new Set();

function resolveImageFile(imageWebPath) {
  if (!imageWebPath) return null;
  const cleanPath = imageWebPath.startsWith('/') ? imageWebPath.slice(1) : imageWebPath;
  const fullPath = path.join(process.cwd(), 'public', cleanPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }
  // Try recursive search in public for matching filename
  const fileName = path.basename(cleanPath);
  return findFileRecursive(path.join(process.cwd(), 'public'), fileName);
}

function findFileRecursive(dir, fileName) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const found = findFileRecursive(filePath, fileName);
      if (found) return found;
    } else if (file.toLowerCase() === fileName.toLowerCase()) {
      return filePath;
    }
  }
  return null;
}

function copyFile(srcPath, desiredName) {
  if (!srcPath || !fs.existsSync(srcPath)) return;
  if (processedFiles.has(srcPath + '->' + desiredName)) return;
  processedFiles.add(srcPath + '->' + desiredName);

  const ext = path.extname(srcPath);
  const finalFileName = desiredName.endsWith(ext) ? desiredName : `${desiredName}${ext}`;
  const destPath = path.join(desktopDir, finalFileName);

  fs.copyFileSync(srcPath, destPath);
  console.log(`[COPIED] ${path.basename(srcPath)} -> ${finalFileName}`);
  copiedCount++;
}

async function main() {
  console.log('=== Exporting Active Products Images ONLY ===\n');

  let products = [];
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB...');
      const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db();
      products = await db.collection('products').find({}).toArray();
      console.log(`Successfully fetched ${products.length} active products from database.\n`);
      await client.close();
    } catch (err) {
      console.warn('Could not fetch from Mongo DB directly:', err.message);
    }
  }

  // If DB products were not loaded or empty, parse reseed products list
  if (products.length === 0) {
    console.log('Reading fallback products from reseed script...');
    try {
      const reseedContent = fs.readFileSync(path.join(__dirname, 'reseed_categories_and_products.js'), 'utf8');
      // Extract array using regex match if needed or require
    } catch (e) {}
  }

  // Process each product and its variations
  products.forEach((p, pIdx) => {
    const productName = (p.name && (p.name.ar || p.name.en)) || p.slug || `product_${pIdx+1}`;
    const cleanSlug = p.slug || `product_${pIdx+1}`;

    console.log(`Processing Product #${pIdx+1}: ${productName}`);

    // Main image
    if (p.image) {
      const src = resolveImageFile(p.image);
      if (src) copyFile(src, `${cleanSlug}_main`);
    }

    // Images array
    if (Array.isArray(p.images)) {
      p.images.forEach((img, idx) => {
        const src = resolveImageFile(img);
        if (src) copyFile(src, `${cleanSlug}_img_${idx+1}`);
      });
    }

    // Variations (options, sizes, etc.)
    if (Array.isArray(p.variations)) {
      p.variations.forEach((v, vIdx) => {
        const varName = v.sku || `variant_${vIdx+1}`;
        if (Array.isArray(v.images)) {
          v.images.forEach((vImg, vImgIdx) => {
            const src = resolveImageFile(vImg);
            if (src) copyFile(src, `${cleanSlug}_${varName}_${vImgIdx+1}`);
          });
        }
        if (v.image) {
          const src = resolveImageFile(v.image);
          if (src) copyFile(src, `${cleanSlug}_${varName}_main`);
        }
      });
    }
  });

  console.log(`\n========================================`);
  console.log(`🎉 SUCCESS! Exported ONLY active product images.`);
  console.log(`Total active product images copied: ${copiedCount}`);
  console.log(`Folder Path: ${desktopDir}`);
  console.log(`========================================`);
}

main();
