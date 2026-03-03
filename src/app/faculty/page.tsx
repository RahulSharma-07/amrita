'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, Play } from 'lucide-react';

interface Faculty {
  _id: string;
  name: string;
  photo?: string;
  qualification: string;
  experience: number;
  subjects: string[];
  designation: string;
  bio?: string;
  teachingDemoVideo?: string;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        // First try to get from localStorage (for admin-added faculty)
        const localFaculty = localStorage.getItem('faculty');
        if (localFaculty) {
          const parsed = JSON.parse(localFaculty);
          setFaculty(parsed);
          setIsLoading(false);
          return;
        }

        // Fallback to API
        const response = await fetch('/api/faculty');
        if (response.ok) {
          const data = await response.json();
          setFaculty(data.faculty);
        }
      } catch (error) {
        console.error('Failed to fetch faculty:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculty();

    // Listen for storage changes (when admin adds faculty)
    const handleStorageChange = () => {
      const localFaculty = localStorage.getItem('faculty');
      if (localFaculty) {
        setFaculty(JSON.parse(localFaculty));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-red-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Faculty
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Meet our dedicated team of experienced educators committed to nurturing young minds
          </motion.p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-red-100">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-24 h-24 text-gray-300" />
                    </div>
                  )}
                  {member.teachingDemoVideo && (
                    <button
                      onClick={() => setSelectedVideo(member.teachingDemoVideo!)}
                      className="absolute bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-3">{member.designation}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Qualification:</span> {member.qualification}
                    </p>
                    <p>
                      <span className="font-medium">Experience:</span> {member.experience} years
                    </p>
                    <p>
                      <span className="font-medium">Subjects:</span> {member.subjects.join(', ')}
                    </p>
                  </div>
                  {member.bio && (
                    <p className="mt-4 text-gray-600 text-sm line-clamp-3">{member.bio}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full">
            <div className="aspect-video">
              <iframe
                src={selectedVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
