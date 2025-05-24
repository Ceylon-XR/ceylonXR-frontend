import React, { useState } from "react";
import { FaCoins } from "react-icons/fa";
import { payForPlace } from "../../api/token";

const TokenPaymentModal = ({
  isOpen,
  onClose,
  place,
  tokensRequired,
  onSuccess,
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    try {
      setError(null);
      setProcessing(true);

      // Call token payment API
      await payForPlace(place.id, tokensRequired);

      // If payment succeeds, call the success handler
      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);

      if (error.response && error.response.status === 400) {
        setError(
          "Insufficient tokens. Please add more tokens to your account."
        );
      } else {
        setError("An error occurred during payment. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="border-hsla max-w-md rounded-lg bg-gray-900 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="special-font text-xl text-blue-50">{place.title}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4 rounded-md bg-blue-900/20 p-4">
            <div className="flex items-center gap-3">
              <FaCoins className="text-yellow-400" />
              <p className="text-blue-50">
                <span className="font-bold">{tokensRequired}</span> tokens
                required to visit this place
              </p>
            </div>
          </div>

          <p className="text-sm text-blue-50/70">
            By continuing, you agree to spend {tokensRequired} tokens to access
            this immersive experience.
          </p>

          {error && (
            <div className="mt-4 rounded-md bg-red-900/20 p-3 text-red-200">
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border-hsla rounded-full px-5 py-2 text-sm uppercase text-white/80 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="
              border-hsla relative flex items-center gap-2 rounded-full 
              bg-gradient-to-r from-blue-600 to-blue-500 
              px-5 py-2 text-sm uppercase text-white transition-all
              hover:from-blue-500 hover:to-blue-400
              disabled:opacity-50
            "
          >
            {processing ? "Processing..." : "Confirm Payment"}
            <FaCoins className="text-yellow-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPaymentModal;
