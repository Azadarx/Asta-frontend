// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";

// Helper to hide Nav/Footer on LMS routes
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

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* 🌐 Main Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/details" element={<Details />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/rabout" element={<Rabout />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/policy" element={<PrivacyPolicy />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/courses/phonics" element={<PhonicsCourse />} />

          {/* 🎓 LMS Routes */}
          <Route path="/lms/login" element={<Login />} />
          <Route
            path="/lms/home"
            element={
              <ProtectedRoute>
                <LMSHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/materials"
            element={
              <ProtectedRoute>
                <Materials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/create-user"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminSignup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Redirects */}
          <Route path="/lms" element={<Navigate to="/lms/login" />} />
          
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;