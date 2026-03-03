'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Plus, Save, X, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/ui/ImageUpload';

export default function GalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [albums, setAlbums] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Events',
    description: '',
    coverImage: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('galleryAlbums');
    if (saved) setAlbums(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('galleryAlbums', JSON.stringify(albums));
  }, [albums]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlbum: any = {
      _id: Date.now().toString(),
      ...formData,
      images: formData.coverImage ? [formData.coverImage] : [],
      createdAt: new Date().toISOString(),
    };
    setAlbums([...albums, newAlbum]);
    setFormData({ name: '', category: 'Events', description: '', coverImage: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAlbums(albums.filter(a => a._id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Plus className="w-4 h-4" /> Add Album
        </button>
      </div>

      {albums.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Albums</h3>
          <p className="text-gray-500 mb-4">Click "Add Album" to create gallery albums.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div key={album._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center">
                {album.coverImage || album.images?.[0] ? (
                  <img src={album.coverImage || album.images[0]} alt={album.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{album.name}</h3>
                  <button onClick={() => handleDelete(album._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                </div>
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mt-2">{album.category}</span>
                {album.description && <p className="text-sm text-gray-500 mt-2">{album.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Gallery Album">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Album Name *</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Events</option>
              <option>Sports</option>
              <option>Academic</option>
              <option>Cultural</option>
              <option>Infrastructure</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <ImageUpload
            value={formData.coverImage}
            onChange={(value) => setFormData({...formData, coverImage: value})}
            label="Album Cover Image"
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
