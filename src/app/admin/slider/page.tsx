'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Save, Image as ImageIcon, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export default function HeroSliderAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load slides from localStorage on mount and when page becomes visible
  useEffect(() => {
    const loadSlides = () => {
      try {
        const savedSlides = localStorage.getItem('heroSlides');
        console.log('Admin Slider - Loading slides:', savedSlides ? 'found' : 'not found');
        if (savedSlides) {
          const parsed = JSON.parse(savedSlides);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Normalize all slides to ensure they have all required fields
            const normalizedSlides = parsed.map((slide: any, index: number) =>
              normalizeSlide({ ...slide, id: slide.id || `slide_${Date.now()}_${index}` })
            );
            setSlides(normalizedSlides);
            setActiveSlide(0); // Ensure first slide is selected
            console.log('Admin Slider - Loaded', normalizedSlides.length, 'slides');
          } else {
            console.log('Admin Slider - Empty array, using defaults');
            setDefaultSlides();
          }
        } else {
          console.log('Admin Slider - No saved data, using defaults');
          setDefaultSlides();
        }
      } catch (error) {
        console.error('Error loading slides:', error);
        setDefaultSlides();
      }
      setIsLoaded(true);
    };

    loadSlides();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'heroSlides') {
        console.log('Admin Slider - Storage changed, reloading');
        loadSlides();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Reload when page becomes visible (navigating back to this tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Admin Slider - Page visible, reloading slides');
        loadSlides();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also reload on window focus
    const handleFocus = () => {
      console.log('Admin Slider - Window focused, reloading slides');
      loadSlides();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Ensure activeSlide is valid when slides change
  useEffect(() => {
    if (slides.length > 0 && activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [slides, activeSlide]);

  const setDefaultSlides = () => {
    setSlides([
      {
        id: `slide_${Date.now()}_1`,
        imageUrl: '',
        title: 'Welcome to Shree Amrita Academy',
        subtitle: 'Nurturing Minds, Building Futures',
        buttonText: 'Apply Now',
        buttonLink: '/admission',
      },
      {
        id: `slide_${Date.now()}_2`,
        imageUrl: '',
        title: 'Admission Open 2026-2027',
        subtitle: 'Enroll Your Child for a Bright Future',
        buttonText: 'Apply Now',
        buttonLink: '/admission',
      },
    ]);
    setActiveSlide(0); // Set to first slide
    setHasChanges(true);
  };

  // Ensure all slide fields have default values
  const normalizeSlide = (slide: any): Slide => ({
    id: slide.id || `slide_${Date.now()}`,
    imageUrl: slide.imageUrl || '',
    title: slide.title || '',
    subtitle: slide.subtitle || '',
    buttonText: slide.buttonText || '',
    buttonLink: slide.buttonLink || '',
  });

  // Save slides to localStorage
  const saveSlides = () => {
    try {
      const slidesJson = JSON.stringify(slides);
      // Check if data is too large (localStorage limit is typically 5-10MB)
      if (slidesJson.length > 5 * 1024 * 1024) {
        alert('Error: Total image size is too large. Please use smaller images or fewer slides.');
        return;
      }
      localStorage.setItem('heroSlides', slidesJson);
      setHasChanges(false);
      // Dispatch event to notify other components
      window.dispatchEvent(new StorageEvent('storage', { key: 'heroSlides' }));
      alert('Slides saved successfully!');
    } catch (error) {
      console.error('Error saving slides:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('Error: Storage quota exceeded. Please use smaller images or fewer slides.');
      } else {
        alert('Failed to save slides');
      }
    }
  };

  // Add new slide
  const addSlide = () => {
    const newSlide = normalizeSlide({
      id: `slide_${Date.now()}`,
      title: 'New Slide',
      subtitle: 'Subtitle here',
      buttonText: 'Learn More',
      buttonLink: '/',
    });
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    setActiveSlide(newSlides.length - 1); // Set to the newly added slide
    setHasChanges(true);
  };

  // Delete slide
  const deleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You must have at least one slide');
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (activeSlide >= newSlides.length) {
      setActiveSlide(newSlides.length - 1);
    }
    setHasChanges(true);
  };

  // Update slide
  const updateSlide = (index: number, field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
    setHasChanges(true);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if a slide is selected
    if (!slides[activeSlide]) {
      alert('Please select a slide first');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateSlide(activeSlide, 'imageUrl', base64String);
      setUploading(false);
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      alert('Failed to read image file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    updateSlide(activeSlide, 'imageUrl', '');
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Move slide up/down
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    setSlides(newSlides);
    setActiveSlide(targetIndex);
    setHasChanges(true);
  };

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slider</h1>
          <p className="text-gray-600">Manage homepage hero slider images and content</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <span className="text-amber-600 text-sm flex items-center">
              Unsaved changes
            </span>
          )}
          <Button onClick={saveSlides} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slides List */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Slides ({slides.length})</h2>
            <Button onClick={addSlide} variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add Slide
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {slides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    activeSlide === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveSlide(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 cursor-move">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{slide.title || 'Untitled'}</p>
                      <p className="text-xs text-gray-500 truncate">{slide.subtitle || 'No subtitle'}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSlide(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSlide(index, 'down');
                        }}
                        disabled={index === slides.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlide(index);
                        }}
                        className="p-1 hover:bg-red-100 text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {slides.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No slides yet</p>
              <Button onClick={addSlide} variant="outline" className="mt-2">
                Add your first slide
              </Button>
            </div>
          )}
        </div>

        {/* Slide Editor */}
        <div className="lg:col-span-2">
          {slides[activeSlide] ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Edit Slide {activeSlide + 1} of {slides.length}
              </h2>

              <div className="space-y-4">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slide Image
                  </label>

                  {slides[activeSlide].imageUrl ? (
                    <div className="relative">
                      <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={slides[activeSlide].imageUrl}
                          alt="Slide"
                          className="w-full h-full object-cover"
                        />
                        {/* Remove image button */}
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Image uploaded successfully. Click the X to remove.
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={triggerFileInput}
                      className="relative h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      {uploading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 2MB</p>
                          <p className="text-xs text-gray-400 mt-2">Or leave empty for gradient background</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={slides[activeSlide].title || ''}
                    onChange={(e) => updateSlide(activeSlide, 'title', e.target.value)}
                    placeholder="Enter slide title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <Input
                    value={slides[activeSlide].subtitle || ''}
                    onChange={(e) => updateSlide(activeSlide, 'subtitle', e.target.value)}
                    placeholder="Enter slide subtitle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <Input
                      value={slides[activeSlide].buttonText || ''}
                      onChange={(e) => updateSlide(activeSlide, 'buttonText', e.target.value)}
                      placeholder="e.g., Learn More"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Link
                    </label>
                    <Input
                      value={slides[activeSlide].buttonLink || ''}
                      onChange={(e) => updateSlide(activeSlide, 'buttonLink', e.target.value)}
                      placeholder="e.g., /admission"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-r from-blue-900 to-red-900">
                    {slides[activeSlide].imageUrl ? (
                      <img
                        src={slides[activeSlide].imageUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <h3 className="text-xl font-bold mb-1">{slides[activeSlide].title}</h3>
                        <p className="text-sm opacity-90">{slides[activeSlide].subtitle}</p>
                        {slides[activeSlide].buttonText && (
                          <button className="mt-3 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium">
                            {slides[activeSlide].buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a slide to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
