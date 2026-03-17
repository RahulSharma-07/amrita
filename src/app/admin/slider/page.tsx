'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Eye, Image as ImageIcon, Upload, X, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function HeroSliderAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load slides from backend API on mount
  useEffect(() => {
    const loadSlides = async () => {
      try {
        // Always fetch from backend API - no localStorage fallback
        const response = await fetch('/api/hero');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Ensure all slides have required fields
            const normalizedSlides = data.data.map((slide: Slide) => ({
              ...slide,
              displayOrder: slide.displayOrder ?? 0,
              status: slide.status ?? 'active',
              createdAt: slide.createdAt ?? new Date().toISOString(),
              updatedAt: slide.updatedAt ?? new Date().toISOString()
            }));
            setSlides(normalizedSlides);
            setActiveSlide(0);
            setIsLoaded(true);
            return;
          }
        }

        console.warn('⚠️ Admin Slider - Backend API failed, using defaults');
        setDefaultSlides();
      } catch (error) {
        console.warn('⚠️ Error loading slides:', error);
        setDefaultSlides();
      } finally {
        setIsLoaded(true);
      }
    };

    loadSlides();
  }, []);

  function setDefaultSlides() {
    setSlides([]);
    setActiveSlide(0);
    setHasChanges(false);
  }

  // Save slides to backend API
  const saveSlides = async () => {
    try {
      setIsLoading(true);

      // Validate slides before sending
      const validSlides = slides.filter(slide =>
        slide.title && slide.subtitle && slide.buttonText
      );

      if (validSlides.length === 0) {
        alert('Error: Please add at least one complete slide with title, subtitle, and button text.');
        setIsLoading(false);
        return;
      }

      // Send to backend API
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slides: validSlides }),
      });

      const data = await response.json();

      if (data.success) {
        setHasChanges(false);
        // Real-time updates are already triggered by backend API
        alert(`Slides saved successfully! Updates sent to all connected devices. (${validSlides.length} slides)`);
        console.log('✅ Slides saved to backend:', data.message);
      } else {
        alert(`Error: ${data.error || 'Failed to save slides'}`);
      }
    } catch (error) {
      console.error('Error saving slides:', error);
      alert('Failed to save slides. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new slide
  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      imageUrl: '',
      title: 'New Slide',
      subtitle: 'Enter your subtitle here',
      buttonText: 'Learn More',
      buttonLink: '/about',
      displayOrder: slides.length + 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSlides([...slides, newSlide]);
    setHasChanges(true);
  };

  // Delete slide
  const deleteSlide = (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      setSlides(slides.filter(slide => slide.id !== id));
      setHasChanges(true);
    }
  };

  // Duplicate slide
  const duplicateSlide = (slide: Slide) => {
    const newSlide: Slide = {
      ...slide,
      id: `slide-${Date.now()}`,
      title: `${slide.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSlides([...slides, newSlide]);
    setHasChanges(true);
  };

  // Update slide
  const updateSlide = (id: string, field: keyof Slide, value: any) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, [field]: value, updatedAt: new Date().toISOString() } : slide
    ));
    setHasChanges(true);
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSlide(id, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter slides
  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hero Slider Management</h1>
              <p className="text-gray-600 mt-1">Manage your website's hero slides</p>
            </div>
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <span className="text-sm text-orange-600 font-medium">
                  Unsaved changes
                </span>
              )}
              <Button
                onClick={saveSlides}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:flex-1 sm:max-w-md">
              <Input
                placeholder="Search slides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={addSlide} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Slide
            </Button>
          </div>
        </div>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.map((slide, index) => (
            <div key={slide.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Slide Preview */}
              <div className="relative h-48 bg-gray-100">
                {slide.imageUrl ? (
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => setActiveSlide(index)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => duplicateSlide(slide)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Slide Details */}
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                    placeholder="Enter slide title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <Input
                    value={slide.subtitle}
                    onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                    placeholder="Enter slide subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <Input
                    value={slide.buttonText}
                    onChange={(e) => updateSlide(slide.id, 'buttonText', e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <Input
                    value={slide.buttonLink}
                    onChange={(e) => updateSlide(slide.id, 'buttonLink', e.target.value)}
                    placeholder="Enter button link (e.g., /admission)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL or Upload</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={slide.imageUrl}
                        onChange={(e) => updateSlide(slide.id, 'imageUrl', e.target.value)}
                        placeholder="Enter image URL"
                      />
                    </div>
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-4 flex items-center justify-center transition-colors">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(slide.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={slide.status === 'active'}
                      onChange={(e) => updateSlide(slide.id, 'status', e.target.checked ? 'active' : 'inactive')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSlides.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No slides found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first slide'}
            </p>
            {!searchTerm && (
              <Button onClick={addSlide} className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Add Your First Slide
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
