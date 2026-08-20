const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function clearOrders() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");
    
    await mongoose.connect(uri);
    console.log('Connected to DB...');
    
    const result = await Order.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} orders.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error clearing orders:', err);
    process.exit(1);
  }
}

clearOrders();
