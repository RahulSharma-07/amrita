'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Save, X, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/ui/ImageUpload';

export default function ToursPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tours, setTours] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    cost: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('tours');
    if (saved) setTours(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tours', JSON.stringify(tours));
  }, [tours]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTour = {
      _id: Date.now().toString(),
      ...formData,
      cost: parseInt(formData.cost) || 0,
    };
    if (!formData.image) {
      delete (newTour as any).image;
    }
    setTours([...tours, newTour]);
    setFormData({ title: '', destination: '', startDate: '', endDate: '', cost: '', description: '', image: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTours(tours.filter(t => t._id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tour Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Plus className="w-4 h-4" /> Add Tour
        </button>
      </div>

      {tours.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tours</h3>
          <p className="text-gray-500 mb-4">Click "Add Tour" to create educational tours.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg shadow overflow-hidden">
              {tour.image && (
                <div className="h-32 bg-gray-100">
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{tour.title}</h3>
                <button onClick={() => handleDelete(tour._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-gray-600 mb-1"><MapPin className="w-4 h-4 inline mr-1" /> {tour.destination}</p>
              <p className="text-sm text-gray-500 mb-1">{tour.startDate} to {tour.endDate}</p>
              <p className="text-red-600 font-medium">₹{tour.cost}</p>
              {tour.description && <p className="text-sm text-gray-500 mt-2">{tour.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Educational Tour">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
            <input type="text" required value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost (₹) *</label>
            <input type="number" required value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({...formData, image: value})}
            label="Tour Image"
          />
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
