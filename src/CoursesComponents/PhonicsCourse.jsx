import React from 'react';
import { motion } from 'framer-motion';

const PhonicsCourse = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
    };

    // Course features
    const courseFeatures = [
        { icon: "🎯", title: "Structured Learning Path", description: "Progressive phonics lessons designed for optimal learning" },
        { icon: "🔤", title: "Interactive Sessions", description: "Engaging activities to reinforce letter-sound relationships" },
        { icon: "📚", title: "Comprehensive Materials", description: "Digital and printable resources for practice at home" },
        { icon: "🏆", title: "Achievement Tracking", description: "Regular assessments to monitor progress" },
        { icon: "👩‍👧‍👦", title: "Small Batch Learning", description: "Limited students per batch for personalized attention" },
        { icon: "🎮", title: "Game-Based Learning", description: "Fun phonics games to make learning enjoyable" }
    ];

    // Curriculum highlights
    const curriculumHighlights = [
        "Letter recognition and formation",
        "Letter-sound relationships",
        "Blending sounds to read words",
        "Segmenting words into sounds",
        "High-frequency sight words",
        "Reading fluency development",
        "Phonemic awareness activities"
    ];

    return (
        <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20"
            >
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{
                    backgroundImage: "url('/images/phonics-pattern.jpg')",
                    opacity: 0.07
                }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full md:w-1/2 mb-8 md:mb-0">
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
                                    Beginner Level • 3 Months Duration
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    Phonics English <span className="text-indigo-600">Course</span>
                                </h1>
                                <p className="text-xl text-gray-700 mb-6">
                                    Master the building blocks of English reading and pronunciation with our expertly crafted phonics program
                                </p>

                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="flex items-center">
                                        <span className="line-through text-gray-500 text-xl">₹199</span>
                                        <span className="ml-2 text-3xl font-bold text-indigo-600">₹99</span>
                                    </div>
                                    <div className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm font-medium">
                                        50% OFF
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => window.location.href = '/details'}
                                >
                                    Enroll Now for ₹99
                                    <span className="ml-2">→</span>
                                </motion.button>
                            </motion.div>
                        </div>

                        <motion.div
                            className="w-full md:w-1/2"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-100 rounded-full z-0"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full z-0"></div>
                                <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl">
                                    <img
                                        src="https://teachertrainingindia.co.in/blog/wp-content/uploads/2024/04/27-phonics-training-online-1.webp"
                                        alt="Phonics Course"
                                        className="w-full h-auto rounded-lg mb-4"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "/api/placeholder/500/300" }}
                                    />
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                                            <div className="text-2xl mb-1">🎓</div>
                                            <div className="text-sm font-medium text-gray-700">Interactive</div>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                                            <div className="text-2xl mb-1">👩‍🏫</div>
                                            <div className="text-sm font-medium text-gray-700">Expert Led</div>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg text-center">
                                            <div className="text-2xl mb-1">📱</div>
                                            <div className="text-sm font-medium text-gray-700">Online</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-blue-${i}00`}></div>
                                            ))}
                                        </div>
                                        <div className="ml-3 text-sm text-gray-600">
                                            <span className="font-medium">127+ students</span> enrolled this month
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Instructor Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row items-center"
                    >
                        <div className="w-full md:w-2/5 mb-8 md:mb-0">
                            <div className="relative">
                                <div className="absolute w-full h-full bg-indigo-100 rounded-2xl"></div>
                                <img
                                    src="https://photosnow.org/wp-content/uploads/2024/04/beautiful-girl-photo_2.jpg"
                                    alt="Shereen Mam"
                                    className="relative z-10 w-full h-auto rounded-2xl shadow-lg"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/api/placeholder/400/500" }}
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-3/5 md:pl-16">
                            <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
                                Meet Your Instructor
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shereen Mam</h2>
                            <div className="flex items-center mb-6">
                                <div className="flex items-center mr-4">
                                    <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="text-gray-700">15+ years experience</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <span className="text-gray-700">Principal, Chota School</span>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">
                                With over 15 years of teaching experience, Shereen Mam is a dedicated educator who has transformed the English learning journey for thousands of students. As the principal of Chota School in Hyderabad, she brings her extensive expertise in phonics teaching methodology to help students build a strong foundation in English pronunciation and reading skills.
                            </p>

                            <p className="text-gray-700 mb-8">
                                Her innovative teaching approach combines traditional phonics with modern interactive techniques, making learning both effective and enjoyable. Shereen Mam's students consistently demonstrate exceptional reading proficiency and confidence in English communication.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">Child Psychology</div>
                                <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">Phonetic Teaching</div>
                                <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">Reading Development</div>
                                <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">English Language</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Course Features */}
            <section className="py-16 bg-gradient-to-br from-indigo-900 to-blue-800 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4">Course Features</h2>
                        <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4"></div>
                        <p className="max-w-2xl mx-auto text-indigo-100">
                            Our comprehensive phonics program is designed to make learning engaging, effective, and enjoyable
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {courseFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-indigo-100">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2"
                        >
                            <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
                                Curriculum Highlights
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Learn</h2>

                            <div className="space-y-4">
                                {curriculumHighlights.map((item, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <p className="text-gray-700">{item}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="mt-8"
                            >
                                <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Course Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Duration</p>
                                            <p className="font-medium">3 Months</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Class Size</p>
                                            <p className="font-medium">Maximum 12 students</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Sessions</p>
                                            <p className="font-medium">Daily 1 session</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Mode</p>
                                            <p className="font-medium">Online</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2"
                        >
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Transform Your English Skills?</h3>
                                    <p className="text-gray-700 mb-6">Join our phonics course and build a strong foundation for English reading and pronunciation</p>

                                    <div className="mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-700 font-medium">Limited Seats Available</span>
                                            <span className="text-indigo-600 font-medium">85% full</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                                        <div className="mb-4 sm:mb-0">
                                            <span className="text-2xl font-bold text-indigo-600">₹99</span>
                                            <span className="text-gray-500 line-through ml-2">₹199</span>
                                            <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">50% OFF</span>
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">Offer ends in:</span> 2 days
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                        onClick={() => window.location.href = '/details'}
                                    >
                                        Enroll Now for ₹99
                                        <span className="ml-2">→</span>
                                    </motion.button>
                                </div>

                                <div className="px-8 py-6 border-t border-gray-100">
                                    <h4 className="font-medium text-gray-900 mb-3">This course includes:</h4>
                                    <div className="space-y-3">
                                        {[
                                            { icon: "📺", text: "24 live online sessions" },
                                            { icon: "📝", text: "Comprehensive study materials" },
                                            { icon: "📱", text: "Mobile app access" },
                                            { icon: "🎖️", text: "Course completion certificate" },
                                            { icon: "🔄", text: "Lifetime updates to course content" }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <span className="mr-3">{item.icon}</span>
                                                <span className="text-gray-700">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
                        <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
                        <p className="max-w-2xl mx-auto text-gray-700">
                            Hear from parents and students who have experienced the transformation in English skills
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Priya Sharma",
                                relation: "Parent of 7-year-old",
                                image: "https://media.istockphoto.com/id/1987655119/photo/smiling-young-businesswoman-standing-in-the-corridor-of-an-office.jpg?s=612x612&w=0&k=20&c=5N_IVGYsXoyj-H9vEiZUCLqbmmineaemQsKt2NTXGms=",
                                content: "My son's reading ability has improved dramatically after just one month. Shereen Mam's phonics method really works!"
                            },
                            {
                                name: "Rahul Verma",
                                relation: "Parent of 6-year-old",
                                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9us0MxB35Wv3z03TJFrxhub-WyxqpBKAsjQ&s",
                                content: "The interactive approach keeps my daughter engaged and excited about learning. Her pronunciation has become much clearer."
                            },
                            {
                                name: "Ananya Reddy",
                                relation: "Parent of 8-year-old",
                                image: "https://thumbs.dreamstime.com/b/indian-lady-7221639.jpg",
                                content: "Best investment we've made in our child's education. The structured curriculum and Shereen Mam's expertise make all the difference."
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 rounded-xl p-6 shadow-sm"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "/api/placeholder/100/100" }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-gray-600 text-sm">{testimonial.relation}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700">{testimonial.content}</p>
                                <div className="mt-4 flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mt-12 text-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 bg-indigo-600 rounded-lg text-white font-medium shadow-lg hover:bg-indigo-700 transition-all duration-300"
                            onClick={() => window.location.href = '/details'}
                        >
                            Enroll Now and Transform Your Child's English Skills
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <div className="w-20 h-1 bg-indigo-600 mx-auto mb-4"></div>
                        <p className="max-w-2xl mx-auto text-gray-700">
                            Everything you need to know about our Phonics English Course
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {[
                            {
                                question: "What age group is this course suitable for?",
                                answer: "The course is designed for children, and as well as for parents and businessMans, the one who wants to learn Phonics English we will teach all of them, there is no particular age limits."
                            },
                            {
                                question: "How are the online classes conducted?",
                                answer: "Classes are conducted via Our own Application 'QuickJoin' with interactive elements. Each session is 45 minutes long with additional activities and assignments for practice."
                            },
                            {
                                question: "Do you provide study materials?",
                                answer: "Yes, we provide comprehensive digital materials including worksheets, flashcards, and reading exercises. Physical materials can also be arranged for an additional fee."
                            },
                            {
                                question: "How many students are in each batch?",
                                answer: "To ensure personalized attention, we limit our batches to a maximum of 12 students."
                            },
                            {
                                question: "Is there a refund policy?",
                                answer: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with the course."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="mb-4 last:mb-0"
                            >
                                <details className="group bg-white rounded-lg shadow-sm overflow-hidden">
                                    <summary className="flex items-center justify-between cursor-pointer p-6 font-medium text-gray-900">
                                        {faq.question}
                                        <svg className="w-5 h-5 text-indigo-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-700">
                                        {faq.answer}
                                    </div>
                                </details>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-16 bg-gradient-to-r from-indigo-700 to-blue-700 text-white"
            >
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Phonics Journey?</h2>
                    <p className="max-w-2xl mx-auto mb-8 text-indigo-100">Give your child the gift of confident English reading and speaking. Limited seats available!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-white text-indigo-700 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => window.location.href = '/details'}
                        >
                            Enroll Now for ₹99
                            <span className="ml-2">→</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-medium text-lg hover:bg-white/10 transition-all duration-300"
                            onClick={() => window.location.href = '/contact-us'}
                        >
                            Contact Instructor
                        </motion.button>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="flex items-center mr-6">
                            <svg className="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <span className="text-white">50% Discount</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-white">Limited Time Offer</span>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Footer */}
            {/* <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between mb-8">
                        <div className="mb-8 md:mb-0">
                            <h3 className="text-xl font-bold mb-4">Phonics English Course</h3>
                            <p className="text-gray-400 max-w-md">
                                Transform your child's English reading and pronunciation skills with our expert-led phonics program.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="text-lg font-medium mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Course Details</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Instructor</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium mb-4">Resources</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition-colors">Free Worksheets</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium mb-4">Contact</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        <span>+91 9876543210</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>info@phonicscourse.com</span>
                                    </li>
                                </ul>

                                <div className="flex space-x-4 mt-4">
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 Phonics English Course. All rights reserved.</p>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer> */}
        </div>
    );
};

export default PhonicsCourse;