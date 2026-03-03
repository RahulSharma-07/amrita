import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  admissionId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'Created' | 'Attempted' | 'Paid' | 'Failed' | 'Refunded';
  receiptUrl?: string;
  metadata?: {
    studentName: string;
    classApplied: string;
    parentEmail: string;
    parentPhone: string;
  };
  failureReason?: string;
  refundedAt?: Date;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  admissionId: { type: Schema.Types.ObjectId, ref: 'Admission', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['Created', 'Attempted', 'Paid', 'Failed', 'Refunded'], default: 'Created' },
  receiptUrl: { type: String },
  metadata: {
    studentName: { type: String },
    classApplied: { type: String },
    parentEmail: { type: String },
    parentPhone: { type: String },
  },
  failureReason: { type: String },
  refundedAt: { type: Date },
  refundAmount: { type: Number },
}, { timestamps: true });

PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ admissionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
