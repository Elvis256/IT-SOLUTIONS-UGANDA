const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { validateNewsletter, handleValidation } = require('../middleware/validators');
const logger = require('../config/logger');

router.post('/subscribe', validateNewsletter, handleValidation, async (req, res) => {
  try {
    const { email, name } = req.body;

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.subscribed) {
        return res.status(400).json({ message: 'This email is already subscribed.' });
      } else {
        existing.subscribed = true;
        await existing.save();
        return res.json({ message: 'Successfully re-subscribed to newsletter!' });
      }
    }

    const subscriber = new Newsletter({ email, name });
    await subscriber.save();
    logger.info(`Newsletter subscription: ${email}`);

    res.json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    logger.error(`Newsletter error: ${error.message}`);
    res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found.' });
    }

    subscriber.subscribed = false;
    await subscriber.save();
    logger.info(`Newsletter unsubscribe: ${email}`);

    res.json({ message: 'Successfully unsubscribed from newsletter.' });
  } catch (error) {
    logger.error(`Newsletter unsubscribe error: ${error.message}`);
    res.status(500).json({ message: 'Failed to unsubscribe. Please try again later.' });
  }
});

module.exports = router;
