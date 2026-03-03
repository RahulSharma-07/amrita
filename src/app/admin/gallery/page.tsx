'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Plus, Save, X, Trash2, Edit, Search, Camera, FolderOpen } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface GalleryAlbum {
  _id: string;
  name: string;
  category: 'Events' | 'Sports' | 'Academic' | 'Cultural' | 'Infrastructure' | 'Others';
  description: string;
  coverImage: string;
  images: string[];
  createdAt: string;
}

export default function GalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    category: 'Events' | 'Sports' | 'Academic' | 'Cultural' | 'Infrastructure' | 'Others';
    description: string;
    coverImage: string;
  }>({
    name: '',
    category: 'Events',
    description: '',
    coverImage: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('galleryAlbums');
    if (saved) setAlbums(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('galleryAlbums', JSON.stringify(albums));
    }
  }, [albums, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlbum) {
      setAlbums(albums.map(a => a._id === editingAlbum._id ? { ...a, ...formData } : a));
      setEditingAlbum(null);
    } else {
      const newAlbum: GalleryAlbum = {
        _id: Date.now().toString(),
        ...formData,
        images: formData.coverImage ? [formData.coverImage] : [],
        createdAt: new Date().toISOString(),
      };
      setAlbums([...albums, newAlbum]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setFormData({
      name: album.name,
      category: album.category as 'Events' | 'Sports' | 'Academic' | 'Cultural' | 'Infrastructure' | 'Others',
      description: album.description,
      coverImage: album.coverImage,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this album?')) {
      setAlbums(albums.filter(a => a._id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'Events', description: '', coverImage: '' });
    setEditingAlbum(null);
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
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         album.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || album.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Events': 'bg-blue-100 text-blue-800',
      'Sports': 'bg-green-100 text-green-800',
      'Academic': 'bg-purple-100 text-purple-800',
      'Cultural': 'bg-orange-100 text-orange-800',
      'Infrastructure': 'bg-gray-100 text-gray-800',
      'Others': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">Manage photo albums and gallery</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Album
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Albums</p>
          <p className="text-2xl font-bold text-gray-900">{albums.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Events</p>
          <p className="text-2xl font-bold text-blue-600">{albums.filter(a => a.category === 'Events').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Sports</p>
          <p className="text-2xl font-bold text-green-600">{albums.filter(a => a.category === 'Sports').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Photos</p>
          <p className="text-2xl font-bold text-purple-600">{albums.reduce((sum, a) => sum + (a.images?.length || 0), 0)}</p>
        </motion.div>
      </div>

      {/* Filters */}
      {albums.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search albums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Categories</option>
              <option value="Events">Events</option>
              <option value="Sports">Sports</option>
              <option value="Academic">Academic</option>
              <option value="Cultural">Cultural</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
      )}

      {albums.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Albums</h3>
          <p className="text-gray-500 mb-4">Click "Add Album" to create gallery albums.</p>
          <Button onClick={() => setIsModalOpen(true)}>Add First Album</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <motion.div 
              key={album._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center relative group">
                {album.coverImage || album.images?.[0] ? (
                  <img src={album.coverImage || album.images[0]} alt={album.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleEdit(album)} className="p-2 bg-white rounded-full hover:bg-gray-100"><Edit className="w-4 h-4 text-blue-600" /></button>
                  <button onClick={() => handleDelete(album._id)} className="p-2 bg-white rounded-full hover:bg-gray-100"><Trash2 className="w-4 h-4 text-red-600" /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{album.name}</h3>
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(album.category)}`}>{album.category}</span>
                {album.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{album.description}</p>}
                <p className="text-xs text-gray-400 mt-2">{album.images?.length || 0} photos</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAlbum ? 'Edit Album' : 'Add Gallery Album'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Album Name *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value as 'Events' | 'Sports' | 'Academic' | 'Cultural' | 'Infrastructure' | 'Others'})} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Events">Events</option>
              <option value="Sports">Sports</option>
              <option value="Academic">Academic</option>
              <option value="Cultural">Cultural</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Album Cover Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
              {formData.coverImage ? (
                <div className="relative">
                  <img src={formData.coverImage} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, coverImage: ''})}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Click to upload cover image</p>
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
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
