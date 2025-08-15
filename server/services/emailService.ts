import nodemailer from 'nodemailer';

// Email configuration
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'Kuriajoe85@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-email-app-password'
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(SMTP_CONFIG);

// Email receipt template
const generateReceiptHTML = (order: any) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rocs Crew - Delivery Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .tagline { font-size: 14px; opacity: 0.9; }
        .receipt-box { border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .receipt-header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
        .receipt-title { color: #10b981; font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .order-id { background: #f0fdf4; color: #166534; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { }
        .detail-label { font-weight: bold; color: #374151; margin-bottom: 3px; }
        .detail-value { color: #6b7280; }
        .cost-summary { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .cost-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .cost-total { font-weight: bold; font-size: 18px; color: #10b981; border-top: 2px solid #e5e7eb; padding-top: 10px; margin-top: 10px; }
        .status-badge { background: #dcfce7; color: #166534; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; }
        .rider-info { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .rider-header { color: #d97706; font-weight: bold; margin-bottom: 10px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .contact-info { margin: 10px 0; color: #6b7280; }
        .social-links { margin: 15px 0; }
        .social-links a { color: #10b981; text-decoration: none; margin: 0 10px; }
        @media (max-width: 600px) {
          body { padding: 10px; }
          .details-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🏍��� ROCS CREW</div>
        <div class="tagline">Fast, Reliable Motorcycle Delivery Service</div>
      </div>

      <div class="receipt-box">
        <div class="receipt-header">
          <div class="receipt-title">📧 DELIVERY RECEIPT</div>
          <div class="order-id">Order ID: ${order.id}</div>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">👤 Customer Name</div>
            <div class="detail-value">${order.customerName}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">📧 Email</div>
            <div class="detail-value">${order.customerEmail}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">📱 Phone</div>
            <div class="detail-value">${order.customerPhone}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">📅 Order Date</div>
            <div class="detail-value">${formatDate(order.createdAt)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">📍 Pickup Location</div>
            <div class="detail-value">${order.pickup}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">🎯 Delivery Location</div>
            <div class="detail-value">${order.delivery}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">📏 Distance</div>
            <div class="detail-value">${order.distance} km</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">📊 Status</div>
            <div class="detail-value"><span class="status-badge">✅ CONFIRMED</span></div>
          </div>
        </div>

        ${order.riderName ? `
        <div class="rider-info">
          <div class="rider-header">🏍️ Assigned Rider</div>
          <div><strong>Name:</strong> ${order.riderName}</div>
          <div><strong>Phone:</strong> ${order.riderPhone}</div>
        </div>
        ` : ''}

        <div class="cost-summary">
          <div class="cost-row">
            <span>Distance (${order.distance} km):</span>
            <span>KES ${(order.distance * 30).toFixed(2)}</span>
          </div>
          <div class="cost-row">
            <span>Base rate:</span>
            <span>KES 30 per km</span>
          </div>
          <div class="cost-row cost-total">
            <span>Total Amount:</span>
            <span>KES ${order.cost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="contact-info">
          <strong>Contact Rocs Crew</strong><br>
          📧 Email: Kuriajoe85@gmail.com<br>
          📱 Phone: +254 712 345 678<br>
          🌐 Website: rocscrew.com
        </div>
        
        <div class="social-links">
          <a href="#">Facebook</a> |
          <a href="#">Twitter</a> |
          <a href="#">Instagram</a> |
          <a href="#">LinkedIn</a>
        </div>
        
        <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
          Thank you for choosing Rocs Crew! 🚀<br>
          This is an automated receipt. Please keep it for your records.
        </p>
      </div>
    </body>
    </html>
  `;
};

// Send receipt email
export const sendOrderReceipt = async (order: any): Promise<boolean> => {
  try {
    const mailOptions = {
      from: {
        name: 'Rocs Crew Delivery',
        address: process.env.EMAIL_USER || 'Kuriajoe85@gmail.com'
      },
      to: order.customerEmail,
      subject: `Order Confirmed - Receipt for ${order.id} | Rocs Crew`,
      html: generateReceiptHTML(order),
      text: `
Dear ${order.customerName},

Your delivery order has been confirmed!

Order ID: ${order.id}
Pickup: ${order.pickup}
Delivery: ${order.delivery}
Distance: ${order.distance} km
Total Cost: KES ${order.cost}

${order.riderName ? `Assigned Rider: ${order.riderName} (${order.riderPhone})` : ''}

Thank you for choosing Rocs Crew!

Best regards,
Rocs Crew Team
Email: Kuriajoe85@gmail.com
Phone: +254 712 345 678
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Receipt email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending receipt email:', error);
    return false;
  }
};

// Send notification to admin
export const sendAdminNotification = async (order: any): Promise<boolean> => {
  try {
    const mailOptions = {
      from: {
        name: 'Rocs Crew System',
        address: process.env.EMAIL_USER || 'Kuriajoe85@gmail.com'
      },
      to: process.env.ADMIN_EMAIL || 'Kuriajoe85@gmail.com',
      subject: `Order Confirmed - ${order.id} | Admin Notification`,
      html: `
        <h3>Order Confirmation Notification</h3>
        <p>Order <strong>${order.id}</strong> has been confirmed and receipt sent to customer.</p>
        <ul>
          <li><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</li>
          <li><strong>Route:</strong> ${order.pickup} → ${order.delivery}</li>
          <li><strong>Cost:</strong> KES ${order.cost}</li>
          <li><strong>Rider:</strong> ${order.riderName || 'Not assigned yet'}</li>
        </ul>
      `,
      text: `Order ${order.id} confirmed. Receipt sent to ${order.customerEmail}.`
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
};

export default { sendOrderReceipt, sendAdminNotification };
