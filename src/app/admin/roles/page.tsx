'use client';

import { motion } from 'framer-motion';
import { Shield, Plus } from 'lucide-react';

export default function RolesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Roles</h3>
        <p className="text-gray-500">User roles and permissions will appear here.</p>
      </div>
    </motion.div>
  );
}
