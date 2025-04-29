import { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { confirmPayment } from "../../api/payment";
import { getCurrentUser } from "../../api/auth";
import { AuthContext } from "../../App";
import NavBar from "../UI/Navbar";
import Footer from "../UI/Footer";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Confirming payment...");
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [refreshingUser, setRefreshingUser] = useState(false);
  const { setUser } = useContext(AuthContext);

  const refreshUserData = async () => {
    try {
      setRefreshingUser(true);
      const response = await getCurrentUser();

      // Update the user in global context and localStorage
      if (response) {
        setUser(response);
        localStorage.setItem("user", JSON.stringify(response));
      }

      setRefreshingUser(false);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      setRefreshingUser(false);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const userId = searchParams.get("user_id");
    const planId = searchParams.get("plan_id");

    if (sessionId && userId && planId) {
      confirmPayment(sessionId, userId, planId)
        .then(() => {
          setMessage(
            "Payment successful! Tokens have been added to your account."
          );
          setStatus("success");
          // Refresh user data after successful payment
          refreshUserData();
        })
        .catch(() => {
          setMessage(
            "Payment was verified, but we encountered an issue updating your account. Our team has been notified."
          );
          setStatus("error");
        });
    } else {
      setMessage("Invalid payment confirmation parameters.");
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex-grow container mx-auto py-16 px-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          {status === "processing" && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {status === "success" && (
            <div className="text-green-500 text-6xl mb-4">✓</div>
          )}

          {status === "error" && (
            <div className="text-red-500 text-6xl mb-4">⚠</div>
          )}

          <h2
            className={`text-2xl font-bold mb-4 ${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {message}
          </h2>

          {refreshingUser && (
            <p className="text-sm text-gray-500 mb-4">
              Updating your account information...
            </p>
          )}

          <div className="mt-6">
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded mr-2"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
