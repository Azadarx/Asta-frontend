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
        // First try to get data from location state
        let data = location.state;

        // If not available, try localStorage for lastSuccessfulPayment
        if (!data) {
            try {
                const storedPayment = localStorage.getItem('lastSuccessfulPayment');
                if (storedPayment) {
                    data = JSON.parse(storedPayment);
                    console.log('Retrieved payment data from localStorage:', data);
                }
            } catch (err) {
                console.error('Error parsing stored payment data:', err);
            }
        }

        // Last resort - try paymentDetails (though this is less likely to have complete info)
        if (!data) {
            try {
                const storedDetails = localStorage.getItem('paymentDetails');
                if (storedDetails) {
                    data = JSON.parse(storedDetails);
                    console.log('Retrieved generic payment details from localStorage:', data);
                }
            } catch (err) {
                console.error('Error parsing stored payment details:', err);
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
        const studentInfo = getStudentInfo();

        // Add logo/header
        doc.setFontSize(20);
        doc.setTextColor(0, 51, 153);
        doc.text("ASTA Education", 105, 20, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Payment Receipt", 105, 30, { align: 'center' });

        // Add horizontal line
        doc.setDrawColor(0, 51, 153);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Add receipt details
        const startY = 50;
        const colWidth = 80;

        doc.setFontSize(12);

        // Customer details
        doc.setFont(undefined, 'bold');
        doc.text("Customer Details", 20, startY);
        doc.setFont(undefined, 'normal');
        doc.text(`Name: ${studentInfo.name}`, 20, startY + 10);
        doc.text(`Email: ${studentInfo.email}`, 20, startY + 20);
        doc.text(`Phone: ${studentInfo.phone}`, 20, startY + 30);

        // Payment details
        doc.setFont(undefined, 'bold');
        doc.text("Payment Details", 20, startY + 50);
        doc.setFont(undefined, 'normal');
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, startY + 60);
        doc.text(`Transaction ID: ${paymentData?.paymentId || paymentData?.orderId || 'N/A'}`, 20, startY + 70);
        doc.text(`Order ID: ${paymentData?.orderId || 'N/A'}`, 20, startY + 80);

        // Course details
        doc.setFont(undefined, 'bold');
        doc.text("Order Summary", 20, startY + 100);

        // Table header
        doc.setFillColor(240, 240, 240);
        doc.rect(20, startY + 110, 170, 10, 'F');
        doc.setFont(undefined, 'bold');
        doc.text("Description", 25, startY + 117);
        doc.text("Amount", 160, startY + 117, { align: 'right' });

        // Table content
        doc.setFont(undefined, 'normal');
        doc.text(studentInfo.course, 25, startY + 130);
        doc.text(getFormattedAmount(), 160, startY + 130, { align: 'right' });

        // Total
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(20, startY + 140, 190, startY + 140);
        doc.setFont(undefined, 'bold');
        doc.text("Total", 25, startY + 150);
        doc.text(getFormattedAmount(), 160, startY + 150, { align: 'right' });

        // Footer
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for enrolling with ASTA Education.", 105, 250, { align: 'center' });
        doc.text("For any queries, please contact: support@astaeducation.com", 105, 257, { align: 'center' });

        // Save the PDF
        doc.save(`receipt_${paymentData?.orderId || 'payment'}.pdf`);
    };


    const handleReturnHome = () => {
        navigate('/');
    };

    // Get student info from the payment data
    const getStudentInfo = () => {
        if (!paymentData) {
            return {
                name: 'Student',
                email: 'student@example.com',
                phone: 'N/A',
                course: 'Phonics English Course'
            };
        }

        // Extract from nested student_info if available
        if (paymentData.student_info) {
            return {
                name: paymentData.student_info.name || 'Student',
                email: paymentData.student_info.email || 'student@example.com',
                phone: paymentData.student_info.phone || 'N/A',
                course: paymentData.student_info.course || 'Phonics English Course'
            };
        }

        // Extract from direct fields
        return {
            name: paymentData.name || 'Student',
            email: paymentData.email || 'student@example.com',
            phone: paymentData.phone || paymentData.contact || 'N/A',
            course: paymentData.course || paymentData.description || 'Phonics English Course'
        };
    };

    // Format the amount properly (ensuring it's displayed as INR 79.00 not 0.79)
    const getFormattedAmount = () => {
        if (!paymentData) return '₹79.00'; // Default fallback

        let amount;

        // Try to get amount from different possible locations
        if (typeof paymentData.amount === 'number') {
            // If amount is stored in paise (e.g., 7900 for ₹79.00), divide by 100
            // If already in rupees (e.g., 79), use as is
            amount = paymentData.amount >= 1000 ? (paymentData.amount / 100) : paymentData.amount;
        } else if (paymentData.student_info?.amount) {
            amount = parseFloat(paymentData.student_info.amount);
        } else {
            amount = 79.00; // Default fallback
        }

        const currency = paymentData.currency || '₹';
        return currency === 'INR' ? `₹${amount.toFixed(2)}` : `${currency} ${amount.toFixed(2)}`;
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
                        className="mt-3 text-xl text-[#666666] max-w-2xl mx-auto"
                    >
                        Thank you for enrolling in our {studentInfo.course}
                    </motion.p>
                </div>

                <motion.div
                    className="bg-[#F9FAFB] rounded-xl shadow-2xl overflow-hidden mb-8"
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
                            <motion.p variants={itemVariants} className="text-[#666666]">
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
                                    <p className="font-medium font-mono text-xs truncate">{paymentData?.paymentId || paymentData?.order_id || paymentData?.orderId || 'TXN12345678'}</p>
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
                                className="px-6 py-3 bg-[#F9FAFB] border-2 border-blue-600 text-blue-600 rounded-lg font-medium shadow-sm hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
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
                        className="bg-[#F9FAFB] rounded-xl shadow-lg overflow-hidden"
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
                            <ul className="space-y-4 text-[#666666]">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-500 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3">Check your email for course details and access instructions.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-500 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3">Save your receipt for future reference.</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-500 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3">Course access will be activated within the next 24 hours.</p>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-[#F9FAFB] rounded-xl shadow-lg overflow-hidden"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Need Help?
                            </h3>
                            <p className="text-[#666666] mb-4">
                                If you have any questions or need assistance with your course, we're here to help.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-700">support@astaeducation.com</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-gray-700">+91 1234567890</span>
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700">Mon-Fri: 9:00 AM - 6:00 PM IST</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-8 text-center text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                >
                    <p>
                        Redirecting to homepage in {countdown} seconds or {' '}
                        <button
                            onClick={handleReturnHome}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            click here
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;