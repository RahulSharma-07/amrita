import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImage {
  url: string;
  publicId: string;
  caption?: string;
  order: number;
}

export interface IGallery extends Document {
  albumName: string;
  description?: string;
  coverImage?: string;
  images: IGalleryImage[];
  eventDate?: Date;
  category: 'Events' | 'Sports' | 'Academic' | 'Cultural' | 'Infrastructure' | 'Other';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema: Schema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  caption: { type: String },
  order: { type: Number, default: 0 },
});

const GallerySchema: Schema = new Schema({
  albumName: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  images: [GalleryImageSchema],
  eventDate: { type: Date },
  category: { type: String, enum: ['Events', 'Sports', 'Academic', 'Cultural', 'Infrastructure', 'Other'], default: 'Events' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

GallerySchema.index({ albumName: 1 });
GallerySchema.index({ category: 1 });
GallerySchema.index({ eventDate: -1 });
GallerySchema.index({ isActive: 1 });

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
