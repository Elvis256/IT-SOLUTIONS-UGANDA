const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const { auth, adminAuth } = require('../middleware/auth');
const { validateBlog, handleValidation } = require('../middleware/validators');
const logger = require('../config/logger');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`Admin login: ${email}`);
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Dashboard stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const [contacts, newsletters, blogs, testimonials] = await Promise.all([
      Contact.countDocuments(),
      Newsletter.countDocuments({ subscribed: true }),
      Blog.countDocuments(),
      Testimonial.countDocuments({ approved: true }),
    ]);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email message status createdAt');

    res.json({
      stats: {
        contacts,
        newsletters,
        blogs,
        testimonials,
      },
      recentContacts,
    });
  } catch (error) {
    logger.error(`Dashboard error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Contacts management
router.get('/contacts', auth, adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    
    const skip = (page - 1) * limit;
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Contacts list error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

router.patch('/contacts/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    logger.error(`Contact update error: ${error.message}`);
    res.status(500).json({ message: 'Failed to update contact' });
  }
});

// Blog management
router.post('/blogs', auth, adminAuth, validateBlog, handleValidation, async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    logger.info(`Blog created: ${blog.title}`);
    res.status(201).json(blog);
  } catch (error) {
    logger.error(`Blog creation error: ${error.message}`);
    res.status(500).json({ message: 'Failed to create blog' });
  }
});

router.get('/blogs', auth, adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    logger.error(`Blogs list error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

router.patch('/blogs/:id', auth, adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    logger.error(`Blog update error: ${error.message}`);
    res.status(500).json({ message: 'Failed to update blog' });
  }
});

router.delete('/blogs/:id', auth, adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    logger.info(`Blog deleted: ${blog.title}`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    logger.error(`Blog deletion error: ${error.message}`);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
});

// Testimonials management
router.get('/testimonials', auth, adminAuth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    logger.error(`Admin testimonials error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

router.patch('/testimonials/:id', auth, adminAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    logger.error(`Testimonial update error: ${error.message}`);
    res.status(500).json({ message: 'Failed to update testimonial' });
  }
});

// Newsletter subscribers
router.get('/newsletters', auth, adminAuth, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    logger.error(`Newsletter list error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

module.exports = router;
