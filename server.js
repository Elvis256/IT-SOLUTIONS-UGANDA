const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '/')));

// Simple contact endpoint (demo only)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields (name, email, message).' });
  }
  console.log('Contact received:', { name, email, message });
  return res.json({ message: 'Thanks — your request has been received. We will respond within one business day.' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// Export for Vercel serverless
module.exports = app;

// Start server only in non-serverless environment
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 IT Solutions Uganda running at http://localhost:${port}`);
  });
}