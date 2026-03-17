'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Save, X, Trash2, Edit, Search, Megaphone, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { uniqueId } from '@/lib/utils';

interface Notice {
  _id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Exam' | 'Admission' | 'Event' | 'Holiday' | 'Urgent';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  createdAt: string;
}

export default function NoticesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    category: 'General' | 'Academic' | 'Exam' | 'Admission' | 'Event' | 'Holiday' | 'Urgent';
    priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  }>({
    title: '',
    content: '',
    category: 'General',
    priority: 'Normal',
  });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const saved = localStorage.getItem('notices');
    if (saved) setNotices(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('notices', JSON.stringify(notices));
    }
  }, [notices, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotice) {
      setNotices(notices.map(n => n._id === editingNotice._id ? { ...n, ...formData } : n));
      setEditingNotice(null);
    } else {
      const newNotice: Notice = {
        _id: uniqueId(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setNotices([newNotice, ...notices]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category as 'General' | 'Academic' | 'Exam' | 'Admission' | 'Event' | 'Holiday' | 'Urgent',
      priority: notice.priority as 'Low' | 'Normal' | 'High' | 'Urgent',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(n => n._id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'General', priority: 'Normal' });
    setEditingNotice(null);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || notice.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  if (!isLoaded) {
    return (
      <div className="space-y-6 text-gray-900">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Urgent': 'bg-red-100 text-red-800 border-red-300',
      'High': 'bg-orange-100 text-orange-800 border-orange-300',
      'Normal': 'bg-blue-100 text-blue-800 border-blue-300',
      'Low': 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'Urgent') return <AlertCircle className="w-4 h-4" />;
    return <Megaphone className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
          <p className="text-gray-600">Manage school notices and announcements</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Notice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Notices</p>
          <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Urgent</p>
          <p className="text-2xl font-bold text-red-600">{notices.filter(n => n.priority === 'Urgent').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">High Priority</p>
          <p className="text-2xl font-bold text-orange-600">{notices.filter(n => n.priority === 'High').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-blue-600">
            {notices.filter(n => new Date(n.createdAt).getMonth() === new Date().getMonth()).length}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      {notices.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      )}

      {notices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Notices</h3>
          <p className="text-gray-500 mb-4">Click &quot;Add Notice&quot; to create your first notice.</p>
          <Button onClick={() => setIsModalOpen(true)}>Add First Notice</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <motion.div 
              key={notice._id} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white rounded-lg shadow p-4 border-l-4 hover:shadow-md transition-shadow ${getPriorityColor(notice.priority).split(' ')[2]}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(notice.category)}
                  <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notice.priority).split(' ').slice(0, 2).join(' ')}`}>{notice.priority}</span>
                  <button onClick={() => handleEdit(notice)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(notice._id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{notice.content}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{notice.category}</span>
                <span>{new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingNotice ? 'Edit Notice' : 'Add New Notice'}>
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
              onChange={(e) => setFormData({...formData, category: e.target.value as 'General' | 'Academic' | 'Exam' | 'Admission' | 'Event' | 'Holiday' | 'Urgent'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Exam">Exam</option>
              <option value="Admission">Admission</option>
              <option value="Event">Event</option>
              <option value="Holiday">Holiday</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as 'Low' | 'Normal' | 'High' | 'Urgent'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
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
    </div>
  );
}
