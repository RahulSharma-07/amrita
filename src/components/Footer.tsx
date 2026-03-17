'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/faculty', label: 'Faculty' },
  { href: '/gallery', label: 'Event Gallery' },
  { href: '/contact', label: 'Contact Us' },
];

const resourceLinks = [
  { href: '/admission', label: 'Admission Form' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/calendar', label: 'School Calendar' },
  { href: '/tours', label: 'Tours & Travels' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                SAA
              </div>
              <div>
                <h3 className="font-bold text-lg">Shree Amrita Academy</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Managed by Shri Bindheshwari Educational Trust, we are committed to providing quality education and nurturing future leaders.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/shreeamritaacademy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/shreeamritaacademy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/shreeamritaacademy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                <span>Plot No. 36 to 40, Pushpvatika Society, Nr. Gadkhol Patia, Ankleshwar</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0 text-red-500" />
                <span>+91 92277 80530</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-red-500" />
                <span>amritaacademy@yahoo.co.in</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-5 h-5 mr-2 flex-shrink-0 text-red-500" />
                <span>Mon - Sat: 8:00 AM To 4:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Shree Amrita Academy. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/admin/login" className="hover:text-white transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
