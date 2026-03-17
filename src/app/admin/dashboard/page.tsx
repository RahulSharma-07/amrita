'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  stats: {
    totalStudents: number;
    totalApplications: number;
    approvedApplications: number;
    pendingApplications: number;
    rejectedApplications: number;
    totalTeachers: number;
    totalFeesCollected: number;
  };
  charts: {
    monthlyAdmissions: { month: number; count: number }[];
    classDistribution: { class: string; count: number }[];
    genderDistribution: { gender: string; count: number }[];
  };
  recentAdmissions: Array<{
    _id: string;
    uniqueApplicationID: string;
    studentDetails: {
      firstName: string;
      lastName: string;
      applyingForClass: string;
    };
    applicationStatus: string;
    paymentStatus: string;
    createdAt: string;
  }>;
}

const statCards = [
  { key: 'totalStudents', label: 'Total Students', icon: Users, color: 'bg-blue-500' },
  { key: 'totalApplications', label: 'Total Applications', icon: GraduationCap, color: 'bg-purple-500' },
  { key: 'approvedApplications', label: 'Approved', icon: CheckCircle, color: 'bg-green-500' },
  { key: 'pendingApplications', label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
  { key: 'rejectedApplications', label: 'Rejected', icon: XCircle, color: 'bg-red-500' },
  { key: 'totalTeachers', label: 'Total Teachers', icon: Users, color: 'bg-indigo-500' },
];

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Default data when MongoDB is not connected
  const defaultData: DashboardStats = {
    stats: {
      totalStudents: 0,
      totalApplications: 0,
      approvedApplications: 0,
      pendingApplications: 0,
      rejectedApplications: 0,
      totalTeachers: 0,
      totalFeesCollected: 0,
    },
    charts: {
      monthlyAdmissions: [],
      classDistribution: [],
      genderDistribution: [],
    },
    recentAdmissions: [],
  };

  const displayData = data || defaultData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <Link
          href="/admin/admissions"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          View All Applications
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card, index) => {
          const value = displayData.stats[card.key as keyof typeof displayData.stats];
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {value.toLocaleString()}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Class-wise Applications</h3>
          <div className="space-y-3">
            {displayData.charts.classDistribution.map((item) => (
              <div key={item.class} className="flex items-center justify-between">
                <span className="text-gray-600">Class {item.class}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{
                        width: `${displayData.stats.totalApplications > 0 ? (item.count / displayData.stats.totalApplications) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gender Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Gender Distribution</h3>
          <div className="space-y-4">
            {displayData.charts.genderDistribution.map((item) => (
              <div key={item.gender} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{item.gender}</span>
                <span className="text-lg font-bold text-red-600">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Admissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-3">
            {displayData.recentAdmissions.map((admission) => (
              <div
                key={admission._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {admission.studentDetails.firstName} {admission.studentDetails.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Class {admission.studentDetails.applyingForClass} • {admission.uniqueApplicationID}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    admission.applicationStatus === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : admission.applicationStatus === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {admission.applicationStatus}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-red-600 rounded-xl shadow-sm p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/admissions"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <GraduationCap className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Manage Admissions</span>
          </Link>
          <Link
            href="/admin/students"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <Users className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">View Students</span>
          </Link>
          <Link
            href="/admin/notices"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Post Notice</span>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
