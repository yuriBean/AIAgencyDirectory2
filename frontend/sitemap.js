const fs = require('fs');

const baseUrl = process.env.REACT_APP_DOMAIN || 'https://aiagencydirectory.com'; 
const paths = [
  '/',
  '/signup',
  '/login',
  '/about',
  '/newsletter',
  '/submit',
  '/agencies',
  '/agency/:agencyId',
  '/blogs',
  '/blog/:slug',
  '/payments',
  '/dashboard',
  '/edit-agency/:agencyId',
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
    .map((path) => {
      if (path.includes(':')) return ''; 
      return `
    <url>
      <loc>${baseUrl}${path}</loc>
    </url>`;
    })
    .join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemapContent);

console.log('Sitemap generated successfully!');