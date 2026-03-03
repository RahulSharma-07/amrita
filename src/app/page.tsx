'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Shield, 
  Lightbulb, 
  Heart,
  Bus,
  Utensils,
  Video,
  Stethoscope,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';

// Hero Slider Component
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSlides = () => {
    try {
      const savedSlides = localStorage.getItem('heroSlides');
      console.log('Homepage - Loading slides from localStorage:', savedSlides);
      if (savedSlides) {
        const parsed = JSON.parse(savedSlides);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Homepage - Loaded slides:', parsed.length);
          setSlides(parsed);
        } else {
          console.log('Homepage - No slides found, using defaults');
          setDefaultSlides();
        }
      } else {
        console.log('Homepage - No localStorage data, using defaults');
        setDefaultSlides();
      }
    } catch (error) {
      console.error('Homepage - Error loading slides:', error);
      setDefaultSlides();
    }
    setIsLoaded(true);
  };

  const setDefaultSlides = () => {
    setSlides([
      {
        imageUrl: '',
        title: 'Welcome to Shree Amrita Academy',
        subtitle: 'Nurturing Minds, Building Futures',
        buttonText: 'Apply Now',
      },
      {
        imageUrl: '',
        title: 'Admission Open 2026-2027',
        subtitle: 'Enroll Your Child for a Bright Future',
        buttonText: 'Apply Now',
      },
    ]);
  };

  useEffect(() => {
    loadSlides();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'heroSlides') {
        console.log('Homepage - Storage changed, reloading slides');
        loadSlides();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Reload when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Homepage - Page visible, reloading slides');
        loadSlides();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Reload on window focus
    const handleFocus = () => {
      console.log('Homepage - Window focused, reloading slides');
      loadSlides();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!isLoaded || slides.length === 0) {
    return (
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-r from-blue-900 to-red-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold bg-gradient-to-br from-red-600 to-blue-700 bg-clip-text text-transparent">SAA</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Shree Amrita Academy</h1>
            <p className="text-xl md:text-2xl opacity-90">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : 'linear-gradient(to right, #1e3a8a, #7f1d1d)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-red-900/80" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white max-w-2xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-br from-red-600 to-blue-700 bg-clip-text text-transparent">
                    SAA
                  </span>
                </div>
                <div>
                  <p className="text-sm opacity-90">Managed by</p>
                  <p className="font-medium">Shri Bindheshwari Educational Trust</p>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admission">
                  <Button size="lg" className="w-full sm:w-auto">
                    {slide.buttonText || 'Apply Now'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// Synopsis Section
const synopsisItems = [
  {
    icon: Lightbulb,
    title: 'Resourceful Ecosystem',
    description: 'International Standard Infrastructure, Intelligent Interactive Panel, STEM Curriculum, Cutting Edge Labs, Inclusive Education Support.',
  },
  {
    icon: Heart,
    title: 'Motivational Learning',
    description: 'Experiential Learning, VLE, Field Trips, Meditation & Yoga, Learning By Doing.',
  },
  {
    icon: GraduationCap,
    title: 'Pedagogy',
    description: 'Student Centric Curriculum, Active Learning, Thematic Teaching, Project Based Learning.',
  },
  {
    icon: Shield,
    title: 'Supplementary Services',
    description: 'Parent Communication Portal, Healthy Diet, CCTV + GPS, Counselor, Medical Support, Transport.',
  },
];

function SynopsisSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-red-600">Shree Amrita Academy</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide a comprehensive learning environment that nurtures academic excellence and holistic development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {synopsisItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-blue-100 rounded-xl flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
const features = [
  { icon: Users, title: 'Expert Faculty', description: 'Highly qualified and experienced teachers dedicated to student success.' },
  { icon: BookOpen, title: 'Modern Library', description: 'Well-stocked library with digital resources and reading spaces.' },
  { icon: Video, title: 'Smart Classes', description: 'Technology-enabled classrooms with interactive learning tools.' },
  { icon: Bus, title: 'Safe Transport', description: 'GPS-enabled buses with trained staff for safe commuting.' },
  { icon: Utensils, title: 'Healthy Meals', description: 'Nutritious and balanced meals prepared in hygienic kitchens.' },
  { icon: Stethoscope, title: 'Medical Care', description: 'On-campus medical facility with qualified healthcare professionals.' },
];

function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Facilities</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            State-of-the-art facilities designed to provide the best learning experience for our students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-red-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Admission Open for 2026-2027
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Give your child the gift of quality education. Limited seats available. Apply now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admission">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Apply Online Now
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Stats Section
const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '5000+', label: 'Students Enrolled' },
  { value: '100+', label: 'Expert Faculty' },
  { value: '98%', label: 'Success Rate' },
];

function StatsSection() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Home Page
export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <SynopsisSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
