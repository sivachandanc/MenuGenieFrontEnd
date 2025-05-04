import { useState } from "react";
import { Link } from "react-router-dom";

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle your form submission here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black mb-8">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" className="h-4 w-4" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I accept all terms & conditions
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 rounded-full bg-[var(--button)] text-black font-inter hover:bg-[var(--button-hover)] transition-colors duration-300"
            >
              Register
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
    </div>
  );
}

export default SignUpForm;
