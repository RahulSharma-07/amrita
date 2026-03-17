import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p>Last updated: March 16, 2026</p>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h2>
            <p>Welcome to Shree Amrita Academy. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at amritaacademy@yahoo.co.in.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website (such as the admission form) or otherwise when you contact us.</p>
            <p>The personal information we collect may include: names, phone numbers, email addresses, mailing addresses, and student academic records.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          </section>


          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Contact Us</h2>
            <p>If you have questions or comments about this policy, you may email us at amritaacademy@yahoo.co.in or by post to:</p>
            <p>Shree Amrita Academy, Plot No. 36 to 40, Pushpvatika Society, Nr. Gadkhol Patia, Ankleshwar</p>
          </section>
        </div>
      </div>
    </div>
  );
}
