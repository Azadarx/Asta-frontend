// src/LMSComponents/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../../HomeComponents/HomeNavbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Already logged in, redirect to home
        navigate('/lms/home');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully:", userCredential.user.email);

      // Check if admin and set a session flag (optional for debugging)
      const isAdmin = userCredential.user.email.toLowerCase() === 'inspiringshereen@gmail.com'.toLowerCase();
      sessionStorage.setItem('isAdmin', isAdmin);

      navigate('/lms/home');
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      let errorMsg = 'Invalid email or password. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. Please try again later.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 overflow-hidden">
        {/* Left Panel - Only visible on md screens and up */}
        <div className="hidden md:flex md:w-1/2 p-8 items-center justify-center">
          <div className="text-center">
            <div className="mb-6 p-3 inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">ASTA Education</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-md mx-auto">Your gateway to comprehensive online learning experiences</p>
            
            <div className="grid grid-cols-2 gap-4 mb-12 max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl">
                <div className="text-4xl text-white font-bold mb-1">100+</div>
                <div className="text-blue-100">Expert Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl">
                <div className="text-4xl text-white font-bold mb-1">24/7</div>
                <div className="text-blue-100">Learning Access</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl">
                <div className="text-4xl text-white font-bold mb-1">10k+</div>
                <div className="text-blue-100">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl">
                <div className="text-4xl text-white font-bold mb-1">90%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            {/* Glass Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg bg-opacity-90 dark:bg-opacity-80 border border-white/20 dark:border-gray-700">
              {/* Top Banner & Logo - Only visible on small screens */}
              <div className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                <div className="inline-flex items-center justify-center bg-white/20 p-3 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white">ASTA Education</h1>
                <p className="text-blue-100 text-sm mt-1">Learning Management System</p>
              </div>

              <div className="p-8 md:p-10">
                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to continue your learning journey</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg animate-fade-in" role="alert">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 block w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 block w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white transition-all"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Create Account Link */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account yet?{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      Create an account
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom info - mobile only */}
            <div className="md:hidden mt-8 text-center text-white/70 text-sm">
              <p>ASTA Education - Transforming learning experiences</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;