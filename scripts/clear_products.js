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
  console.log('No .env.local file loaded or parsed error', e.message);
}

async function clearProducts() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('No MONGODB_URI found!');
    return;
  }
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);

  const productSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

  const count = await Product.countDocuments({});
  console.log(`Current products in DB: ${count}`);

  const res = await Product.deleteMany({});
  console.log(`Deleted ${res.deletedCount} products from database.`);

  await mongoose.disconnect();
  console.log('Database cleared of old products successfully!');
}

clearProducts().catch(console.error);
