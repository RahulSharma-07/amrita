'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Save, X, Trash2, Download } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function DocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Prospectus',
    fileUrl: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('documents');
    if (saved) setDocuments(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      _id: Date.now().toString(),
      ...formData,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments([...documents, newDoc]);
    setFormData({ title: '', category: 'Prospectus', fileUrl: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(d => d._id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents</h3>
          <p className="text-gray-500 mb-4">Click "Upload Document" to add documents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg shadow p-4 flex items-start gap-3">
              <FileText className="w-10 h-10 text-red-600" />
              <div className="flex-1">
                <h3 className="font-medium">{doc.title}</h3>
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mt-1">{doc.category}</span>
              </div>
              <div className="flex gap-1">
                {doc.fileUrl && <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-blue-600 hover:text-blue-800"><Download className="w-4 h-4" /></a>}
                <button onClick={() => handleDelete(doc._id)} className="p-1 text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Document">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Prospectus</option>
              <option>Circular</option>
              <option>Exam Schedule</option>
              <option>Syllabus</option>
              <option>Form</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
            <input type="url" value={formData.fileUrl} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} placeholder="https://example.com/file.pdf" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
