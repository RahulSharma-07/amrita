'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, SlidersHorizontal, ChevronDown, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admissions');
      const data = await response.json();

      if (response.ok && data.admissions) {
        setAdmissions(data.admissions);
      } else {
        setAdmissions([]);
      }
    } catch (err) {
      console.error('Error fetching admissions:', err);
      setError('Unable to load admissions. MongoDB is not connected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Admission Applications</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage student admission requests for the academic year.</p>
          </div>
          <Link href="/admission" className="bg-primary-ui dark:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md transition-shadow shrink-0">
            <Plus className="w-5 h-5" />
            New Application
          </Link>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-ui focus:outline-none" placeholder="Search by Student Name or ID..." type="text" />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:flex-none">
              <select className="appearance-none w-full lg:w-36 pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-ui focus:outline-none">
                <option>All Classes</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
            </div>
            <div className="relative flex-1 lg:flex-none">
              <select className="appearance-none w-full lg:w-36 pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-ui focus:outline-none">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-ui mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading admissions...</p>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
            <div className="text-yellow-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2">{error}</p>
          </div>
        ) : admissions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Applications Yet</h3>
            <p className="text-slate-500 dark:text-slate-400">No admission applications have been submitted yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Application ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Father's Phone</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submission Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {admissions.map((admission: any) => (
                    <tr key={admission._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-400">#{admission.uniqueApplicationID}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {admission.studentDetails?.firstName} {admission.studentDetails?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {admission.studentDetails?.applyingForClass}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {admission.fatherDetails?.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(admission.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${admission.applicationStatus === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                              admission.applicationStatus === 'Under Review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                admission.applicationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                            {admission.applicationStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/admissions/${admission._id}`} className="inline-block text-primary-ui hover:bg-primary-ui/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {admissions.length > 0 && (
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Showing {admissions.length} entries</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30" disabled>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-8 h-8 rounded bg-primary-ui text-white text-sm font-bold">1</button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" disabled>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
