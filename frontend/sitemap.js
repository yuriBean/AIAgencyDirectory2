const fs = require('fs');
const path = require('path');
require('dotenv').config(); 

const baseUrl = process.env.REACT_APP_DOMAIN || 'https://aiagencydirectory.com';

const paths = [
  '/',
  '/signup',
  '/login',
  '/about',
  '/newsletter',
  '/submit',
  '/agencies',
  '/blogs',
  '/payments',
  '/dashboard',
  '/search-results',
  '/fail',
  '/success',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/contact'
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${paths
    .map((path) => `
    <url>
      <loc>${baseUrl}${path}</loc>
    </url>`)
    .join('')}
</urlset>`;

const publicPath = path.join(__dirname, 'public');
if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemapContent, 'utf8');

console.log('✅ Sitemap generated successfully!');
