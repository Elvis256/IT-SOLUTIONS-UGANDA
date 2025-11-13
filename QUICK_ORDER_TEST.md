# 🚀 Quick Test Guide - Order System

## Test the Order Form Right Now!

### Step 1: Open Website
```
http://localhost:3000
```

### Step 2: Click "Order Now"
Scroll to **"Shop Our Products"** section and click **"Order Now"** on any product (Laptop, Desktop, Printer, or Network Equipment)

### Step 3: Fill the Form

**Your Information:**
- Name: `Test Customer`
- Phone: `+256 700 123 456`
- Email: `your-email@example.com`
- WhatsApp: `+256 700 123 456`

**Device Specifications:**
- Product Category: (Auto-filled)
- Brand: `HP`
- Processor: `Intel Core i5`
- RAM: `16GB`
- Storage: `512GB SSD`
- Screen: `15.6 inch`
- Graphics: `Integrated Graphics`
- OS: `Windows 11`

**Additional Requirements:**
- Quantity: `1`
- Intended Use: `Office Work`
- Budget: `2,000,000 - 3,000,000`
- Location: `Kampala Central`
- Notes: `Need warranty and mouse`

**Quote Delivery:**
- Select: `📧💬 Both` (Email & WhatsApp)

### Step 4: Click "Generate Quote"

### Step 5: Check Results
- ✅ Success message appears with Order ID
- ✅ Total price calculated (e.g., UGX 2,900,000)
- ✅ Email sent confirmation
- ✅ WhatsApp link button appears
- ✅ Click WhatsApp button to see formatted quote

---

## Expected Quotation Example

**Email will contain:**
```
🎉 YOUR CUSTOM IT QUOTE
Avis IT Solutions Uganda

Customer: Test Customer
Phone: +256 700 123 456
Location: Kampala Central

SPECIFICATIONS:
- Processor: Intel Core i5
- RAM: 16GB
- Storage: 512GB SSD
- Graphics: Integrated
- OS: Windows 11

PRICING:
Unit Price: UGX 2,900,000
Quantity: 1
TOTAL: UGX 2,900,000
```

**WhatsApp will show similar formatted message**

---

## Verify Email Setup

If email doesn't arrive:
1. Check `.env` file has correct email settings
2. Check spam/junk folder
3. Verify EMAIL_PASSWORD is app password (not regular password)
4. Test email configuration:
   ```bash
   cd /home/elvis/Downloads/files
   node -e "require('./config/database'); console.log('Email config OK')"
   ```

---

## Common Test Scenarios

### Scenario 1: Gaming Laptop
- Processor: Intel Core i7
- RAM: 32GB
- Storage: 1TB SSD
- Graphics: NVIDIA RTX
- Expected: ~5,000,000+ UGX

### Scenario 2: Basic Office Desktop
- Processor: Intel Core i3
- RAM: 8GB
- Storage: 256GB SSD
- Graphics: Integrated
- Expected: ~2,000,000 UGX

### Scenario 3: Developer Workstation
- Processor: AMD Ryzen 7
- RAM: 32GB
- Storage: 1TB SSD
- Graphics: AMD Radeon
- Expected: ~4,500,000 UGX

---

## Quick Check Commands

```bash
# Check server is running
curl http://localhost:3000/api/health

# View recent orders (in browser console or API tool)
curl http://localhost:3000/api/orders

# Restart server if needed
pkill -f "node server.js" && cd /home/elvis/Downloads/files && node server.js &
```

---

## 🎉 Success Indicators

You know it's working when:
- ✅ Form opens when clicking "Order Now"
- ✅ Product name is pre-filled
- ✅ All fields are available
- ✅ Submit shows success message
- ✅ Order ID is generated
- ✅ Price is calculated
- ✅ Email/WhatsApp confirmation shown

---

**Test it now at:** http://localhost:3000

**Documentation:** See ORDER_SYSTEM_COMPLETE.md for full details
