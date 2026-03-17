import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shree Amrita Academy',
    short_name: 'SAA',
    description: 'Excellence in Education - Managed by Shri Bindheshwari Educational Trust',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#135bec',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
