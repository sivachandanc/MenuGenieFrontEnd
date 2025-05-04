import { useState } from "react";
import { Link } from "react-router-dom";

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const handleNameInput = (event) => {
    setName(event.target.value);
  };
  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordInput = (event) => {
    setpassword(event.target.value);
  };
  const handleConfirmedPasswordInput = (event) => {
    setConfirmedPassword(event.target.value);
  };

  return (
    <div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            onChange={handleNameInput}
            value={name}
            className="bg-amber-50"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <input
            type="text"
            name="email"
            onChange={handleEmailInput}
            value={email}
            className="bg-amber-50"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            onChange={handlePasswordInput}
            value={password}
            className="bg-amber-50"
            placeholder="Enter your password"
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmed-password"
            onChange={handleConfirmedPasswordInput}
            value={confirmedPassword}
            className="bg-amber-50"
            placeholder="Confirm your password"
          />
        </div>
        <div>
          <input type="checkbox"/>
          <h3>I accept all terms & conditions</h3>
        </div>
        <div>
          <button
            type="submit"
            className="text-black font-inter bg-[var(--button)] hover:bg-[var(--button-hover)] transition-colors duration-300 rounded-full"
          >
            Register
          </button>
        </div>
        <div>
      <h3>Already have an an account? <Link to="/login" className="hover:bg-[var(--button-hover)] transition-colors duration-300">Login now</Link></h3>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
