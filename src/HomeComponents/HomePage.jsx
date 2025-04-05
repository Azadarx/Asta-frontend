import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const HomePage = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', message: 'Hello! How can I help you today?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  // Scroll position for various effects
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);

      // Show promo popup when user scrolls down 40% of page
      if (window.scrollY > window.innerHeight * 0.4 && !showPromoPopup && !localStorage.getItem('promoShown')) {
        setShowPromoPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPromoPopup]);

  // Delayed popup for new visitors
  useEffect(() => {
    if (!localStorage.getItem('visited')) {
      const timer = setTimeout(() => {
        setShowPromoPopup(true);
        localStorage.setItem('visited', 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Newsletter form submission handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Set loading state if needed
    setIsLoading(true);

    // Example API call to subscribe the user
    // Replace with your actual API endpoint
    fetch('https://api.yourwebsite.com/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful subscription
        setIsLoading(false);
        setIsSubscribed(true);
        // Optional: Clear the input field
        e.target.reset();
        // Optional: Show success message
        alert('Thank you for subscribing to our newsletter!');
      })
      .catch((error) => {
        // Handle errors
        setIsLoading(false);
        console.error('Subscription error:', error);
        alert('There was an error subscribing you. Please try again later.');
      });
  };

  const [isSubscribed, setIsSubscribed] = useState(false);
  // Animation refs
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [coachRef, coachInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Cursor tracking for hero section parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroSectionRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setMousePosition({
            x: (e.clientX / window.innerWidth - 0.5) * 20,
            y: (e.clientY / window.innerHeight - 0.5) * 20,
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Patel',
      initials: 'RP',
      role: 'Phonics English Student',
      content: "The phonics course completely transformed my child's reading ability. Shereen ma'am's teaching methods are engaging and effective!",
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: 2,
      name: 'Sonia Kumar',
      initials: 'SK',
      role: 'Life Coaching Student',
      content: "The life coaching program helped me gain clarity and confidence. Shereen ma'am's personalized approach and expert guidance made all the difference.",
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/26.jpg'
    },
    {
      id: 3,
      name: 'Vikram Singh',
      initials: 'VS',
      role: 'Parent',
      content: "My daughter was struggling with reading, but after just 3 months with Shereen ma'am in the phonics program, she's reading fluently and confidently. Worth every penny!",
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Define the FAQ data array
  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer a wide range of services including web development, mobile app development, UI/UX design, and digital marketing solutions tailored to meet your business needs."
    },
    {
      question: "How much do your services cost?",
      answer: "Our pricing varies depending on project scope, complexity, and timeline. We offer customized quotes after an initial consultation to understand your specific requirements."
    },
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary based on scope and complexity. Simple websites might take 2-4 weeks, while complex applications can take several months. We'll provide you with a detailed timeline during our project planning phase."
    },
    {
      question: "Do you offer support after project completion?",
      answer: "Yes, we provide ongoing maintenance and support services. We offer various support packages to ensure your digital products continue to run smoothly after launch."
    },
    {
      question: "How do I get started working with you?",
      answer: "Getting started is easy! Simply contact us through our website form or give us a call. We'll schedule an initial consultation to discuss your project requirements and determine the best path forward."
    }
  ];

  // You'll also need to define the openFaq state and toggleFaq function
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  // Courses data
  const courses = [
    {
      id: 1,
      title: 'Phonics English',
      description: 'Master reading and pronunciation with our comprehensive phonics program designed for all age groups.',
      icon: 'book-open',
      color: 'blue',
      duration: '3 months',
      students: '1,200+',
      features: ['Personalized attention', 'Interactive lessons', 'Regular assessments']
    },
    {
      id: 2,
      title: 'Life Coaching',
      description: 'Develop essential life skills, build confidence, and unlock your full potential with personalized coaching.',
      icon: 'star',
      color: 'purple',
      duration: '6 months',
      students: '850+',
      features: ['One-on-one sessions', 'Practical exercises', 'Progress tracking']
    },
    {
      id: 3,
      title: 'Spoken English',
      description: 'Enhance your communication skills with our conversation-focused English speaking course.',
      icon: 'message-circle',
      color: 'green',
      duration: '4 months',
      students: '950+',
      features: ['Confidence building', 'Real-world scenarios', 'Presentation skills']
    }
  ];

  // Features that change on interval
  const features = [
    "Expert Phonics Teaching",
    "Personalized Learning Plans",
    "15+ Years School Experience",
    "Interactive Learning Methods",
    "Proven Results"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Simulated chatbot logic
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { sender: 'user', message: userMessage }]);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I'll help you with that. Please visit our courses page or contact Shereen ma'am directly for more details.";

      if (userMessage.toLowerCase().includes('course')) {
        botResponse = "Shereen ma'am offers Phonics English, Life Coaching, and Spoken English courses. Which one interests you?";
      } else if (userMessage.toLowerCase().includes('fee') || userMessage.toLowerCase().includes('cost')) {
        botResponse = "Our courses start at ₹99 with our special promotion. Would you like to know more about our fee structure?";
      } else if (userMessage.toLowerCase().includes('enroll')) {
        botResponse = "Great! You can enroll by clicking the 'Enroll Now' button or contacting Shereen ma'am directly. Would you like me to help you with the enrollment process?";
      } else if (userMessage.toLowerCase().includes('shereen') || userMessage.toLowerCase().includes('teacher')) {
        botResponse = "Shereen Begum is our expert instructor with over 15 years of experience in the education industry. She specializes in phonics teaching and has helped thousands of students improve their reading and communication skills.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', message: botResponse }]);
    }, 600);

    setUserMessage('');
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      setTimeout(() => {
        setAnimationComplete(true);
      }, 500);

    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Render loading screen
  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute w-full h-full border-4 border-white/30 rounded-full"></div>
              <div className="absolute w-full h-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Asta Education Academy</h2>
            <p className="text-blue-100">Transforming lives through education...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
        {/* Floating chat button */}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 group"
        >
          {!showChatbot ? (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300">1</span>
        </button>

        {/* Chat interface */}
        <AnimatePresence>
          {showChatbot && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
              style={{ height: '70vh', maxHeight: '600px' }}
            >
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Asta Academy Assistant</h3>
                    <div className="flex items-center text-xs">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                      Online
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowChatbot(false)}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3/4 p-3 rounded-lg ${msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                      }`}>
                      {msg.message}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-full px-4 transition-colors duration-300"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Asta Education Academy
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to top button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hero Section with Animated Elements */}
        <div ref={heroSectionRef} className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"
              animate={{
                x: mousePosition.x * -1,
                y: mousePosition.y * -1,
              }}
              transition={{ type: "spring", damping: 10 }}
            ></motion.div>
            <motion.div
              className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-white"
              animate={{
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              transition={{ type: "spring", damping: 10 }}
            ></motion.div>
            <motion.div
              className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white"
              animate={{
                x: mousePosition.x * 0.5,
                y: mousePosition.y * 0.5,
              }}
              transition={{ type: "spring", damping: 15 }}
            ></motion.div>
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10" ref={heroRef}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Transform Your <span className="text-yellow-300">Learning Journey</span>
                </motion.h1>

                <motion.p
                  className="text-xl text-blue-100 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Expert coaching in Phonics English and Life Skills by Shereen Begum with over 15 years of experience in the education industry.
                </motion.p>

                <motion.div
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <span className="text-white/60 absolute top-0 left-0 text-2xl line-through">₹199</span>
                      <span className="text-4xl font-bold ml-16">Only ₹99</span>
                    </div>
                    <div className="ml-6 bg-yellow-400 text-blue-900 font-bold py-1 px-3 rounded-lg transform -rotate-3 animate-pulse">
                      50% OFF
                    </div>
                  </div>
                  <p className="text-sm mt-2">Limited time offer! Enroll now and save ₹100</p>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/details" className="block bg-white text-blue-600 py-4 px-8 rounded-full font-medium text-center shadow-lg hover:bg-blue-50 transition-all duration-300">
                      Enroll Now
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a href="https://wa.me/+918897125110" target='_blank' className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-full font-medium shadow-lg transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp Us
                    </a>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="md:w-1/2 mt-8 md:mt-0"
                initial={{ opacity: 0, y: 50 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -left-4 -top-4 w-full h-full border-2 border-white/30 rounded-lg"
                    animate={{ rotate: [3, -1, 3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  ></motion.div>
                  <div className="rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src="https://media.istockphoto.com/id/1307457391/photo/happy-black-student-raising-arm-to-answer-question-while-attending-class-with-her-university.jpg?s=612x612&w=0&k=20&c=iZaZFyC-WqlqSQc4elqUNPTxLvWPe8P5Tb_YdZnrI9Q="
                      alt="Phonics English and Life Coaching"
                      className="w-full h-auto"
                    />

                    {/* Video play button */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-50 transition-colors duration-300 relative overflow-hidden group">
                        <motion.div
                          className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        ></motion.div>
                        <svg className="w-6 h-6 text-blue-600 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute -right-4 -bottom-4 bg-yellow-400 text-blue-900 p-3 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                      </svg>
                      <span className="font-bold">Certified Courses</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Animated feature text */}
            <div className="mt-10 text-center overflow-hidden h-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-2 text-xl font-medium"
                >
                  <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {features[activeFeature]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-700">Trusted by Parents & Students</h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto mt-2"></div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
              <img src="https://t3.ftcdn.net/jpg/02/55/22/68/360_F_255226859_Rhqr5hflr2esVXHQE1sS1bWxmZxs0gWI.jpg" alt="Partner School" className="h-12" />
              <img src="https://img.freepik.com/free-photo/group-three-young-good-looking-startupers-sitting-light-coworking-space-talking-about-future-project-looking-through-design-examples-digital-tablet-friends-smiling-talking-about-work_176420-8284.jpg" alt="Partner School" className="h-12" />
              <img src="https://eccles.utah.edu/wp-content/uploads/2015/04/Study-Group-web.jpeg" alt="Partner School" className="h-12" />
              <img src="https://www.euroschoolindia.com/wp-content/uploads/2023/07/student-study-group.jpg" alt="Partner School" className="h-12" />
              <img src="https://static.vecteezy.com/system/resources/thumbnails/002/164/492/small/cute-kids-boy-and-girl-study-together-free-vector.jpg" alt="Partner School" className="h-12" />
            </div>
          </div>
        </div>

        {/* Featured Courses Section */}
        <section className="py-16 bg-white" ref={featuresRef}>
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Featured Courses</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover our expertly crafted courses designed to help you excel in language skills and personal development.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`h-2 bg-${course.color}-500`}></div>
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-full bg-${course.color}-100 text-${course.color}-600 flex items-center justify-center mb-4`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                        </svg>
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                        </svg>
                        {course.students}
                      </div>
                    </div>

                    <div className="mb-6">
                      {course.features.map((feature, i) => (
                        <div key={i} className="flex items-center mb-2">
                          <svg className={`w-5 h-5 mr-2 text-${course.color}-500`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link to={`/course/${course.id}`} className={`block text-center py-3 rounded-lg bg-${course.color}-500 hover:bg-${course.color}-600 text-white font-medium transition-colors duration-300`}>
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructor Section */}
        <section className="py-16 bg-blue-50" ref={coachRef}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                className="md:w-2/5"
                initial={{ opacity: 0, x: -50 }}
                animate={coachInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <div className="relative z-10 overflow-hidden rounded-xl shadow-xl">
                    <img
                      src="https://randomuser.me/api/portraits/women/67.jpg"
                      alt="Shereen Begum"
                      className="w-full h-auto"
                    />
                  </div>

                  <motion.div
                    className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={coachInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600 font-medium">1000+ Reviews</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -z-10 top-5 left-5 w-full h-full bg-blue-200 rounded-xl"
                    animate={{
                      rotate: [0, 2, 0, -2, 0],
                      x: [0, 5, 0, -5, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  ></motion.div>
                </div>
              </motion.div>

              <motion.div
                className="md:w-3/5"
                initial={{ opacity: 0, x: 50 }}
                animate={coachInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-full mb-4">
                  Meet Your Instructor
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Shereen Begum</h2>
                <h3 className="text-xl text-gray-600 mb-6">Phonics Expert & Life Coach</h3>

                <p className="text-gray-700 mb-6">
                  With over 15 years of experience in education, Shereen Begum has helped thousands of students master the English language through her specialized phonics methodology. Her approach combines traditional teaching methods with innovative techniques to ensure rapid progress.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-blue-600 font-bold text-xl mb-1">15+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-blue-600 font-bold text-xl mb-1">5,000+</div>
                    <div className="text-gray-600">Students Taught</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-blue-600 font-bold text-xl mb-1">100%</div>
                    <div className="text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://wa.me/+918897125110" target='_blank' className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contact on WhatsApp
                  </a>

                  <Link to="/about" className="flex items-center justify-center gap-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-6 rounded-lg transition-colors duration-300">
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white" ref={statsRef}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsInView && (
                <>
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      <CountUp end={5000} duration={2.5} separator="," />+
                    </div>
                    <p className="text-blue-100">Students Taught</p>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      <CountUp end={15} duration={2.5} />+
                    </div>
                    <p className="text-blue-100">Years Experience</p>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      <CountUp end={96} duration={2.5} />%
                    </div>
                    <p className="text-blue-100">Success Rate</p>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      <CountUp end={3} duration={2.5} />
                    </div>
                    <p className="text-blue-100">Specialized Courses</p>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">What Our Students Say</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover how our courses have transformed the lives of students across the country.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="relative bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonialIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        {testimonials[currentTestimonialIndex].avatar ? (
                          <img
                            src={testimonials[currentTestimonialIndex].avatar}
                            alt={testimonials[currentTestimonialIndex].name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                            {testimonials[currentTestimonialIndex].initials}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{testimonials[currentTestimonialIndex].name}</h4>
                        <p className="text-gray-600">{testimonials[currentTestimonialIndex].role}</p>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(testimonials[currentTestimonialIndex].rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg italic">"{testimonials[currentTestimonialIndex].content}"</p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center mt-8 gap-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonialIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentTestimonialIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      aria-label={`View testimonial ${index + 1}`}
                    ></button>
                  ))}
                </div>

                <div className="absolute -top-4 -left-4 text-blue-600 opacity-30">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="absolute -bottom-4 -right-4 text-blue-600 opacity-30 transform rotate-180">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white" ref={ctaRef}>
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Journey?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Enroll today for just ₹99 and take the first step towards mastering Phonics English and essential life skills.
              </p>

              <motion.div
                className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8 inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <span className="text-white/60 absolute top-0 left-0 text-2xl line-through">₹199</span>
                    <span className="text-4xl font-bold ml-16">Only ₹99</span>
                  </div>
                  <div className="ml-6 bg-yellow-400 text-blue-900 font-bold py-1 px-3 rounded-lg transform -rotate-3 animate-pulse">
                    50% OFF
                  </div>
                </div>
                <p className="text-sm mt-2">Limited time offer! Offer ends soon.</p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/enroll" className="block bg-white text-blue-600 py-4 px-8 rounded-full font-medium text-center shadow-lg hover:bg-blue-50 transition-all duration-300">
                    Enroll Now
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="https://wa.me/+919123456789" className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white py-4 px-8 rounded-full font-medium shadow-lg hover:bg-white/10 transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Ask Questions
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about our courses and methodology.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full px-6 py-4 text-left bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none"
                  >
                    <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-blue-600 transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-white rounded-b-lg shadow-md border-t border-gray-100">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Newsletter Section */}
        <section className="py-12 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Get Updates & Free Resources</h2>
                <p className="text-blue-100">
                  Subscribe to our newsletter for study tips, upcoming events, and free learning materials.
                </p>
              </div>
              <div className="md:w-1/2">
                <form onSubmit={handleNewsletterSubmit} className="flex flex-wrap gap-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 min-w-[200px] py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-sm text-blue-100 mt-2">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;