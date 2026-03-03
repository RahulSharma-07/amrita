import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  qualification: string;
  specialization?: string;
  experience: number;
  joiningDate: Date;
  assignedClasses: string[];
  subjects: string[];
  designation: string;
  bio?: string;
  teachingDemoVideo?: string;
  address?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema: Schema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  photo: { type: String },
  qualification: { type: String, required: true },
  specialization: { type: String },
  experience: { type: Number, required: true, default: 0 },
  joiningDate: { type: Date, required: true },
  assignedClasses: [{ type: String }],
  subjects: [{ type: String, required: true }],
  designation: { type: String, required: true },
  bio: { type: String },
  teachingDemoVideo: { type: String },
  address: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

FacultySchema.index({ employeeId: 1 });
FacultySchema.index({ email: 1 });
FacultySchema.index({ subjects: 1 });
FacultySchema.index({ assignedClasses: 1 });
FacultySchema.index({ isActive: 1 });

export default mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema);
