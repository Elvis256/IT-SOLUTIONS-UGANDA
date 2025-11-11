```markdown
# IT Solutions Uganda — Website (Demo)

A focused, responsive website for IT Solutions Uganda — a Kampala-based IT services provider. This repo provides a minimal frontend and a demo Express backend for contact submission.

Key features
- Clear, benefit-driven copy tailored for Ugandan businesses.
- Services, projects and contact sections built for conversion.
- Contact form POSTs to /api/contact (demo; logs to server console).

Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run locally:
   ```bash
   npm start
   ```
   Open http://localhost:3000

Development
- Use auto-reload with nodemon:
  ```bash
  npm run dev
  ```

Production notes
- Replace the demo /api/contact handler with a production integration:
  - Send emails (SendGrid, Postmark) or persist leads to a database/CRM.
  - Add validation, sanitization and spam protection (reCAPTCHA or rate limits).
  - Store API keys and secrets in environment variables.
- Add a real logo, optimized images and organisation contacts.
- Use HTTPS and follow best practices for deployment (Vercel, DigitalOcean, Heroku, etc.).

Next steps I can take
- Integrate /api/contact with SendGrid, Postmark or a CRM (you provide API keys).
- Add analytics, SEO metadata and structured data.
- Convert to a static-site generator or framework (Next.js / Astro) for easier scaling.

```