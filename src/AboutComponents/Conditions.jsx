// src/pages/TermsAndConditions.jsx
import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">Terms and Conditions</h1>
      
      <p className="mb-4">
        These terms and conditions govern your participation in the Inspiring Shereen Masterclass. By registering, you agree to the following:
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Registration & Payment</h2>
      <p className="mb-4">
        Full payment must be made to confirm your spot. Payments are processed securely via Razorpay.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund Policy</h2>
      <p className="mb-4">
        All payments are non-refundable once registration is complete. Please ensure you’re available before enrolling.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Event Details</h2>
      <p className="mb-4">
        You will receive event access details (Zoom link) 24 hours before the masterclass via email.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Code of Conduct</h2>
      <p className="mb-4">
        Participants are expected to be respectful and professional during the session. Disruptive behavior may lead to removal from the session without a refund.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p>
        If you have any questions, contact us at <a href="mailto:phonicswithshereen@gmail.com" className="text-purple-600 underline">phonicswithshereen@gmail.com</a>.
      </p>
    </div>
  );
};

export default TermsAndConditions;
