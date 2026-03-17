import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmission extends Document {
  uniqueApplicationID: string;
  studentDetails: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female' | 'Other';
    nationality: string;
    religion: string;
    category: string;
    bloodGroup?: string;
    aadharNumber?: string;
    applyingForClass: string;
    academicYear: string;
    photo?: string;
    birthCertificate?: string;
    aadharCard?: string;
    previousMarksheet?: string;
    transferCertificate?: string;
  };
  fatherDetails: {
    name: string;
    profession: string;
    qualification: string;
    annualIncome: number;
    phone: string;
    email?: string;
    aadharNumber?: string;
    photo?: string;
  };
  motherDetails: {
    name: string;
    profession: string;
    qualification: string;
    annualIncome: number;
    phone: string;
    email?: string;
    aadharNumber?: string;
    photo?: string;
  };
  presentAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  permanentAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    sameAsPresent: boolean;
  };
  previousSchoolDetails?: {
    schoolName: string;
    board: string;
    classCompleted: string;
    yearOfPassing: string;
    percentage: string;
    address?: string;
  };
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  applicationStatus: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  adminRemarks?: string;
  registrationFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema: Schema = new Schema({
  uniqueApplicationID: { type: String, required: true, unique: true },
  studentDetails: {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    nationality: { type: String, required: true, default: 'Indian' },
    religion: { type: String, required: true },
    category: { type: String, required: true },
    bloodGroup: { type: String },
    aadharNumber: { type: String },
    applyingForClass: { type: String, required: true },
    academicYear: { type: String, required: true, default: '2026-2027' },
    photo: { type: String },
    birthCertificate: { type: String },
    aadharCard: { type: String },
    previousMarksheet: { type: String },
    transferCertificate: { type: String },
  },
  fatherDetails: {
    name: { type: String, required: true },
    profession: { type: String, required: true },
    qualification: { type: String, required: true },
    annualIncome: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    aadharNumber: { type: String },
    photo: { type: String },
  },
  motherDetails: {
    name: { type: String, required: true },
    profession: { type: String, required: true },
    qualification: { type: String, required: true },
    annualIncome: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    aadharNumber: { type: String },
    photo: { type: String },
  },
  presentAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  permanentAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    sameAsPresent: { type: Boolean, default: false },
  },
  previousSchoolDetails: {
    schoolName: { type: String },
    board: { type: String },
    classCompleted: { type: String },
    yearOfPassing: { type: String },
    percentage: { type: String },
    address: { type: String },
  },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Paid' },
  applicationStatus: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], default: 'Pending' },
  adminRemarks: { type: String },
  registrationFee: { type: Number, default: 0 },
}, { timestamps: true });

AdmissionSchema.index({ uniqueApplicationID: 1 });
AdmissionSchema.index({ 'studentDetails.aadharNumber': 1 });
AdmissionSchema.index({ applicationStatus: 1 });
AdmissionSchema.index({ paymentStatus: 1 });
AdmissionSchema.index({ createdAt: -1 });

export default mongoose.models.Admission || mongoose.model<IAdmission>('Admission', AdmissionSchema);
