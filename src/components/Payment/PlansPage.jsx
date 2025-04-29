import React, { useState, useEffect, useContext } from "react";
import { getPlans, createCheckoutSession } from "../../api/payment";
import PlanCard from "./PlanCard";
import { AuthContext } from "../../App";
import NavBar from "../UI/Navbar";
import Footer from "../UI/Footer";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    getPlans()
      .then((res) => {
        // Check if response has data property or is the data itself
        const plansData = res.data || res;
        console.log("Plans data:", plansData);
        setPlans(Array.isArray(plansData) ? plansData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading plans", err);
        setError("Failed to load token plans. Please try again later.");
        setPlans([]); // Set to empty array on error
        setLoading(false);
      });
  }, []);

  const handleBuy = async (plan) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }

    try {
      const res = await createCheckoutSession({
        AmountInCents: plan.price * 100, // Convert to cents if needed
        PlanName: plan.name,
        UserId: user.id,
        PlanId: plan.id,
      });

      // Check if response has url property or needs to be accessed differently
      const checkoutUrl = res.data?.url || res.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("No checkout URL returned", res);
        setError("Failed to create checkout session. Please try again later.");
      }
    } catch (err) {
      console.error("Checkout error", err);
      setError("Failed to create checkout. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="container mx-auto py-12 px-4 pt-24 flex-grow">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Choose a Token Plan
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 bg-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans && plans.length > 0 ? (
              plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onBuy={handleBuy} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-lg text-gray-600">
                  No token plans are currently available.
                </p>
                <p className="text-gray-500 mt-2">
                  Please check back later or contact support.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
