const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// In-memory storage (replace with MongoDB in production)
const orders = [];

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate quotation based on specifications
function generateQuotation(orderData) {
  const { category, brand, processor, ram, storage, screen, graphics, os, quantity, usage, budget } = orderData;
  
  // Pricing logic (customize as needed)
  let basePrice = 0;
  
  // Processor pricing
  const processorPrices = {
    intel_i3: 1800000, intel_i5: 2500000, intel_i7: 3500000, intel_i9: 5000000,
    amd_ryzen3: 1700000, amd_ryzen5: 2400000, amd_ryzen7: 3300000, amd_ryzen9: 4800000,
    apple_m1: 4500000, apple_m2: 5500000, apple_m3: 6500000
  };
  
  // RAM pricing
  const ramPrices = { '4gb': 200000, '8gb': 400000, '16gb': 700000, '32gb': 1200000, '64gb': 2000000 };
  
  // Storage pricing
  const storagePrices = {
    '256gb_ssd': 300000, '512gb_ssd': 500000, '1tb_ssd': 800000, '2tb_ssd': 1500000,
    '1tb_hdd': 250000, '2tb_hdd': 400000
  };
  
  basePrice = (processorPrices[processor] || 2000000) + 
              (ramPrices[ram] || 0) + 
              (storagePrices[storage] || 0);
  
  // Graphics card addition
  if (graphics && graphics !== 'integrated') {
    basePrice += 800000;
  }
  
  // Brand premium
  if (brand === 'apple') basePrice *= 1.3;
  else if (brand === 'dell' || brand === 'hp') basePrice *= 1.1;
  
  const totalPrice = basePrice * parseInt(quantity || 1);
  
  return {
    basePrice,
    quantity: parseInt(quantity || 1),
    totalPrice,
    specifications: {
      category, brand, processor, ram, storage, screen, graphics, os
    }
  };
}

// Format quotation email
function formatQuotationEmail(orderData, quotation) {
  const specs = quotation.specifications;
  const formatPrice = (price) => `UGX ${price.toLocaleString()}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .spec-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .price-row { font-size: 1.2em; font-weight: bold; color: #667eea; padding: 15px 0; }
    .total { font-size: 1.5em; color: #764ba2; }
    .footer { text-align: center; margin-top: 30px; color: #666; }
    .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Custom IT Quote</h1>
      <p>Avis IT Solutions Uganda</p>
    </div>
    <div class="content">
      <div class="section">
        <h2>📋 Customer Information</h2>
        <div class="spec-row"><span><strong>Name:</strong></span><span>${orderData.name}</span></div>
        <div class="spec-row"><span><strong>Phone:</strong></span><span>${orderData.phone}</span></div>
        <div class="spec-row"><span><strong>Email:</strong></span><span>${orderData.email}</span></div>
        <div class="spec-row"><span><strong>Location:</strong></span><span>${orderData.location}</span></div>
      </div>
      
      <div class="section">
        <h2>💻 Device Specifications</h2>
        <div class="spec-row"><span><strong>Category:</strong></span><span>${specs.category || 'N/A'}</span></div>
        <div class="spec-row"><span><strong>Brand:</strong></span><span>${specs.brand || 'Any'}</span></div>
        <div class="spec-row"><span><strong>Processor:</strong></span><span>${specs.processor || 'N/A'}</span></div>
        <div class="spec-row"><span><strong>RAM:</strong></span><span>${specs.ram || 'N/A'}</span></div>
        <div class="spec-row"><span><strong>Storage:</strong></span><span>${specs.storage || 'N/A'}</span></div>
        <div class="spec-row"><span><strong>Screen:</strong></span><span>${specs.screen || 'Standard'}</span></div>
        <div class="spec-row"><span><strong>Graphics:</strong></span><span>${specs.graphics || 'Integrated'}</span></div>
        <div class="spec-row"><span><strong>OS:</strong></span><span>${specs.os || 'Windows 11'}</span></div>
        <div class="spec-row"><span><strong>Intended Use:</strong></span><span>${orderData.usage || 'General'}</span></div>
      </div>
      
      <div class="section">
        <h2>💰 Pricing</h2>
        <div class="spec-row"><span><strong>Unit Price:</strong></span><span>${formatPrice(quotation.basePrice)}</span></div>
        <div class="spec-row"><span><strong>Quantity:</strong></span><span>${quotation.quantity}</span></div>
        <div class="price-row total"><span><strong>TOTAL:</strong></span><span>${formatPrice(quotation.totalPrice)}</span></div>
        ${orderData.notes ? `<p><strong>Special Requirements:</strong> ${orderData.notes}</p>` : ''}
      </div>
      
      <div class="section" style="text-align: center;">
        <h3>🎯 Next Steps</h3>
        <p>Ready to proceed? Contact us to confirm your order:</p>
        <a href="tel:+256752052202" class="btn">📞 Call Us</a>
        <a href="https://wa.me/256752052202?text=I%27m%20interested%20in%20quote%20${orderData.orderId || ''}" class="btn">💬 WhatsApp</a>
        <p style="margin-top: 20px;"><small>Quote valid for 14 days. Prices subject to availability.</small></p>
      </div>
    </div>
    <div class="footer">
      <p><strong>Avis IT Solutions Uganda</strong></p>
      <p>📧 info@itsolutionsuganda.co.ug | 📱 +256 752 052202</p>
      <p>📍 Kampala, Uganda</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Format WhatsApp message
function formatWhatsAppMessage(orderData, quotation) {
  const specs = quotation.specifications;
  const formatPrice = (price) => `UGX ${price.toLocaleString()}`;
  
  return `
🎉 *YOUR CUSTOM IT QUOTE*
_Avis IT Solutions Uganda_

━━━━━━━━━━━━━━━━━━━━
📋 *CUSTOMER INFO*
Name: ${orderData.name}
Phone: ${orderData.phone}
Location: ${orderData.location}

━━━━━━━━━━━━━━━━━━━━
💻 *SPECIFICATIONS*
Category: ${specs.category || 'N/A'}
Brand: ${specs.brand || 'Any'}
Processor: ${specs.processor || 'N/A'}
RAM: ${specs.ram || 'N/A'}
Storage: ${specs.storage || 'N/A'}
Graphics: ${specs.graphics || 'Integrated'}
OS: ${specs.os || 'Windows 11'}
Use Case: ${orderData.usage || 'General'}

━━━━━━━━━━━━━━━━━━━━
💰 *PRICING*
Unit Price: ${formatPrice(quotation.basePrice)}
Quantity: ${quotation.quantity}
*TOTAL: ${formatPrice(quotation.totalPrice)}*

${orderData.notes ? `📝 Notes: ${orderData.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━
✅ Quote valid for 14 days
📞 Call: +256 752 052202
📧 Email: info@itsolutionsuganda.co.ug

Thank you for choosing Avis IT Solutions! 🚀
  `.trim();
}

// POST /api/orders - Create new order with quotation
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
    body('processor').trim().notEmpty().withMessage('Processor is required'),
    body('ram').trim().notEmpty().withMessage('RAM is required'),
    body('storage').trim().notEmpty().withMessage('Storage is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const orderData = { orderId, ...req.body, createdAt: new Date() };
      
      // Generate quotation
      const quotation = generateQuotation(orderData);
      orderData.quotation = quotation;
      orderData.status = 'pending';
      
      orders.push(orderData);
      
      // Send quotation via email
      const deliveryMethod = req.body.delivery_method || 'email';
      const whatsappNumber = req.body.whatsapp || req.body.phone;
      
      if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: orderData.email,
            subject: `Your Custom IT Quote - ${orderId}`,
            html: formatQuotationEmail(orderData, quotation)
          });
          logger.info(`Quote sent via email to ${orderData.email}`);
        } catch (emailError) {
          logger.error('Email send error:', emailError);
        }
      }
      
      // Prepare WhatsApp message (for manual or API integration)
      let whatsappUrl = null;
      if (deliveryMethod === 'whatsapp' || deliveryMethod === 'both') {
        const message = formatWhatsAppMessage(orderData, quotation);
        const encodedMessage = encodeURIComponent(message);
        whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        logger.info(`WhatsApp quote prepared for ${whatsappNumber}`);
      }

      logger.info(`Order created: ${orderId} for ${orderData.name}`);

      res.status(201).json({
        success: true,
        message: 'Quote generated successfully! Check your email/WhatsApp.',
        orderId,
        quotation,
        whatsappUrl
      });

    } catch (error) {
      logger.error('Order error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate quote. Please try again.' 
      });
    }
  }
);

// GET /api/orders - Get all orders (admin only)
router.get('/', async (req, res) => {
  try {
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId - Get specific order
router.get('/:orderId', async (req, res) => {
  try {
    const order = orders.find(o => o.orderId === req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

module.exports = router;
