'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award, BookOpen, Users } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide quality education that nurtures intellectual curiosity, critical thinking, and ethical values in students, preparing them to become responsible global citizens.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To be a leading educational institution recognized for academic excellence, innovative teaching methods, and holistic student development.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Integrity, Excellence, Respect, Innovation, and Social Responsibility form the foundation of our educational philosophy.',
  },
];

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '5000+', label: 'Students Enrolled' },
  { value: '100%', label: 'Qualified Faculty' },
  { value: '50+', label: 'Classrooms' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-red-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            About Shree Amrita Academy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-3xl mx-auto"
          >
            Managed by Shri Bindheshwari Educational Trust, we are committed to providing 
            world-class education with a focus on holistic development.
          </motion.p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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

      {/* Infrastructure */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              World-Class <span className="text-red-600">Infrastructure</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our campus is equipped with modern facilities to provide the best learning environment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Smart Classrooms', desc: 'Technology-enabled interactive learning spaces' },
              { icon: Users, title: 'Science Labs', desc: 'Well-equipped physics, chemistry, and biology labs' },
              { icon: Award, title: 'Sports Facilities', desc: 'Indoor and outdoor sports infrastructure' },
              { icon: BookOpen, title: 'Library', desc: 'Digital library with extensive book collection' },
              { icon: Users, title: 'Computer Lab', desc: 'Modern computer lab with high-speed internet' },
              { icon: Award, title: 'Auditorium', desc: 'Spacious auditorium for events and functions' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Info */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Shri Bindheshwari Educational Trust</h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
              Our institution is managed by Shri Bindheshwari Educational Trust, a registered 
              charitable organization dedicated to providing quality education to students from 
              all walks of life. The trust is committed to nurturing young minds and building 
              a brighter future for the community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="font-bold text-xl mb-2">Excellence</h3>
                <p className="text-sm opacity-80">Committed to academic excellence and innovation</p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Integrity</h3>
                <p className="text-sm opacity-80">Upholding highest standards of ethics and values</p>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Inclusivity</h3>
                <p className="text-sm opacity-80">Education for all, regardless of background</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
