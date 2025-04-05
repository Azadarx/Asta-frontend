import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { jsPDF } from "jspdf";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentData, setPaymentData] = useState(null);
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        // Try to get data from location state first
        let data = location.state;

        // If not available, try localStorage
        if (!data) {
            const storedData = localStorage.getItem('paymentDetails');
            if (storedData) {
                data = JSON.parse(storedData);
            }
        }

        setPaymentData(data);

        // Trigger confetti effect on load
        triggerConfetti();

        // Set up countdown to redirect to home
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // navigate('/'); // Uncomment to enable automatic redirect
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Clean up timer
        return () => clearInterval(timer);
    }, [location, navigate]);

    // Confetti animation function
    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });

            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const handleDownloadReceipt = () => {
        const doc = new jsPDF();
        
        doc.text("Receipt", 10, 10);
        doc.text("Thank you for your purchase!", 10, 20);
        
        doc.save("receipt.pdf");
    };
    

    const handleReturnHome = () => {
        navigate('/');
    };

    // Get student info from the payment data
    const getStudentInfo = () => {
        if (paymentData?.student_info) {
            return paymentData.student_info;
        } else if (paymentData?.name) {
            // Create a student_info object if data is directly at the root level
            return {
                name: paymentData.name,
                email: paymentData.email,
                phone: paymentData.phone,
                course: paymentData.course || 'Phonics English Course'
            };
        } else {
            // Fallback defaults
            return {
                name: 'Student Name',
                email: 'student@example.com',
                phone: '9876543210',
                course: 'Phonics English Course'
            };
        }
    };

    // Format the amount properly (ensuring it's displayed as INR 79.00 not 0.79)
    const getFormattedAmount = () => {
        if (paymentData?.amount) {
            // If amount is stored in paise (e.g., 7900 for ₹79.00), divide by 100
            // If already in rupees (e.g., 79), use as is
            const amount = paymentData.amount >= 1000 ? (paymentData.amount / 100) : paymentData.amount;
            return `₹${amount.toFixed(2)}`;
        } else if (paymentData?.student_info?.amount) {
            return `₹${parseFloat(paymentData.student_info.amount).toFixed(2)}`;
        } else {
            return '₹79.00'; // Default fallback
        }
    };

    const studentInfo = getStudentInfo();

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
            >
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800"
                    >
                        Payment Successful!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Thank you for enrolling in our Phonics English Course
                    </motion.p>
                </div>

                <motion.div
                    className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="p-6 sm:p-10">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-green-100 p-3">
                                <svg className="h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center mb-8"
                        >
                            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-800 mb-2">
                                Your Registration is Confirmed!
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-gray-600">
                                We've sent the course details to your email address.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-100"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-blue-200 pb-2">
                                Payment Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div variants={itemVariants}>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{studentInfo.name}</p>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{studentInfo.email}</p>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{studentInfo.phone}</p>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <p className="text-sm text-gray-500">Course</p>
                                    <p className="font-medium">{studentInfo.course}</p>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <p className="text-sm text-gray-500">Amount Paid</p>
                                    <p className="font-medium text-green-600">{getFormattedAmount()}</p>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <p className="text-sm text-gray-500">Transaction ID</p>
                                    <p className="font-medium font-mono text-xs truncate">{paymentData?.order_id || 'TXN12345678'}</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadReceipt}
                                className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium shadow-sm hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                Download Receipt
                            </motion.button>
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleReturnHome}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-200"
                            >
                                Return to Homepage
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Next Steps
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">1</span>
                                    <span>Check your email for course access instructions and materials</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">2</span>
                                    <span>Complete your student profile in our learning portal</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">3</span>
                                    <span>Mark your calendar for the orientation session on April 5th</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">4</span>
                                    <span>Join our student community group to connect with peers</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Course Schedule
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                    <span className="font-medium">Orientation</span>
                                    <span className="text-gray-600">April 5, 2025</span>
                                </div>
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                    <span className="font-medium">Module 1 Start</span>
                                    <span className="text-gray-600">April 8, 2025</span>
                                </div>
                                <div className="flex justify-between pb-2 border-b border-gray-100">
                                    <span className="font-medium">Practice Session</span>
                                    <span className="text-gray-600">April 15, 2025</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Module 1 Assessment</span>
                                    <span className="text-gray-600">April 22, 2025</span>
                                </div>
                            </div>
                            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <span className="font-semibold block">Pro Tip:</span>
                                    Add these dates to your calendar to stay on track with your learning journey.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-8 text-center text-gray-500 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <p>Need help? Contact our support team at support@astaeducation.com</p>
                    {countdown > 0 && (
                        <p className="mt-2 text-xs text-gray-400">
                            You will be redirected to the homepage in {countdown} seconds
                        </p>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;