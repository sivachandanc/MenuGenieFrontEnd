import { useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import RegistrationDonePopUp from "./RegistrationDonePopUp";
import ErrorMessage from "../util-components/ErrorMessage";

function SignUpForm() {
  // Various states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const [submitDisabled, setDisableSubmitButton] = useState(true);
  const [registrationProcessing, setRegistrationProcessing] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  //Getting Superbase URL and Keys from env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  // Creating a superbase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Creating a sinup memchanism
  const signUp = async () => {
    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.error("Signup error:", error.message);
      setError(`Signup failed: ${error.message}`);
      setRegistrationProcessing(false);
      return;
    }

    console.log("Signup successful:", data);
    setDisableSubmitButton(true);
    setError("");
    setRegistrationProcessing(false);
    setShowPopUp(true);
  };

  const handleTermsAcceptedCheckBoxChange = (event) => {
    if (event.target.checked) {
      setDisableSubmitButton(false);
    } else {
      setDisableSubmitButton(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setRegistrationProcessing(true);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name) {
      setRegistrationProcessing(false);
      setError("Name is required");
      return;
    }
    if (!email) {
      setRegistrationProcessing(false);
      setError("Email is required");
      return;
    }
    if (!emailPattern.test(email)) {
      setRegistrationProcessing(false);
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setRegistrationProcessing(false);
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setRegistrationProcessing(false);
      setError("Length of password should be greater than 6");
      return;
    }
    if (password !== confirmedPassword) {
      setRegistrationProcessing(false);
      setError("Passwords do not match!");
      return;
    }
    setError("");
    signUp();
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
                className="w-full px-4 py-2 rounded-md bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-2 rounded-md bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-2 rounded-md bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmed-password"
                onChange={(e) => setConfirmedPassword(e.target.value)}
                value={confirmedPassword}
                className="w-full px-4 py-2 rounded-md bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
                placeholder="Confirm your password"
              />
            </div>

            {/* ERROR MESSAGE BLOCK */}
            {error && (
              <ErrorMessage errorMessage={error}/>
            )}

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
