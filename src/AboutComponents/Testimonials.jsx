import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Testimonials = () => {
    const navigate = useNavigate();
    const [testimonials, setTestimonials] = useState([
        {
            id: 1,
            name: "Michael Chen",
            course: "Business English",
            rating: 5,
            text: "The Business English course transformed my professional communication. I'm now more confident during meetings and presentations with international clients. The personalized feedback from instructors was invaluable for improving my pronunciation and vocabulary.",
            image: "/api/placeholder/100/100",
            role: "Marketing Director",
            featured: true,
            videoTestimonial: false
        },
        {
            id: 2,
            name: "Sarah Johnson",
            course: "Phonics English Course",
            rating: 5,
            text: "My children have shown remarkable improvement in their reading abilities since joining the phonics course. The interactive approach keeps them engaged! The weekly progress reports helped me understand exactly where they were improving and what areas needed more focus.",
            image: "/api/placeholder/100/100",
            role: "Parent",
            featured: true,
            videoTestimonial: false
        },
        {
            id: 3,
            name: "James Wilson",
            course: "Advanced Grammar Masterclass",
            rating: 5,
            text: "The Advanced Grammar Masterclass was exactly what I needed to improve my academic writing. The instructors are knowledgeable and the materials are excellent. I've seen a significant improvement in my academic paper scores since taking this course.",
            image: "/api/placeholder/100/100",
            role: "PhD Student",
            featured: true,
            videoTestimonial: true
        },
        {
            id: 4,
            name: "Priya Sharma",
            course: "Business English",
            rating: 4,
            text: "As a non-native speaker working in an international company, this course gave me the confidence to lead meetings and write professional emails. The role-playing exercises with other students were particularly helpful for practicing real-world scenarios.",
            image: "/api/placeholder/100/100",
            role: "Project Manager",
            featured: false,
            videoTestimonial: false
        },
        {
            id: 5,
            name: "Carlos Rodriguez",
            course: "Phonics English Course",
            rating: 5,
            text: "Learning English pronunciation has always been challenging for me, but this course broke it down in a way that finally made sense. The audio exercises and immediate feedback technology helped me correct mistakes I didn't even know I was making.",
            image: "/api/placeholder/100/100",
            role: "Engineering Student",
            featured: false,
            videoTestimonial: true
        },
        {
            id: 6,
            name: "Emma Thompson",
            course: "Advanced Grammar Masterclass",
            rating: 5,
            text: "This course took my writing from good to excellent. The detailed analysis of complex grammar structures and personalized feedback on my assignments significantly improved my ability to write clear, compelling content for my work.",
            image: "/api/placeholder/100/100",
            role: "Content Writer",
            featured: false,
            videoTestimonial: false
        },
        {
            id: 7,
            name: "Ahmed Hassan",
            course: "Business English",
            rating: 5,
            text: "The negotiation and presentation modules were game-changers for my career. I secured a promotion within three months of completing the course, and I attribute much of that success to the confidence and communication skills I gained.",
            image: "/api/placeholder/100/100",
            role: "Sales Executive",
            featured: false,
            videoTestimonial: false
        },
        {
            id: 8,
            name: "Sophia Kim",
            course: "Phonics English Course",
            rating: 4,
            text: "The phonics approach made a huge difference in my pronunciation clarity. The course was well-structured with gradual progression from basic to complex sounds. I appreciate how the instructors were patient and provided constructive feedback.",
            image: "/api/placeholder/100/100",
            role: "International Student",
            featured: false,
            videoTestimonial: false
        }
    ]);
    
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [filteredTestimonials, setFilteredTestimonials] = useState([]);
    const [featuredTestimonials, setFeaturedTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filter testimonials based on selected course
    useEffect(() => {
        setIsLoading(true);
        
        setTimeout(() => {
            if (selectedCourse === 'all') {
                setFilteredTestimonials(testimonials);
            } else {
                setFilteredTestimonials(testimonials.filter(testimonial => 
                    testimonial.course === selectedCourse
                ));
            }
            
            setFeaturedTestimonials(testimonials.filter(testimonial => testimonial.featured));
            setIsLoading(false);
        }, 500); // Simulate loading delay
    }, [selectedCourse, testimonials]);
    
    const handleCourseChange = (course) => {
        setSelectedCourse(course);
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
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };
    
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <svg 
                key={i} 
                className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };
    
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800"
                    >
                        Success Stories from Our Students
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Discover how our English courses have transformed the lives and careers of students worldwide
                    </motion.p>
                </div>
                
                {/* Featured Testimonials Carousel */}
                {featuredTestimonials.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                        className="mb-16"
                    >
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-8 md:p-12 bg-gradient-to-r from-blue-600 to-indigo-700">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Featured Student Testimonials</h2>
                                <p className="text-blue-100">Hear from some of our most successful students</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-10">
                                {featuredTestimonials.map((testimonial) => (
                                    <motion.div
                                        key={testimonial.id}
                                        whileHover={{ y: -5 }}
                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100 flex flex-col h-full"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="relative">
                                                <img 
                                                    src={testimonial.image} 
                                                    alt={testimonial.name} 
                                                    className="h-14 w-14 rounded-full object-cover border-2 border-blue-300"
                                                />
                                                {testimonial.videoTestimonial && (
                                                    <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                            <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                                                <p className="text-sm text-gray-600">{testimonial.role}</p>
                                                <div className="flex mt-1">
                                                    {renderStars(testimonial.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4 flex-grow">
                                            <div className="bg-blue-100 px-3 py-1 rounded text-blue-700 text-sm font-medium inline-block mb-2">
                                                {testimonial.course}
                                            </div>
                                            <p className="text-gray-700 italic">"{testimonial.text}"</p>
                                        </div>
                                        
                                        {testimonial.videoTestimonial && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="mt-2 flex items-center justify-center w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                                Watch Video Testimonial
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Course Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCourseChange('all')}
                            className={`px-4 py-2 rounded-full font-medium ${
                                selectedCourse === 'all' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-blue-50'
                            } transition-colors`}
                        >
                            All Courses
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCourseChange('Phonics English Course')}
                            className={`px-4 py-2 rounded-full font-medium ${
                                selectedCourse === 'Phonics English Course' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-blue-50'
                            } transition-colors`}
                        >
                            Phonics English
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCourseChange('Business English')}
                            className={`px-4 py-2 rounded-full font-medium ${
                                selectedCourse === 'Business English' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-blue-50'
                            } transition-colors`}
                        >
                            Business English
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCourseChange('Advanced Grammar Masterclass')}
                            className={`px-4 py-2 rounded-full font-medium ${
                                selectedCourse === 'Advanced Grammar Masterclass' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-blue-50'
                            } transition-colors`}
                        >
                            Grammar Masterclass
                        </motion.button>
                    </div>
                </motion.div>
                
                {/* All Testimonials Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredTestimonials.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-lg p-10 text-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-900">No testimonials found</h3>
                        <p className="mt-2 text-gray-600">Try selecting a different course category.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredTestimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                variants={itemVariants}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <img 
                                                src={testimonial.image} 
                                                alt={testimonial.name} 
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-100 px-3 py-1 rounded text-blue-700 text-xs font-medium">
                                            {testimonial.course}
                                        </div>
                                    </div>
                                    
                                    <div className="flex mb-4">
                                        {renderStars(testimonial.rating)}
                                    </div>
                                    
                                    <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                                    
                                    {testimonial.videoTestimonial && (
                                        <div className="mt-4 flex justify-end">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center text-indigo-600 hover:text-indigo-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                                Watch Video
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
                
                {/* Success Metrics Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.7 }}
                    className="mt-16 bg-white rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Student Success Metrics</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
                            <div className="text-gray-700">Satisfaction Rate</div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">15K+</div>
                            <div className="text-gray-700">Graduates</div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">4.8/5</div>
                            <div className="text-gray-700">Average Rating</div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">85%</div>
                            <div className="text-gray-700">Career Advancement</div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Submit Your Story Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.7 }}
                    className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden"
                >
                    <div className="px-8 py-12 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-4">Share Your Success Story</h2>
                                <p className="text-blue-100 mb-6">
                                    We love hearing how our courses have helped our students. Share your experience and inspire future learners.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                >
                                    Submit Your Testimonial
                                </motion.button>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                                <div className="flex space-x-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="text-white opacity-90">
                                    <p className="mb-2">
                                        <span className="text-blue-300">// Student testimonial</span>
                                    </p>
                                    <p className="mb-2">
                                        <span className="text-pink-300">const</span> <span className="text-blue-300">myStory</span> = {"{"}
                                    </p>
                                    <p className="mb-2 ml-4">
                                        <span className="text-green-300">name</span>: <span className="text-yellow-300">"Your Name"</span>,
                                    </p>
                                    <p className="mb-2 ml-4">
                                        <span className="text-green-300">course</span>: <span className="text-yellow-300">"Course Name"</span>,
                                    </p>
                                    <p className="mb-2 ml-4">
                                        <span className="text-green-300">experience</span>: <span className="text-yellow-300">"Share your journey..."</span>,
                                    </p>
                                    <p className="mb-2">
                                        {"}"};
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Courses CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.7 }}
                    className="mt-16 mb-8 bg-white rounded-xl shadow-lg p-8"
                >
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Success Story?</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of students who have transformed their lives through our English courses. It's your turn to succeed.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/courses')}
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Explore Courses
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Testimonials;