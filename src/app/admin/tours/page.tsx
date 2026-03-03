'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Save, X, Trash2, Edit, Search, Bus, Camera } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Tour {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  cost: number;
  description: string;
  image: string;
}

export default function ToursPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
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
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tours', JSON.stringify(tours));
    }
  }, [tours, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tourData = {
      title: formData.title,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      cost: parseInt(formData.cost) || 0,
      description: formData.description,
      image: formData.image,
    };
    if (editingTour) {
      setTours(tours.map(t => t._id === editingTour._id ? { ...t, ...tourData } : t));
      setEditingTour(null);
    } else {
      const newTour: Tour = {
        _id: Date.now().toString(),
        ...tourData,
      };
      setTours([...tours, newTour]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      destination: tour.destination,
      startDate: tour.startDate,
      endDate: tour.endDate,
      cost: tour.cost.toString(),
      description: tour.description,
      image: tour.image || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      setTours(tours.filter(t => t._id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', destination: '', startDate: '', endDate: '', cost: '', description: '', image: '' });
    setEditingTour(null);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredTours = tours.filter(tour => 
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingTours = filteredTours.filter(t => new Date(t.startDate) >= new Date());
  const pastTours = filteredTours.filter(t => new Date(t.startDate) < new Date());

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

  const totalRevenue = tours.reduce((sum, t) => sum + (t.cost || 0), 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Management</h1>
          <p className="text-gray-600">Manage educational tours and trips</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Tour
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Tours</p>
          <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">{upcomingTours.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Past Tours</p>
          <p className="text-2xl font-bold text-gray-600">{pastTours.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Search */}
      {tours.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search tours by title or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {tours.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tours</h3>
          <p className="text-gray-500 mb-4">Click "Add Tour" to create educational tours.</p>
          <Button onClick={() => setIsModalOpen(true)}>Add First Tour</Button>
        </div>
      ) : (
        <>
          {/* Upcoming Tours */}
          {upcomingTours.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-green-600" />
                Upcoming Tours ({upcomingTours.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTours.map((tour) => (
                  <motion.div 
                    key={tour._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {tour.image && (
                      <div className="h-40 bg-gray-100">
                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{tour.title}</h3>
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(tour)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(tour._id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-1"><MapPin className="w-4 h-4 inline mr-1" /> {tour.destination}</p>
                      <p className="text-sm text-gray-500 mb-1">{new Date(tour.startDate).toLocaleDateString('en-IN')} to {new Date(tour.endDate).toLocaleDateString('en-IN')}</p>
                      <p className="text-red-600 font-medium">₹{tour.cost.toLocaleString()}</p>
                      {tour.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tour.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past Tours */}
          {pastTours.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Tours ({pastTours.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastTours.map((tour) => (
                  <motion.div 
                    key={tour._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg shadow overflow-hidden opacity-75"
                  >
                    {tour.image && (
                      <div className="h-40 bg-gray-100">
                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover grayscale" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-700">{tour.title}</h3>
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(tour)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(tour._id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="text-gray-500 mb-1"><MapPin className="w-4 h-4 inline mr-1" /> {tour.destination}</p>
                      <p className="text-sm text-gray-400 mb-1">{new Date(tour.startDate).toLocaleDateString('en-IN')} to {new Date(tour.endDate).toLocaleDateString('en-IN')}</p>
                      <p className="text-gray-600 font-medium">₹{tour.cost.toLocaleString()}</p>
                      {tour.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{tour.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTour ? 'Edit Tour' : 'Add Educational Tour'}>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tour Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
              {formData.image ? (
                <div className="relative">
                  <img src={formData.image} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, image: ''})}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Click to upload tour image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
