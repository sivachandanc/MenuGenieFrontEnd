import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../util-components/ErrorMessage";
import { useAuth } from "../../context/AuthContext"; // 👈 context

function LoginForm() {
  const { signIn } = useAuth(); // 👈 get signIn from context

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black mb-8">
          Login
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              name="email"
              onChange={(e) => setUserEmail(e.target.value)}
              value={userEmail}
              className="w-full px-4 py-2 rounded-md bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={(e) => setUserPassword(e.target.value)}
              value={userPassword}
              className="w-full px-4 py-2 rounded-md bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[var(--button)]"
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          <button
            type="submit"
            className="w-full py-2 rounded-full text-black font-inter bg-[var(--button)] hover:bg-[var(--button-hover)] transition-colors duration-300"
            disabled={loginProcessing}
          >
            <div className="flex justify-center items-center space-x-2">
              {loginProcessing && (
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
              <span>{loginProcessing ? "Processing..." : "Login"}</span>
            </div>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[var(--button)] hover:underline transition-colors duration-300"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
