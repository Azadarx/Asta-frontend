import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { Country, State, City } from "country-state-city";
import axios from 'axios';

const Details = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get selected course info from location state or use default
    const courseInfo = location.state?.courseInfo || {
        name: 'Phonics English Course',
        price: 79,
        originalPrice: 99,
        discount: '20% OFF',
        duration: '3 months',
        level: 'Beginner'
    };

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        country: null,
        state: null,
        city: null,
        course: courseInfo.name,
        amount: courseInfo.price,
        duration: courseInfo.duration,
        level: courseInfo.level
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState({ applied: false, amount: 0, message: '' });

    // Get countries data from the library
    const countries = Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.isoCode,
    }));

    // Get states based on selected country
    const states = formData.country
        ? State.getStatesOfCountry(formData.country.value).map((state) => ({
            label: state.name,
            value: state.isoCode,
        }))
        : [];

    // Get cities based on selected country and state
    const cities = formData.state
        ? City.getCitiesOfState(formData.country.value, formData.state.value).map((city) => ({
            label: city.name,
            value: city.name,
        }))
        : [];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (option, action) => {
        // Reset dependent fields when parent field changes
        if (action.name === 'country') {
            setFormData(prev => ({
                ...prev,
                [action.name]: option,
                state: null,
                city: null
            }));
        } else if (action.name === 'state') {
            setFormData(prev => ({
                ...prev,
                [action.name]: option,
                city: null
            }));
        } else {
            setFormData(prev => ({ ...prev, [action.name]: option }));
        }
    };

    // Function to handle coupon application
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!couponCode) {
            setDiscount({ applied: false, amount: 0, message: 'Please enter a coupon code' });
            return;
        }

        // Simulate coupon validation (in a real app, this would be an API call)
        if (couponCode.toUpperCase() === 'WELCOME10') {
            const discountAmount = formData.amount * 0.1;
            setDiscount({
                applied: true,
                amount: discountAmount,
                message: 'Coupon applied successfully! 10% discount'
            });
            setFormData(prev => ({
                ...prev,
                amount: parseFloat((prev.amount - discountAmount).toFixed(2))
            }));
        } else if (couponCode.toUpperCase() === 'ENGLISH5') {
            const discountAmount = 5;
            setDiscount({
                applied: true,
                amount: discountAmount,
                message: 'Coupon applied successfully! $5 discount'
            });
            setFormData(prev => ({
                ...prev,
                amount: parseFloat((prev.amount - discountAmount).toFixed(2))
            }));
        } else {
            setDiscount({
                applied: false,
                amount: 0,
                message: 'Invalid coupon code'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Prepare data for the server
            const orderData = {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                course: formData.course,
                amount: formData.amount,
                country: formData.country?.label,
                state: formData.state?.label,
                city: formData.city?.label,
                level: formData.level,
                duration: formData.duration
            };

            // Use the full URL to your backend server
            const response = await axios.post('http://localhost:3000/create-order', orderData);

            if (response.data) {
                // Store order details in localStorage for payment page
                localStorage.setItem('paymentDetails', JSON.stringify(response.data));

                // Navigate to payment page
                navigate('/payment', { state: response.data });
            }
        } catch (err) {
            console.error('Error creating order:', err);
            setError(err.response?.data?.error || 'Failed to create order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to get course description based on course name
    const getCourseDescription = () => {
        switch (formData.course) {
            case 'Phonics English Course':
                return 'Master English pronunciation with our comprehensive phonics approach';
            case 'Business English':
                return 'Enhance your professional communication skills for workplace success';
            case 'Advanced Grammar Masterclass':
                return 'Perfect your grammar skills with in-depth analysis and practice';
            default:
                return 'Learn English with our comprehensive courses';
        }
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

    // Custom styles for Select component
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.3)' : 'none',
            '&:hover': {
                borderColor: '#3B82F6'
            },
            borderRadius: '0.5rem',
            padding: '2px'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#DBEAFE' : null,
            color: state.isSelected ? 'white' : '#1F2937',
            cursor: 'pointer'
        })
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800"
                    >
                        Join Our {formData.course}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        {getCourseDescription()}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="mt-2 flex justify-center gap-2"
                    >
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {formData.level}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {formData.duration}
                        </span>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <motion.div
                        className="w-full lg:w-1/2 bg-white rounded-xl shadow-2xl overflow-hidden"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="p-6 sm:p-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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

                            <form onSubmit={handleSubmit}>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-6"
                                >
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                            placeholder="Enter your phone number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <Select
                                            id="country"
                                            name="country"
                                            options={countries}
                                            value={formData.country}
                                            onChange={(option, action) => handleSelectChange(option, { name: 'country' })}
                                            placeholder="Select your country"
                                            isSearchable
                                            styles={customSelectStyles}
                                            className="rounded-lg"
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            State / Province
                                        </label>
                                        <Select
                                            id="state"
                                            name="state"
                                            options={states}
                                            value={formData.state}
                                            onChange={(option, action) => handleSelectChange(option, { name: 'state' })}
                                            placeholder={formData.country ? "Select your state" : "First select a country"}
                                            isDisabled={!formData.country}
                                            isSearchable
                                            styles={customSelectStyles}
                                            className="rounded-lg"
                                        />
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                            City / District
                                        </label>
                                        <Select
                                            id="city"
                                            name="city"
                                            options={cities}
                                            value={formData.city}
                                            onChange={(option, action) => handleSelectChange(option, { name: 'city' })}
                                            placeholder={formData.state ? "Select your city" : "First select a state"}
                                            isDisabled={!formData.state}
                                            isSearchable
                                            styles={customSelectStyles}
                                            className="rounded-lg"
                                        />
                                    </motion.div>

                                    {/* Coupon Code Section */}
                                    <motion.div variants={itemVariants} className="pt-4 border-t border-gray-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <div className="flex-1">
                                                <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Coupon Code
                                                </label>
                                                <input
                                                    id="couponCode"
                                                    name="couponCode"
                                                    type="text"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                                    placeholder="Enter coupon code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    disabled={discount.applied}
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    disabled={discount.applied}
                                                    className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                        {discount.message && (
                                            <p className={`mt-2 text-sm ${discount.applied ? 'text-green-600' : 'text-red-600'}`}>
                                                {discount.message}
                                            </p>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                "Continue to Payment"
                                            )}
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full lg:w-1/2"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Course Summary */}
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
                            <div className="p-6 sm:p-10">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-700">Course</span>
                                        <span className="font-medium text-gray-900">{formData.course}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-700">Level</span>
                                        <span className="font-medium text-gray-900">{formData.level}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-700">Duration</span>
                                        <span className="font-medium text-gray-900">{formData.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-700">Original Price</span>
                                        <span className="font-medium text-gray-500 line-through">${courseInfo.originalPrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-700">Discount</span>
                                        <span className="font-medium text-green-600">{courseInfo.discount}</span>
                                    </div>
                                    {discount.applied && (
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                            <span className="text-gray-700">Coupon Discount</span>
                                            <span className="font-medium text-green-600">-${discount.amount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-bold text-gray-900">Total Price</span>
                                        <span className="text-2xl font-bold text-blue-700">${formData.amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Benefits */}
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                            <div className="p-6 sm:p-10">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Our {formData.course}?</h2>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-6"
                                >
                                    <motion.div variants={itemVariants} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Expert Instructors</h3>
                                            <p className="mt-1 text-gray-600">Learn from certified specialists with years of teaching experience.</p>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Interactive Learning</h3>
                                            <p className="mt-1 text-gray-600">Engage with fun activities, games, and exercises designed to make learning enjoyable.</p>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Rapid Progress</h3>
                                            <p className="mt-1 text-gray-600">Our proven method helps students improve their skills fast.</p>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">Certificate Included</h3>
                                            <p className="mt-1 text-gray-600">Receive a verified certificate upon course completion.</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <motion.div
                            className="mt-8 bg-white rounded-xl shadow-2xl overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <div className="p-6 sm:p-10">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <img className="h-12 w-12 rounded-full" src="/api/placeholder/100/100" alt="Student" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Sarah Johnson</h3>
                                        <p className="text-gray-600 text-sm">Student</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-700 italic">
                                    "I've shown remarkable improvement in my English skills since joining this course. The interactive approach keeps me engaged and excited about learning. Highly recommended!"
                                </p>
                                <div className="mt-2 flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Details;