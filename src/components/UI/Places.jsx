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
        {/* Tourism Category Section */}
        <div id="tourism-section" className="mb-16">
          <h2 className="px-5 mb-6 font-circular-web text-2xl text-blue-50">
            Tourism
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {/* Ella Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("tourism", "ella")}
            >
              <Card
                src="img/tourism/ella.webp"
                title={<>Ella</>}
                description="Nestled in the lush hills of Sri Lanka, Ella is a breathtaking escape filled with misty mountains, scenic tea plantations, and iconic landmarks."
                isComingSoon={false}
                viewType="bird"
              />
            </BentoTilt>

            {/* Sigiriya Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("tourism", "sigiriya")}
            >
              <Card
                src="img/sigiriya.webp"
                title={<>sigiriya</>}
                description="Perched on a towering rock, Sigiriya is an ancient fortress filled with stunning frescoes, landscaped gardens, and the iconic Lion's Paw entrance."
                isComingSoon={true}
                viewType="bird"
              />
            </BentoTilt>

            {/* Campus Tour Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("tourism", "campus-tour")}
            >
              <Card
                src="img/foe_usj.jpg"
                title={<>Campus Tour - FOE USJP</>}
                description="Discover Sri Lanka's newest engineering complex at USJP, equipped with cutting-edge tech and modern labs."
                isComingSoon={false}
                viewType="bird"
              />
            </BentoTilt>

            {/* Colombo National Museum Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("tourism", "colombo-museum")}
            >
              <Card
                src="img/tourism/National_Museum.jpg"
                title={<>Colombo National Museum</>}
                description="Sri Lanka's primary cultural institution featuring artifacts showcasing the rich heritage and history of the island."
                isComingSoon={false}
                viewType="surface"
              />
            </BentoTilt>

            {/* Nemuro City Museum Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("tourism", "nemuro-museum")}
            >
              <Card
                src="img/tourism/Nemuro_City_Museum.png"
                title={<>Nemuro City Museum</>}
                description="Explore our experimental 3D space featuring real-time voice assistance and interactive elements."
                isComingSoon={false}
                showVoiceAssistant={false}
                viewType="surface"
              />
            </BentoTilt>
          </div>
        </div>{" "}
        {/* Hotels Category Section */}
        <div id="hotels-section" className="mb-16">
          <h2 className="px-5 mb-6 font-circular-web text-2xl text-blue-50">
            Hotels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {/* Cinnamon Grand Hotel Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("hotels", "cinnamon-grand")}
            >
              <Card
                src="img/hotels/cinnamon-grand.jpg"
                title={<>Cinnamon Grand</>}
                description="Experience luxury at this iconic 5-star hotel in the heart of Colombo, featuring elegant rooms, fine dining, and world-class amenities."
                isComingSoon={true}
                viewType="surface"
              />
            </BentoTilt>

            {/* Jetwing Blue Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("hotels", "jetwing-blue")}
            >
              <Card
                src="img/hotels/jetwing-blue.jpg"
                title={<>Jetwing Blue</>}
                description="Beachfront luxury in Negombo with stunning ocean views, contemporary design, and exceptional Sri Lankan hospitality."
                isComingSoon={true}
                viewType="surface"
              />
            </BentoTilt>

            {/* Heritance Kandalama Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("hotels", "heritance-kandalama")}
            >
              <Card
                src="img/hotels/heritance.jpeg"
                title={<>Heritance Kandalama</>}
                description="An architectural marvel embedded in nature, offering breathtaking views of Sigiriya Rock and Kandalama Lake."
                isComingSoon={true}
                viewType="bird"
              />
            </BentoTilt>
          </div>
        </div>{" "}
        {/* Other Category Section */}
        <div id="other-section" className="mb-16">
          <h2 className="px-5 mb-6 font-circular-web text-2xl text-blue-50">
            Other
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {/* Barista Colombo Card */}
            <BentoTilt
              className="border-hsla relative h-96 w-full overflow-hidden rounded-md"
              onClick={() => navigateToPlace("other", "barista-colombo")}
            >
              <Card
                src="img/other/barista.jpg"
                title={<>Barista Colombo</>}
                description="Experience the warm ambiance and rich coffee culture of Sri Lanka's premier coffee house chain."
                isComingSoon={true}
                viewType="surface"
              />
            </BentoTilt>

            {/* More Coming Soon Card */}
            <BentoTilt className="border-hsla relative h-96 w-full overflow-hidden rounded-md">
              <div className="flex size-full flex-col justify-between bg-blue-300 p-5">
                <h1 className="bento-title special-font max-w-64 text-black">
                  More coming soon.
                </h1>
                <TiLocationArrow className="m-5 scale-[5] self-end" />
              </div>
            </BentoTilt>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Places;
