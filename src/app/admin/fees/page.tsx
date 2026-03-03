'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Plus, Save, X, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function FeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fees, setFees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    className: '',
    admissionFee: '',
    monthlyFee: '',
    examFee: '',
    otherCharges: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('fees');
    if (saved) setFees(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fees', JSON.stringify(fees));
  }, [fees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFee = {
      _id: Date.now().toString(),
      ...formData,
      total: parseInt(formData.admissionFee) + parseInt(formData.monthlyFee) + parseInt(formData.examFee) + parseInt(formData.otherCharges || 0),
    };
    setFees([...fees, newFee]);
    setFormData({ className: '', admissionFee: '', monthlyFee: '', examFee: '', otherCharges: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setFees(fees.filter(f => f._id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Plus className="w-4 h-4" /> Add Fee Structure
        </button>
      </div>

      {fees.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <IndianRupee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Fee Records</h3>
          <p className="text-gray-500 mb-4">Click "Add Fee Structure" to add fee details.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.map((f) => (
                <tr key={f._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{f.className}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{f.admissionFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{f.monthlyFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{f.examFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleDelete(f._id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Fee Structure">
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
    </motion.div>
  );
}
