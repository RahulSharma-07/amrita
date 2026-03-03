'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ChevronRight,
    Calendar,
    User,
    Users,
    Phone,
    Mail,
    Briefcase,
    ZoomIn,
    CheckCircle,
    Clock,
    XOctagon,
    Trash2,
    Loader2,
    Download,
    FileText
} from 'lucide-react';
import Link from 'next/link';
import { calculateAge } from '@/lib/utils'; // if calculateAge exists

export default function AdmissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [admission, setAdmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdmission();
    }, [id]);

    const fetchAdmission = async () => {
        try {
            const response = await fetch(`/api/admissions/${id}`);
            const data = await response.json();

            if (response.ok && data.admission) {
                setAdmission(data.admission);
            } else {
                setError(data.error || 'Failed to load admission details');
            }
        } catch (err) {
            setError('An error occurred while fetching admission details');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status: string) => {
        try {
            setIsUpdating(true);
            const res = await fetch(`/api/admissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationStatus: status })
            });
            const data = await res.json();
            if (res.ok) {
                setAdmission(data.admission);
            } else {
                alert(data.error || 'Failed to update status');
            }
        } catch (err) {
            alert('Error updating status');
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteAdmission = async () => {
        if (!confirm('Are you sure you want to delete this application? This cannot be undone.')) return;
        try {
            setIsUpdating(true);
            const res = await fetch(`/api/admissions/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.push('/admin/admissions');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete application');
                setIsUpdating(false);
            }
        } catch (err) {
            alert('Error deleting application');
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-ui" />
            </div>
        );
    }

    if (error || !admission) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error || 'Admission not found'}
                </div>
            </div>
        );
    }

    const { studentDetails, fatherDetails, motherDetails, presentAddress, permanentAddress, previousSchoolDetails } = admission;
    const fullName = `${studentDetails.firstName} ${studentDetails.middleName || ''} ${studentDetails.lastName}`.replace(/\s+/g, ' ').trim();
    const dob = new Date(studentDetails.dateOfBirth);

    // Try using calculateAge, fallback to rough math
    const getAge = (birthDate: Date) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = getAge(dob);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-background-light dark:bg-background-dark min-h-full font-display text-slate-900 dark:text-slate-100">
            {/* Breadcrumbs & Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Link className="hover:text-primary-ui" href="/admin/dashboard">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link className="hover:text-primary-ui" href="/admin/admissions">Applications</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-slate-900 dark:text-slate-200 font-medium">Application #{admission.uniqueApplicationID}</span>
                    </nav>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{fullName}</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Submitted on {new Date(admission.createdAt).toLocaleDateString()} • ID: {admission.uniqueApplicationID}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {admission.applicationStatus === 'Pending' && (
                        <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-full border border-amber-200 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                            Pending
                        </span>
                    )}
                    {admission.applicationStatus === 'Under Review' && (
                        <span className="px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-bold rounded-full border border-blue-200 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Under Review
                        </span>
                    )}
                    {admission.applicationStatus === 'Approved' && (
                        <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full border border-emerald-200 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Approved
                        </span>
                    )}
                    {admission.applicationStatus === 'Rejected' && (
                        <span className="px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-bold rounded-full border border-rose-200 flex items-center gap-2">
                            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                            Rejected
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Information */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Student Information Card */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-primary-ui" />
                                Student Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                                <p className="text-slate-900 dark:text-slate-100 font-medium">{fullName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Date of Birth</label>
                                <p className="text-slate-900 dark:text-slate-100 font-medium">
                                    {dob.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} ({age} years old)
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender</label>
                                <p className="text-slate-900 dark:text-slate-100 font-medium">{studentDetails.gender}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Grade Applying For</label>
                                <p className="text-slate-900 dark:text-slate-100 font-medium">{studentDetails.applyingForClass}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nationality / Category</label>
                                <p className="text-slate-900 dark:text-slate-100 font-medium">{studentDetails.nationality || 'Indian'} / {studentDetails.category}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Religion / Blood Group</label>
                                <p className="text-slate-900 dark:text-slate-100 font-medium">{studentDetails.religion} {studentDetails.bloodGroup ? `/ ${studentDetails.bloodGroup}` : ''}</p>
                            </div>
                            {studentDetails.aadharNumber && (
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Aadhar Number</label>
                                    <p className="text-slate-900 dark:text-slate-100 font-medium">{studentDetails.aadharNumber}</p>
                                </div>
                            )}
                            {previousSchoolDetails?.schoolName && (
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous School Details</label>
                                    <p className="text-slate-900 dark:text-slate-100 font-medium">{previousSchoolDetails.schoolName} {previousSchoolDetails.board ? `(${previousSchoolDetails.board})` : ''}</p>
                                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-sm">
                                        {previousSchoolDetails.classCompleted ? `Completed Class: ${previousSchoolDetails.classCompleted}` : ''}
                                        {previousSchoolDetails.yearOfPassing ? ` in ${previousSchoolDetails.yearOfPassing}` : ''}.
                                        {previousSchoolDetails.percentage ? ` Percentage/Grade: ${previousSchoolDetails.percentage}` : ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Parent/Guardian Details Card */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary-ui" />
                                Parent / Guardian Details
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-8 mb-8">
                                {/* Mother Details */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-ui/10 rounded-full flex items-center justify-center text-primary-ui font-bold">
                                            {getInitials(motherDetails.name)}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-slate-100 font-semibold">{motherDetails.name}</p>
                                            <p className="text-xs text-slate-500">Mother</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pl-13">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="text-slate-400 w-4 h-4" />
                                            <span className="text-slate-600 dark:text-slate-400">{motherDetails.phone || 'N/A'}</span>
                                        </div>
                                        {motherDetails.email && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Mail className="text-slate-400 w-4 h-4" />
                                                <span className="text-slate-600 dark:text-slate-400">{motherDetails.email}</span>
                                            </div>
                                        )}
                                        {motherDetails.profession && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Briefcase className="text-slate-400 w-4 h-4" />
                                                <span className="text-slate-600 dark:text-slate-400">{motherDetails.profession}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Father Details */}
                                <div className="flex-1 space-y-4 border-l border-slate-100 dark:border-slate-800 md:pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-ui/10 rounded-full flex items-center justify-center text-primary-ui font-bold">
                                            {getInitials(fatherDetails.name)}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-slate-100 font-semibold">{fatherDetails.name}</p>
                                            <p className="text-xs text-slate-500">Father</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pl-13 md:pl-0">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="text-slate-400 w-4 h-4" />
                                            <span className="text-slate-600 dark:text-slate-400">{fatherDetails.phone || 'N/A'}</span>
                                        </div>
                                        {fatherDetails.email && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Mail className="text-slate-400 w-4 h-4" />
                                                <span className="text-slate-600 dark:text-slate-400">{fatherDetails.email}</span>
                                            </div>
                                        )}
                                        {fatherDetails.profession && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Briefcase className="text-slate-400 w-4 h-4" />
                                                <span className="text-slate-600 dark:text-slate-400">{fatherDetails.profession}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Present Address</label>
                                    <p className="text-slate-900 dark:text-slate-100 font-medium mt-1 whitespace-pre-line text-sm leading-relaxed">
                                        {presentAddress.addressLine1}
                                        {presentAddress.addressLine2 && <><br />{presentAddress.addressLine2}</>}
                                        <br />{presentAddress.city}, {presentAddress.state} - {presentAddress.pincode}
                                        <br />{presentAddress.country}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Permanent Address</label>
                                    <p className="text-slate-900 dark:text-slate-100 font-medium mt-1 whitespace-pre-line text-sm leading-relaxed">
                                        {permanentAddress.sameAsPresent ? (
                                            <span className="text-slate-500 italic">Same as present address</span>
                                        ) : (
                                            <>
                                                {permanentAddress.addressLine1}
                                                {permanentAddress.addressLine2 && <><br />{permanentAddress.addressLine2}</>}
                                                <br />{permanentAddress.city}, {permanentAddress.state} - {permanentAddress.pincode}
                                                <br />{permanentAddress.country}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right Column: Media & Actions */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Student Photo Card */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 text-center">
                        <h3 className="font-bold text-lg mb-4 text-left">Student Photo Preview</h3>
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-800 shadow-inner group relative">
                            {studentDetails.photo ? (
                                <img alt="Student Applicant Photo" className="w-full h-full object-cover" src={studentDetails.photo} />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                    <User className="w-16 h-16 mb-2" />
                                    <span className="text-sm font-medium">No Photo Provided</span>
                                </div>
                            )}
                            {studentDetails.photo && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <a href={studentDetails.photo} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-slate-50">
                                        <ZoomIn className="w-5 h-5" />
                                        View Large
                                    </a>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm mt-4">Uploaded on {new Date(admission.createdAt).toLocaleDateString()}</p>
                    </section>

                    {/* Action Button Group */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 sticky top-24">
                        <h3 className="font-bold text-lg mb-2">Review Action</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => updateStatus('Approved')}
                                disabled={isUpdating || admission.applicationStatus === 'Approved'}
                                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Approve Application
                            </button>
                            <button
                                onClick={() => updateStatus('Pending')}
                                disabled={isUpdating || admission.applicationStatus === 'Pending'}
                                className="w-full h-14 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95"
                            >
                                <Clock className="w-5 h-5" />
                                Mark as Pending
                            </button>
                            <button
                                onClick={() => updateStatus('Rejected')}
                                disabled={isUpdating || admission.applicationStatus === 'Rejected'}
                                className="w-full h-14 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95"
                            >
                                <XOctagon className="w-5 h-5" />
                                Reject Application
                            </button>
                        </div>
                        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={deleteAdmission}
                                disabled={isUpdating}
                                className="w-full h-12 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Application
                            </button>
                        </div>
                    </div>

                    {/* Attached Documents (Optional Files like Aadhar / BC) */}
                    {(studentDetails.birthCertificate || studentDetails.aadharCard || studentDetails.previousMarksheet || studentDetails.transferCertificate) && (
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4">Attached Documents</h3>
                            <div className="space-y-3">

                                {studentDetails.birthCertificate && (
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary-ui" />
                                            <span className="text-sm font-medium">Birth Certificate</span>
                                        </div>
                                        <a href={studentDetails.birthCertificate} target="_blank" className="text-slate-400 hover:text-primary-ui">
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                )}

                                {studentDetails.aadharCard && (
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary-ui" />
                                            <span className="text-sm font-medium">Aadhar Card</span>
                                        </div>
                                        <a href={studentDetails.aadharCard} target="_blank" className="text-slate-400 hover:text-primary-ui">
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                )}

                                {studentDetails.previousMarksheet && (
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary-ui" />
                                            <span className="text-sm font-medium">Previous Marksheet</span>
                                        </div>
                                        <a href={studentDetails.previousMarksheet} target="_blank" className="text-slate-400 hover:text-primary-ui">
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                )}

                                {studentDetails.transferCertificate && (
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary-ui" />
                                            <span className="text-sm font-medium">Transfer Certificate</span>
                                        </div>
                                        <a href={studentDetails.transferCertificate} target="_blank" className="text-slate-400 hover:text-primary-ui">
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
}
