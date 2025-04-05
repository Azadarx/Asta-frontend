import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const HomeNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle mouse enter and leave for hover functionality
  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-bold text-white">Asta</span>
              <span className="text-3xl font-medium text-yellow-300">Education</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white font-medium hover:text-yellow-300 transition-colors">Home</Link>
            <Link to="/about" className="text-white font-medium hover:text-yellow-300 transition-colors">About</Link>

            {/* Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
            >
              <Link
                to="/courses"
                className="text-white font-medium hover:text-yellow-300 transition-colors flex items-center"
              >
                Courses
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/courses/phonics"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                  >
                    Phonics English
                  </Link>
                  <Link
                    to="/courses/life-coaching"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                  >
                    Life Coaching
                  </Link>
                </div>
              )}
            </div>

            <Link to="/contact-us" className="text-white font-medium hover:text-yellow-300 transition-colors">Contact</Link>

            <Link
              to="/details"
              className="ml-4 bg-yellow-300 hover:bg-yellow-400 text-blue-600 px-6 py-2 rounded-full font-medium transition-colors"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <Link
              to="/"
              className="block py-2 text-blue-900 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-blue-900 font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            {/* Mobile dropdown */}
            <div>
              <button
                className="flex items-center justify-between w-full py-2 text-blue-900 font-medium"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Courses
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div className="pl-4 py-1">
                  <Link
                    to="/courses/phonics"
                    className="block py-2 text-gray-800"
                    onClick={() => { setShowDropdown(false); setIsOpen(false); }}
                  >
                    Phonics English
                  </Link>
                  <Link
                    to="/courses/life-coaching"
                    className="block py-2 text-gray-800"
                    onClick={() => { setShowDropdown(false); setIsOpen(false); }}
                  >
                    Life Coaching
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/contact-us"
              className="block py-2 text-blue-900 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            <Link
              to="/details"
              className="block py-2 text-white font-medium bg-yellow-300 hover:bg-yellow-400 rounded-full mt-2 px-6"
              onClick={() => setIsOpen(false)}
            >
              Enroll Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;