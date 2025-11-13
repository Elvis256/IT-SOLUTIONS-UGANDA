const { body, validationResult } = require('express-validator');

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone').optional().trim()
    .matches(/^[+]?[\d\s()-]+$/).withMessage('Invalid phone format'),
  body('location').optional().trim().isLength({ max: 100 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters'),
];

const validateNewsletter = [
  body('email').trim().isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('name').optional().trim().isLength({ max: 100 }),
];

const validateBlog = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }),
  body('slug').trim().notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with hyphens'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required')
    .isLength({ min: 20, max: 300 }),
  body('content').trim().notEmpty().withMessage('Content is required')
    .isLength({ min: 100 }),
  body('category').optional().isIn(['Technology', 'Cloud', 'Security', 'Business', 'Tutorial']),
  body('tags').optional().isArray(),
];

const validateTestimonial = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('position').optional().trim().isLength({ max: 100 }),
  body('testimonial').trim().notEmpty().withMessage('Testimonial is required')
    .isLength({ min: 20, max: 1000 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateContact,
  validateNewsletter,
  validateBlog,
  validateTestimonial,
  handleValidation,
};
