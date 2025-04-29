import { Link } from "react-router-dom";
import NavBar from "../UI/Navbar";
import Footer from "../UI/Footer";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-yellow-500 text-6xl mb-4">←</div>

          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Payment was cancelled.
          </h2>

          <p className="text-gray-600 mb-6">
            Your card hasn&apos;t been charged. If you experienced any issues
            during checkout, please try again or contact our support team.
          </p>

          <div className="mt-6">
            <Link
              to="/plans"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded mr-2"
            >
              Back to Plans
            </Link>
            <Link
              to="/"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
