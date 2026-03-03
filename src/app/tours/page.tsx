'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Calendar, MapPin, Users, IndianRupee, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Tour {
  _id: string;
  title: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: string;
  cost: number;
  images: Array<{ url: string; caption?: string }>;
  maxParticipants?: number;
  registeredParticipants: number;
  applicableClasses: string[];
  contactPerson?: string;
  contactPhone?: string;
  registrationLink?: string;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/tours?upcoming=true');
        if (response.ok) {
          const data = await response.json();
          setTours(data.tours);
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
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
            Tours & Travels
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Educational trips and excursions for holistic learning experiences
          </motion.p>
        </div>
      </section>

      {/* Tours List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tours.length === 0 ? (
            <div className="text-center py-12">
              <Bus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No upcoming tours at the moment</p>
            </div>
          ) : (
            <div className="space-y-8">
              {tours.map((tour, index) => (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Image */}
                    <div className="relative h-64 lg:h-auto">
                      {tour.images[0]?.url ? (
                        <img
                          src={tour.images[0].url}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center">
                          <Bus className="w-24 h-24 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                          {tour.duration}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-1 text-red-600" />
                            {tour.destination}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">₹{tour.cost.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">per person</div>
                        </div>
                      </div>

                      {tour.description && (
                        <p className="text-gray-600 mb-6">{tour.description}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                          <div>
                            <div className="text-xs text-gray-500">Start Date</div>
                            <div className="font-medium">{new Date(tour.startDate).toLocaleDateString('en-IN')}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                          <div>
                            <div className="text-xs text-gray-500">End Date</div>
                            <div className="font-medium">{new Date(tour.endDate).toLocaleDateString('en-IN')}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-5 h-5 mr-2 text-green-600" />
                          <div>
                            <div className="text-xs text-gray-500">Classes</div>
                            <div className="font-medium">{tour.applicableClasses.join(', ')}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <IndianRupee className="w-5 h-5 mr-2 text-purple-600" />
                          <div>
                            <div className="text-xs text-gray-500">Cost</div>
                            <div className="font-medium">₹{tour.cost.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {tour.maxParticipants && (
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Registration Progress</span>
                            <span className="font-medium">{tour.registeredParticipants} / {tour.maxParticipants}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-600 rounded-full"
                              style={{ width: `${(tour.registeredParticipants / tour.maxParticipants) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                        {tour.registrationLink && (
                          <a href={tour.registrationLink} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full sm:w-auto">
                              Register Now
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </a>
                        )}
                        {tour.contactPhone && (
                          <a href={`tel:${tour.contactPhone}`}>
                            <Button variant="outline" className="w-full sm:w-auto">
                              Contact: {tour.contactPhone}
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
