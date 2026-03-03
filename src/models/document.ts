import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: 'Prospectus' | 'Circular' | 'Exam Schedule' | 'Syllabus' | 'Form' | 'Other';
  applicableClasses?: string[];
  isPublic: boolean;
  downloadCount: number;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  category: { type: String, enum: ['Prospectus', 'Circular', 'Exam Schedule', 'Syllabus', 'Form', 'Other'], default: 'Other' },
  applicableClasses: [{ type: String }],
  isPublic: { type: Boolean, default: true },
  downloadCount: { type: Number, default: 0 },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

DocumentSchema.index({ category: 1 });
DocumentSchema.index({ isPublic: 1 });
DocumentSchema.index({ createdAt: -1 });

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
