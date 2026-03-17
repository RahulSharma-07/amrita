'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  Image,
  FileText,
  Bus,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/admissions', label: 'Admissions', icon: GraduationCap },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/faculty', label: 'Faculty', icon: Users },
  { href: '/admin/fees', label: 'Fee Management', icon: FileText },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/tours', label: 'Tours', icon: Bus },
  { href: '/admin/notices', label: 'Notices', icon: Bell },
  { href: '/admin/slider', label: 'Hero Slider', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    if (pathname !== '/admin/login') {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-full flex flex-col w-full overflow-hidden">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-800 shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-700 rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-lg">SAA</span>
              </div>
              {isSidebarOpen && (
                <div className="min-w-[120px]">
                  <p className="font-bold text-sm whitespace-nowrap">Admin Panel</p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">Shree Amrita Academy</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700">
            <ul className="space-y-1 px-3">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => {
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                      title={!isSidebarOpen ? link.label : undefined}
                    >
                      <link.icon className="w-5 h-5 flex-shrink-0" />
                      {isSidebarOpen && <span className="text-sm truncate">{link.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-800 p-4 shrink-0">
            {isSidebarOpen && user && (
              <div className="mb-4 px-3 overflow-hidden">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 w-full text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              title={!isSidebarOpen ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
