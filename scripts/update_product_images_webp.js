const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Parse .env.local
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[match[1]] = value.trim();
    }
  });
} catch (e) {}

// ─── Paths ───────────────────────────────────────────────────────────────────
const SOURCE_DIR   = path.join('C:', 'Users', 'VECTUS-H', 'Desktop', 'active item');
const DEST_DIR     = path.join(process.cwd(), 'public', 'images', 'products');
const WEB_PREFIX   = '/images/products';

// ─── 1. Create destination dir ────────────────────────────────────────────────
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  console.log(`Created folder: ${DEST_DIR}`);
}

// ─── 2. Copy all WebP files → public/images/products/ ────────────────────────
const webpFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.webp'));
console.log(`\nCopying ${webpFiles.length} WebP files to public/images/products/ ...\n`);

webpFiles.forEach(file => {
  const src  = path.join(SOURCE_DIR, file);
  const dest = path.join(DEST_DIR, file);
  fs.copyFileSync(src, dest);
  console.log(`  [COPIED] ${file}`);
});

// ─── 3. Build lookup: slug_key → new web path ─────────────────────────────────
// Key format (from export script naming):
//   {slug}_img_{n}       → images[n-1]
//   {slug}_{sku}_{n}     → variation images[n-1]
//   {slug}_main          → product.image (if used)
//
// We store: key (without .webp) → webPath
const lookup = {};
webpFiles.forEach(file => {
  const key = file.replace(/\.webp$/, '');
  lookup[key] = `${WEB_PREFIX}/${file}`;
});

// ─── 4. Update MongoDB ────────────────────────────────────────────────────────
async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) { console.error('No MONGODB_URI found!'); return; }

  const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db();
  const col = db.collection('products');
  const products = await col.find({}).toArray();

  console.log(`\nUpdating ${products.length} products in MongoDB ...\n`);
  let updatedProducts = 0;

  for (const p of products) {
    const slug = p.slug;
    if (!slug) continue;

    const updateOps = {};

    // ── images array ──────────────────────────────────────────────────────────
    if (Array.isArray(p.images) && p.images.length > 0) {
      const newImages = p.images.map((oldImg, idx) => {
        const key = `${slug}_img_${idx + 1}`;
        return lookup[key] || oldImg; // fallback to old if no webp found
      });
      if (JSON.stringify(newImages) !== JSON.stringify(p.images)) {
        updateOps.images = newImages;
      }
    }

    // ── main image field (some products may have single image) ────────────────
    if (p.image) {
      const key = `${slug}_main`;
      if (lookup[key]) updateOps.image = lookup[key];
    }

    // ── variations ────────────────────────────────────────────────────────────
    if (Array.isArray(p.variations) && p.variations.length > 0) {
      let variationsChanged = false;
      const newVariations = p.variations.map((v, vIdx) => {
        const varKey = v.sku || `variant_${vIdx + 1}`;

        // variation images array
        let newVImages = v.images;
        if (Array.isArray(v.images) && v.images.length > 0) {
          newVImages = v.images.map((oldImg, imgIdx) => {
            const key = `${slug}_${varKey}_${imgIdx + 1}`;
            return lookup[key] || oldImg;
          });
          if (JSON.stringify(newVImages) !== JSON.stringify(v.images)) {
            variationsChanged = true;
          }
        }

        // variation single image
        let newVImage = v.image;
        if (v.image) {
          const key = `${slug}_${varKey}_main`;
          if (lookup[key]) { newVImage = lookup[key]; variationsChanged = true; }
        }

        return { ...v, images: newVImages, ...(newVImage ? { image: newVImage } : {}) };
      });

      if (variationsChanged) updateOps.variations = newVariations;
    }

    // ── Apply update if there's anything to change ────────────────────────────
    if (Object.keys(updateOps).length > 0) {
      await col.updateOne({ _id: p._id }, { $set: updateOps });
      const pName = (p.name?.ar || p.name?.en || slug);
      console.log(`  [UPDATED] ${pName} (${slug})`);
      Object.entries(updateOps).forEach(([field, val]) => {
        if (field === 'images') console.log(`     images: [${val.join(', ')}]`);
        else if (field === 'variations') console.log(`     variations: ${val.length} updated`);
        else console.log(`     ${field}: ${val}`);
      });
      updatedProducts++;
    } else {
      console.log(`  [SKIPPED] ${slug} — no matching WebP files found`);
    }
  }

  await client.close();

  console.log(`\n========================================`);
  console.log(`🎉 DONE!`);
  console.log(`WebP files copied to: public/images/products/`);
  console.log(`Products updated in DB: ${updatedProducts}/${products.length}`);
  console.log(`========================================`);
}

main().catch(err => console.error('Error:', err));
