import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Try to get payment details from location state first
        let data = location.state;

        // If not available, try to get from localStorage
        if (!data) {
            const storedData = localStorage.getItem('paymentDetails');
            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                } catch (err) {
                    console.error('Error parsing stored payment data:', err);
                }
            }
        }

        if (data) {
            setPaymentData(data);
            setIsLoading(false);
            // Initialize Razorpay immediately if data is available
            initializeRazorpay();
        } else {
            setError('Payment information not found. Please return to the registration page.');
            setIsLoading(false);
        }
    }, [location]);

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
                setError('Failed to load Razorpay. Please try again later.');
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            setIsLoading(true);
            const res = await initializeRazorpay();

            if (!res) {
                setError('Razorpay SDK failed to load');
                setIsLoading(false);
                return;
            }

            openRazorpayCheckout();
        } catch (err) {
            console.error('Payment error:', err);
            setError('Failed to process payment. Please try again.');
            setIsLoading(false);
        }
    };

    const openRazorpayCheckout = () => {
        if (!window.Razorpay || !paymentData) {
            setError('Payment gateway not loaded properly');
            setIsLoading(false);
            return;
        }

        const options = {
            key: paymentData.key_id,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: paymentData.name,
            description: paymentData.description,
            order_id: paymentData.order_id,
            prefill: paymentData.prefill,
            handler: function (response) {
                handlePaymentSuccess(response);
            },
            modal: {
                ondismiss: function () {
                    console.log('Payment canceled by user');
                    setIsLoading(false);
                }
            },
            theme: {
                color: '#3B82F6'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handlePaymentSuccess = async (response) => {
        setPaymentStatus('processing');
        setProcessing(true);

        try {
            // Verify payment on server
            const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                student_id: paymentData.student_id,
                student_info: paymentData.student_info || paymentData.prefill // Include student info
            };

            // Use the appropriate endpoint based on your environment
            const endpoint = process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/verify-payment'
                : '/verify-payment';

            const verifyResponse = await axios.post(endpoint, verifyData);

            if (verifyResponse.data.status === 'success') {
                setPaymentStatus('success');
                // Clear localStorage after successful payment
                localStorage.removeItem('paymentDetails');

                // Navigate to success page with relevant data
                navigate('/success', {
                    state: {
                        paymentId: response.razorpay_payment_id,
                        ...paymentData.student_info
                    }
                });
            } else {
                setPaymentStatus('failed');
                setError(verifyResponse.data.message || 'Payment verification failed');
            }
        } catch (err) {
            console.error('Payment verification error:', err);
            setPaymentStatus('failed');
            setError(err.response?.data?.message || 'Payment verification failed');
        } finally {
            setProcessing(false);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-600 border-blue-600 border-t-transparent" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-4 text-lg text-gray-700">Loading payment information...</p>
                </div>
            </div>
        );
    }

    if (error && paymentStatus === 'pending') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                    <div className="text-center">
                        <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Error</h2>
                        <p className="mt-2 text-gray-600">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                        >
                            Return to Registration
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                    <div className="text-center">
                        <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h2>
                        <p className="mt-2 text-gray-600">Thank you for enrolling in our Phonics English Course. We've sent a confirmation to your email.</p>
                        <div className="mt-6 bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-800">You will receive further instructions and course materials shortly.</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                    <div className="text-center">
                        <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Payment Failed</h2>
                        <p className="mt-2 text-gray-600">{error || "We couldn't process your payment. Please try again."}</p>
                        <button
                            onClick={handlePayment}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Try Again'}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                            disabled={processing}
                        >
                            Return to Registration
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Payment</h2>

                    {paymentData && (
                        <div className="mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg text-gray-800">Order Summary</h3>
                                <div className="mt-2 flex justify-between">
                                    <span className="text-gray-600">Course:</span>
                                    <span className="font-medium">{paymentData.description}</span>
                                </div>
                                <div className="mt-1 flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-medium">{(paymentData.amount / 100).toFixed(2)} {paymentData.currency}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="text-gray-600 mb-6">
                        You're almost there! Click the button below to proceed with the secure payment process.
                    </p>

                    <button
                        onClick={handlePayment}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : 'Pay Now'}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                        disabled={processing}
                    >
                        Cancel Payment
                    </button>

                    <div className="mt-6 flex items-center justify-center">
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="ml-2 text-sm text-gray-500">Secured by Razorpay</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;