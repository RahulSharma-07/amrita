'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { School, User, Users, UploadCloud, Loader2, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

export default function AdmissionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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
      occupation: '',
      phone: '',
      email: '',
      qualification: '',
      annualIncome: '',
    },
    motherDetails: {
      name: '',
      occupation: '',
      phone: '',
      email: '',
      qualification: '',
      annualIncome: '',
    },
    presentAddress: {
      addressLine1: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    permanentAddress: {
      addressLine1: '',
      city: '',
      state: '',
      pincode: '',
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      window.scrollTo(0, 0);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      window.scrollTo(0, 0);
      setCurrentStep(currentStep - 1);
    }
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
      
      // Sync permanent address if flag is set
      const finalPermAddress = formData.permanentAddress.sameAsPresent 
        ? { ...formData.presentAddress, sameAsPresent: true }
        : formData.permanentAddress;
        
      formDataToSend.append('permanentAddress', JSON.stringify(finalPermAddress));
      formDataToSend.append('agreedToTerms', 'true');
      formDataToSend.append('studentPhoto', studentPhoto);

      const response = await fetch('/api/admissions', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/admission/success?applicationId=${data.applicationId}`);
      } else {
        if (data.details) {
          console.error('Validation details:', data.details);
          alert(`Validation Error: ${data.details[0]?.message || 'Please check all fields'}`);
        } else {
          alert(data.error || 'Something went wrong');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="mb-12">
      <div className="flex justify-between items-center relative gap-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center flex-1 z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-all duration-500 scale-110 ${
              step === currentStep 
                ? 'bg-blue-900 text-white ring-4 ring-blue-100' 
                : step < currentStep 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-slate-400 border border-slate-200'
            }`}>
              {step < currentStep ? '✓' : step}
            </div>
            <span className={`text-[10px] sm:text-xs mt-3 font-bold uppercase tracking-wider transition-colors ${
              step <= currentStep ? 'text-blue-900' : 'text-slate-400'
            }`}>
              {step === 1 ? 'Student' : step === 2 ? 'Parents' : step === 3 ? 'Address' : 'Finalize'}
            </span>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-1 bg-slate-100 -z-0" />
        <div 
          className="absolute top-6 left-0 h-1 bg-blue-900 transition-all duration-700 ease-out -z-0"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Admission 2026-2027</h1>
          <p className="text-slate-500 text-lg">Shree Amrita Academy • Registration Portal</p>
        </header>

        <StepIndicator />

        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-white overflow-hidden">
          <form className="p-8 sm:p-12" onSubmit={(e) => { e.preventDefault(); if(currentStep === totalSteps) handleSubmit(e); else nextStep(); }}>
            
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-900">
                  <User className="w-8 h-8" />
                  <h2 className="text-2xl font-black italic uppercase">Student Info</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">First Name</label>
                    <input required value={formData.studentDetails.firstName} onChange={(e) => handleInputChange('studentDetails', 'firstName', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 transition-all outline-none" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Last Name</label>
                    <input required value={formData.studentDetails.lastName} onChange={(e) => handleInputChange('studentDetails', 'lastName', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 transition-all outline-none" placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Birth Date</label>
                    <input required type="date" value={formData.studentDetails.dateOfBirth} onChange={(e) => handleInputChange('studentDetails', 'dateOfBirth', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Gender</label>
                    <select required value={formData.studentDetails.gender} onChange={(e) => handleInputChange('studentDetails', 'gender', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 outline-none">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Religion</label>
                    <input required value={formData.studentDetails.religion} onChange={(e) => handleInputChange('studentDetails', 'religion', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 outline-none" placeholder="e.g. Hindu, Muslim, Sikh..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Category</label>
                    <select required value={formData.studentDetails.category} onChange={(e) => handleInputChange('studentDetails', 'category', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 outline-none">
                      <option value="">Select Category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Class Applying For</label>
                    <select required value={formData.studentDetails.applyingForClass} onChange={(e) => handleInputChange('studentDetails', 'applyingForClass', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 outline-none">
                      <option value="">Select Grade</option>
                      <option value="Nursery">Nursery</option>
                      <option value="LKG">LKG</option>
                      <option value="UKG">UKG</option>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={String(n)}>Class {n}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Aadhar Number</label>
                    <input placeholder="12 Digit number (Optional)" maxLength={12} value={formData.studentDetails.aadharNumber} onChange={(e) => handleInputChange('studentDetails', 'aadharNumber', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-base focus:ring-4 focus:ring-blue-100 outline-none" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-900 border-b pb-6">
                  <Users className="w-8 h-8" />
                  <h2 className="text-2xl font-black italic uppercase">Parent Info</h2>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black bg-blue-50 text-blue-900 w-max px-3 py-1 rounded-full uppercase tracking-tighter">Father's Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input required placeholder="Father's Full Name" value={formData.fatherDetails.name} onChange={(e) => handleInputChange('fatherDetails', 'name', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input required placeholder="Phone Number" maxLength={10} value={formData.fatherDetails.phone} onChange={(e) => handleInputChange('fatherDetails', 'phone', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input required placeholder="Occupation" value={formData.fatherDetails.occupation} onChange={(e) => handleInputChange('fatherDetails', 'occupation', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input placeholder="Email (Optional)" value={formData.fatherDetails.email} onChange={(e) => handleInputChange('fatherDetails', 'email', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <h3 className="text-xs font-black bg-rose-50 text-rose-900 w-max px-3 py-1 rounded-full uppercase tracking-tighter">Mother's Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input required placeholder="Mother's Full Name" value={formData.motherDetails.name} onChange={(e) => handleInputChange('motherDetails', 'name', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input required placeholder="Phone Number" maxLength={10} value={formData.motherDetails.phone} onChange={(e) => handleInputChange('motherDetails', 'phone', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input required placeholder="Occupation" value={formData.motherDetails.occupation} onChange={(e) => handleInputChange('motherDetails', 'occupation', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input placeholder="Email (Optional)" value={formData.motherDetails.email} onChange={(e) => handleInputChange('motherDetails', 'email', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-900">
                  <MapPin className="w-8 h-8" />
                  <h2 className="text-2xl font-black italic uppercase">Home Address</h2>
                </div>
                <div className="space-y-6">
                  <textarea required rows={4} placeholder="Full Address (House No, Society, Landmark...)" value={formData.presentAddress.addressLine1} onChange={(e) => handleInputChange('presentAddress', 'addressLine1', e.target.value)} className="w-full bg-slate-50 border-0 rounded-3xl p-6 text-sm outline-none resize-none"></textarea>
                  <div className="grid grid-cols-2 gap-6">
                    <input required placeholder="City / Town" value={formData.presentAddress.city} onChange={(e) => handleInputChange('presentAddress', 'city', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input required placeholder="State" value={formData.presentAddress.state} onChange={(e) => handleInputChange('presentAddress', 'state', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input required placeholder="Pincode" maxLength={6} value={formData.presentAddress.pincode} onChange={(e) => handleInputChange('presentAddress', 'pincode', e.target.value)} className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm" />
                    <input required readOnly value="India" className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm opacity-50 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-blue-900">
                  <UploadCloud className="w-8 h-8" />
                  <h2 className="text-2xl font-black italic uppercase">Final Touch</h2>
                </div>

                <div className={`relative overflow-hidden rounded-3xl p-12 text-center border-4 border-dashed transition-all group ${studentPhoto ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-900'}`}>
                  <input className="hidden" id="photo-final" type="file" accept="image/*" onChange={handlePhotoChange} />
                  <label htmlFor="photo-final" className="cursor-pointer block">
                    {photoPreview ? (
                      <div className="flex flex-col items-center gap-4">
                        <img src={photoPreview} className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl" alt="Final" />
                        <p className="text-emerald-700 font-black uppercase text-xs">Ready to submit!</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-8 h-8 text-blue-900" />
                        </div>
                        <p className="text-slate-900 font-bold">Attach Student Photo</p>
                        <p className="text-slate-400 text-xs font-medium">Click here to upload • Max 2MB</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 bg-slate-900 text-white p-6 rounded-3xl">
                    <input required type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-6 h-6 rounded-lg accent-emerald-500" />
                    <p className="text-xs font-semibold opacity-90 leading-relaxed">
                      I confirm that all information provided is accurate. I understand that the registration process is subject to verification.
                    </p>
                  </div>

                  <button 
                    disabled={isSubmitting || !agreedToTerms || !studentPhoto} 
                    className="w-full bg-blue-900 text-white py-6 rounded-3xl text-xl font-black shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <><Loader2 className="animate-spin w-8 h-8" /> Submitting...</> : 'SUBMIT APPLICATION'}
                  </button>
                </div>
              </div>
            )}

            <div className={`flex justify-between items-center mt-12 pt-8 border-t ${currentStep === 1 ? 'justify-end' : ''}`}>
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-400 font-black uppercase text-xs hover:text-blue-900 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {currentStep < totalSteps && (
                <button type="button" onClick={nextStep} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-blue-900 transition-all shadow-lg">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© {new Date().getFullYear()} Shree Amrita Academy</p>
          <div className="flex justify-center gap-6 mt-4 opacity-50 font-bold uppercase text-[10px]">
             <Link href="/privacy-policy" className="hover:text-blue-900">Privacy</Link>
             <Link href="/terms" className="hover:text-blue-900">Terms</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
