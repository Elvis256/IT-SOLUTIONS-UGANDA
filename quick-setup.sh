#!/bin/bash

# Quick Auto-Start Setup for Avis IT Solutions
# Run this with: bash quick-setup.sh

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║       🚀 SETTING UP AUTO-START FOR AVIS IT SOLUTIONS         ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Stop any running instance first
echo "1️⃣  Stopping current server..."
pkill -f "node server.js" 2>/dev/null
sleep 2

# Copy service file
echo "2️⃣  Installing systemd service..."
sudo cp /home/elvis/Downloads/files/avis-it.service /etc/systemd/system/

# Reload systemd
echo "3️⃣  Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable service
echo "4️⃣  Enabling auto-start..."
sudo systemctl enable avis-it.service

# Start service
echo "5️⃣  Starting service now..."
sudo systemctl start avis-it.service

# Wait a moment
sleep 3

# Check status
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP COMPLETE!                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Verify it's running
if sudo systemctl is-active --quiet avis-it; then
    echo "✅ Service is ACTIVE and RUNNING"
    echo "✅ Auto-start is ENABLED"
    echo ""
    echo "🌐 Website is now live at: http://localhost:3000"
    echo ""
    echo "🎉 Your website will start automatically on every boot!"
else
    echo "⚠️  Service may not be running. Check with:"
    echo "   sudo systemctl status avis-it"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Useful Commands:"
echo "   Check status:  sudo systemctl status avis-it"
echo "   View logs:     sudo journalctl -u avis-it -f"
echo "   Restart:       sudo systemctl restart avis-it"
echo "   Stop:          sudo systemctl stop avis-it"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
