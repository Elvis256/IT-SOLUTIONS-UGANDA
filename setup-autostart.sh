#!/bin/bash

echo "🚀 Setting up Avis IT Solutions to auto-start on boot..."

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo privileges"
    echo "Running with sudo..."
    sudo "$0" "$@"
    exit $?
fi

SERVICE_FILE="/home/elvis/Downloads/files/avis-it.service"
SYSTEMD_PATH="/etc/systemd/system/avis-it.service"

# Copy service file
echo "📋 Installing systemd service..."
cp "$SERVICE_FILE" "$SYSTEMD_PATH"

# Reload systemd
echo "🔄 Reloading systemd daemon..."
systemctl daemon-reload

# Enable service
echo "✅ Enabling auto-start..."
systemctl enable avis-it.service

# Start service now
echo "🚀 Starting service..."
systemctl start avis-it.service

# Check status
echo ""
echo "📊 Service Status:"
systemctl status avis-it.service --no-pager -l

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Service Commands:"
echo "   Check status:  sudo systemctl status avis-it"
echo "   Start:         sudo systemctl start avis-it"
echo "   Stop:          sudo systemctl stop avis-it"
echo "   Restart:       sudo systemctl restart avis-it"
echo "   View logs:     sudo journalctl -u avis-it -f"
echo "   Disable:       sudo systemctl disable avis-it"
echo ""
echo "🎉 Avis IT Solutions will now start automatically on boot!"
