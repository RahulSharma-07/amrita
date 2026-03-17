import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlider extends Document {
  title?: string;
  subtitle?: string;
  imageUrl: string;
  publicId: string;
  buttonText?: string;
  buttonLink?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSliderSchema: Schema = new Schema({
  title: { type: String },
  subtitle: { type: String },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  buttonText: { type: String, default: 'Apply Now' },
  buttonLink: { type: String, default: '/admission' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

HeroSliderSchema.index({ displayOrder: 1 });
HeroSliderSchema.index({ isActive: 1 });
HeroSliderSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.HeroSlider || mongoose.model<IHeroSlider>('HeroSlider', HeroSliderSchema);
