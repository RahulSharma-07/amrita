'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, CheckCircle, School, Mail, Phone, MapPin, Globe, Clock, Camera, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface SchoolSettings {
  schoolName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  principalName: string;
  establishedYear: string;
  affiliation: string;
  schoolTiming: string;
  logo: string;
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState<SchoolSettings>({
    schoolName: 'Shree Amrita Academy',
    email: 'amritaacademy@yahoo.co.in',
    phone: '+91 80530',
    address: 'School Address, City, State',
    website: '',
    principalName: '',
    establishedYear: '',
    affiliation: '',
    schoolTiming: '',
    logo: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('schoolSettings');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem('schoolSettings', JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearAllData = () => {
    if (confirm('WARNING: This will delete ALL data including students, fees, events, gallery, documents, tours, and notices. This cannot be undone. Are you sure?')) {
      localStorage.removeItem('students');
      localStorage.removeItem('fees');
      localStorage.removeItem('calendarEvents');
      localStorage.removeItem('galleryAlbums');
      localStorage.removeItem('documents');
      localStorage.removeItem('tours');
      localStorage.removeItem('notices');
      localStorage.removeItem('heroSlides');
      alert('All data has been cleared. Please refresh the page.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage school settings and configuration</p>
        </div>
        <Button 
          onClick={handleSave}
          className={`flex items-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <School className="w-5 h-5 text-red-600" />
            School Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({...formData, principalName: e.target.value})}
                placeholder="Enter principal name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4" /> Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Globe className="w-4 h-4" /> Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4" /> School Timing
              </label>
              <input
                type="text"
                value={formData.schoolTiming}
                onChange={(e) => setFormData({...formData, schoolTiming: e.target.value})}
                placeholder="e.g., 8:00 AM - 3:00 PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              <input
                type="text"
                value={formData.establishedYear}
                onChange={(e) => setFormData({...formData, establishedYear: e.target.value})}
                placeholder="e.g., 1995"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
                placeholder="e.g., CBSE, State Board"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Address
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Logo & Actions */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-red-600" />
              School Logo
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
              {formData.logo ? (
                <div className="relative">
                  <img src={formData.logo} alt="School Logo" className="max-h-32 mx-auto rounded-lg" />
                  <button
                    onClick={() => setFormData({...formData, logo: ''})}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Click to upload logo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-600" />
              Data Management
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleClearAllData}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
              <p className="text-xs text-gray-500 text-center">
                This will delete all students, fees, events, gallery, documents, tours, and notices.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
