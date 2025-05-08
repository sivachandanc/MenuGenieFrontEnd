import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar.jsx";
import HeroSection from "./components/hero-section/HeroSection.jsx";
import SignUpForm from "./components/sign-up/SignUpForm.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import ChatWindow from "./components/user-chat/ChatWindow.jsx";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

function App() {
  //Getting Superbase URL and Keys from env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  const [chatMode, setChatMode] = useState(false)

  // Creating a superbase client
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        {!chatMode && <NavBar />}
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
          <Route 
            path="/chat-with-menu/:businessID" 
            element={<ChatWindow setChatMode={setChatMode}/>} // 👈 added this
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
