'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  url: string;
  caption?: string;
}

interface GalleryAlbum {
  _id: string;
  albumName: string;
  description?: string;
  coverImage?: string;
  images: GalleryImage[];
  category: string;
  eventDate?: string;
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // First try to get from localStorage (for admin-added albums)
        const localAlbums = localStorage.getItem('galleryAlbums');
        if (localAlbums) {
          const parsed = JSON.parse(localAlbums);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAlbums(parsed);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to API
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setAlbums(data.albums);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (album: GalleryAlbum, index: number) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedAlbum.images.length);
    }
  };

  const prevImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
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
            Event Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Capturing memorable moments from our school events and activities
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album, index) => (
              <motion.div
                key={album._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openLightbox(album, 0)}
              >
                <div className="relative h-64">
                  {album.coverImage || album.images[0]?.url ? (
                    <img
                      src={album.coverImage || album.images[0]?.url}
                      alt={album.albumName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <span className="text-xs bg-red-600 px-2 py-1 rounded-full">{album.category}</span>
                    <h3 className="text-lg font-bold mt-2">{album.albumName}</h3>
                    <p className="text-sm opacity-90">{album.images.length} photos</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="max-w-5xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedAlbum.images[currentImageIndex]?.url}
                alt={selectedAlbum.images[currentImageIndex]?.caption || 'Gallery image'}
                className="max-w-full max-h-[80vh] object-contain"
              />
              {selectedAlbum.images[currentImageIndex]?.caption && (
                <p className="text-white text-center mt-4">
                  {selectedAlbum.images[currentImageIndex].caption}
                </p>
              )}
              <p className="text-gray-400 text-center mt-2">
                {currentImageIndex + 1} / {selectedAlbum.images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
