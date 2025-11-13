#!/bin/bash

echo "🚀 Starting Avis IT Solutions Uganda Production Deployment..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Note: Some commands may require sudo privileges"
fi

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js $NODE_VERSION installed"
else
    echo "❌ Node.js not found. Please install Node.js 18 or higher"
    exit 1
fi

# Install dependencies
echo "📥 Installing production dependencies..."
npm ci --production

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs uploads

# Copy environment file if not exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit .env file with your production values!"
    echo "   Run: nano .env"
else
    echo "✅ .env file already exists"
fi

# Check MongoDB
echo "🔍 Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Start it with: sudo systemctl start mongodb"
    fi
else
    echo "⚠️  MongoDB not found. Install it or use Docker deployment"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file: nano .env"
echo "2. Start the server:"
echo "   - With PM2: pm2 start ecosystem.config.js --env production"
echo "   - With Docker: docker-compose up -d"
echo "   - Direct: npm run prod"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
