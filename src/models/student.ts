import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance {
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  remarks?: string;
}

export interface IStudent extends Document {
  admissionId: mongoose.Types.ObjectId;
  studentId: string;
  rollNumber?: string;
  class: string;
  section: string;
  academicYear: string;
  attendance: IAttendance[];
  attendancePercentage: number;
  fees: {
    totalFees: number;
    paidAmount: number;
    pendingAmount: number;
    lastPaymentDate?: Date;
    paymentStatus: 'Paid' | 'Partial' | 'Pending';
  };
  isActive: boolean;
  promotedToNextClass: boolean;
  promotedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], required: true },
  remarks: { type: String },
});

const StudentSchema: Schema = new Schema({
  admissionId: { type: Schema.Types.ObjectId, ref: 'Admission', required: true },
  studentId: { type: String, required: true, unique: true },
  rollNumber: { type: String },
  class: { type: String, required: true },
  section: { type: String, required: true },
  academicYear: { type: String, required: true },
  attendance: [AttendanceSchema],
  attendancePercentage: { type: Number, default: 0 },
  fees: {
    totalFees: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    lastPaymentDate: { type: Date },
    paymentStatus: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' },
  },
  isActive: { type: Boolean, default: true },
  promotedToNextClass: { type: Boolean, default: false },
  promotedDate: { type: Date },
}, { timestamps: true });

StudentSchema.index({ studentId: 1 });
StudentSchema.index({ admissionId: 1 });
StudentSchema.index({ class: 1, section: 1 });
StudentSchema.index({ academicYear: 1 });
StudentSchema.index({ isActive: 1 });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
