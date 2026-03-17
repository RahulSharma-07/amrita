import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shreeamritaacademy.com';
  
  const routes = [
    '',
    '/about',
    '/gallery',
    '/admission',
    '/calendar',
    '/downloads',
    '/contact',
    '/tours',
    '/privacy-policy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
