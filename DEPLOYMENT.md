# AVIS IT Solutions Uganda - Deployment Guide

## Quick Start Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed

#### Steps
1. Configure environment variables:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your production values
   ```

2. Build and start:
   ```bash
   docker-compose up -d
   ```

3. Check status:
   ```bash
   docker-compose ps
   docker-compose logs -f app
   ```

4. Stop:
   ```bash
   docker-compose down
   ```

### Option 2: PM2 Process Manager

#### Prerequisites
- Node.js 18+ installed
- MongoDB running

#### Steps
1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your production values
   ```

3. Start application:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

4. Setup auto-restart on reboot:
   ```bash
   pm2 startup
   pm2 save
   ```

5. Monitor:
   ```bash
   pm2 monit
   pm2 logs avis-it-solutions
   ```

### Option 3: Traditional Node.js

#### Prerequisites
- Node.js 18+ installed
- MongoDB running

#### Steps
1. Install dependencies:
   ```bash
   npm install --production
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   nano .env
   ```

3. Start server:
   ```bash
   NODE_ENV=production node server.js
   ```

## Production Checklist

### Security
- [ ] Change all default passwords in `.env`
- [ ] Generate secure JWT_SECRET and SESSION_SECRET
- [ ] Configure proper EMAIL credentials
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure firewall rules

### Database
- [ ] MongoDB is running and accessible
- [ ] Database credentials are secure
- [ ] Backup strategy in place

### Server Configuration
- [ ] Sufficient RAM (minimum 1GB recommended)
- [ ] Sufficient disk space for uploads and logs
- [ ] Port 3000 is accessible (or configure reverse proxy)

### Monitoring
- [ ] Log rotation configured
- [ ] Server monitoring setup
- [ ] Error alerting configured

## Reverse Proxy Setup (Nginx)

Create `/etc/nginx/sites-available/avis-it`:

```nginx
server {
    listen 80;
    server_name itsolutionsuganda.co.ug www.itsolutionsuganda.co.ug;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        alias /path/to/app/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/avis-it /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d itsolutionsuganda.co.ug -d www.itsolutionsuganda.co.ug
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment mode | production |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/itsolutions_uganda |
| EMAIL_HOST | SMTP server | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email username | noreply@itsolutionsuganda.co.ug |
| EMAIL_PASSWORD | Email app password | your_secure_password |
| ADMIN_EMAIL | Admin login email | admin@itsolutionsuganda.co.ug |
| ADMIN_PASSWORD | Admin password | SecureP@ssw0rd123 |
| JWT_SECRET | JWT signing key | random_64_char_string |
| SESSION_SECRET | Session signing key | random_64_char_string |

## Troubleshooting

### Port already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### MongoDB connection failed
```bash
sudo systemctl status mongodb
sudo systemctl start mongodb
```

### Check logs
```bash
# PM2
pm2 logs avis-it-solutions

# Docker
docker-compose logs -f app

# Direct
tail -f logs/combined.log
```

## Backup Strategy

### Database Backup
```bash
mongodump --db itsolutions_uganda --out /backup/mongodb/$(date +%Y%m%d)
```

### Application Backup
```bash
tar -czf avis-backup-$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='logs' \
  /path/to/app
```

## Support

For deployment assistance, contact:
- Email: info@itsolutionsuganda.co.ug
- GitHub: [Repository URL]
