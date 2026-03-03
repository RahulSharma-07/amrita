import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Exam' | 'Admission' | 'Event' | 'Holiday' | 'Urgent';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  targetAudience: ('All' | 'Students' | 'Parents' | 'Teachers' | 'Staff')[];
  applicableClasses?: string[];
  attachmentUrl?: string;
  isPinned: boolean;
  isPublished: boolean;
  publishDate: Date;
  expiryDate?: Date;
  viewCount: number;
  createdBy: mongoose.Types.ObjectId;
  sentEmail: boolean;
  emailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'Academic', 'Exam', 'Admission', 'Event', 'Holiday', 'Urgent'], default: 'General' },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Urgent'], default: 'Normal' },
  targetAudience: [{ type: String, enum: ['All', 'Students', 'Parents', 'Teachers', 'Staff'] }],
  applicableClasses: [{ type: String }],
  attachmentUrl: { type: String },
  isPinned: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  publishDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  viewCount: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sentEmail: { type: Boolean, default: false },
  emailSentAt: { type: Date },
}, { timestamps: true });

NoticeSchema.index({ isPinned: -1, publishDate: -1 });
NoticeSchema.index({ category: 1 });
NoticeSchema.index({ priority: 1 });
NoticeSchema.index({ isPublished: 1 });
NoticeSchema.index({ publishDate: -1 });
NoticeSchema.index({ expiryDate: 1 });

export default mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
