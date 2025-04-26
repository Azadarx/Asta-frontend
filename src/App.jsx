import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// Home Site Components
import HomePage from "./HomeComponents/HomePage";
import HomeNavbar from "./HomeComponents/HomeNavbar";
import HomeFooter from "./HomeComponents/HomeFooter";
import Details from "./DetailsComponets/Details";
import Payment from "./PaymentGateway/Payment";
import PaymentSuccess from "./PaymentGateway/PaymentSuccess";
import Courses from "./CoursesComponents/Courses";
import About from "./AboutComponents/About";
import Testimonials from "./AboutComponents/Testimonials";
import Contact from "./ContactComponents/Contact";
import PhonicsCourse from "./CoursesComponents/PhonicsCourse";
import TermsAndConditions from "./AboutComponents/Conditions";
import PrivacyPolicy from "./AboutComponents/Policy";
import Rabout from "./AboutComponents/Rabout";

// LMS Components
import Login from "./LMSComponents/Auth/Login";
import AdminSignup from "./LMSComponents/Auth/AdminSignup";
import LMSHome from "./LMSComponents/LMSHome";
import Materials from "./LMSComponents/Materials";
import AdminDashboard from "./LMSComponents/Admin/AdminDashboard";
import UserProfile from "./LMSComponents/UserProfile";
import MyProfile from "./LMSComponents/MyProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import EditContentPage from "./LMSComponents/Admin/EditContentPage";
import StudentDetailsPage from "./LMSComponents/Admin/StudentDetailsPage";
import LMSNavbar from "./LMSComponents/LMSNavbar";

// Home layout
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isLMS = location.pathname.startsWith("/lms");
  return (
    <>
      {!isLMS && <HomeNavbar />}
      {children}
      {!isLMS && <HomeFooter />}
    </>
  );
};

// LMS layout with user context
const LMSLayoutWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if user is admin
        const adminStatus = currentUser.email.toLowerCase() === 'inspiringshereen@gmail.com'.toLowerCase();
        setIsAdmin(adminStatus);

        // Get user data from database if needed
        // This is simplified - you'll need to adjust according to your data structure
        setLoading(false);
      } else {
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <LMSNavbar user={user} userData={userData} isAdmin={isAdmin} />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Website Pages */}
        <Route path="/" element={<LayoutWrapper><HomePage /></LayoutWrapper>} />
        <Route path="/details" element={<LayoutWrapper><Details /></LayoutWrapper>} />
        <Route path="/payment" element={<LayoutWrapper><Payment /></LayoutWrapper>} />
        <Route path="/success" element={<LayoutWrapper><PaymentSuccess /></LayoutWrapper>} />
        <Route path="/courses" element={<LayoutWrapper><Courses /></LayoutWrapper>} />
        <Route path="/about" element={<LayoutWrapper><About /></LayoutWrapper>} />
        <Route path="/rabout" element={<LayoutWrapper><Rabout /></LayoutWrapper>} />
        <Route path="/termsandconditions" element={<LayoutWrapper><TermsAndConditions /></LayoutWrapper>} />
        <Route path="/policy" element={<LayoutWrapper><PrivacyPolicy /></LayoutWrapper>} />
        <Route path="/testimonials" element={<LayoutWrapper><Testimonials /></LayoutWrapper>} />
        <Route path="/contact-us" element={<LayoutWrapper><Contact /></LayoutWrapper>} />
        <Route path="/courses/phonics" element={<LayoutWrapper><PhonicsCourse /></LayoutWrapper>} />

        {/* 🎓 LMS Pages (with LMS Navbar) */}
        <Route path="/lms/login" element={<Login />} />
        <Route path="/lms/home" element={<ProtectedRoute><LMSLayoutWrapper><LMSHome /></LMSLayoutWrapper></ProtectedRoute>} />
        <Route path="/lms/materials" element={<ProtectedRoute><LMSLayoutWrapper><Materials /></LMSLayoutWrapper></ProtectedRoute>} />
        <Route path="/lms/profile" element={<ProtectedRoute><LMSLayoutWrapper><UserProfile /></LMSLayoutWrapper></ProtectedRoute>} />
        <Route path="/lms/my-profile" element={<ProtectedRoute><LMSLayoutWrapper><MyProfile /></LMSLayoutWrapper></ProtectedRoute>} />
        <Route path="/lms/admin" element={<ProtectedRoute adminOnly={true}><LMSLayoutWrapper><AdminDashboard /></LMSLayoutWrapper></ProtectedRoute>} />
        <Route path="/lms/create-user" element={<ProtectedRoute adminOnly={true}><LMSLayoutWrapper><AdminSignup /></LMSLayoutWrapper></ProtectedRoute>} />
        <Route path="/lms/admin/edit/:id" element={<ProtectedRoute adminOnly={true}><LMSLayoutWrapper><EditContentPage /></LMSLayoutWrapper></ProtectedRoute>} />
        <Route path="/lms/admin/student/:id" element={<ProtectedRoute adminOnly={true}><LMSLayoutWrapper><StudentDetailsPage /></LMSLayoutWrapper></ProtectedRoute>} />

        {/* 🚀 Redirects */}
        <Route path="/lms" element={<Navigate to="/lms/login" />} />

        {/* 🚫 404 Not Found */}
        <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
      </Routes>
    </Router>
  );
}

export default App;