'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Download } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description?: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  isAllDay: boolean;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/calendar?month=${currentMonth}&year=${currentYear}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentMonth, currentYear]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Holiday': return 'bg-red-100 text-red-800';
      case 'Exam': return 'bg-purple-100 text-purple-800';
      case 'Event': return 'bg-blue-100 text-blue-800';
      case 'Meeting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            School Calendar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Stay updated with school events, holidays, and important dates
          </motion.p>
        </div>
      </section>

      {/* Calendar Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                if (currentMonth === 1) {
                  setCurrentMonth(12);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              Previous
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentMonth - 1]} {currentYear}
            </h2>
            <button
              onClick={() => {
                if (currentMonth === 12) {
                  setCurrentMonth(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              Next
            </button>
          </div>

          {/* Events List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Events & Holidays</h3>
                <button className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
            
            {events.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No events scheduled for this month</p>
              </div>
            ) : (
              <div className="divide-y">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-red-600 font-medium">
                          {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-red-600">
                          {new Date(event.startDate).getDate()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-bold text-gray-900">{event.title}</h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getEventTypeColor(event.eventType)}`}>
                            {event.eventType}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {!event.isAllDay && event.startTime && (
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {event.startTime} {event.endTime && `- ${event.endTime}`}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </span>
                          )}
                          {event.isAllDay && (
                            <span className="text-blue-600 font-medium">All Day</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-red-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Holiday</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-purple-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Exam</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Event</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-yellow-100 rounded-full"></span>
              <span className="text-sm text-gray-600">Meeting</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
