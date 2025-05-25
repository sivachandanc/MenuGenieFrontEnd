import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ErrorMessage from "../util-components/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import bg from "../../assets/bg-illustration.png";

function LoginForm() {
  const { signIn } = useAuth();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginProcessing, setLoginProcessing] = useState(false);

  const login = async () => {
    try {
      await signIn(userEmail, userPassword);
      setLoginProcessing(false);
      setErrorMessage("");
    } catch (err) {
      console.error("Login error:", err.message);
      setLoginProcessing(false);
      setErrorMessage(`Login failed: ${err.message}`);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setLoginProcessing(true);
    login();
  };

  const handlePasswordReset = async () => {
    if (!userEmail) {
      setErrorMessage("Please enter your email above to receive a reset link.");
      return;
    }

    const toastId = toast.loading("Sending password reset email...");

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      userEmail, {
        redirectTo: import.meta.env.VITE_PASSWORD_RESET_URL,
      }
    );

    if (error) {
      console.error("Password reset error:", error.message);
      toast.error("Failed to send reset link", { id: toastId });
    } else {
      toast.success("Password reset link sent!", { id: toastId });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f7f3ed] flex items-start justify-center px-4 py-12 overflow-hidden">
      <img
        src={bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      />

      <div className="relative z-10 bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Agent Login
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Hey, Enter your details to sign in to your account
        </p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              name="email"
              onChange={(e) => setUserEmail(e.target.value)}
              value={userEmail}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
              placeholder="Enter Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={(e) => setUserPassword(e.target.value)}
              value={userPassword}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
              placeholder="Passcode"
              required
            />
          </div>

          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          <div className="flex justify-between items-center text-sm text-[var(--textSecondary)] mb-2">
            <span>Having trouble signing in?</span>
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={handlePasswordReset}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-[#fcb565] hover:bg-[#fda94e] transition-colors duration-300"
            disabled={loginProcessing}
          >
            <div className="flex justify-center items-center space-x-2">
              {loginProcessing && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              <span>{loginProcessing ? "Processing..." : "Sign in"}</span>
            </div>
          </button>

          <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[var(--button)] hover:underline transition-colors duration-300"
            >
              Request Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
