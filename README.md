# IT Solutions Uganda - Complete Website

A comprehensive, production-ready website for IT Solutions Uganda with full backend functionality, admin dashboard, blog system, and more.

## 🌟 Features

### Frontend
- ✅ Four Liquid Glass Themes (Blue, Purple, Green, Gray)
- ✅ Modern responsive design
- ✅ Service showcase with auto-quote generator
- ✅ Order management system
- ✅ Appointment booking system
- ✅ Project portfolio  
- ✅ Blog with categories and pagination
- ✅ Testimonials system
- ✅ Newsletter subscription
- ✅ FAQ section
- ✅ Contact form with validation
- ✅ Mobile-friendly navigation

### Backend
- ✅ Express.js server with security best practices
- ✅ MongoDB database integration
- ✅ Email & WhatsApp notifications (Nodemailer)
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS and Helmet security
- ✅ Request logging (Winston & Morgan)
- ✅ Environment-based configuration

### Admin Dashboard
- ✅ Secure authentication (JWT)
- ✅ Dashboard with statistics
- ✅ Contact management
- ✅ Order management
- ✅ Appointment management
- ✅ Quote management
- ✅ Blog post management
- ✅ Testimonial approval system
- ✅ Newsletter subscriber list

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run setup script:**
   ```bash
   ./setup.sh
   ```

4. **Start server:**
   ```bash
   npm start
   ```

5. **Access:**
   - Main site: http://localhost:3000
   - Admin: http://localhost:3000/admin.html

## 📦 Deployment Options

### Option 1: Docker (Recommended)
```bash
docker-compose up -d
```

### Option 2: PM2 Process Manager
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
```

### Option 3: Traditional Node.js
```bash
NODE_ENV=production node server.js
```

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.**

## Configuration

Update `.env` with:
- MongoDB connection
- Email credentials (Gmail app password recommended)
- Admin login credentials
- JWT secrets

See `.env.example` for all options.

## API Endpoints

### Public
- `POST /api/contact` - Contact form
- `POST /api/newsletter/subscribe` - Newsletter
- `GET /api/blog` - Blog posts
- `GET /api/testimonials/featured` - Testimonials

### Admin (Auth Required)
- `POST /api/admin/login` - Login
- `GET /api/admin/dashboard` - Stats
- `GET /api/admin/contacts` - Contacts
- `POST /api/admin/blogs` - Create blog

## Security Features

- Helmet.js security headers
- Rate limiting
- Input validation
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration

## Support

Email: info@itsolutionsuganda.co.ug  
Phone: +256 700 000 000

## License

MIT License © 2025 IT Solutions Uganda
