import { z } from 'zod';

// Student Details Schema
export const studentDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  nationality: z.string().default('Indian'),
  religion: z.string().min(1, 'Religion is required'),
  category: z.string().min(1, 'Category is required'),
  bloodGroup: z.string().optional().or(z.literal('')),
  aadharNumber: z.string().length(12, 'Aadhar number must be 12 digits').optional().or(z.literal('')),
  applyingForClass: z.string().min(1, 'Class is required'),
  academicYear: z.string().default('2026-2027'),
});

// Parent Details Schema (relaxed for testing)
export const parentDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  occupation: z.string().optional().or(z.literal('')),
  qualification: z.string().optional().or(z.literal('')),
  annualIncome: z.union([z.number(), z.string()]).optional().transform((val) => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    }
    return val;
  }),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().optional().or(z.literal('')),
  aadharNumber: z.string().optional().or(z.literal('')),
});

// Address Schema (relaxed for testing)
export const addressSchema = z.object({
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  country: z.string().default('India'),
});

// Previous School Schema
export const previousSchoolSchema = z.object({
  schoolName: z.string().optional(),
  board: z.string().optional(),
  classCompleted: z.string().optional(),
  yearOfPassing: z.string().optional(),
  percentage: z.string().optional(),
  address: z.string().optional(),
});

// Admission Form Schema
export const admissionFormSchema = z.object({
  studentDetails: studentDetailsSchema,
  fatherDetails: parentDetailsSchema,
  motherDetails: parentDetailsSchema,
  presentAddress: addressSchema,
  permanentAddress: addressSchema.extend({
    sameAsPresent: z.boolean().default(false),
  }),
  previousSchoolDetails: previousSchoolSchema.optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Faculty Schema
export const facultySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  qualification: z.string().min(2, 'Qualification is required'),
  specialization: z.string().optional(),
  experience: z.number().min(0, 'Experience cannot be negative'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  assignedClasses: z.array(z.string()),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  designation: z.string().min(1, 'Designation is required'),
  bio: z.string().optional(),
  teachingDemoVideo: z.string().url().optional(),
});

// Event Schema
export const eventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  eventType: z.enum(['Event', 'Holiday', 'Exam', 'Meeting', 'Function', 'Other']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isAllDay: z.boolean().default(true),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(['Academic', 'Sports', 'Cultural', 'Administrative', 'General']),
  applicableClasses: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
});

// Notice Schema
export const noticeSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.enum(['General', 'Academic', 'Exam', 'Admission', 'Event', 'Holiday', 'Urgent']),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent']),
  targetAudience: z.array(z.enum(['All', 'Students', 'Parents', 'Teachers', 'Staff'])),
  applicableClasses: z.array(z.string()).optional(),
  isPinned: z.boolean().default(false),
  publishDate: z.string().min(1, 'Publish date is required'),
  expiryDate: z.string().optional(),
});

// User Schema
export const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sub Admin', 'Accountant', 'Teacher', 'Staff']),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Gallery Schema
export const gallerySchema = z.object({
  albumName: z.string().min(2, 'Album name is required'),
  description: z.string().optional(),
  eventDate: z.string().optional(),
  category: z.enum(['Events', 'Sports', 'Academic', 'Cultural', 'Infrastructure', 'Other']),
});

// Tour Schema
export const tourSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  duration: z.string().min(1, 'Duration is required'),
  cost: z.number().min(0, 'Cost is required'),
  costIncludes: z.array(z.string()).optional(),
  costExcludes: z.array(z.string()).optional(),
  itinerary: z.array(z.string()).optional(),
  registrationLink: z.string().url().optional(),
  registrationDeadline: z.string().optional(),
  maxParticipants: z.number().optional(),
  applicableClasses: z.array(z.string()).min(1, 'At least one class is required'),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
});

// Document Schema
export const documentSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['Prospectus', 'Circular', 'Exam Schedule', 'Syllabus', 'Form', 'Other']),
  applicableClasses: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
});

// Types
export type StudentDetailsInput = z.infer<typeof studentDetailsSchema>;
export type ParentDetailsInput = z.infer<typeof parentDetailsSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type PreviousSchoolInput = z.infer<typeof previousSchoolSchema>;
export type AdmissionFormInput = z.infer<typeof admissionFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FacultyInput = z.infer<typeof facultySchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type TourInput = z.infer<typeof tourSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
