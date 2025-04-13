// src/pages/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">Privacy Policy</h1>
      <p className="mb-4">
        At Inspiring Shereen, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We may collect your name, email address, phone number, and payment details when you register for our masterclass or contact us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To confirm your registration and send event-related updates</li>
        <li>To process payments securely via Razorpay</li>
        <li>To communicate with you for support or promotions</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Protection</h2>
      <p className="mb-4">
        Your data is stored securely. We do not sell or share your information with third parties, except for payment processing via Razorpay.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at <a href="mailto:phonicswithshereen@gmail.com" className="text-purple-600 underline">phonicswithshereen@gmail.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
