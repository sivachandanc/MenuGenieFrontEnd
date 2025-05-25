import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";
import toast from "react-hot-toast";
import bg from "../../assets/bg-illustration.png";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabaseClient.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            toast.error("Failed to restore session for reset.");
            console.error("Session restoration error:", error.message);
          } else {
            console.log("✅ Auth session restored from token.");
          }
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);

    const { error } = await supabaseClient.auth.updateUser({ password });

    if (error) {
      toast.error(`Reset failed: ${error.message}`);
    } else {
      toast.success("Password reset successfully. Please login.");

      // 👇 Force logout after password reset
      await supabaseClient.auth.signOut();

      navigate("/login");
    }

    setSubmitting(false);
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
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your new password below to reset your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--button)] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-white font-semibold bg-[#fcb565] hover:bg-[#fda94e] transition-colors duration-300"
          >
            <div className="flex justify-center items-center space-x-2">
              {submitting && (
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
              <span>{submitting ? "Updating..." : "Update Password"}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
