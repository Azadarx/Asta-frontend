import React, { useState } from 'react';
import { motion } from 'framer-motion';

const About = () => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState({
        success: false,
        message: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus({ success: false, message: '' });

        try {
            const response = await fetch('http://localhost:3000/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Reset form on success
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setSubmissionStatus({
                    success: true,
                    message: 'Thank you! Your message has been sent successfully.'
                });
            } else {
                setSubmissionStatus({
                    success: false,
                    message: data.error || 'There was an error sending your message. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmissionStatus({
                success: false,
                message: 'Network error. Please check your connection and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-20">
                {/* Modern dot pattern background with animated gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-amber-500/10 animate-gradient"></div>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
                        <defs>
                            <pattern id="modern-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                                <circle cx="4" cy="4" r="2" fill="#6d28d9" />
                                <circle cx="20" cy="20" r="1.5" fill="#ec4899" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#modern-dots)" />
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                >
                    <div className="text-center max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="mb-4 inline-block"
                        >
                            <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">Transforming Education</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 drop-shadow-sm">
                                ASTA Education Academy
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-6 text-xl md:text-2xl font-light text-gray-700 leading-relaxed max-w-3xl mx-auto"
                        >
                            Empowering students with transformative language skills and confidence for global success
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mt-8 flex flex-wrap justify-center gap-4"
                        >
                            <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
                                Explore Programs
                            </button>
                            <button className="px-8 py-3 bg-white hover:bg-gray-50 text-purple-700 border border-purple-200 rounded-full font-medium shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
                                Book a Tour
                            </button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-16 relative"
                    >
                        <div className="absolute -left-4 -top-4 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
                        <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-amber-400 rounded-full blur-3xl opacity-20"></div>

                        <div className="relative w-full max-w-6xl mx-auto h-72 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://t3.ftcdn.net/jpg/04/40/29/94/360_F_440299419_s4b12RfNDJvpplheVDmKdhFGJiHlAYNs.jpg"
                                alt="ASTA Education Academy Campus"
                                className="w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent flex items-end">
                                <div className="p-8 md:p-10 lg:p-12 text-white max-w-3xl">
                                    <h2 className="text-3xl md:text-4xl font-bold">Building Tomorrow's Leaders</h2>
                                    <p className="mt-3 text-xl text-purple-100 font-light">Where language mastery opens doors to unlimited possibilities</p>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 1 }}
                                        className="mt-6"
                                    >
                                        <a href="#" className="flex items-center text-amber-300 hover:text-amber-200 transition-colors">
                                            <span>Watch our story</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Our Story Section - Modern Redesign */}
            <section className="py-20 md:py-32 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-300/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-60 -left-20 w-80 h-80 bg-gradient-to-tr from-amber-400/10 to-yellow-200/5 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
                    >
                        <motion.div variants={fadeIn} className="order-2 lg:order-1 lg:col-span-6">
                            <div className="relative">
                                <motion.span
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "40%" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    viewport={{ once: true }}
                                    className="absolute -top-4 left-0 h-1 bg-gradient-to-r from-purple-600 to-pink-500"
                                ></motion.span>
                                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8">Our Story</h2>
                            </div>

                            <div className="space-y-6 text-gray-600">
                                <p className="text-lg leading-relaxed">
                                    ASTA Education Academy was founded with a vision to revolutionize language education in a rapidly globalizing world. What began as a small initiative has blossomed into one of the region's most respected educational institutions specializing in English language proficiency.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    At ASTA, we believe that language is not just a means of communication but a gateway to cultural understanding and professional growth. Our pioneering approach to Phonics English has helped thousands of students master pronunciation and reading skills, setting them up for lifelong success.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Our academy stands out for its personalized approach, innovative teaching methodologies, and unwavering commitment to student development. We don't just teach English; we nurture confident communicators and critical thinkers equipped to excel in any field they choose.
                                </p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="mt-10 flex flex-wrap gap-4"
                            >
                                <button
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Discover Our Programs
                                </button>
                                <div className="flex items-center">
                                    <div className="flex -space-x-2 mr-4">
                                        <img src="https://randomuser.me/api/portraits/women/32.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="Student" />
                                        <img src="https://randomuser.me/api/portraits/men/54.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="Student" />
                                        <img src="https://randomuser.me/api/portraits/women/67.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="Student" />
                                    </div>
                                    <span className="text-sm text-gray-500">Join 2,500+ students</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="order-1 lg:order-2 lg:col-span-6">
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
                                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>

                                <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl">
                                    <img
                                        src="https://www.shutterstock.com/image-photo/happy-mid-aged-business-woman-600nw-2353012835.jpg"
                                        alt="ASTA Education Academy Class"
                                        className="w-full h-auto rounded-xl"
                                    />

                                    <div className="mt-6 p-6 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-gray-600 font-medium">4.9/5</span>
                                        </div>

                                        <h3 className="text-xl font-semibold text-gray-800">Where learning feels like discovery</h3>
                                        <p className="text-gray-500 mt-2">Interactive classes designed for engagement and retention</p>

                                        <div className="mt-6 flex justify-center">
                                            <button className="text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center">
                                                <span>Take a virtual tour</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-purple-900 to-pink-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership</h2>
                        <p className="max-w-2xl mx-auto text-purple-200">
                            The visionary minds behind ASTA Education Academy's success
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {/* Principal/Head Trainer */}
                        <motion.div
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md"></div>
                                    <div className="relative overflow-hidden w-36 h-36 rounded-full border-4 border-white">
                                        <img
                                            src="https://media.istockphoto.com/id/1312447551/photo/business-woman-at-office-stock-photo.jpg?s=612x612&w=0&k=20&c=AE2Pew-VIYVSmY4wOZcK6bPV2AKgbwSRUVGMnFhyS-Y="
                                            alt="Shereen Ma'am"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">Shereen Ma'am</h3>
                                <p className="text-pink-300 font-medium mb-4">Principal & Head Trainer</p>
                                <p className="text-purple-100 leading-relaxed">
                                    With over 15 years of teaching experience, Shereen Ma'am brings unparalleled expertise in phonics and English language instruction. Her innovative teaching methodologies have transformed the learning experience for thousands of students, making complex concepts accessible and enjoyable.
                                </p>
                                <div className="mt-6 pt-6 border-t border-white/20 w-full">
                                    <div className="flex justify-center space-x-6">
                                        <div className="text-center">
                                            <div className="text-xl font-bold">15+</div>
                                            <div className="text-purple-300 text-sm">Years Teaching</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold">5000+</div>
                                            <div className="text-purple-300 text-sm">Students Mentored</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold">12</div>
                                            <div className="text-purple-300 text-sm">Awards</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Director */}
                        <motion.div
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-pink-500 rounded-full blur-md"></div>
                                    <div className="relative overflow-hidden w-36 h-36 rounded-full border-4 border-white">
                                        <img
                                            src="https://media.istockphoto.com/id/1464539429/photo/thoughtful-business-man-with-a-digital-tablet.jpg?s=612x612&w=0&k=20&c=yLbK-rGNUkL0sPX4jw7Q_XE_vDtfj0X3nirixUlGtr4="
                                            alt="Ali Abbas Sir"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">Ali Abbas Sir</h3>
                                <p className="text-pink-300 font-medium mb-4">Director & Strategic Vision</p>
                                <p className="text-purple-100 leading-relaxed">
                                    Ali Abbas Sir brings extensive industry experience to ASTA Education Academy. His entrepreneurial mindset and passion for education have been instrumental in shaping the academy's growth and reputation. Under his strategic leadership, the academy continues to pioneer new educational approaches.
                                </p>
                                <div className="mt-6 pt-6 border-t border-white/20 w-full">
                                    <div className="flex justify-center space-x-6">
                                        <div className="text-center">
                                            <div className="text-xl font-bold">10+</div>
                                            <div className="text-purple-300 text-sm">Years in Leadership</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold">20+</div>
                                            <div className="text-purple-300 text-sm">Industry Connections</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold">8</div>
                                            <div className="text-purple-300 text-sm">Business Excellence Awards</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Choose ASTA Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose ASTA</h2>
                        <p className="max-w-2xl mx-auto text-gray-600">
                            Discover what sets our academy apart and why we're the preferred choice for language education
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {/* Card 1 */}
                        <motion.div
                            variants={fadeIn}
                            className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Innovative Teaching Methods</h3>
                            <p className="text-gray-600">
                                Our pioneering phonics approach makes English pronunciation and reading accessible to learners of all ages. We combine traditional techniques with modern technology for maximum effectiveness.
                            </p>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            variants={fadeIn}
                            className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Instructors</h3>
                            <p className="text-gray-600">
                                Learn from the best in the industry. Our teachers are not only qualified educators but also passionate about nurturing student growth with patience and personalized attention.
                            </p>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            variants={fadeIn}
                            className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Proven Results</h3>
                            <p className="text-gray-600">
                                Our track record speaks for itself. With a 95% success rate and glowing testimonials from students and parents alike, we take pride in consistently delivering excellence.
                            </p>
                        </motion.div>

                        {/* Card 4 */}
                        <motion.div
                            variants={fadeIn}
                            className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Modern Facilities</h3>
                            <p className="text-gray-600">
                                Our state-of-the-art classrooms are equipped with the latest educational technology to enhance the learning experience and prepare students for the digital age.
                            </p>
                        </motion.div>

                        {/* Card 5 */}
                        <motion.div
                            variants={fadeIn}
                            className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Comprehensive Curriculum</h3>
                            <p className="text-gray-600">
                                Our programs go beyond basic language skills to include critical thinking, public speaking, and cultural awareness—preparing students for global opportunities.
                            </p>
                        </motion.div>

                        {/* Card 6 */}
                        <motion.div
                            variants={fadeIn}
                            className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Flexible Learning Options</h3>
                            <p className="text-gray-600">
                                We understand busy schedules. Choose from morning, evening, weekend, or online classes designed to fit seamlessly into your lifestyle without compromising quality.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Success Story Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-pink-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Impact</h2>
                            <p className="text-gray-600">The numbers that reflect our commitment to excellence</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold text-purple-600 mb-2">5000+</div>
                                <div className="text-gray-600">Students Trained</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold text-pink-600 mb-2">98%</div>
                                <div className="text-gray-600">Success Rate</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold text-amber-600 mb-2">15+</div>
                                <div className="text-gray-600">Years of Excellence</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">20+</div>
                                <div className="text-gray-600">Expert Instructors</div>
                            </div>
                        </div>

                        <div className="mt-16 bg-white p-8 rounded-xl shadow-xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Student Success Story</h3>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
                                        <img
                                            src="https://media.istockphoto.com/id/1392125218/photo/happy-teacher-and-schoolboy-giving-each-other-high-five-on-a-class.jpg?s=612x612&w=0&k=20&c=xn3BHSIvAzsLosNAYEn5SdZILHd_smpp3W4DR7fNTdM="
                                            alt="Student Success Story"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <blockquote className="text-gray-600 italic">
                                        "Before joining ASTA Education Academy, I struggled with English pronunciation and lacked confidence in my communication skills. The phonics program completely transformed my approach to learning English. Shereen Ma'am's teaching methods made complex phonics rules easy to understand, and with Ali Abbas Sir's guidance, I gained practical experience through various speaking opportunities. Today, I work confidently in an international company where strong English skills are essential for daily operations."
                                    </blockquote>
                                    <div className="mt-4">
                                        <div className="font-semibold text-gray-800">Priya Sharma</div>
                                        <div className="text-sm text-gray-500">Former Student, now working at a multinational firm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center">
                            <div className="md:w-2/3">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your English Journey Today</h2>
                                <p className="text-purple-100 text-lg mb-8 md:mb-0">
                                    Join ASTA Education Academy and transform your language skills. Our expert instructors are ready to guide you every step of the way.
                                </p>
                            </div>
                            <div className="md:w-1/3 flex justify-center md:justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Book a Free Assessment
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Have questions about our programs? Want to schedule a visit? Our team is here to help!
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Our Location</h3>
                            <p className="text-gray-600">
                                123 Education Avenue<br />
                                Learning District<br />
                                Knowledge City, 400001
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Contact Us</h3>
                            <p className="text-gray-600">
                                Phone: +91 1234567890<br />
                                Email: info@astaeducation.com
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Office Hours</h3>
                            <p className="text-gray-600">
                                Monday - Friday: 9:00 AM - 6:00 PM<br />
                                Saturday: 9:00 AM - 1:00 PM<br />
                                Sunday: Closed
                            </p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mt-16 max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl"
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send Us a Message</h3>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter subject"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Type your message here..."
                                    required
                                ></textarea>
                            </div>
                            {submissionStatus.message && (
                                <div className={`text-center p-3 rounded-lg ${submissionStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {submissionStatus.message}
                                </div>
                            )}
                            <div className="text-center">
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            {/* <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div>
                            <h3 className="text-xl font-bold mb-4">ASTA Education</h3>
                            <p className="text-gray-400">
                                Empowering students with transformative language skills and confidence for global success.
                            </p>
                            <div className="mt-4 flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Programs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Programs</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Phonics English</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Advanced Communication</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business English</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Academic Writing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Exam Preparation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates on programs and events.</p>
                            <form className="space-y-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white font-medium">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="mt-10 pt-6 border-t border-gray-800 text-center">
                        <p className="text-gray-400">© 2025 ASTA Education Academy. All rights reserved.</p>
                    </div>
                </div>
            </footer> */}
        </div>
    );
};

export default About;