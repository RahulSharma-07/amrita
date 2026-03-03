import connectDB from '../lib/db';
import { User } from '../models';

async function seed() {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'amritaacademy@yahoo.co.in' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      name: 'Administrator',
      email: 'amritaacademy@yahoo.co.in',
      password: '80530',
      role: 'Admin',
      permissions: [
        'view_dashboard',
        'view_admissions',
        'manage_admissions',
        'approve_admissions',
        'view_students',
        'manage_students',
        'view_faculty',
        'manage_faculty',
        'view_fees',
        'manage_fees',
        'view_gallery',
        'manage_gallery',
        'view_calendar',
        'manage_calendar',
        'view_documents',
        'manage_documents',
        'view_tours',
        'manage_tours',
        'view_notices',
        'manage_notices',
        'manage_slider',
        'view_settings',
        'manage_settings',
        'view_users',
        'manage_users',
        'manage_roles',
      ],
      isActive: true,
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: amritaacademy@yahoo.co.in');
    console.log('Password: 80530');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
