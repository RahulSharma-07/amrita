import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description?: string;
  eventType: 'Event' | 'Holiday' | 'Exam' | 'Meeting' | 'Function' | 'Other';
  startDate: Date;
  endDate?: Date;
  isAllDay: boolean;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: 'Academic' | 'Sports' | 'Cultural' | 'Administrative' | 'General';
  applicableClasses?: string[];
  isPublic: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  eventType: { type: String, enum: ['Event', 'Holiday', 'Exam', 'Meeting', 'Function', 'Other'], default: 'Event' },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isAllDay: { type: Boolean, default: true },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String },
  category: { type: String, enum: ['Academic', 'Sports', 'Cultural', 'Administrative', 'General'], default: 'General' },
  applicableClasses: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

EventSchema.index({ startDate: 1 });
EventSchema.index({ eventType: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ isPublic: 1 });
EventSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
