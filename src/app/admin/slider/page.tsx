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

  // Load slides from localStorage on mount
  useEffect(() => {
    const loadSlides = () => {
      try {
        const savedSlides = localStorage.getItem('heroSlides');
        if (savedSlides) {
          const parsed = JSON.parse(savedSlides);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Ensure all slides have required fields
            const normalizedSlides = parsed.map((slide: Slide) => ({
              ...slide,
              displayOrder: slide.displayOrder ?? 0,
              status: slide.status ?? 'active',
              createdAt: slide.createdAt ?? new Date().toISOString(),
              updatedAt: slide.updatedAt ?? new Date().toISOString()
            }));
            setSlides(normalizedSlides);
            setActiveSlide(0);
          } else {
            setDefaultSlides();
          }
        } else {
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
        loadSlides();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  function setDefaultSlides() {
    const now = new Date().toISOString();
    setSlides([
      {
        id: `slide_${Date.now()}_1`,
        imageUrl: '',
        title: 'Welcome to Shree Amrita Academy',
        subtitle: 'Nurturing Minds, Building Futures',
        buttonText: 'Apply Now',
        buttonLink: '/admission',
        displayOrder: 1,
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
      {
        id: `slide_${Date.now()}_2`,
        imageUrl: '',
        title: 'Admission Open 2026-2027',
        subtitle: 'Enroll Your Child for a Bright Future',
        buttonText: 'Apply Now',
        buttonLink: '/admission',
        displayOrder: 2,
        status: 'active',
        createdAt: now,
        updatedAt: now
      },
    ]);
    setActiveSlide(0);
    setHasChanges(true);
  };

  // Save slides to localStorage
  const saveSlides = () => {
    try {
      const slidesJson = JSON.stringify(slides);
      const sizeInMB = slidesJson.length / (1024 * 1024);
      
      // Check if data is too large (localStorage limit is typically 5-10MB)
      if (sizeInMB > 5) {
        alert(`Error: Data size is ${sizeInMB.toFixed(2)}MB. Maximum allowed is 5MB. Please use smaller images or fewer slides.`);
        return;
      }
      
      localStorage.setItem('heroSlides', slidesJson);
      setHasChanges(false);
      // Dispatch event to notify other components
      window.dispatchEvent(new StorageEvent('storage', { key: 'heroSlides' }));
      alert(`Slides saved successfully! (${slides.length} slides, ${sizeInMB.toFixed(2)}MB)`);
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
    const now = new Date().toISOString();
    const newSlide: Slide = {
      id: `slide_${Date.now()}`,
      imageUrl: '',
      title: 'New Slide',
      subtitle: 'Subtitle here',
      buttonText: 'Learn More',
      buttonLink: '/',
      displayOrder: slides.length + 1,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };
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
    
    const result = confirm("Are you sure you want to delete this slider?");
    if (!result) return;
    
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (activeSlide >= newSlides.length) {
      setActiveSlide(newSlides.length - 1);
    }
    setHasChanges(true);
  };

  // Update slide
  const updateSlide = (index: number, field: keyof Slide, value: string | number | 'active' | 'inactive') => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      if (newSlides[index]) {
        newSlides[index] = { 
          ...newSlides[index], 
          [field]: value,
          updatedAt: new Date().toISOString()
        };
      }
      return newSlides;
    });
    setHasChanges(true);
  };

  // Toggle slide status
  const toggleSlideStatus = (index: number) => {
    const currentStatus = slides[index].status;
    updateSlide(index, 'status', currentStatus === 'active' ? 'inactive' : 'active');
  };

  // Move slide up/down
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    
    // Update display order to reflect the new position
    newSlides.forEach((slide, idx) => {
      slide.displayOrder = idx + 1;
    });
    
    setSlides(newSlides);
    setActiveSlide(targetIndex);
    setHasChanges(true);
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP)');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // Update the current active slide with the new image
      setSlides((prevSlides) => {
        const newSlides = [...prevSlides];
        if (newSlides[activeSlide]) {
          newSlides[activeSlide] = { 
            ...newSlides[activeSlide], 
            imageUrl: base64String,
            updatedAt: new Date().toISOString()
          };
        }
        return newSlides;
      });
      setHasChanges(true);
    };
    reader.onerror = () => {
      alert('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      if (newSlides[activeSlide]) {
        newSlides[activeSlide] = { 
          ...newSlides[activeSlide], 
          imageUrl: '' ,
          updatedAt: new Date().toISOString()
        };
      }
      return newSlides;
    });
    setHasChanges(true);
  };

  // Filter slides based on search
  const filteredSlides = slides.filter((slide) =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort slides by display order
  const sortedSlides = [...filteredSlides].sort((a, b) => a.displayOrder - b.displayOrder);

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
              Add New Slider
            </Button>
          </div>

          {/* Search */}
          {slides.length > 5 && (
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search slides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {sortedSlides.map((slide, index) => {
              // Find the original index in the unsorted array
              const originalIndex = slides.findIndex(s => s.id === slide.id);
              return (
                <div
                  key={slide.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    activeSlide === originalIndex
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveSlide(originalIndex)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                      <span className="text-xs font-medium">{slide.displayOrder}</span>
                    </div>
                    {slide.imageUrl && (
                      <img 
                        src={slide.imageUrl} 
                        alt="" 
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    {!slide.imageUrl && (
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{slide.title || 'Untitled'}</p>
                      <p className="text-xs text-gray-500 truncate">{slide.subtitle || 'No subtitle'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          slide.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {slide.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          #{slide.displayOrder}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSlide(originalIndex, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSlide(originalIndex, 'down');
                          }}
                          disabled={index === sortedSlides.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSlideStatus(originalIndex);
                          }}
                          className={`p-1 rounded ${
                            slide.status === 'active' 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSlide(originalIndex);
                          }}
                          className="p-1 hover:bg-red-100 text-red-500 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slide Image *
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
                    <label
                      htmlFor="image-upload"
                      className="relative h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP up to 2MB</p>
                      <p className="text-xs text-gray-400 mt-2">Or leave empty for gradient background</p>
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    label=""
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
                    label=""
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
                      label=""
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
                      label=""
                      value={slides[activeSlide].buttonLink || ''}
                      onChange={(e) => updateSlide(activeSlide, 'buttonLink', e.target.value)}
                      placeholder="e.g., /admission"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <Input
                      type="number"
                      value={slides[activeSlide].displayOrder}
                      onChange={(e) => updateSlide(activeSlide, 'displayOrder', parseInt(e.target.value) || 1)}
                      placeholder="Order number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={slides[activeSlide].status}
                      onChange={(e) => updateSlide(activeSlide, 'status', e.target.value as 'active' | 'inactive')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
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