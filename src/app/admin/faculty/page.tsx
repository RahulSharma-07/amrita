'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, Edit, Trash2, Save, X, Calendar, Camera, Upload, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  photo?: string;
}

export default function FacultyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFaculty, setNewFaculty] = useState<Omit<Faculty, 'id'>>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    photo: '',
  });

  const subjects = ['all', 'Mathematics', 'English', 'Science', 'Hindi', 'Social Studies', 'Computer'];

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('faculty');
    if (saved) {
      setFaculty(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('faculty', JSON.stringify(faculty));
  }, [faculty]);

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || f.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  // Handle adding new faculty
  const handleAddFaculty = () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.subject) {
      alert('Please fill in required fields: Name, Email, and Subject');
      return;
    }
    
    const newFacultyWithId: Faculty = {
      ...newFaculty,
      id: `fac-${Date.now()}`,
    };
    
    setFaculty([...faculty, newFacultyWithId]);
    setNewFaculty({
      name: '',
      email: '',
      phone: '',
      subject: '',
      qualification: '',
      experience: '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
  };

  // Handle updating faculty
  const handleUpdateFaculty = () => {
    if (!editingFaculty) return;
    
    setFaculty(faculty.map(f => f.id === editingFaculty.id ? editingFaculty : f));
    setEditingFaculty(null);
  };

  // Handle deleting faculty
  const handleDeleteFaculty = (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setFaculty(faculty.filter(f => f.id !== id));
    }
  };

  // Handle status toggle
  const toggleStatus = (id: string) => {
    setFaculty(faculty.map(f => 
      f.id === id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isNew) {
          setNewFaculty({ ...newFaculty, photo: base64String });
        } else if (editingFaculty) {
          setEditingFaculty({ ...editingFaculty, photo: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600">Manage teachers and staff</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Faculty
        </Button>
      </div>

      {/* Add Faculty Form - Collapsed by default */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Faculty</h2>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-full">
              {newFaculty.photo ? (
                <div className="relative w-32 h-32 mb-4">
                  <img src={newFaculty.photo} alt="Preview" className="w-full h-full object-cover rounded-full border-4 border-white shadow-md" />
                  <button 
                    onClick={() => setNewFaculty({...newFaculty, photo: ''})}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <Camera className="w-8 h-8" />
                  </div>
                  <p className="text-xs">No Photo</p>
                </div>
              )}
              <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Picture</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, true)} 
                  className="hidden" 
                />
              </label>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <Input
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                placeholder="Enter faculty name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                type="email"
                value={newFaculty.email}
                onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                value={newFaculty.phone}
                onChange={(e) => setNewFaculty({...newFaculty, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <Input
                value={newFaculty.subject}
                onChange={(e) => setNewFaculty({...newFaculty, subject: e.target.value})}
                placeholder="Enter subject taught"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <Input
                value={newFaculty.qualification}
                onChange={(e) => setNewFaculty({...newFaculty, qualification: e.target.value})}
                placeholder="Enter qualification"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <Input
                value={newFaculty.experience}
                onChange={(e) => setNewFaculty({...newFaculty, experience: e.target.value})}
                placeholder="Enter years of experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <Input
                type="date"
                value={newFaculty.joinDate}
                onChange={(e) => setNewFaculty({...newFaculty, joinDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={newFaculty.status}
                onChange={(e) => setNewFaculty({...newFaculty, status: e.target.value as 'Active' | 'Inactive'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAddFaculty}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add Faculty
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <p className="text-sm text-gray-600">Total Faculty</p>
          <p className="text-2xl font-bold text-gray-900">{faculty.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {faculty.filter((f) => f.status === 'Active').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <p className="text-sm text-gray-600">Departments</p>
          <p className="text-2xl font-bold text-blue-600">{new Set(faculty.map(f => f.subject)).size}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <p className="text-sm text-gray-600">New This Year</p>
          <p className="text-2xl font-bold text-purple-600">
            {faculty.filter(f => new Date(f.joinDate).getFullYear() === new Date().getFullYear()).length}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search faculty by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Faculty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qualification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFaculty.map((f) => (
              <motion.tr
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {f.photo ? (
                      <img src={f.photo} alt={f.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                        {f.name.charAt(0)}
                      </div>
                    )}
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{f.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        {f.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Phone className="w-3 h-3" />
                        {f.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{f.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{f.qualification}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{f.experience}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(f.id)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      f.status === 'Active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {f.status}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingFaculty(f)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit faculty"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteFaculty(f.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete faculty"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredFaculty.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No faculty found</p>
          </div>
        )}
      </div>

      {/* Edit Faculty Modal */}
      {editingFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Edit Faculty</h2>
                <button 
                  onClick={() => setEditingFaculty(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Edit Photo Upload */}
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-full">
                  {editingFaculty.photo ? (
                    <div className="relative w-32 h-32 mb-4">
                      <img src={editingFaculty.photo} alt="Preview" className="w-full h-full object-cover rounded-full border-4 border-white shadow-md" />
                      <button 
                        onClick={() => setEditingFaculty({...editingFaculty, photo: ''})}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                        <Camera className="w-8 h-8" />
                      </div>
                      <p className="text-xs">No Photo</p>
                    </div>
                  )}
                  <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Change Picture</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, false)} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={editingFaculty.name}
                    onChange={(e) => setEditingFaculty({...editingFaculty, name: e.target.value})}
                    placeholder="Enter faculty name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={editingFaculty.email}
                    onChange={(e) => setEditingFaculty({...editingFaculty, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={editingFaculty.phone}
                    onChange={(e) => setEditingFaculty({...editingFaculty, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <Input
                    value={editingFaculty.subject}
                    onChange={(e) => setEditingFaculty({...editingFaculty, subject: e.target.value})}
                    placeholder="Enter subject taught"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <Input
                    value={editingFaculty.qualification}
                    onChange={(e) => setEditingFaculty({...editingFaculty, qualification: e.target.value})}
                    placeholder="Enter qualification"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <Input
                    value={editingFaculty.experience}
                    onChange={(e) => setEditingFaculty({...editingFaculty, experience: e.target.value})}
                    placeholder="Enter years of experience"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <Input
                    type="date"
                    value={editingFaculty.joinDate}
                    onChange={(e) => setEditingFaculty({...editingFaculty, joinDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingFaculty.status}
                    onChange={(e) => setEditingFaculty({...editingFaculty, status: e.target.value as 'Active' | 'Inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingFaculty(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleUpdateFaculty}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update Faculty
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}