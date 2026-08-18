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
      <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
        <p style="margin: 0; font-weight: bold; color: #0f172a; font-size: 15px;">${item.nameAr}</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">${item.nameEn}</p>
      </td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #333; font-weight: bold;">
        x${item.quantity}
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #e2e8f0; text-align: left; font-weight: bold; color: #0066b2;">
        ${item.price.toFixed(2)} JOD
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); max-width: 600px; margin: 0 auto;">
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 30px; background-color: #ffffff; border-bottom: 4px solid #0066b2;">
                  <img src="https://alfayasel.com/images/alfayasel-logo-new-02.png" alt="Al Fayasel Laboratories" style="max-height: 80px; width: auto; display: block;">
                </td>
              </tr>
              
              <!-- Hero Section -->
              <tr>
                <td style="padding: 40px 30px 20px; text-align: center;">
                  <h1 style="color: #0066b2; margin: 0 0 10px; font-size: 26px;">شكراً لتسوقك معنا! 🎉</h1>
                  <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0;">
                    أهلاً <strong>${order.customerName}</strong>،<br>
                    لقد استلمنا طلبك بنجاح ونقوم الآن بتجهيزه بكل حب.<br>
                    <span style="color: #888; font-size: 14px;">We have received your order and are preparing it.</span>
                  </p>
                </td>
              </tr>

              <!-- Order Details Card -->
              <tr>
                <td style="padding: 0 30px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 20px; text-align: right; border-left: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 5px; font-size: 13px; color: #64748b;">رقم الطلب / Order #</p>
                        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0f172a;">${order.orderNumber}</p>
                      </td>
                      <td style="padding: 20px; text-align: left;">
                        <p style="margin: 0 0 5px; font-size: 13px; color: #64748b;">طريقة الدفع / Payment</p>
                        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #0f172a;">الدفع عند الاستلام</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items Table -->
              <tr>
                <td style="padding: 20px 30px;">
                  <h3 style="color: #0f172a; margin: 0 0 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; text-align: right;">ملخص الطلب / Order Summary</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    ${orderItemsHtml}
                  </table>
                </td>
              </tr>

              <!-- Totals -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 10px; padding: 20px;">
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; text-align: right; font-size: 15px;">المجموع / Subtotal:</td>
                      <td style="padding: 8px 0; text-align: left; font-weight: bold; color: #333; font-size: 15px;">${order.subtotal.toFixed(2)} JOD</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; text-align: right; font-size: 15px;">رسوم التوصيل / Delivery:</td>
                      <td style="padding: 8px 0; text-align: left; font-weight: bold; color: #333; font-size: 15px;">${order.deliveryFee.toFixed(2)} JOD</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0 0; border-top: 2px solid #e2e8f0; font-size: 18px; color: #0066b2; font-weight: bold; text-align: right;">الإجمالي / Total:</td>
                      <td style="padding: 15px 0 0; border-top: 2px solid #e2e8f0; text-align: left; font-size: 20px; color: #0066b2; font-weight: bold;">${order.total.toFixed(2)} JOD</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Address -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <h3 style="color: #0f172a; margin: 0 0 15px; text-align: right;">عنوان التوصيل / Delivery Address</h3>
                  <p style="margin: 0; color: #475569; line-height: 1.8; background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 10px; text-align: right;">
                    <strong>المدينة:</strong> ${order.customerCity}<br>
                    <strong>العنوان:</strong> ${order.customerAddress}<br>
                    <strong>رقم الهاتف:</strong> <span dir="ltr">${order.customerPhone}</span>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0066b2; padding: 40px 30px; text-align: center; color: #ffffff;">
                  <p style="margin: 0 0 10px; font-size: 18px; font-weight: bold;">مختبرات الفيصل - Al Fayasel Laboratories</p>
                  <p style="margin: 0 0 25px; font-size: 15px; color: #bfdbfe; line-height: 1.6;">
                    إذا كان لديك أي استفسار، فريقنا سعيد بخدمتك عبر الواتساب:<br>
                    <span dir="ltr" style="font-size: 18px; font-weight: bold; color: #ffffff; display: inline-block; margin-top: 5px;">+962 776 755 550</span>
                  </p>
                  <a href="https://alfayasel.com" style="display: inline-block; padding: 12px 30px; background-color: #ffffff; color: #0066b2; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">زيارة متجرنا</a>
                </td>
              </tr>
            </table>
            
            <!-- Safe Unsubscribe/Footer Note -->
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
              تم إرسال هذه الرسالة لأنك قمت بالشراء من متجر الفيصل.<br>
              © ${new Date().getFullYear()} Al Fayasel Laboratories. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Al Fayasel Laboratories" <${SMTP_USER}>`,
      to: order.customerEmail,
      subject: `تأكيد طلبك من الفيصل | رقم الطلب: ${order.orderNumber}`,
      html: htmlContent,
    });
    console.log('Order confirmation premium email sent to:', order.customerEmail);
  } catch (error) {
    console.error('Failed to send premium order email:', error);
  }
}
