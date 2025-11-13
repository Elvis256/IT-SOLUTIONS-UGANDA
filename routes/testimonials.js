const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { validateTestimonial, handleValidation } = require('../middleware/validators');
const logger = require('../config/logger');

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(testimonials);
  } catch (error) {
    logger.error(`Testimonials list error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(testimonials);
  } catch (error) {
    logger.error(`Featured testimonials error: ${error.message}`);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

router.post('/', validateTestimonial, handleValidation, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    logger.info(`New testimonial submitted: ${req.body.name}`);

    res.json({ 
      message: 'Thank you for your feedback! Your testimonial is under review.' 
    });
  } catch (error) {
    logger.error(`Testimonial submission error: ${error.message}`);
    res.status(500).json({ message: 'Failed to submit testimonial' });
  }
});

module.exports = router;
