# 🚀 Auto-Start Setup for Avis IT Solutions

## Quick Setup (Run Once)

To make the Avis IT website start automatically when the computer boots:

```bash
cd /home/elvis/Downloads/files
sudo ./setup-autostart.sh
```

Enter your password when prompted.

---

## Manual Setup (If Script Fails)

### Step 1: Copy Service File
```bash
sudo cp /home/elvis/Downloads/files/avis-it.service /etc/systemd/system/
```

### Step 2: Reload Systemd
```bash
sudo systemctl daemon-reload
```

### Step 3: Enable Auto-Start
```bash
sudo systemctl enable avis-it.service
```

### Step 4: Start Service Now
```bash
sudo systemctl start avis-it.service
```

### Step 5: Check Status
```bash
sudo systemctl status avis-it.service
```

---

## Service Management Commands

### Check if running:
```bash
sudo systemctl status avis-it
```

### Start manually:
```bash
sudo systemctl start avis-it
```

### Stop service:
```bash
sudo systemctl stop avis-it
```

### Restart service:
```bash
sudo systemctl restart avis-it
```

### View logs:
```bash
# Live logs (follow)
sudo journalctl -u avis-it -f

# Last 50 lines
sudo journalctl -u avis-it -n 50

# Today's logs
sudo journalctl -u avis-it --since today
```

### Disable auto-start:
```bash
sudo systemctl disable avis-it
```

---

## Verify Auto-Start Works

### Test 1: Check if enabled
```bash
sudo systemctl is-enabled avis-it
```
Should output: `enabled`

### Test 2: Check if running
```bash
sudo systemctl is-active avis-it
```
Should output: `active`

### Test 3: Access website
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"ok",...}`

### Test 4: Reboot test
```bash
# Reboot computer
sudo reboot

# After reboot, check status
sudo systemctl status avis-it
curl http://localhost:3000
```

---

## Troubleshooting

### Service won't start?
1. Check logs:
   ```bash
   sudo journalctl -u avis-it -n 50
   ```

2. Check Node.js is installed:
   ```bash
   node --version
   ```

3. Test manually:
   ```bash
   cd /home/elvis/Downloads/files
   node server.js
   ```

### Port 3000 already in use?
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Restart service
sudo systemctl restart avis-it
```

### MongoDB not running?
```bash
# Start MongoDB (if installed)
sudo systemctl start mongodb

# Or use Docker Compose
cd /home/elvis/Downloads/files
docker-compose up -d mongodb
```

---

## What Happens on Boot

1. **Computer starts** → Ubuntu boots
2. **Network ready** → Systemd waits for network
3. **Service starts** → Avis IT application launches
4. **Server running** → Website accessible at http://localhost:3000
5. **Auto-restart** → If crashes, restarts automatically after 10 seconds

---

## Service Configuration

The service file is located at:
- **Development:** `/home/elvis/Downloads/files/avis-it.service`
- **System:** `/etc/systemd/system/avis-it.service`

Key settings:
- **User:** elvis
- **Working Dir:** /home/elvis/Downloads/files
- **Auto-restart:** Yes (on failure)
- **Logs:** /home/elvis/Downloads/files/logs/
- **Environment:** NODE_ENV=production

---

## Alternative: PM2 Auto-Start

If systemd doesn't work, use PM2:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
cd /home/elvis/Downloads/files
pm2 start ecosystem.config.js --env production

# Save current process list
pm2 save

# Generate startup script
pm2 startup systemd -u elvis --hp /home/elvis

# Copy and run the generated command
```

---

## Logs Location

Application logs are stored in:
- **App logs:** `/home/elvis/Downloads/files/logs/app.log`
- **Error logs:** `/home/elvis/Downloads/files/logs/error.log`
- **System logs:** `sudo journalctl -u avis-it`

View live logs:
```bash
# Application logs
tail -f /home/elvis/Downloads/files/logs/app.log

# System logs
sudo journalctl -u avis-it -f
```

---

## Uninstall Auto-Start

If you want to remove auto-start:

```bash
# Stop and disable service
sudo systemctl stop avis-it
sudo systemctl disable avis-it

# Remove service file
sudo rm /etc/systemd/system/avis-it.service

# Reload systemd
sudo systemctl daemon-reload
```

---

## ✅ Success Checklist

After setup, verify:
- [ ] `sudo systemctl status avis-it` shows "active (running)"
- [ ] `curl http://localhost:3000` returns HTML
- [ ] `curl http://localhost:3000/api/health` returns JSON
- [ ] Logs show no errors: `sudo journalctl -u avis-it -n 20`
- [ ] Service enabled: `sudo systemctl is-enabled avis-it` returns "enabled"

---

## Quick Reference Card

```bash
# Setup (run once)
cd /home/elvis/Downloads/files && sudo ./setup-autostart.sh

# Daily operations
sudo systemctl status avis-it    # Check status
sudo systemctl restart avis-it   # Restart
sudo journalctl -u avis-it -f    # View logs

# Access website
http://localhost:3000

# Health check
curl http://localhost:3000/api/health
```

---

**Your Avis IT Solutions website will now start automatically on every boot! 🎉**

*Setup file: `/home/elvis/Downloads/files/setup-autostart.sh`*
