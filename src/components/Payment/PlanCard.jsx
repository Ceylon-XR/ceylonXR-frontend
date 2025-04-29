import React from "react";

export default function PlanCard({ plan, onBuy }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-2 border border-gray-200 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
      <div className="mb-4">
        <p className="text-3xl font-bold text-indigo-600">
          {plan.tokensIncluded} tokens
        </p>
        <p className="text-lg font-semibold text-gray-700">
          ${plan.price} {plan.currency}
        </p>
      </div>
      <button
        onClick={() => onBuy(plan)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Buy Now
      </button>
    </div>
  );
}
