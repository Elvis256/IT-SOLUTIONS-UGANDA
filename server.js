// Minimal Express server to serve the static site and accept contact submissions.
// Note: This endpoint is a demo. Replace with production integrations for email/CRM storage.
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Simple contact endpoint (demo only)
app.post('/api/contact', (req, res) => {
  const { name, email, phone, location, company, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields (name, email, message).' });
  }

  // TODO (production): validate, sanitize, persist to DB and notify via email/CRM.
  console.log('Contact received:', { name, email, phone, location, company, message });

  return res.json({ message: 'Thanks — your request has been received. We will respond within one business day.' });
});

app.listen(port, () => {
  console.log(`IT Solutions Uganda site running at http://localhost:${port}`);
});