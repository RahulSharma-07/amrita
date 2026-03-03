// Test script to add slides to localStorage
const testSlides = [
  {
    id: 'slide_1',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
    title: 'Welcome to Shree Amrita Academy',
    subtitle: 'Nurturing Minds, Building Futures Since 1995',
    buttonText: 'Apply Now',
    buttonLink: '/admission'
  },
  {
    id: 'slide_2',
    imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200',
    title: 'Admission Open 2026-2027',
    subtitle: 'Enroll Your Child for a Bright Future with Quality Education',
    buttonText: 'Apply Now',
    buttonLink: '/admission'
  },
  {
    id: 'slide_3',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    title: 'Experienced Faculty Team',
    subtitle: 'Learn from Qualified Teachers with 20+ Years of Experience',
    buttonText: 'Meet Our Faculty',
    buttonLink: '/faculty'
  }
];

// Save to localStorage
localStorage.setItem('heroSlides', JSON.stringify(testSlides));
console.log('Test slides added to localStorage');

// Dispatch storage event to notify other components
window.dispatchEvent(new StorageEvent('storage', { key: 'heroSlides' }));

// Verify
const saved = localStorage.getItem('heroSlides');
console.log('Saved slides:', JSON.parse(saved));