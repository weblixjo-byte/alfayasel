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
      <td dir="rtl" style="padding: 15px 5px; border-bottom: 1px solid #eee; text-align: right; width: 60%;">
        <div style="font-weight: bold; color: #222; font-size: 14px;">${item.nameAr}</div>
        <div style="color: #888; font-size: 12px; margin-top: 4px;">${item.nameEn}</div>
      </td>
      <td style="padding: 15px 5px; border-bottom: 1px solid #eee; text-align: center; color: #555; font-size: 14px; width: 15%;">
        x${item.quantity}
      </td>
      <td dir="ltr" style="padding: 15px 5px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #0066b2; font-size: 14px; width: 25%;">
        ${item.price.toFixed(2)} JOD
      </td>
    </tr>
  `).join('');

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: Arial, sans-serif; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 20px 10px;">
      <tr>
        <td align="center">
          <!-- Main Card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #ddd; max-width: 500px; margin: 0 auto; overflow: hidden;">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding: 25px 20px; border-bottom: 4px solid #0066b2; background-color: #ffffff;">
                <img src="https://alfayasel.com/images/alfayasel-logo-new-02.png" alt="Al Fayasel" width="160" style="display: block; max-width: 160px; height: auto;">
              </td>
            </tr>
            
            <!-- Greeting -->
            <tr>
              <td align="center" dir="rtl" style="padding: 30px 20px 20px;">
                <h2 style="color: #0066b2; margin: 0 0 15px; font-size: 24px;">شكراً لتسوقك معنا!</h2>
                <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0;">
                  أهلاً <strong>${order.customerName}</strong>،<br>
                  لقد استلمنا طلبك بنجاح ونعمل على تجهيزه الآن.
                </p>
              </td>
            </tr>

            <!-- Order Info -->
            <tr>
              <td style="padding: 0 20px 25px;">
                <table width="100%" dir="rtl" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #eee;">
                  <tr>
                    <td style="padding-bottom: 12px; border-bottom: 1px solid #eee;">
                      <span style="color: #777; font-size: 13px; display: block; margin-bottom: 4px;">رقم الطلب:</span>
                      <strong style="font-size: 16px; color: #222;">${order.orderNumber}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 12px;">
                      <span style="color: #777; font-size: 13px; display: block; margin-bottom: 4px;">طريقة الدفع:</span>
                      <strong style="font-size: 15px; color: #222;">الدفع عند الاستلام (COD)</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Items -->
            <tr>
              <td style="padding: 10px 20px;">
                <h3 dir="rtl" style="margin: 0 0 10px; color: #222; font-size: 18px;">ملخص الطلب</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  ${orderItemsHtml}
                </table>
              </td>
            </tr>

            <!-- Totals -->
            <tr>
              <td style="padding: 10px 20px 30px;">
                <table width="100%" dir="rtl" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px; color: #555; font-size: 14px; width: 60%;">المجموع:</td>
                    <td dir="ltr" style="padding: 10px; text-align: right; color: #222; font-weight: bold; font-size: 14px;">${order.subtotal.toFixed(2)} JOD</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; color: #555; font-size: 14px;">رسوم التوصيل:</td>
                    <td dir="ltr" style="padding: 10px; text-align: right; color: #222; font-weight: bold; font-size: 14px;">${order.deliveryFee.toFixed(2)} JOD</td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 10px 0; color: #0066b2; font-weight: bold; font-size: 16px; border-top: 2px solid #eee;">الإجمالي:</td>
                    <td dir="ltr" style="padding: 15px 10px 0; text-align: right; color: #0066b2; font-weight: bold; font-size: 18px; border-top: 2px solid #eee;">${order.total.toFixed(2)} JOD</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Address -->
            <tr>
              <td style="padding: 0 20px 30px;">
                <table width="100%" dir="rtl" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; padding: 20px;">
                  <tr>
                    <td colspan="2" style="padding-bottom: 15px; font-weight: bold; color: #222; font-size: 16px; border-bottom: 1px solid #eee;">عنوان التوصيل</td>
                  </tr>
                  <tr>
                    <td style="padding-top: 15px; color: #777; font-size: 14px; width: 30%;">المدينة:</td>
                    <td style="padding-top: 15px; color: #222; font-size: 15px; font-weight: bold;">${order.customerCity}</td>
                  </tr>
                  <tr>
                    <td style="padding-top: 10px; color: #777; font-size: 14px;">العنوان:</td>
                    <td style="padding-top: 10px; color: #222; font-size: 15px; font-weight: bold;">${order.customerAddress}</td>
                  </tr>
                  <tr>
                    <td style="padding-top: 10px; color: #777; font-size: 14px;">رقم الهاتف:</td>
                    <td dir="ltr" style="padding-top: 10px; color: #222; font-size: 15px; font-weight: bold; text-align: right;">${order.customerPhone}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color: #0066b2; padding: 35px 20px; color: #fff;">
                <h3 style="margin: 0 0 10px; font-size: 18px; color: #ffffff;">مختبرات الفياصل</h3>
                <p style="margin: 0 0 25px; font-size: 14px; color: #dbeafe; line-height: 1.6;">
                  فريقنا متاح دائماً لخدمتك عبر الواتساب<br>
                  <strong dir="ltr" style="display: inline-block; margin-top: 5px; font-size: 16px; color: #ffffff;">+962 776 755 550</strong>
                </p>
                <a href="https://alfayasel.com" style="background-color: #fff; color: #0066b2; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block;">زيارة المتجر</a>
              </td>
            </tr>

          </table>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
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
      subject: `تأكيد طلبك من الفياصل | رقم الطلب: ${order.orderNumber}`,
      html: htmlContent,
    });
    console.log('Order confirmation minimal premium email sent to:', order.customerEmail);
  } catch (error) {
    console.error('Failed to send premium order email:', error);
  }
}


export async function sendOrderCancelledEmail(order: any, reason: string) {
  if (!order.customerEmail) return;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  if (!SMTP_USER || !SMTP_PASS) return;

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden; background-color: #fff;">
      <div style="background-color: #ef4444; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">تم إلغاء طلبك ❌</h1>
      </div>
      <div style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">عزيزي/عزيزتي <strong>${order.customerName}</strong>،</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">نعتذر لإبلاغك بأنه قد تم إلغاء/رفض طلبك رقم <strong style="color: #ef4444;">${order.orderNumber}</strong>.</p>
        <div style="background-color: #fee2e2; border-right: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <h3 style="color: #991b1b; margin-top: 0; font-size: 16px;">سبب الإلغاء:</h3>
          <p style="color: #7f1d1d; margin-bottom: 0; font-size: 15px; line-height: 1.5;">${reason}</p>
        </div>
        <p style="font-size: 15px; color: #777; line-height: 1.5; margin-top: 30px;">إذا كان لديك أي استفسار، يرجى عدم التردد في التواصل مع فريق الدعم الفني الخاص بنا.</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eaeaea; color: #888; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} مختبرات الفيصل. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Al Fayasel Laboratories" <${SMTP_USER}>`,
      to: order.customerEmail,
      subject: `إلغاء الطلب #${order.orderNumber} - مختبرات الفيصل`,
      html,
    });
  } catch (err) {
    console.error('Failed to send cancellation email', err);
  }
}

export async function sendOrderShippedEmail(order: any) {
  if (!order.customerEmail) return;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  if (!SMTP_USER || !SMTP_PASS) return;

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden; background-color: #fff;">
      <div style="background-color: #3b82f6; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">طلبك في طريقه إليك! 🚚</h1>
      </div>
      <div style="padding: 30px 20px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">عزيزي/عزيزتي <strong>${order.customerName}</strong>،</p>
        <p style="font-size: 16px; color: #555; line-height: 1.6;">يسعدنا إبلاغك بأن طلبك رقم <strong>${order.orderNumber}</strong> قد تم تجهيزه وهو الآن في طريقه إليك!</p>
        <p style="font-size: 15px; color: #555; line-height: 1.6;">سيتواصل معك مندوب التوصيل قريباً لتسليم شحنتك، نرجو إبقاء هاتفك قريباً منك.</p>
        <p style="font-size: 15px; color: #777; line-height: 1.5; margin-top: 30px;">شكراً لاختيارك منتجاتنا. نتمنى لك تجربة رائعة!</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eaeaea; color: #888; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} مختبرات الفيصل. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Al Fayasel Laboratories" <${SMTP_USER}>`,
      to: order.customerEmail,
      subject: `طلبك #${order.orderNumber} في الطريق! - مختبرات الفيصل`,
      html,
    });
  } catch (err) {
    console.error('Failed to send shipped email', err);
  }
}
