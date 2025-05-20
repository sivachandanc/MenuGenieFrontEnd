import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../util-components/ErrorMessage";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <div className="min-h-screen bg-[#f7f3ed] flex items-start justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Agent Login
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Hey, Enter your details to get sign in to your account
        </p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              name="email"
              onChange={(e) => setUserEmail(e.target.value)}
              value={userEmail}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
              placeholder="Enter Email / Phone No"
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

          <div className="text-right text-sm text-[var(--textSecondary)] mb-2">
            Having trouble in sign in?
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

          <div className="text-center text-gray-400 text-sm mt-4">
            Or Sign in with
          </div>

          <div className="flex justify-center gap-4 mt-2">
            <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium hover:shadow">
              Google
            </button>
            <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium hover:shadow">
              Apple ID
            </button>
            <button className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium hover:shadow">
              Facebook
            </button>
          </div>

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
