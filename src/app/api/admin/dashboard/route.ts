import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Admission, Payment, Faculty, Student, User } from '@/models';
import { authenticateRequest, hasPermission, PERMISSIONS } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = await authenticateRequest(req);
    
    if (!payload || !hasPermission(payload.permissions, PERMISSIONS.VIEW_DASHBOARD)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    // Get current academic year
    const now = new Date();
    const currentYear = now.getFullYear();
    const academicYear = now.getMonth() >= 3 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
    
    // Get counts
    const [
      totalStudents,
      totalApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      totalTeachers,
      totalFees,
      monthlyAdmissions,
    ] = await Promise.all([
      Student.countDocuments({ isActive: true, academicYear }),
      Admission.countDocuments({ 'studentDetails.academicYear': academicYear }),
      Admission.countDocuments({ applicationStatus: 'Approved', 'studentDetails.academicYear': academicYear }),
      Admission.countDocuments({ applicationStatus: { $in: ['Pending', 'Under Review'] }, 'studentDetails.academicYear': academicYear }),
      Admission.countDocuments({ applicationStatus: 'Rejected', 'studentDetails.academicYear': academicYear }),
      Faculty.countDocuments({ isActive: true }),
      Payment.aggregate([
        { $match: { status: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Admission.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentYear, 0, 1),
              $lte: new Date(currentYear, 11, 31),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
    ]);
    
    // Get class-wise distribution
    const classDistribution = await Admission.aggregate([
      { $match: { 'studentDetails.academicYear': academicYear } },
      {
        $group: {
          _id: '$studentDetails.applyingForClass',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    // Get gender distribution
    const genderDistribution = await Admission.aggregate([
      { $match: { 'studentDetails.academicYear': academicYear } },
      {
        $group: {
          _id: '$studentDetails.gender',
          count: { $sum: 1 },
        },
      },
    ]);
    
    // Get recent admissions
    const recentAdmissions = await Admission.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('uniqueApplicationID studentDetails.firstName studentDetails.lastName studentDetails.applyingForClass applicationStatus paymentStatus createdAt');
    
    return NextResponse.json({
      stats: {
        totalStudents,
        totalApplications,
        approvedApplications,
        pendingApplications,
        rejectedApplications,
        totalTeachers,
        totalFeesCollected: totalFees[0]?.total || 0,
      },
      charts: {
        monthlyAdmissions: monthlyAdmissions.map((item) => ({
          month: item._id.month,
          count: item.count,
        })),
        classDistribution: classDistribution.map((item) => ({
          class: item._id,
          count: item.count,
        })),
        genderDistribution: genderDistribution.map((item) => ({
          gender: item._id,
          count: item.count,
        })),
      },
      recentAdmissions,
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
