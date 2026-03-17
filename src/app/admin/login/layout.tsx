import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Login - Shree Amrita Academy",
  description: "Admin login portal for Shree Amrita Academy management system",
  robots: "noindex, nofollow",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
