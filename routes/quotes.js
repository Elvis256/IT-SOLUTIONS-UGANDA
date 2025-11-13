const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// In-memory storage (replace with MongoDB in production)
const quotes = [];

// Price calculation engine
function calculateQuote(specs) {
  let basePrice = 0;
  let breakdown = {};

  // Base processor prices
  const processorPrices = {
    'intel_i3': 800000,
    'intel_i5': 1200000,
    'intel_i7': 1800000,
    'intel_i9': 2800000,
    'amd_ryzen3': 750000,
    'amd_ryzen5': 1100000,
    'amd_ryzen7': 1600000,
    'amd_ryzen9': 2600000,
    'apple_m1': 3500000,
    'apple_m2': 4200000,
    'apple_m3': 5000000
  };

  // RAM prices
  const ramPrices = {
    '4gb': 200000,
    '8gb': 400000,
    '16gb': 800000,
    '32gb': 1600000,
    '64gb': 3200000
  };

  // Storage prices
  const storagePrices = {
    '256gb_ssd': 300000,
    '512gb_ssd': 500000,
    '1tb_ssd': 900000,
    '2tb_ssd': 1800000,
    '1tb_hdd': 250000,
    '2tb_hdd': 400000
  };

  // Graphics card prices
  const graphicsPrices = {
    'integrated': 0,
    'nvidia_gtx': 800000,
    'nvidia_rtx': 1500000,
    'amd_radeon': 700000,
    'apple_gpu': 0 // included in Apple processor
  };

  // Screen size adjustment
  const screenPrices = {
    '13inch': 0,
    '14inch': 100000,
    '15inch': 150000,
    '17inch': 300000,
    '24inch': 400000,
    '27inch': 600000
  };

  // Operating System
  const osPrices = {
    'windows11': 150000,
    'windows10': 100000,
    'macos': 0, // included with Apple
    'linux': 0,
    'no_os': -100000 // discount
  };

  // Calculate base price
  basePrice += processorPrices[specs.processor] || 1000000;
  breakdown.processor = processorPrices[specs.processor] || 1000000;

  basePrice += ramPrices[specs.ram] || 400000;
  breakdown.ram = ramPrices[specs.ram] || 400000;

  basePrice += storagePrices[specs.storage] || 500000;
  breakdown.storage = storagePrices[specs.storage] || 500000;

  basePrice += graphicsPrices[specs.graphics] || 0;
  breakdown.graphics = graphicsPrices[specs.graphics] || 0;

  if (specs.screen) {
    basePrice += screenPrices[specs.screen] || 0;
    breakdown.screen = screenPrices[specs.screen] || 0;
  }

  basePrice += osPrices[specs.os] || 0;
  breakdown.os = osPrices[specs.os] || 0;

  // Brand premium
  const brandPremiums = {
    'apple': 1.5,
    'microsoft': 1.3,
    'dell': 1.1,
    'hp': 1.05,
    'lenovo': 1.0,
    'asus': 1.05,
    'acer': 0.95
  };

  const brandMultiplier = brandPremiums[specs.brand] || 1.0;
  basePrice *= brandMultiplier;

  // Quantity discount
  const quantity = specs.quantity || 1;
  let discount = 0;
  if (quantity >= 10) discount = 0.15;
  else if (quantity >= 5) discount = 0.10;
  else if (quantity >= 3) discount = 0.05;

  const subtotal = basePrice * quantity;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  return {
    basePrice: Math.round(basePrice),
    quantity: quantity,
    subtotal: Math.round(subtotal),
    discount: discount * 100,
    discountAmount: Math.round(discountAmount),
    total: Math.round(total),
    breakdown: breakdown,
    warranty: '1 Year Standard Warranty Included',
    delivery: specs.location.toLowerCase().includes('kampala') ? 0 : 50000
  };
}

// Generate quote text for WhatsApp/Email
function generateQuoteText(data, quote) {
  const specs = [
    `Processor: ${data.processor.replace(/_/g, ' ').toUpperCase()}`,
    `RAM: ${data.ram.toUpperCase()}`,
    `Storage: ${data.storage.replace(/_/g, ' ').toUpperCase()}`,
    data.graphics !== 'integrated' ? `Graphics: ${data.graphics.replace(/_/g, ' ').toUpperCase()}` : null,
    data.screen ? `Screen: ${data.screen}` : null,
    `OS: ${data.os.replace(/_/g, ' ').toUpperCase()}`,
    data.brand ? `Brand: ${data.brand.toUpperCase()}` : null
  ].filter(Boolean).join('\n');

  return `
🎯 AVIS IT SOLUTIONS - CUSTOM QUOTE

Dear ${data.name},

Thank you for your quote request!

📋 SPECIFICATIONS:
${specs}

💰 PRICING:
Base Unit Price: UGX ${quote.basePrice.toLocaleString()}
Quantity: ${quote.quantity} unit(s)
Subtotal: UGX ${quote.subtotal.toLocaleString()}
${quote.discount > 0 ? `Discount (${quote.discount}%): -UGX ${quote.discountAmount.toLocaleString()}` : ''}
Delivery (${data.location}): UGX ${quote.delivery.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━
TOTAL: UGX ${(quote.total + quote.delivery).toLocaleString()}
━━━━━━━━━━━━━━━━━━━━

✅ ${quote.warranty}
✅ Professional Setup & Configuration
✅ Free Technical Support (90 days)

📍 Delivery: ${data.location}
⏱️ Lead Time: 2-5 business days

📞 To confirm this order:
Call/WhatsApp: +256 752 052202 / +256 740 596558
Email: info@itsolutionsuganda.com

Reference: ${data.quoteId}

---
AVIS IT Solutions Uganda
Sun City Arcade, Kampala Road
Complete IT Solutions For You
  `.trim();
}

// POST /api/quotes/generate - Generate custom quote
router.post('/generate',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('processor').trim().notEmpty().withMessage('Processor is required'),
    body('ram').trim().notEmpty().withMessage('RAM is required'),
    body('storage').trim().notEmpty().withMessage('Storage is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Valid quantity required'),
    body('usage').trim().notEmpty().withMessage('Usage type is required'),
    body('location').trim().notEmpty().withMessage('Delivery location required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Calculate quote
      const pricing = calculateQuote(req.body);
      
      const quote = {
        quoteId: `QTE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        ...req.body,
        pricing: pricing,
        estimatedPrice: pricing.total + pricing.delivery,
        status: 'pending',
        createdAt: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };

      quotes.push(quote);

      // Generate quote text
      const quoteText = generateQuoteText({ ...req.body, quoteId: quote.quoteId }, pricing);

      // Send via selected method
      const deliveryMethod = req.body.delivery_method || 'email';
      
      // TODO: Integrate with actual email service
      if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        console.log(`📧 Sending email quote to: ${req.body.email}`);
        console.log(quoteText);
        // await sendEmail(req.body.email, 'Your Custom Quote', quoteText);
      }

      // TODO: Integrate with WhatsApp Business API
      if (deliveryMethod === 'whatsapp' || deliveryMethod === 'both') {
        const whatsapp = req.body.whatsapp || req.body.phone;
        console.log(`📱 Sending WhatsApp quote to: ${whatsapp}`);
        console.log(quoteText);
        // await sendWhatsApp(whatsapp, quoteText);
      }

      console.log('✅ Quote generated:', quote.quoteId);

      res.status(201).json({
        success: true,
        message: 'Quote generated successfully',
        quoteId: quote.quoteId,
        estimatedPrice: quote.estimatedPrice,
        pricing: pricing,
        validUntil: quote.validUntil,
        deliveryMethod: deliveryMethod
      });

    } catch (error) {
      console.error('Quote generation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate quote' 
      });
    }
  }
);

// GET /api/quotes - Get all quotes (admin)
router.get('/', async (req, res) => {
  try {
    res.json({ quotes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quotes' });
  }
});

// GET /api/quotes/:quoteId - Get specific quote
router.get('/:quoteId', async (req, res) => {
  try {
    const quote = quotes.find(q => q.quoteId === req.params.quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json({ quote });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quote' });
  }
});

module.exports = router;
