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

async function showCategories() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('No MONGODB_URI found!');
    return;
  }
  await mongoose.connect(mongoUri);
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  const categories = await Category.find({}).lean();
  
  console.log('--- Database Categories ---');
  categories.forEach(c => {
    console.log(`- [${c.slug}] name: ${c.name?.ar} | ${c.name?.en} (Parent: ${c.parentSlug || 'None'}, Order: ${c.order})`);
  });
  
  await mongoose.disconnect();
}

showCategories().catch(console.error);
