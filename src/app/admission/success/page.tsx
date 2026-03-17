'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MapPin, Phone, Home, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdmissionSuccessPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Submission Successful!
          </h1>

          {/* THE REQUESTED MESSAGE - HIGHLIGHTED PAGE CENTER */}
          <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[40px] mb-10 shadow-xl shadow-red-900/5">
            <h2 className="text-2xl md:text-3xl font-black text-red-600 mb-2 uppercase tracking-tight">
              Important Next Step:
            </h2>
            <p className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
              "Please, Come to the school for admission confirmation"
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Application ID</h3>
              </div>
              <p className="text-xl font-mono font-black text-blue-900 uppercase">
                {applicationId || 'SAA-2026-XXXX'}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900">School Location</h3>
              </div>
              <p className="text-sm font-medium text-slate-600">
                Plot No. 36 to 40, Pushpvatika Society, Ankleshwar
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="px-10 py-5 bg-blue-900 text-white rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2"
            >
              <Home className="w-6 h-6" /> Back to Home
            </Link>
            <button 
              onClick={() => window.print()}
              className="px-10 py-5 bg-slate-100 text-slate-900 rounded-full font-black text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              Print Acknowledgment
            </button>
          </div>

          <p className="mt-12 text-slate-400 font-bold text-sm uppercase tracking-widest">
            Shree Amrita Academy • Excellence in Education
          </p>
        </motion.div>
      </div>
    </div>
  );
}
