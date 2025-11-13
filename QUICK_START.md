# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js installed ✓
- MongoDB (optional for basic testing)

## 1. Install & Start (2 minutes)

```bash
cd ~/Downloads/files
npm install  # Already done
npm start    # Server is running!
```

## 2. Access the Site

Open your browser:
- **Homepage**: http://localhost:3000
- **Blog**: http://localhost:3000/blog.html
- **FAQ**: http://localhost:3000/faq.html
- **Admin**: http://localhost:3000/admin.html

## 3. Admin Login

Default credentials (from .env):
- Email: `admin@itsolutionsuganda.co.ug`
- Password: `changeme123`

## 4. Test Features

### Without MongoDB (Limited Mode)
- ✅ View all pages
- ✅ Test UI interactions
- ❌ Forms won't save (no database)

### With MongoDB (Full Features)

**Install MongoDB:**
```bash
sudo apt-get update
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Then restart server:**
```bash
pkill -f "node.*server.js"
npm start
```

Now all features work! 🎉

## 5. Configure Email (Optional)

Update `.env`:
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

Get Gmail App Password:
1. Enable 2FA: https://myaccount.google.com/security
2. Generate password: https://myaccount.google.com/apppasswords
3. Restart server

## What's Working Right Now

✅ Frontend fully functional
✅ All pages accessible
✅ Contact form UI
✅ Newsletter form
✅ Blog page (will show sample data with MongoDB)
✅ Admin dashboard (requires MongoDB)
✅ Security features active

## Next Steps

1. **Install MongoDB** for full functionality
2. **Configure email** for notifications
3. **Update .env** with your credentials
4. **Run setup.sh** to create admin user

## Need Help?

Check `IMPLEMENTATION_COMPLETE.md` for full documentation.

**Server Status**: Running on http://localhost:3000 🟢
