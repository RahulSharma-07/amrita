import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  const tokenCookie = req.cookies.get('token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

export async function authenticateRequest(req: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('all');
}

export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  
  // Admissions
  VIEW_ADMISSIONS: 'view_admissions',
  MANAGE_ADMISSIONS: 'manage_admissions',
  APPROVE_ADMISSIONS: 'approve_admissions',
  
  // Students
  VIEW_STUDENTS: 'view_students',
  MANAGE_STUDENTS: 'manage_students',
  
  // Faculty
  VIEW_FACULTY: 'view_faculty',
  MANAGE_FACULTY: 'manage_faculty',
  
  // Fees
  VIEW_FEES: 'view_fees',
  MANAGE_FEES: 'manage_fees',
  
  // Gallery
  VIEW_GALLERY: 'view_gallery',
  MANAGE_GALLERY: 'manage_gallery',
  
  // Calendar
  VIEW_CALENDAR: 'view_calendar',
  MANAGE_CALENDAR: 'manage_calendar',
  
  // Documents
  VIEW_DOCUMENTS: 'view_documents',
  MANAGE_DOCUMENTS: 'manage_documents',
  
  // Tours
  VIEW_TOURS: 'view_tours',
  MANAGE_TOURS: 'manage_tours',
  
  // Notices
  VIEW_NOTICES: 'view_notices',
  MANAGE_NOTICES: 'manage_notices',
  
  // Slider
  MANAGE_SLIDER: 'manage_slider',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  
  // Users
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin: Object.values(PERMISSIONS),
  'Sub Admin': [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ADMISSIONS,
    PERMISSIONS.MANAGE_ADMISSIONS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_FACULTY,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.VIEW_GALLERY,
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.VIEW_CALENDAR,
    PERMISSIONS.MANAGE_CALENDAR,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.VIEW_TOURS,
    PERMISSIONS.MANAGE_TOURS,
    PERMISSIONS.VIEW_NOTICES,
    PERMISSIONS.MANAGE_NOTICES,
    PERMISSIONS.MANAGE_SLIDER,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  Accountant: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ADMISSIONS,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_FEES,
    PERMISSIONS.MANAGE_FEES,
    PERMISSIONS.VIEW_DOCUMENTS,
  ],
  Teacher: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_CALENDAR,
    PERMISSIONS.VIEW_NOTICES,
  ],
  Staff: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CALENDAR,
    PERMISSIONS.VIEW_NOTICES,
  ],
};
