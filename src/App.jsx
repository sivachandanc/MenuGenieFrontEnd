import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/navbar/navbar.jsx";
import HeroSection from "./components/hero-section/HeroSection.jsx";
import SignUpForm from "./components/sign-up/SignUpForm.jsx";
import LoginForm from "./components/login/LoginForm.jsx";
import ChatWindow from "./components/user-chat/ChatWindow.jsx";
import UserDashBoardLayout from "./components/user/UserDashBoardLayout.jsx";
import BusinessList from "./components/user/BusinessList.jsx";
import OnBoardingWizard from "./components/business-onboarding/OnBoardingWizard.jsx";
import BusinessDetails from "./components/user/BusinessDetails.jsx";
import ListBusinessMenu from "./components/user/ListBusinessMenu.jsx";
import NotFoundPage from "./components/user-chat/NotFoundPage.jsx";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import UploadMenuCopy from "./components/user/AddMenuCopy/UploadMenuCopy.jsx";
import AboutPage from "./components/about-page/AboutPage.jsx";
import FeaturesSection from "./components/features-page/FeaturesSection.jsx";
import ContactSection from "./components/contact-me/ContactSection.jsx";
import ResetPasswordForm from "./components/login/ResetPasswordForm.jsx";

import { useState } from "react";

function App() {
  const { user } = useAuth();
  const [chatMode, setChatMode] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        <Toaster position="top-center" />
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
            path="/reset-password"
            element={
              <PublicRoute forceAllow={true}>
                <ResetPasswordForm />
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
          <Route
            path="/about"
            element={
              <PublicRoute>
                <AboutPage />
              </PublicRoute>
            }
          />
          <Route
            path="/features"
            element={
              <PublicRoute>
                <FeaturesSection />
              </PublicRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <PublicRoute>
                <ContactSection />
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
            <Route path="business/:businessID" element={<BusinessDetails />} />
            <Route
              path="business/:businessID/menu"
              element={<ListBusinessMenu />}
            />
            <Route
              path="business/:businessID/menu-upload"
              element={<UploadMenuCopy />}
            />
          </Route>

          {/* Chat route */}
          <Route
            path="/chat-with-menu/:businessID"
            element={<ChatWindow setChatMode={setChatMode} />}
          />

          {/* 404 handling */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
