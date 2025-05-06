import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function RegistrationDonePopUp() {
    const goToLogin = useNavigate();
    const handleOK = () => {
        goToLogin("/login");
    }

    return (
      <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
          <h2 className="text-2xl font-bold mb-4">Success 🎉</h2>
          <div className="flex flex-row justify-center space-x-1 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-blue-600 animate-pulse"
            >
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
            <p className="text-gray-600">
              An Email was sent for Account verification
            </p>
          </div>
  
          <button onClick={handleOK} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            OK
          </button>
        </div>
      </div>
    );
  }
  
  export default RegistrationDonePopUp;
  