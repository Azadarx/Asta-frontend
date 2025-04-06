import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentForm = ({ paymentData, onPaymentSuccess, onPaymentError }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the Razorpay script when component mounts
    const loadRazorpayScript = async () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
          setError('Failed to load Razorpay. Please try again later.');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();

    // Clean up function to remove script when component unmounts
    return () => {
      const razorpayScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (razorpayScript) {
        razorpayScript.remove();
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!paymentData) {
      setError('Payment data is missing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Configure Razorpay options
      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        name: paymentData.name || 'English Course',
        description: paymentData.description || 'Course Enrollment',
        order_id: paymentData.order_id,
        prefill: {
          name: paymentData.prefill?.name || '',
          email: paymentData.prefill?.email || '',
          contact: paymentData.prefill?.contact || ''
        },
        notes: {
          course_id: paymentData.course_id || '',
          student_id: paymentData.student_id || ''
        },
        theme: {
          color: '#3B82F6'
        },
        handler: function(response) {
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      // Initialize Razorpay
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function(response) {
        setError(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
        if (onPaymentError) onPaymentError(response.error);
      });
      
      // Open Razorpay checkout
      paymentObject.open();
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment');
      if (onPaymentError) onPaymentError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    setIsLoading(true);
    
    try {
      // Verify payment on server
      const verifyData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        student_id: paymentData.student_id,
        course_id: paymentData.course_id,
        amount: paymentData.amount
      };

      // Use environment variable for API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const verifyResponse = await axios.post(`${apiUrl}/verify-payment`, verifyData);

      if (verifyResponse.data.status === 'success') {
        // Clear payment data from localStorage
        localStorage.removeItem('paymentDetails');
        
        // Call success callback
        if (onPaymentSuccess) {
          onPaymentSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            ...verifyResponse.data
          });
        }
      } else {
        throw new Error(verifyResponse.data.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(err.response?.data?.message || err.message || 'Payment verification failed');
      if (onPaymentError) onPaymentError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-form-container">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          "Pay Now"
        )}
      </button>

      <div className="mt-4 flex items-center justify-center">
        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="ml-2 text-sm text-gray-500">Secured by Razorpay</span>
      </div>
    </div>
  );
};

export default PaymentForm;