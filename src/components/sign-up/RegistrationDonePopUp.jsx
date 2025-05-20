import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function RegistrationDonePopUp() {
  const goToLogin = useNavigate();
  const handleOK = () => {
    goToLogin("/login");
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative z-10 bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-black mb-3">Success 🎉</h2>
        <div className="flex items-center justify-center gap-2 mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-[#fcb565] animate-pulse"
          >
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
          <p className="text-sm text-gray-600">
            An email was sent for account verification
          </p>
        </div>

        <button
          onClick={handleOK}
          className="w-full py-3 rounded-xl text-white font-semibold bg-[#fcb565] hover:bg-[#fda94e] transition-colors duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default RegistrationDonePopUp;