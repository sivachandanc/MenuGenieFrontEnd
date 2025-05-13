import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/navbar/navbar.jsx";
import HeroSection from "./components/hero-section/HeroSection.jsx";
import SignUpForm from "./components/sign-up/SignUpForm.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import ChatWindow from "./components/user-chat/ChatWindow.jsx";
import UserDashBoardLayout from "./components/user/UserDashBoardLayout.jsx";
import BusinessList from "./components/user/BusinessList.jsx";
import OnBoardingWizard from "./components/business-onboarding/OnBoardingWizard.jsx";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

import { useState } from "react";

function App() {
  const { user } = useAuth();
  const [chatMode, setChatMode] = useState(false);
  // TODO: Remove later
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  console.log("The superbase URL:",supabaseUrl)
  //
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        {!chatMode && !user && <NavBar />}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <HeroSection />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpForm />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />

          {/* Authenticated Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashBoardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<BusinessList />} />
            <Route path="onboarding" element={<OnBoardingWizard />} />
          </Route>

          {/* Chat route can be public or private depending on use case */}
          <Route
            path="/chat-with-menu/:businessID"
            element={<ChatWindow setChatMode={setChatMode} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
