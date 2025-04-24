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
import UserProfile from "./LMSComponents/UserProfile";
import MyProfile from "./LMSComponents/MyProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import EditContent from "./LMSComponents/Admin/EditContent";

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
      <Routes>
        {/* 🌐 Main Website Routes with layout */}
        <Route
          path="/"
          element={
            <LayoutWrapper>
              <HomePage />
            </LayoutWrapper>
          }
        />
        <Route
          path="/details"
          element={
            <LayoutWrapper>
              <Details />
            </LayoutWrapper>
          }
        />
        <Route
          path="/payment"
          element={
            <LayoutWrapper>
              <Payment />
            </LayoutWrapper>
          }
        />
        <Route
          path="/success"
          element={
            <LayoutWrapper>
              <PaymentSuccess />
            </LayoutWrapper>
          }
        />
        <Route
          path="/courses"
          element={
            <LayoutWrapper>
              <Courses />
            </LayoutWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <LayoutWrapper>
              <About />
            </LayoutWrapper>
          }
        />
        <Route
          path="/rabout"
          element={
            <LayoutWrapper>
              <Rabout />
            </LayoutWrapper>
          }
        />
        <Route
          path="/termsandconditions"
          element={
            <LayoutWrapper>
              <TermsAndConditions />
            </LayoutWrapper>
          }
        />
        <Route
          path="/policy"
          element={
            <LayoutWrapper>
              <PrivacyPolicy />
            </LayoutWrapper>
          }
        />
        <Route
          path="/testimonials"
          element={
            <LayoutWrapper>
              <Testimonials />
            </LayoutWrapper>
          }
        />
        <Route
          path="/contact-us"
          element={
            <LayoutWrapper>
              <Contact />
            </LayoutWrapper>
          }
        />
        <Route
          path="/courses/phonics"
          element={
            <LayoutWrapper>
              <PhonicsCourse />
            </LayoutWrapper>
          }
        />

        {/* 🎓 LMS Routes WITHOUT layout wrapper */}
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
          path="/lms/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lms/admin/edit/"
          element={
            <ProtectedRoute>
              <EditContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lms/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
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
        <Route
          path="*"
          element={
            <LayoutWrapper>
              <NotFound />
            </LayoutWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;