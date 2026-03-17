'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Plus, Save, X, Trash2, Edit, Search } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { uniqueId } from '@/lib/utils';

interface Fee {
  _id: string;
  className: string;
  admissionFee: string;
  monthlyFee: string;
  examFee: string;
  otherCharges: string;
  total: number;
}

export default function FeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [fees, setFees] = useState<Fee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    admissionFee: '',
    monthlyFee: '',
    examFee: '',
    otherCharges: '',
  });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const saved = localStorage.getItem('fees');
    if (saved) setFees(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('fees', JSON.stringify(fees));
    }
  }, [fees, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseInt(formData.admissionFee || '0') + parseInt(formData.monthlyFee || '0') + 
                  parseInt(formData.examFee || '0') + parseInt(formData.otherCharges || '0');
    
    if (editingFee) {
      setFees(fees.map(f => f._id === editingFee._id ? {
        ...f,
        ...formData,
        total
      } : f));
      setEditingFee(null);
    } else {
      const newFee: Fee = {
        _id: uniqueId(),
        ...formData,
        total,
      };
      setFees([...fees, newFee]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (fee: Fee) => {
    setEditingFee(fee);
    setFormData({
      className: fee.className,
      admissionFee: fee.admissionFee,
      monthlyFee: fee.monthlyFee,
      examFee: fee.examFee,
      otherCharges: fee.otherCharges,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      setFees(fees.filter(f => f._id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ className: '', admissionFee: '', monthlyFee: '', examFee: '', otherCharges: '' });
    setEditingFee(null);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const filteredFees = fees.filter(f => 
    f.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = fees.reduce((sum, f) => sum + (f.total || 0), 0);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600">Manage fee structures for all classes</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Fee Structure
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Classes</p>
          <p className="text-2xl font-bold text-gray-900">{fees.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Avg Monthly Fee</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{fees.length > 0 ? Math.round(fees.reduce((sum, f) => sum + parseInt(f.monthlyFee || '0'), 0) / fees.length).toLocaleString() : 0}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Avg Admission Fee</p>
          <p className="text-2xl font-bold text-purple-600">
            ₹{fees.length > 0 ? Math.round(fees.reduce((sum, f) => sum + parseInt(f.admissionFee || '0'), 0) / fees.length).toLocaleString() : 0}
          </p>
        </motion.div>
      </div>

      {/* Search */}
      {fees.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by class name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {fees.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <IndianRupee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Fee Records</h3>
          <p className="text-gray-500 mb-4">Click &quot;Add Fee Structure&quot; to add fee details.</p>
          <Button onClick={() => setIsModalOpen(true)}>Add First Fee Structure</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Other</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFees.map((f) => (
                <motion.tr key={f._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ backgroundColor: '#f9fafb' }}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{f.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{f.admissionFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{f.monthlyFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{f.examFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{f.otherCharges || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">₹{f.total?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(f)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(f._id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredFees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No fee structures found matching your search.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingFee ? 'Edit Fee Structure' : 'Add Fee Structure'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
            <input type="text" required value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Fee *</label>
            <input type="number" required value={formData.admissionFee} onChange={(e) => setFormData({...formData, admissionFee: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee *</label>
            <input type="number" required value={formData.monthlyFee} onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee *</label>
            <input type="number" required value={formData.examFee} onChange={(e) => setFormData({...formData, examFee: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Other Charges</label>
            <input type="number" value={formData.otherCharges} onChange={(e) => setFormData({...formData, otherCharges: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
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
