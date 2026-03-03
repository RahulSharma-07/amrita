'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { School, User, Users, UploadCloud, Loader2 } from 'lucide-react';

export default function AdmissionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    studentDetails: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      religion: '',
      category: '',
      aadharNumber: '',
      applyingForClass: '',
      nationality: 'Indian',
    },
    fatherDetails: {
      name: '',
      profession: '',
      phone: '',
      email: '',
      qualification: 'NA',
      annualIncome: '0',
    },
    motherDetails: {
      name: '',
      profession: '',
      phone: '',
      email: '',
      qualification: 'NA',
      annualIncome: '0',
    },
    presentAddress: {
      addressLine1: 'NA',
      city: 'NA',
      state: 'NA',
      pincode: '000000',
      country: 'India',
    },
    permanentAddress: {
      addressLine1: 'NA',
      city: 'NA',
      state: 'NA',
      pincode: '000000',
      country: 'India',
      sameAsPresent: true,
    }
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPG, JPEG, and PNG formats are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      e.target.value = '';
      return;
    }

    setStudentPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (!studentPhoto) {
      alert('Please upload a student photo.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('studentDetails', JSON.stringify(formData.studentDetails));
      formDataToSend.append('fatherDetails', JSON.stringify(formData.fatherDetails));
      formDataToSend.append('motherDetails', JSON.stringify(formData.motherDetails));
      formDataToSend.append('presentAddress', JSON.stringify(formData.presentAddress));
      formDataToSend.append('permanentAddress', JSON.stringify(formData.permanentAddress));
      formDataToSend.append('agreedToTerms', 'true');
      formDataToSend.append('studentPhoto', studentPhoto);

      const response = await fetch('/api/admissions', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to payment page
        router.push(`/admission/payment?orderId=${data.orderId}&applicationId=${data.applicationId}`);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-display">
      <div className="max-w-[800px] mx-auto">

        {/* Header Text */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Student Admission Form</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Academic Session 2024-2025 • Priority Admissions</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <form className="p-4 sm:p-8 space-y-10" onSubmit={handleSubmit}>

            {/* Section: Student Information */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                <User className="w-6 h-6 text-primary-ui" />
                <h2 className="text-xl font-bold">Student Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                  <input required value={formData.studentDetails.firstName} onChange={(e) => handleInputChange('studentDetails', 'firstName', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" placeholder="First Name" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                  <input required value={formData.studentDetails.lastName} onChange={(e) => handleInputChange('studentDetails', 'lastName', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" placeholder="Last Name" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                  <input required value={formData.studentDetails.dateOfBirth} onChange={(e) => handleInputChange('studentDetails', 'dateOfBirth', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                  <select required value={formData.studentDetails.gender} onChange={(e) => handleInputChange('studentDetails', 'gender', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Blood Group</label>
                  <select value={formData.studentDetails.bloodGroup} onChange={(e) => handleInputChange('studentDetails', 'bloodGroup', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Religion</label>
                  <input required value={formData.studentDetails.religion} onChange={(e) => handleInputChange('studentDetails', 'religion', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" placeholder="Enter religion" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select required value={formData.studentDetails.category} onChange={(e) => handleInputChange('studentDetails', 'category', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none">
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aadhaar / ID Number</label>
                  <input value={formData.studentDetails.aadharNumber} onChange={(e) => handleInputChange('studentDetails', 'aadharNumber', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" placeholder="12-digit Aadhaar number" maxLength={12} type="text" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Applying for Class</label>
                  <select required value={formData.studentDetails.applyingForClass} onChange={(e) => handleInputChange('studentDetails', 'applyingForClass', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none">
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section: Parent Details */}
            <section className="space-y-8">
              <div className="flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Users className="w-6 h-6 text-primary-ui" />
                <h2 className="text-xl font-bold">Parent Details</h2>
              </div>

              {/* Father Details */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl space-y-4 border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Father's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Full Name</label>
                    <input required value={formData.fatherDetails.name} onChange={(e) => handleInputChange('fatherDetails', 'name', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Occupation</label>
                    <input required value={formData.fatherDetails.profession} onChange={(e) => handleInputChange('fatherDetails', 'profession', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phone Number</label>
                    <input required value={formData.fatherDetails.phone} onChange={(e) => handleInputChange('fatherDetails', 'phone', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="text" maxLength={10} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email Address</label>
                    <input value={formData.fatherDetails.email} onChange={(e) => handleInputChange('fatherDetails', 'email', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="email" />
                  </div>
                </div>
              </div>

              {/* Mother Details */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl space-y-4 border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Mother's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Full Name</label>
                    <input required value={formData.motherDetails.name} onChange={(e) => handleInputChange('motherDetails', 'name', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Occupation</label>
                    <input required value={formData.motherDetails.profession} onChange={(e) => handleInputChange('motherDetails', 'profession', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Phone Number</label>
                    <input value={formData.motherDetails.phone} onChange={(e) => handleInputChange('motherDetails', 'phone', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="text" maxLength={10} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email Address</label>
                    <input value={formData.motherDetails.email} onChange={(e) => handleInputChange('motherDetails', 'email', e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-2 focus:ring-primary-ui focus:border-primary-ui outline-none" type="email" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Document Upload */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                <UploadCloud className="w-6 h-6 text-primary-ui" />
                <h2 className="text-xl font-bold">Student Photo Upload <span className="text-rose-500">*</span></h2>
              </div>
              <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer group bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden relative ${studentPhoto ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-700 hover:border-primary-ui'}`}>

                <input required={!studentPhoto} className="hidden" id="photo-upload" type="file" accept="image/jpeg, image/png, image/jpg" onChange={handlePhotoChange} />

                <label className="cursor-pointer flex flex-col items-center justify-center w-full min-h-[140px]" htmlFor="photo-upload">
                  {photoPreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <img src={photoPreview} alt="Student preview" className="w-24 h-24 object-cover rounded-full border-4 border-emerald-100 shadow-md" />
                      <p className="text-emerald-600 font-medium">Photo Attached Successfully</p>
                      <span className="text-indigo-600 text-sm underline group-hover:text-indigo-700">Change Photo</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-primary-ui/10 rounded-full flex items-center justify-center text-primary-ui mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">Click to upload or drag and drop</p>
                      <p className="text-sm text-slate-500 mt-1">PNG, JPG or JPEG (max. 2MB)</p>
                    </>
                  )}
                </label>
              </div>
            </section>

            {/* Footer Action */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex items-start gap-3">
                <input
                  required
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-primary-ui focus:ring-primary-ui"
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <label className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium" htmlFor="terms">
                  I hereby declare that all the information provided above is true and accurate to the best of my knowledge. I understand that any false statement may lead to disqualification.
                </label>
              </div>

              <button disabled={isSubmitting || !agreedToTerms} className="w-full flex items-center justify-center gap-2 bg-primary-ui text-white py-4 px-6 rounded-lg text-lg font-bold shadow-lg shadow-primary-ui/30 hover:bg-primary-ui/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Submitting...</> : 'Submit Admission Form'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Small Print */}
        <footer className="mt-12 pb-12 text-center text-sm text-slate-500">
          <p>© 2024 EduPrime Academy. All Rights Reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link className="hover:underline" href="/privacy-policy">Privacy Policy</Link>
            <span>•</span>
            <Link className="hover:underline" href="/terms-of-service">Terms of Service</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
