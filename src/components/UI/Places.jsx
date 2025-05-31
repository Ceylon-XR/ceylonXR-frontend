import React, { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { GiFootprint } from "react-icons/gi";
import { PiBirdFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import VoiceAssistant from "./VoiceAssistant";
import TokenPaymentModal from "./TokenPaymentModal";
import placesData from "../../data/placesData";

export const BentoTilt = ({ children, className = "", onClick }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
};

export const Card = ({
  src,
  title,
  description,
  isComingSoon,
  onClick,
  showVoiceAssistant,
  viewType,
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div
      className="relative size-full"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Image */}
      <img
        src={src}
        alt={title}
        className="absolute left-0 top-0 size-full object-cover object-center"
      />

      {/* Voice Assistant */}
      {showVoiceAssistant && <VoiceAssistant />}

      {/* Diagonal Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        <div
          ref={hoverButtonRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/90"
        >
          {/* Radial gradient hover effect */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
            style={{
              opacity: hoverOpacity,
              background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
            }}
          />
          <TiLocationArrow className="relative z-20" />
          {isComingSoon ? (
            <p className="relative z-20">coming soon</p>
          ) : (
            <p className="relative z-20">Ready to explore? Let’s dive in! 🚀</p>
          )}
        </div>
      </div>
      {/* Top-right view-type pill */}
      <div
        className="
      absolute top-4 right-4 z-20
      border-hsla flex items-center gap-1
      rounded-full bg-black px-5 py-2
      uppercase text-xs text-white/90
      transition-transform hover:scale-105
    "
      >
        {viewType === "bird" ? (
          <>
            <PiBirdFill className="relative z-20" />
            <span className="relative z-20 ml-1">Bird View</span>
          </>
        ) : (
          <>
            <GiFootprint className="relative z-20" />
            <span className="relative z-20 ml-1">Surface View</span>
          </>
        )}
      </div>
    </div>
  );
};

const Places = () => {
  const navigate = useNavigate();
  // Add state for token payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Direct navigation functions
  const navigateToPlace = (category, placeId) => {
    navigate(`/${category}/${placeId}`);
  };

  // Legacy functions for backward compatibility
  const openPlayCanvasWithVoiceAssistant = () => {
    setSelectedPlace({
      id: "6",
      placeId: "nemuro-city-museum",
      title: "Nemuro City Museum",
      tokensRequired: 5,
    });
    setShowPaymentModal(true);
  };

  const openCampusTour = () => {
    window.open("/playcanvas/campus-tour/index.html", "_blank");
  };

  const openElla = () => {
    window.open("/playcanvas/ella/index.html", "_blank");
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);

    const playCanvasWindow = window.open(
      "/playcanvas/playcanvas-app/index.html",
      "_blank"
    );

    if (playCanvasWindow) {
      playCanvasWindow.addEventListener("load", () => {
        const script = playCanvasWindow.document.createElement("script");
        script.src = "/playcanvas-app/voice-assistant.js";
        playCanvasWindow.document.body.appendChild(script);
      });
    }
  };

  return (
    <section className="bg-black pb-52">
      {/* Token Payment Modal */}
      {selectedPlace && (
        <TokenPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          place={selectedPlace}
          tokensRequired={selectedPlace.tokensRequired}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the Gaussian Splats!
          </p>
          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            Explore stunning digital recreations of real-world sites, enriched
            with historical insights, interactive storytelling, and multiplayer
            discovery.
          </p>
        </div>{" "}
        {/* Dynamically render each category section */}
        {Object.entries(placesData).map(([category, places]) => (
          <div id={`${category}-section`} className="mb-16" key={category}>
            <h2 className="px-5 mb-6 font-circular-web text-2xl text-blue-50">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {/* Render places from the placesData */}
              {Object.entries(places).map(([placeId, place]) => (
                <BentoTilt
                  key={placeId}
                  className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
                  onClick={() => navigateToPlace(category, placeId)}
                >
                  <Card
                    src={`/${place.image}`}
                    title={<>{place.title}</>}
                    description={
                      place.description.length > 150
                        ? `${place.description.substring(0, 150)}...`
                        : place.description
                    }
                    isComingSoon={place.comingSoon || false}
                    viewType={
                      place.tours?.[0]?.viewType ||
                      place.rooms?.[0]?.viewType ||
                      place.spaces?.[0]?.viewType ||
                      "surface"
                    }
                    showVoiceAssistant={place.hasVoiceAssistant || false}
                  />
                </BentoTilt>
              ))}

              {/* Only add "More coming soon" to the Other category */}
              {category === "other" && (
                <BentoTilt className="border-hsla relative h-96 w-full overflow-hidden rounded-md">
                  <div className="flex size-full flex-col justify-between bg-blue-300 p-5">
                    <h1 className="bento-title special-font max-w-64 text-black">
                      More coming soon.
                    </h1>
                    <TiLocationArrow className="m-5 scale-[5] self-end" />
                  </div>
                </BentoTilt>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Places;
