import { useState } from "react";
import { Link } from "react-router-dom";
import RegistrationDonePopUp from "./RegistrationDonePopUp";
import ErrorMessage from "../util-components/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import bg from "../../assets/bg-illustration.png"

function SignUpForm() {
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const [submitDisabled, setDisableSubmitButton] = useState(true);
  const [registrationProcessing, setRegistrationProcessing] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const handleTermsAcceptedCheckBoxChange = (event) => {
    setDisableSubmitButton(!event.target.checked);
  };

  const handleSignUp = async () => {
    try {
      const data = await signUp(email, password);
      console.log("SIGNUP DATA:", data);
      setDisableSubmitButton(true);
      setError("");
      setRegistrationProcessing(false);
      setShowPopUp(true);
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(`Signup failed: ${err.message}`);
      setRegistrationProcessing(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setRegistrationProcessing(true);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) return stop("Name is required");
    if (!email) return stop("Email is required");
    if (!emailPattern.test(email)) return stop("Please enter a valid email address");
    if (!password) return stop("Password is required");
    if (password.length < 6) return stop("Length of password should be greater than 6");
    if (password !== confirmedPassword) return stop("Passwords do not match!");

    setError("");
    handleSignUp();
  };

  const stop = (msg) => {
    setError(msg);
    setRegistrationProcessing(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f7f3ed] flex items-start justify-center px-4 py-12 overflow-hidden">
      {/* Background illustration (optional if reused) */}
      <img
        src={bg}
        alt="Decorative background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0 animate-bgFloat"
      />

      {!showPopUp && (
        <div className="relative z-10 bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-black mb-2">
            Register
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Enter your details to create a new account
          </p>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
              placeholder="Enter your name"
            />
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
              placeholder="Enter your email"
            />
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
              placeholder="Enter your password"
            />
            <input
              type="password"
              name="confirmed-password"
              onChange={(e) => setConfirmedPassword(e.target.value)}
              value={confirmedPassword}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
              placeholder="Confirm your password"
            />

            {error && <ErrorMessage errorMessage={error} />}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4"
                onChange={handleTermsAcceptedCheckBoxChange}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I accept all terms & conditions
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white font-semibold ${
                submitDisabled
                  ? "bg-[var(--button-disabled)]"
                  : "bg-[#fcb565] hover:bg-[#fda94e] transition-colors duration-300"
              }`}
              disabled={submitDisabled || registrationProcessing}
            >
              <div className="flex justify-center items-center space-x-2">
                {registrationProcessing && (
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
                <span>{registrationProcessing ? "Processing..." : "Register"}</span>
              </div>
            </button>

            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account? {" "}
              <Link
                to="/login"
                className="text-[var(--button)] hover:underline transition-colors duration-300"
              >
                Login now
              </Link>
            </div>
          </form>
        </div>
      )}

      {showPopUp && <RegistrationDonePopUp />}
    </div>
  );
}

export default SignUpForm;