import mongoose, { Schema, Document } from 'mongoose';

export interface ITourImage {
  url: string;
  caption?: string;
}

export interface ITour extends Document {
  title: string;
  description?: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  cost: number;
  costIncludes?: string[];
  costExcludes?: string[];
  images: ITourImage[];
  itinerary?: string[];
  registrationLink?: string;
  registrationDeadline?: Date;
  maxParticipants?: number;
  registeredParticipants: number;
  applicableClasses: string[];
  contactPerson?: string;
  contactPhone?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TourImageSchema: Schema = new Schema({
  url: { type: String, required: true },
  caption: { type: String },
});

const TourSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: String, required: true },
  cost: { type: Number, required: true },
  costIncludes: [{ type: String }],
  costExcludes: [{ type: String }],
  images: [TourImageSchema],
  itinerary: [{ type: String }],
  registrationLink: { type: String },
  registrationDeadline: { type: Date },
  maxParticipants: { type: Number },
  registeredParticipants: { type: Number, default: 0 },
  applicableClasses: [{ type: String, required: true }],
  contactPerson: { type: String },
  contactPhone: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

TourSchema.index({ startDate: 1 });
TourSchema.index({ isActive: 1 });
TourSchema.index({ applicableClasses: 1 });

export default mongoose.models.Tour || mongoose.model<ITour>('Tour', TourSchema);
