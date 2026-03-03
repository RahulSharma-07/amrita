'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Save, X, Trash2, Download, Edit, Search, Upload, Folder } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Document {
  _id: string;
  title: string;
  category: 'Prospectus' | 'Circular' | 'Exam Schedule' | 'Syllabus' | 'Form' | 'Homework' | 'Other';
  fileUrl: string;
  fileName?: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    category: 'Prospectus' | 'Circular' | 'Exam Schedule' | 'Syllabus' | 'Form' | 'Homework' | 'Other';
    fileUrl: string;
    fileName: string;
  }>({
    title: '',
    category: 'Prospectus',
    fileUrl: '',
    fileName: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('documents');
    if (saved) setDocuments(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('documents', JSON.stringify(documents));
    }
  }, [documents, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoc) {
      setDocuments(documents.map(d => d._id === editingDoc._id ? { ...d, ...formData } : d));
      setEditingDoc(null);
    } else {
      const newDoc: Document = {
        _id: Date.now().toString(),
        ...formData,
        uploadedAt: new Date().toISOString(),
      };
      setDocuments([...documents, newDoc]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      category: doc.category as 'Prospectus' | 'Circular' | 'Exam Schedule' | 'Syllabus' | 'Form' | 'Homework' | 'Other',
      fileUrl: doc.fileUrl,
      fileName: doc.fileName || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d._id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'Prospectus', fileUrl: '', fileName: '' });
    setEditingDoc(null);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          fileUrl: reader.result as string,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
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
      'Prospectus': 'bg-blue-100 text-blue-800',
      'Circular': 'bg-green-100 text-green-800',
      'Exam Schedule': 'bg-red-100 text-red-800',
      'Syllabus': 'bg-purple-100 text-purple-800',
      'Form': 'bg-orange-100 text-orange-800',
      'Homework': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage school documents and files</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Prospectus</p>
          <p className="text-2xl font-bold text-blue-600">{documents.filter(d => d.category === 'Prospectus').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Circulars</p>
          <p className="text-2xl font-bold text-green-600">{documents.filter(d => d.category === 'Circular').length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Homework</p>
          <p className="text-2xl font-bold text-pink-600">{documents.filter(d => d.category === 'Homework').length}</p>
        </motion.div>
      </div>

      {/* Filters */}
      {documents.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search documents..."
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
              <option value="Prospectus">Prospectus</option>
              <option value="Circular">Circular</option>
              <option value="Exam Schedule">Exam Schedule</option>
              <option value="Syllabus">Syllabus</option>
              <option value="Form">Form</option>
              <option value="Homework">Homework</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents</h3>
          <p className="text-gray-500 mb-4">Click "Upload Document" to add documents.</p>
          <Button onClick={() => setIsModalOpen(true)}>Upload First Document</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <motion.div 
              key={doc._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-4 flex items-start gap-3 hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-red-50 rounded-lg">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getCategoryColor(doc.category)}`}>{doc.category}</span>
                {doc.fileName && <p className="text-xs text-gray-400 mt-1 truncate">{doc.fileName}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(doc)} className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                {doc.fileUrl && <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"><Download className="w-4 h-4" /></a>}
                <button onClick={() => handleDelete(doc._id)} className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingDoc ? 'Edit Document' : 'Upload Document'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value as 'Prospectus' | 'Circular' | 'Exam Schedule' | 'Syllabus' | 'Form' | 'Homework' | 'Other'})} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Prospectus">Prospectus</option>
              <option value="Circular">Circular</option>
              <option value="Exam Schedule">Exam Schedule</option>
              <option value="Syllabus">Syllabus</option>
              <option value="Form">Form</option>
              <option value="Homework">Homework</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400 transition-colors">
              {formData.fileUrl ? (
                <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                  <span className="text-sm text-green-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {formData.fileName || 'File uploaded'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, fileUrl: '', fileName: ''})}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Click to upload file</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
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
