import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ success: true, message: 'Message sent successfully!' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({ success: false, message: result.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({ success: false, message: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);

      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need more information? Reach out to us and our team will get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="flex flex-wrap -mx-4">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Address</h4>
                    <p className="text-gray-600 mt-1">Opposite Sanjary Function Palace,
                      Ftihar Chowk, 9F6J+QXW,
                      Yakutpura Station Road, Kotla Alijah Road,
                      Yakhutpura, Hyderabad – 500023,
                      Telangana, India</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Phone</h4>
                    <p className="text-gray-600 mt-1">+91 8897125110</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600 mt-1">phonicswithshereen@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Hours</h4>
                    <p className="text-gray-600 mt-1">Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/3 px-4"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>

              {submitStatus && (
                <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;