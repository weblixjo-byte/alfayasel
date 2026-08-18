import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail(order: any) {
  if (!order.customerEmail) return;

  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_USER || !SMTP_PASS) {
    console.log('SMTP credentials missing, skipping order email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const orderItemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.nameEn} <br> <span style="font-size: 10px; color: #666;">${item.nameAr}</span></td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price.toFixed(2)} JOD</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #0066b2; text-align: center;">Order Confirmation</h2>
      <p>Dear <strong>${order.customerName}</strong>,</p>
      <p>Thank you for shopping with <strong>Al Fayasel Laboratories</strong>! We have received your order and are currently processing it.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total Amount:</strong> ${order.total.toFixed(2)} JOD</p>
        <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
        <p><strong>Delivery Address:</strong> ${order.customerCity}, ${order.customerAddress}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f1f1f1;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
            <td style="padding: 10px; text-align: right;">${order.subtotal.toFixed(2)} JOD</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Delivery Fee:</td>
            <td style="padding: 10px; text-align: right;">${order.deliveryFee.toFixed(2)} JOD</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; color: #0066b2;">Total:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; color: #0066b2;">${order.total.toFixed(2)} JOD</td>
          </tr>
        </tfoot>
      </table>

      <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
        Our team will contact you shortly to arrange the delivery.<br>
        If you have any questions, reply to this email or contact us via WhatsApp: +962776755550.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Al Fayasel Laboratories" <${SMTP_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: htmlContent,
    });
    console.log('Order confirmation email sent to:', order.customerEmail);
  } catch (error) {
    console.error('Failed to send order email:', error);
  }
}
