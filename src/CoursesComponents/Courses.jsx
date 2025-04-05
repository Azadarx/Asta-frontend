import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([
        {
            id: 1,
            title: 'Phonics English Course',
            description: 'Master English pronunciation with our comprehensive phonics approach',
            price: 79,
            originalPrice: 99,
            duration: '3 months',
            level: 'Beginner',
            imageUrl: 'https://t4.ftcdn.net/jpg/01/63/53/23/360_F_163532337_I03tbZE4CqGOTzw2jXSR8IBxdXU9krqt.jpg',
            features: [
                'Interactive pronunciation exercises',
                'Weekly live sessions with instructors',
                'Personalized progress tracking',
                'Access to exclusive learning materials'
            ],
            popular: true,
            comingSoon: false
        },
        {
            id: 2,
            title: 'Business English',
            description: 'Enhance your professional communication skills for workplace success',
            price: 89,
            originalPrice: 119,
            duration: '2 months',
            level: 'Intermediate',
            imageUrl: 'https://media.istockphoto.com/id/1385398604/photo/a-woman-interpreting-at-an-international-conference.jpg?s=612x612&w=0&k=20&c=I9LwLGETy_ON9ORhNNXLJiFamuZzJgjkHVFS4ILhLB4=',
            features: [
                'Business vocabulary building',
                'Email and report writing',
                'Presentation skills training',
                'Negotiation and meeting language'
            ],
            popular: false,
            comingSoon: true
        },
        {
            id: 3,
            title: 'Advanced Grammar Masterclass',
            description: 'Perfect your grammar skills with in-depth analysis and practice',
            price: 69,
            originalPrice: 99,
            duration: '2 months',
            level: 'Advanced',
            imageUrl: 'https://img.freepik.com/free-photo/close-up-team-leader-explaining-board_23-2148868450.jpg?ga=GA1.1.1886208408.1743750114&semt=ais_hybrid&w=740',
            features: [
                'Complex sentence structures',
                'Academic writing techniques',
                'Error analysis and correction',
                'Grammar for professional contexts'
            ],
            popular: false,
            comingSoon: true
        }
    ]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filters, setFilters] = useState({
        level: 'all',
        priceRange: 'all',
        duration: 'all',
        searchTerm: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [expandedCourse, setExpandedCourse] = useState(null);

    // Apply filters effect
    useEffect(() => {
        let filtered = [...courses];

        if (filters.level !== 'all') {
            filtered = filtered.filter(course => course.level === filters.level);
        }

        if (filters.priceRange !== 'all') {
            if (filters.priceRange === 'under-50') {
                filtered = filtered.filter(course => course.price < 50);
            } else if (filters.priceRange === '50-100') {
                filtered = filtered.filter(course => course.price >= 50 && course.price <= 100);
            } else if (filters.priceRange === 'over-100') {
                filtered = filtered.filter(course => course.price > 100);
            }
        }

        if (filters.duration !== 'all') {
            filtered = filtered.filter(course => {
                const months = parseInt(course.duration);
                if (filters.duration === 'short' && months <= 1) return true;
                if (filters.duration === 'medium' && months > 1 && months <= 3) return true;
                if (filters.duration === 'long' && months > 3) return true;
                return false;
            });
        }

        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(term) ||
                course.description.toLowerCase().includes(term)
            );
        }

        setFilteredCourses(filtered);
    }, [filters, courses]);

    // Initialize filtered courses on component mount
    useEffect(() => {
        setFilteredCourses(courses);

        // Simulate fetching courses from API
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                // In a real app, you would fetch from your API
                // const response = await axios.get('http://localhost:3000/api/courses');
                // setCourses(response.data);
                // setFilteredCourses(response.data);

                // Simulate API delay
                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleEnrollNow = (course) => {
        // Only allow enrollment for courses that are not coming soon
        if (!course.comingSoon) {
            // Store selected course in localStorage
            localStorage.setItem('selectedCourse', JSON.stringify(course));
            // Navigate to details page
            navigate('/details');
        }
    };

    const toggleCourseDetails = (courseId) => {
        setExpandedCourse(expandedCourse === courseId ? null : courseId);
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

    const courseVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
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
                        Explore Our English Courses
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Find the perfect course to elevate your English skills and reach your goals
                    </motion.p>
                </div>

                {/* Filters Section */}
                <motion.div
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-xl shadow-lg mb-10 p-6"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                                Level
                            </label>
                            <select
                                id="level"
                                name="level"
                                value={filters.level}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="all">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                                Price Range
                            </label>
                            <select
                                id="priceRange"
                                name="priceRange"
                                value={filters.priceRange}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="all">All Prices</option>
                                <option value="under-50">Under $50</option>
                                <option value="50-100">$50 - $100</option>
                                <option value="over-100">Over $100</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <select
                                id="duration"
                                name="duration"
                                value={filters.duration}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="all">Any Duration</option>
                                <option value="short">Short (≤ 1 month)</option>
                                <option value="medium">Medium (1-3 months)</option>
                                <option value="long">Long (&gt; 3 months)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </label>
                            <input
                                id="searchTerm"
                                name="searchTerm"
                                type="text"
                                value={filters.searchTerm}
                                onChange={handleFilterChange}
                                placeholder="Search courses..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Courses Display */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-lg p-10 text-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-900">No courses found</h3>
                        <p className="mt-2 text-gray-600">Try adjusting your filters to find more courses.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                variants={courseVariants}
                                whileHover={!course.comingSoon ? { y: -5 } : {}}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${course.comingSoon ? 'relative' : ''}`}
                            >
                                <div className="relative">
                                    <img
                                        src={course.imageUrl}
                                        alt={course.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    {course.popular && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Popular
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white font-semibold px-3 py-1 rounded-full bg-blue-600 text-sm">
                                                {course.level}
                                            </span>
                                            <span className="text-white font-semibold px-3 py-1 rounded-full bg-indigo-600 text-sm">
                                                {course.duration}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-600 mb-4">{course.description}</p>

                                    <div className="flex items-center mb-4">
                                        <span className="text-2xl font-bold text-indigo-700">${course.price}</span>
                                        {course.originalPrice > course.price && (
                                            <span className="ml-2 text-lg text-gray-500 line-through">${course.originalPrice}</span>
                                        )}
                                        {course.originalPrice > course.price && (
                                            <span className="ml-2 text-sm font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                                                {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <motion.button
                                        onClick={() => toggleCourseDetails(course.id)}
                                        className={`w-full text-blue-600 text-sm font-medium flex items-center justify-center mb-4 ${course.comingSoon ? 'pointer-events-none opacity-50' : ''}`}
                                        whileHover={!course.comingSoon ? { scale: 1.05 } : {}}
                                        whileTap={!course.comingSoon ? { scale: 0.95 } : {}}
                                    >
                                        {expandedCourse === course.id ? 'Show Less' : 'View Details'}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 ml-1 transition-transform duration-300 ${expandedCourse === course.id ? 'transform rotate-180' : ''}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </motion.button>

                                    {expandedCourse === course.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mb-4"
                                        >
                                            <h4 className="font-semibold text-gray-800 mb-2">What you'll learn:</h4>
                                            <ul className="space-y-2">
                                                {course.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-gray-600">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}

                                    <motion.button
                                        onClick={() => handleEnrollNow(course)}
                                        className={`w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${course.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        whileHover={!course.comingSoon ? { scale: 1.02 } : {}}
                                        whileTap={!course.comingSoon ? { scale: 0.98 } : {}}
                                        disabled={course.comingSoon}
                                    >
                                        {course.comingSoon ? 'Coming Soon' : 'Enroll Now'}
                                    </motion.button>
                                </div>

                                {/* Coming Soon Overlay */}
                                {course.comingSoon && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 flex flex-col items-center justify-center text-white z-10">
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-center p-4"
                                        >
                                            <div className="relative mb-4 inline-block">
                                                <div className="h-20 w-20 rounded-full bg-white/20 animate-pulse flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-bold mb-2">Coming Soon</h3>
                                            <p className="text-blue-100 max-w-xs mx-auto">
                                                We're currently finalizing this course. Enter your email to be notified when it's available.
                                            </p>
                                            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                                                <input
                                                    type="email"
                                                    placeholder="Your email address"
                                                    className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white"
                                                />
                                                <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                                    Notify Me
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Extra Section - Testimonials */}
                <motion.div
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-16 bg-white rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What Our Students Say</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100"
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <img className="h-12 w-12 rounded-full" src="/api/placeholder/100/100" alt="Student" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Michael Chen</h3>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "The Business English course transformed my professional communication. I'm now more confident during meetings and presentations with international clients."
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100"
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <img className="h-12 w-12 rounded-full" src="/api/placeholder/100/100" alt="Student" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Sarah Johnson</h3>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "My children have shown remarkable improvement in their reading abilities since joining the phonics course. The interactive approach keeps them engaged!"
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100"
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    <img className="h-12 w-12 rounded-full" src="/api/placeholder/100/100" alt="Student" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">James Wilson</h3>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">
                                "The Advanced Grammar Masterclass was exactly what I needed to improve my academic writing. The instructors are knowledgeable and the materials are excellent."
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Call to Action Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.7 }}
                    className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden"
                >
                    <div className="px-8 py-12 md:py-16 md:px-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Start Your Learning Journey Today</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied students worldwide. Find the perfect course that matches your goals and transform your English skills.</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        >
                            View All Courses
                        </motion.button>
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-16 bg-white rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>

                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">How are the courses structured?</h3>
                            <p className="text-gray-600">
                                Our courses combine video lessons, interactive exercises, quizzes, and live sessions with instructors. You'll have access to a personalized dashboard to track your progress and participate in community discussions.
                            </p>
                        </div>

                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Do I get a certificate after completing a course?</h3>
                            <p className="text-gray-600">
                                Yes, all our courses come with a completion certificate that you can add to your resume or LinkedIn profile. For certain advanced courses, you may also receive internationally recognized certifications.
                            </p>
                        </div>

                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">What if I'm not satisfied with a course?</h3>
                            <p className="text-gray-600">
                                We offer a 30-day money-back guarantee for all our courses. If you're not completely satisfied, you can request a full refund within the first 30 days of enrollment.
                            </p>
                        </div>

                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">How long do I have access to course materials?</h3>
                            <p className="text-gray-600">
                                Once enrolled, you'll have lifetime access to all course materials, including any future updates. You can learn at your own pace and revisit the content whenever you need.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Can I access the courses on mobile devices?</h3>
                            <p className="text-gray-600">
                                Yes, our platform is fully responsive and optimized for all devices. You can access your courses from desktop, laptop, tablet, or smartphone through our website or dedicated mobile app.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Courses;