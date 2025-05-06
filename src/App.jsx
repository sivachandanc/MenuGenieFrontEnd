import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar.jsx";
import HeroSection from "./components/hero-section/HeroSection.jsx";
import SignUpForm from "./components/sign-up/SignUpForm.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import { createClient } from "@supabase/supabase-js";

function App() {
  //Getting Superbase URL and Keys from env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  // Creating a superbase client
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        <NavBar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route
            path="/signup"
            element={<SignUpForm supabaseClient={supabaseClient} />}
          />
          <Route
            path="/login"
            element={<LoginForm supabaseClient={supabaseClient} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
