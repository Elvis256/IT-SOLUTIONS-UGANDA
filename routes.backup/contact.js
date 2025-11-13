const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { validateContact, handleValidation } = require('../middleware/validators');
const { sendContactNotification, sendContactConfirmation } = require('../config/email');
const logger = require('../config/logger');

router.post('/', validateContact, handleValidation, async (req, res) => {
  try {
    const { name, email, phone, location, company, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      location,
      company,
      message,
    });

    await contact.save();
    logger.info(`Contact form submitted: ${email}`);

    // Send notifications (non-blocking)
    Promise.all([
      sendContactNotification(contact).catch(err => 
        logger.error(`Failed to send admin notification: ${err.message}`)
      ),
      sendContactConfirmation(email, name).catch(err => 
        logger.error(`Failed to send confirmation email: ${err.message}`)
      ),
    ]);

    res.json({ 
      message: 'Thanks — your request has been received. We will respond within one business day.' 
    });
  } catch (error) {
    logger.error(`Contact form error: ${error.message}`);
    res.status(500).json({ 
      message: 'There was an error processing your request. Please try again later.' 
    });
  }
});

module.exports = router;
