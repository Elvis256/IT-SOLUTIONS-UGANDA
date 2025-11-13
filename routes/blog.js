const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const logger = require('../config/logger');

router.get('/', async (req, res) => {
  try {
    const { category, tag, limit = 10, page = 1 } = req.query;
    const query = { published: true };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content');

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Blog list error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    logger.error(`Blog detail error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch blog post' });
  }
});

module.exports = router;
