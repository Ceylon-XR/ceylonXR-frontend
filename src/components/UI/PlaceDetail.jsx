import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BentoTilt, Card } from "./Places";
import TokenPaymentModal from "./TokenPaymentModal";
import placesData from "../../data/placesData";

const PlaceDetail = () => {
  const { category, placeId } = useParams();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  // Get place data
  const place = placesData[category]?.[placeId];

  // If place not found, redirect to home
  useEffect(() => {
    if (!place) {
      navigate("/");
    }
  }, [place, navigate]);

  if (!place) {
    return (
      <div className="min-h-screen bg-black pt-28 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Function to handle tour selection
  const handleTourSelection = (tour) => {
    setSelectedTour({
      ...tour,
      placeTitle: place.title,
    });
    setShowPaymentModal(true);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);

    // If place has a specific experience URL, use it
    const experienceUrl =
      place.experienceUrl ||
      `/playcanvas/${category}/${placeId}/${selectedTour.id}/index.html`;

    const playCanvasWindow = window.open(experienceUrl, "_blank");

    // When the window loads, inject voice assistant script if needed
    if (playCanvasWindow && selectedTour.hasVoiceAssistant) {
      playCanvasWindow.addEventListener("load", () => {
        const script = playCanvasWindow.document.createElement("script");
        script.src = "/playcanvas-app/voice-assistant.js";
        playCanvasWindow.document.body.appendChild(script);
      });
    }
  };

  // Determine what type of detail cards to display
  const detailCards = place.tours || place.rooms || place.spaces || [];
  const detailCardTitle = place.tours
    ? "Available Tours"
    : place.rooms
    ? "Room Types"
    : place.spaces
    ? "Available Spaces"
    : "Explore Details";

  return (
    <section className="bg-black min-h-screen pt-28 pb-52">
      {/* Payment Modal */}
      {selectedTour && (
        <TokenPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          place={{
            id: selectedTour.id,
            placeId: `${category}-${placeId}-${selectedTour.id}`,
            title: `${place.title} - ${selectedTour.title}`,
            tokensRequired: selectedTour.tokensRequired,
          }}
          tokensRequired={selectedTour.tokensRequired}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <div className="container mx-auto px-3 md:px-10">
        {/* Hero Section */}
        <div className="relative h-[50vh] w-full mb-10 overflow-hidden rounded-lg">
          <img
            src={`/${place.image}`}
            alt={place.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-0 p-8 w-full">
            <h1 className="text-4xl md:text-5xl special-font text-white mb-2">
              {place.title}
            </h1>
            <p className="text-white/80 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {place.location}
            </p>
          </div>
        </div>

        {/* Description and Details */}
        <div className="px-5 mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <p className="font-circular-web text-lg text-blue-50 mb-6">
                {place.description}
              </p>

              {place.features && (
                <div className="mt-6">
                  <h3 className="text-xl text-blue-50 mb-3">Key Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-900/30 text-blue-50 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-1/3 bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-xl text-blue-50 mb-4">Information</h3>

              {place.contact && (
                <div className="flex items-center gap-3 text-blue-50/90 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{place.contact}</span>
                </div>
              )}

              {place.website && (
                <div className="flex items-center gap-3 text-blue-50/90 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href={`https://${place.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400"
                  >
                    {place.website}
                  </a>
                </div>
              )}

              {place.rating && (
                <div className="flex items-center gap-3 text-blue-50/90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{place.rating} / 5</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detail Cards Section */}
        <div className="px-5 mb-10">
          <h2 className="text-2xl special-font text-white mb-8">
            {detailCardTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {detailCards.map((card) => (
              <BentoTilt
                key={card.id}
                className="border-hsla relative h-80 w-full overflow-hidden rounded-md"
                onClick={() => !place.comingSoon && handleTourSelection(card)}
              >
                <Card
                  src={`/${card.image}`}
                  title={<>{card.title}</>}
                  description={
                    place.comingSoon
                      ? card.description
                      : `${card.description} (${card.tokensRequired} tokens)`
                  }
                  isComingSoon={place.comingSoon}
                  viewType={card.viewType}
                />
              </BentoTilt>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="px-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-50 hover:text-blue-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlaceDetail;
