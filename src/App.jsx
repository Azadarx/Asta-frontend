import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <HomeNavbar /> {/* Navbar stays common across all routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details" element={<Details />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="//courses/phonics" element={<PhonicsCourse />} />
      </Routes>
      <HomeFooter /> {/* Footer stays common across all routes */}
    </Router>
  );
}

export default App;
