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

async function dumpProducts() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('No MONGODB_URI found!');
    return;
  }
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected successfully!');

  const productSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

  const products = await Product.find({}).lean();
  console.log(`Found ${products.length} products in database.`);

  function cleanHtml(str) {
    if (!str) return '';
    return str
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\r?\n\s*\n+/g, '\n')
      .trim();
  }

  let textOutput = '======================================================================\n';
  textOutput += '             سجل وبيانات جميع منتجات مختبرات الفياصل               \n';
  textOutput += '======================================================================\n\n';
  textOutput += `تاريخ التصدير: ${new Date().toLocaleString('ar-JO')}\n`;
  textOutput += `إجمالي عدد المنتجات: ${products.length}\n\n`;

  products.forEach((p, idx) => {
    textOutput += '======================================================================\n';
    textOutput += `المنتج رقم (${idx + 1}): ${p.name?.ar || 'بدون اسم'} | ${p.name?.en || 'No Name'}\n`;
    textOutput += '======================================================================\n';
    textOutput += `• رمز المنتج (SKU): ${p.sku || 'N/A'}\n`;
    textOutput += `• الرابط (Slug): ${p.slug || 'N/A'}\n`;
    textOutput += `• القسم (Category Slug): ${p.categorySlug || 'N/A'}\n`;
    textOutput += `• السعر الرئيسي: ${p.price || 0} دينار أردني\n`;
    if (p.originalPrice) {
      textOutput += `• السعر قبل الخصم: ${p.originalPrice} دينار أردني\n`;
    }
    textOutput += `• حالة التوفر في المخزون: ${p.inStock !== false ? 'متوفر' : 'غير متوفر'} (الكمية: ${p.stockQuantity || 0})\n`;
    textOutput += `• علامات العرض: [جديد: ${p.isNewArrival ? 'نعم' : 'لا'}] [مميز: ${p.isFeatured ? 'نعم' : 'لا'}] [الأكثر مبيعاً: ${p.isTopSeller ? 'نعم' : 'لا'}]\n\n`;

    textOutput += '--- الصور ---\n';
    if (p.images && p.images.length > 0) {
      p.images.forEach((img, i) => {
        textOutput += `  ${i + 1}. ${img}\n`;
      });
    } else {
      textOutput += '  لا توجد صور مسجلة\n';
    }

    textOutput += '\n--- الوصف بالعربية ---\n';
    textOutput += (cleanHtml(p.description?.ar) || 'لا يوجد وصف عربي') + '\n';

    textOutput += '\n--- الوصف بالإنجليزية ---\n';
    textOutput += (cleanHtml(p.description?.en) || 'No English description') + '\n';

    if (p.usage?.ar || p.usage?.en) {
      textOutput += '\n--- طريقة الاستخدام (Usage) ---\n';
      if (p.usage?.ar) textOutput += `بالعربية: ${cleanHtml(p.usage.ar)}\n`;
      if (p.usage?.en) textOutput += `بالإنجليزية: ${cleanHtml(p.usage.en)}\n`;
    }

    if (p.variations && p.variations.length > 0) {
      textOutput += '\n--- الأحجام والخيارات المتوفرة (Variations) ---\n';
      p.variations.forEach((v, vi) => {
        textOutput += `  [خيار ${vi + 1}]\n`;
        textOutput += `    - الاسم / الحجم: ${v.name?.ar || ''} / ${v.name?.en || ''}\n`;
        textOutput += `    - SKU: ${v.sku || ''}\n`;
        textOutput += `    - السعر: ${v.price || 0} دينار\n`;
        if (v.originalPrice) textOutput += `    - السعر قبل الخصم: ${v.originalPrice} دينار\n`;
        textOutput += `    - التوفر: ${v.inStock !== false ? 'متوفر' : 'غير متوفر'} (كمية: ${v.stockQuantity || 0})\n`;
        if (v.images && v.images.length > 0) {
          textOutput += `    - صور الخيار: ${v.images.join(', ')}\n`;
        }
        if (v.description?.ar) {
          textOutput += `    - وصف خاص بالعربية: ${cleanHtml(v.description.ar)}\n`;
        }
        if (v.description?.en) {
          textOutput += `    - وصف خاص بالإنجليزية: ${cleanHtml(v.description.en)}\n`;
        }
      });
    }

    textOutput += '\n\n';
  });

  const exportPath = path.join(process.cwd(), 'PRODUCTS_BACKUP.txt');
  fs.writeFileSync(exportPath, textOutput, 'utf8');
  console.log(`Exported successfully to: ${exportPath}`);

  await mongoose.disconnect();
}

dumpProducts().catch(console.error);
