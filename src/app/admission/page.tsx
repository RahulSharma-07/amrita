'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const steps = [
  { id: 1, title: 'Student Details' },
  { id: 2, title: 'Father Details' },
  { id: 3, title: 'Mother Details' },
  { id: 4, title: 'Present Address' },
  { id: 5, title: 'Permanent Address' },
  { id: 6, title: 'Previous School' },
  { id: 7, title: 'Payment' },
];

const classOptions = [
  { value: 'Nursery', label: 'Nursery' },
  { value: 'LKG', label: 'LKG' },
  { value: 'UKG', label: 'UKG' },
  { value: '1', label: 'Class 1' },
  { value: '2', label: 'Class 2' },
  { value: '3', label: 'Class 3' },
  { value: '4', label: 'Class 4' },
  { value: '5', label: 'Class 5' },
  { value: '6', label: 'Class 6' },
  { value: '7', label: 'Class 7' },
  { value: '8', label: 'Class 8' },
  { value: '9', label: 'Class 9' },
  { value: '10', label: 'Class 10' },
  { value: '11', label: 'Class 11' },
  { value: '12', label: 'Class 12' },
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const categoryOptions = [
  { value: 'General', label: 'General' },
  { value: 'SC', label: 'SC' },
  { value: 'ST', label: 'ST' },
  { value: 'OBC', label: 'OBC' },
  { value: 'EWS', label: 'EWS' },
];

const religionOptions = [
  { value: 'Hindu', label: 'Hindu' },
  { value: 'Muslim', label: 'Muslim' },
  { value: 'Christian', label: 'Christian' },
  { value: 'Sikh', label: 'Sikh' },
  { value: 'Jain', label: 'Jain' },
  { value: 'Buddhist', label: 'Buddhist' },
  { value: 'Other', label: 'Other' },
];

export default function AdmissionPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    studentDetails: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Indian',
      religion: '',
      category: '',
      bloodGroup: '',
      aadharNumber: '',
      applyingForClass: '',
    },
    fatherDetails: {
      name: '',
      profession: '',
      qualification: '',
      annualIncome: '',
      phone: '',
      email: '',
      aadharNumber: '',
    },
    motherDetails: {
      name: '',
      profession: '',
      qualification: '',
      annualIncome: '',
      phone: '',
      email: '',
      aadharNumber: '',
    },
    presentAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    permanentAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    previousSchoolDetails: {
      schoolName: '',
      board: '',
      classCompleted: '',
      yearOfPassing: '',
      percentage: '',
      address: '',
    },
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

  const handleSameAsPresentChange = (checked: boolean) => {
    setSameAsPresent(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: { ...prev.presentAddress },
      }));
    }
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('studentDetails', JSON.stringify(formData.studentDetails));
      formDataToSend.append('fatherDetails', JSON.stringify(formData.fatherDetails));
      formDataToSend.append('motherDetails', JSON.stringify(formData.motherDetails));
      formDataToSend.append('presentAddress', JSON.stringify(formData.presentAddress));
      formDataToSend.append('permanentAddress', JSON.stringify({
        ...formData.permanentAddress,
        sameAsPresent: sameAsPresent,
      }));
      formDataToSend.append('previousSchoolDetails', JSON.stringify(formData.previousSchoolDetails));
      formDataToSend.append('agreedToTerms', 'true');

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="First Name"
                required
                value={formData.studentDetails.firstName}
                onChange={(e) => handleInputChange('studentDetails', 'firstName', e.target.value)}
              />
              <Input
                label="Middle Name"
                value={formData.studentDetails.middleName}
                onChange={(e) => handleInputChange('studentDetails', 'middleName', e.target.value)}
              />
              <Input
                label="Last Name"
                required
                value={formData.studentDetails.lastName}
                onChange={(e) => handleInputChange('studentDetails', 'lastName', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Date of Birth"
                type="date"
                required
                value={formData.studentDetails.dateOfBirth}
                onChange={(e) => handleInputChange('studentDetails', 'dateOfBirth', e.target.value)}
              />
              <Select
                label="Gender"
                required
                options={genderOptions}
                value={formData.studentDetails.gender}
                onChange={(e) => handleInputChange('studentDetails', 'gender', e.target.value)}
              />
              <Select
                label="Blood Group"
                options={[
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' },
                ]}
                value={formData.studentDetails.bloodGroup}
                onChange={(e) => handleInputChange('studentDetails', 'bloodGroup', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Religion"
                required
                options={religionOptions}
                value={formData.studentDetails.religion}
                onChange={(e) => handleInputChange('studentDetails', 'religion', e.target.value)}
              />
              <Select
                label="Category"
                required
                options={categoryOptions}
                value={formData.studentDetails.category}
                onChange={(e) => handleInputChange('studentDetails', 'category', e.target.value)}
              />
              <Input
                label="Aadhar Number"
                maxLength={12}
                value={formData.studentDetails.aadharNumber}
                onChange={(e) => handleInputChange('studentDetails', 'aadharNumber', e.target.value)}
              />
            </div>
            <Select
              label="Applying For Class"
              required
              options={classOptions}
              value={formData.studentDetails.applyingForClass}
              onChange={(e) => handleInputChange('studentDetails', 'applyingForClass', e.target.value)}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Father's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Father's Name"
                required
                value={formData.fatherDetails.name}
                onChange={(e) => handleInputChange('fatherDetails', 'name', e.target.value)}
              />
              <Input
                label="profession"
                required
                value={formData.fatherDetails.profession}
                onChange={(e) => handleInputChange('fatherDetails', 'profession', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Qualification"
                required
                value={formData.fatherDetails.qualification}
                onChange={(e) => handleInputChange('fatherDetails', 'qualification', e.target.value)}
              />
              <Input
                label="Annual Income"
                type="number"
                required
                value={formData.fatherDetails.annualIncome}
                onChange={(e) => handleInputChange('fatherDetails', 'annualIncome', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                required
                maxLength={10}
                value={formData.fatherDetails.phone}
                onChange={(e) => handleInputChange('fatherDetails', 'phone', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={formData.fatherDetails.email}
                onChange={(e) => handleInputChange('fatherDetails', 'email', e.target.value)}
              />
            </div>
            <Input
              label="Aadhar Number"
              maxLength={12}
              value={formData.fatherDetails.aadharNumber}
              onChange={(e) => handleInputChange('fatherDetails', 'aadharNumber', e.target.value)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Mother's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Mother's Name"
                required
                value={formData.motherDetails.name}
                onChange={(e) => handleInputChange('motherDetails', 'name', e.target.value)}
              />
              <Input
                label="profession"
                required
                value={formData.motherDetails.profession}
                onChange={(e) => handleInputChange('motherDetails', 'profession', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Qualification"
                required
                value={formData.motherDetails.qualification}
                onChange={(e) => handleInputChange('motherDetails', 'qualification', e.target.value)}
              />
              <Input
                label="Annual Income"
                type="number"
                required
                value={formData.motherDetails.annualIncome}
                onChange={(e) => handleInputChange('motherDetails', 'annualIncome', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                required
                maxLength={10}
                value={formData.motherDetails.phone}
                onChange={(e) => handleInputChange('motherDetails', 'phone', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={formData.motherDetails.email}
                onChange={(e) => handleInputChange('motherDetails', 'email', e.target.value)}
              />
            </div>
            <Input
              label="Aadhar Number"
              maxLength={12}
              value={formData.motherDetails.aadharNumber}
              onChange={(e) => handleInputChange('motherDetails', 'aadharNumber', e.target.value)}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Present Address</h3>
            <Input
              label="Address Line 1"
              required
              value={formData.presentAddress.addressLine1}
              onChange={(e) => handleInputChange('presentAddress', 'addressLine1', e.target.value)}
            />
            <Input
              label="Address Line 2"
              value={formData.presentAddress.addressLine2}
              onChange={(e) => handleInputChange('presentAddress', 'addressLine2', e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="City"
                required
                value={formData.presentAddress.city}
                onChange={(e) => handleInputChange('presentAddress', 'city', e.target.value)}
              />
              <Input
                label="State"
                required
                value={formData.presentAddress.state}
                onChange={(e) => handleInputChange('presentAddress', 'state', e.target.value)}
              />
              <Input
                label="Pincode"
                required
                maxLength={6}
                value={formData.presentAddress.pincode}
                onChange={(e) => handleInputChange('presentAddress', 'pincode', e.target.value)}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Permanent Address</h3>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="sameAsPresent"
                checked={sameAsPresent}
                onChange={(e) => handleSameAsPresentChange(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="sameAsPresent" className="ml-2 text-gray-700">
                Same as Present Address
              </label>
            </div>
            <Input
              label="Address Line 1"
              required
              value={formData.permanentAddress.addressLine1}
              onChange={(e) => handleInputChange('permanentAddress', 'addressLine1', e.target.value)}
              disabled={sameAsPresent}
            />
            <Input
              label="Address Line 2"
              value={formData.permanentAddress.addressLine2}
              onChange={(e) => handleInputChange('permanentAddress', 'addressLine2', e.target.value)}
              disabled={sameAsPresent}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="City"
                required
                value={formData.permanentAddress.city}
                onChange={(e) => handleInputChange('permanentAddress', 'city', e.target.value)}
                disabled={sameAsPresent}
              />
              <Input
                label="State"
                required
                value={formData.permanentAddress.state}
                onChange={(e) => handleInputChange('permanentAddress', 'state', e.target.value)}
                disabled={sameAsPresent}
              />
              <Input
                label="Pincode"
                required
                maxLength={6}
                value={formData.permanentAddress.pincode}
                onChange={(e) => handleInputChange('permanentAddress', 'pincode', e.target.value)}
                disabled={sameAsPresent}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Previous School Details (Optional)</h3>
            <Input
              label="School Name"
              value={formData.previousSchoolDetails.schoolName}
              onChange={(e) => handleInputChange('previousSchoolDetails', 'schoolName', e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Board"
                value={formData.previousSchoolDetails.board}
                onChange={(e) => handleInputChange('previousSchoolDetails', 'board', e.target.value)}
              />
              <Input
                label="Class Completed"
                value={formData.previousSchoolDetails.classCompleted}
                onChange={(e) => handleInputChange('previousSchoolDetails', 'classCompleted', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Year of Passing"
                value={formData.previousSchoolDetails.yearOfPassing}
                onChange={(e) => handleInputChange('previousSchoolDetails', 'yearOfPassing', e.target.value)}
              />
              <Input
                label="Percentage/Grade"
                value={formData.previousSchoolDetails.percentage}
                onChange={(e) => handleInputChange('previousSchoolDetails', 'percentage', e.target.value)}
              />
            </div>
            <Input
              label="School Address"
              value={formData.previousSchoolDetails.address}
              onChange={(e) => handleInputChange('previousSchoolDetails', 'address', e.target.value)}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment & Terms</h3>
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-lg mb-4">Registration Fee</h4>
              <div className="flex justify-between items-center mb-2">
                <span>Registration Fee</span>
                <span className="font-bold">₹500</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-red-600">₹500</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-lg mb-4">Terms & Conditions</h4>
              <div className="text-sm text-gray-600 space-y-2 max-h-40 overflow-y-auto">
                <p>1. The registration fee is non-refundable.</p>
                <p>2. Submission of the application are guarantee admission.</p>
                <p>3. All information provided must be accurate and verifiable.</p>
                <p>4. Original documents must be presented for verification.</p>
                <p>5. The school reserves the right to accept or reject any application.</p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-gray-700">
                I agree to the <Link href="/terms" className="text-red-600 hover:underline">Terms & Conditions</Link> and{' '}
                <Link href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-red-900 px-8 py-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Online Registration 2026-2027</h1>
            <p className="mt-2 opacity-90">Shree Amrita Academy - Admission Form</p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 border-b">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-full h-1 mx-2 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </span>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 border-t bg-gray-50 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}>
                Next
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={!agreedToTerms}
              >
                Proceed to Payment
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
