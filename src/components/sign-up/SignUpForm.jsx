import { useState } from "react";
import { Link } from "react-router-dom";
import RegistrationDonePopUp from "./RegistrationDonePopUp";
import ErrorMessage from "../util-components/ErrorMessage";
import { useAuth } from "../../context/AuthContext";

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
      const data = await signUp(email, password); // just `data`, no destructuring
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
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)] px-4">
      {!showPopUp && (
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full px-4 py-2 rounded-md bg--[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--button)] outline-1 outline-black"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-2 rounded-md bg--[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--button)] outline-1 outline-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-2 rounded-md bg--[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--button)] outline-1 outline-black"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmed-password"
                onChange={(e) => setConfirmedPassword(e.target.value)}
                value={confirmedPassword}
                className="w-full px-4 py-2 rounded-md bg--[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--button)] outline-1 outline-black"
                placeholder="Confirm your password"
              />
            </div>

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

            <div>
              <button
                type="submit"
                className={`w-full py-2 rounded-full text-black font-inter ${
                  submitDisabled
                    ? "bg-[var(--button-disabled)]"
                    : "bg-[var(--button)] hover:bg-[var(--button-hover)] transition-colors duration-300"
                } `}
                disabled={submitDisabled || registrationProcessing}
              >
                <div className="flex justify-center items-center space-x-2">
                  {registrationProcessing && (
                    <svg
                      className="animate-spin h-5 w-5 text-black"
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
                  <span>
                    {registrationProcessing ? "Processing..." : "Register"}
                  </span>
                </div>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[var(--button)] hover:underline transition-colors duration-300"
                >
                  Login now
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}

      {showPopUp && <RegistrationDonePopUp />}
    </div>
  );
}

export default SignUpForm;
