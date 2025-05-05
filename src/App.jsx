import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar.jsx";
import HeroSection from "./components/hero-section/HeroSection.jsx";
import SignUpForm from "./components/sign-up/SignUpForm.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        <NavBar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/sign-up" element={<SignUpForm/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
