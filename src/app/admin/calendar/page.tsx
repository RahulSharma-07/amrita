'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Save, X, Trash2, Edit, Search, Clock } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { uniqueId } from '@/lib/utils';

// wrapper used for fields where we intentionally omit the `label` prop
const UncheckedInput = Input as React.FC<any>;

interface CalendarEvent {
  _id: string;
  title: string;
  date: string;
  type: 'Event' | 'Holiday' | 'Exam' | 'Meeting' | 'Function';
  description: string;
}

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    type: 'Event' | 'Holiday' | 'Exam' | 'Meeting' | 'Function';
    description: string;
  }>({
    title: '',
    date: '',
    type: 'Event',
    description: '',
  });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) setEvents(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(ev => ev._id === editingEvent._id ? { ...ev, ...formData } : ev));
      setEditingEvent(null);
    } else {
      const newEvent: CalendarEvent = {
        _id: uniqueId(),
        ...formData,
      };
      setEvents([...events, newEvent]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      type: event.type as 'Event' | 'Holiday' | 'Exam' | 'Meeting' | 'Function',
      description: event.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e._id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', date: '', type: 'Event', description: '' });
    setEditingEvent(null);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ev.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ev.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingEvents = filteredEvents.filter(ev => new Date(ev.date) >= new Date());
  const pastEvents = filteredEvents.filter(ev => new Date(ev.date) < new Date());

  if (!isLoaded) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Event': 'bg-blue-100 text-blue-800',
      'Holiday': 'bg-green-100 text-green-800',
      'Exam': 'bg-red-100 text-red-800',
      'Meeting': 'bg-purple-100 text-purple-800',
      'Function': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
          <p className="text-gray-600">Manage school events and holidays</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold text-gray-900">{events.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">{upcomingEvents.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-blue-600">
            {events.filter(ev => new Date(ev.date).getMonth() === new Date().getMonth()).length}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Holidays</p>
          <p className="text-2xl font-bold text-purple-600">
            {events.filter(ev => ev.type === 'Holiday').length}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      {events.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {/* use unchecked wrapper to avoid potential stale type requirements during remote builds */}
              <UncheckedInput
                label="Search events"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Types</option>
              <option value="Event">Event</option>
              <option value="Holiday">Holiday</option>
              <option value="Exam">Exam</option>
              <option value="Meeting">Meeting</option>
              <option value="Function">Function</option>
            </select>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events</h3>
          <p className="text-gray-500 mb-4">Click &quot;Add Event&quot; to create calendar events.</p>
          <Button onClick={() => setIsModalOpen(true)}>Add First Event</Button>
        </div>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Upcoming Events ({upcomingEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <motion.div 
                    key={event._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(event)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(event._id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(event.type)}`}>{event.type}</span>
                    {event.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Events ({pastEvents.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map((event) => (
                  <motion.div 
                    key={event._id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg shadow p-4 border-l-4 border-gray-400 opacity-75"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-700">{event.title}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(event)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(event._id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(event.type)}`}>{event.type}</span>
                    {event.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEvent ? 'Edit Event' : 'Add Calendar Event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value as 'Event' | 'Holiday' | 'Exam' | 'Meeting' | 'Function'})} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Event">Event</option>
              <option value="Holiday">Holiday</option>
              <option value="Exam">Exam</option>
              <option value="Meeting">Meeting</option>
              <option value="Function">Function</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
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
