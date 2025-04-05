import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HomeFooter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus({ type: 'error', message: 'Please enter a valid email address' });
            return;
        }

        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            setStatus({ type: 'success', message: 'Thank you for subscribing!' });
            setEmail('');
            setLoading(false);
        }, 1500);
    };

    return (
        <footer className="bg-blue-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Asta Education Academy</h3>
                        <p className="text-blue-300 mb-4">Transforming lives through quality education and personalized coaching.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white hover:text-blue-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-blue-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-blue-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-blue-300">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-blue-300 hover:text-white">Home</Link>
                            </li>
                            <li>
                                <Link to="/courses" className="text-blue-300 hover:text-white">Courses</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-blue-300 hover:text-white">About Us</Link>
                            </li>
                            <li>
                                <Link to="/testimonials" className="text-blue-300 hover:text-white">Testimonials</Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="text-blue-300 hover:text-white">Contact Us</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Contact Info</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-3 mt-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-blue-300">Opposite Sanjary Function Palace,
                                    Ftihar Chowk, 9F6J+QXW,
                                    Yakutpura Station Road, Kotla Alijah Road,
                                    Yakhutpura, Hyderabad – 500023,
                                    Telangana, India</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-3 mt-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-blue-300">+918897125110</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 mr-3 mt-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-blue-300">phonicswithshereen@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-blue-900 text-white p-6 rounded-lg shadow-lg max-w-md">
                        <h4 className="font-bold mb-4 text-xl">Newsletter</h4>
                        <p className="text-blue-300 mb-4">Subscribe to get updates on our latest courses and special offers.</p>

                        {status?.type === 'success' ? (
                            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-100 px-4 py-3 rounded mb-4">
                                {status.message}
                            </div>
                        ) : (
                            <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-full bg-blue-800 border border-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-blue-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                    {status?.type === 'error' && (
                                        <p className="text-red-300 text-sm mt-1">{status.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className={`bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded font-medium transition-colors duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-blue-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-blue-300 text-sm">© {new Date().getFullYear()} Asta Education Academy. All rights reserved.</p>
                    <div className="mt-4 md:mt-0">
                        <ul className="flex space-x-6">
                            <li><a href="/" className="text-blue-300 hover:text-white text-sm">Privacy Policy</a></li>
                            <li><a href="/" className="text-blue-300 hover:text-white text-sm">Terms of Service</a></li>
                            <li><a href="/" className="text-blue-300 hover:text-white text-sm">Sitemap</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default HomeFooter