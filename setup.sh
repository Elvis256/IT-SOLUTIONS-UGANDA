#!/bin/bash
# Setup script for IT Solutions Uganda website

echo "Setting up IT Solutions Uganda website..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y mongodb
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
else
    echo "✓ MongoDB is already installed"
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    sudo systemctl start mongodb
else
    echo "✓ MongoDB is running"
fi

# Create admin user
echo ""
echo "Creating admin user..."
node << 'SCRIPT'
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log('✓ Admin user already exists');
    } else {
      const admin = new User({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      await admin.save();
      console.log('✓ Admin user created successfully');
      console.log('  Email:', process.env.ADMIN_EMAIL);
      console.log('  Password:', process.env.ADMIN_PASSWORD);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
SCRIPT

# Create sample blog post
echo ""
echo "Creating sample blog post..."
node << 'SCRIPT'
require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

async function createSampleBlog() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existing = await Blog.findOne({ slug: 'welcome-to-it-solutions-uganda' });
    if (!existing) {
      const blog = new Blog({
        title: 'Welcome to IT Solutions Uganda',
        slug: 'welcome-to-it-solutions-uganda',
        excerpt: 'Your trusted partner for IT services, cloud solutions, and digital transformation in Uganda.',
        content: `
          <h2>Empowering Businesses Through Technology</h2>
          <p>Welcome to IT Solutions Uganda, your trusted partner for comprehensive IT services and solutions. We're excited to launch our new blog where we'll share insights, tips, and updates about technology trends in Uganda and beyond.</p>
          
          <h3>What We Offer</h3>
          <ul>
            <li>Managed IT Support</li>
            <li>Cloud Migration & Infrastructure</li>
            <li>Network Design & Security</li>
            <li>Custom Software Development</li>
            <li>Payment Gateway Integration</li>
          </ul>
          
          <h3>Why Choose Us?</h3>
          <p>We understand the unique challenges facing businesses in Uganda. Our team combines international best practices with local expertise to deliver practical, cost-effective solutions that drive real results.</p>
          
          <p>Stay tuned for more updates, tutorials, and insights!</p>
        `,
        category: 'Business',
        tags: ['introduction', 'services', 'technology'],
        published: true,
        author: 'IT Solutions Uganda'
      });
      await blog.save();
      console.log('✓ Sample blog post created');
    } else {
      console.log('✓ Sample blog post already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating blog:', error.message);
    process.exit(1);
  }
}

createSampleBlog();
SCRIPT

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your email credentials"
echo "2. Access admin dashboard at http://localhost:3000/admin.html"
echo "3. Login with credentials from .env file"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
