'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Save, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function NoticesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notices, setNotices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Normal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setNotices([newNotice, ...notices]);
    setFormData({ title: '', content: '', category: 'General', priority: 'Normal' });
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-4 h-4" />
          Add Notice
        </button>
      </div>

      {notices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Notices</h3>
          <p className="text-gray-500 mb-4">Click "Add Notice" to create your first notice.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{notice.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  notice.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                  notice.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>{notice.priority}</span>
              </div>
              <p className="text-gray-600 mb-2">{notice.content}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Category: {notice.category}</span>
                <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Notice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>General</option>
              <option>Academic</option>
              <option>Exam</option>
              <option>Admission</option>
              <option>Event</option>
              <option>Holiday</option>
              <option>Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Notice
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
