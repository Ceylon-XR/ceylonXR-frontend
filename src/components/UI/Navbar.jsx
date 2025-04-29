import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState, useContext } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../App";
import UserAvatar from "../Auth/UserAvatar";

import Button from "./Button";

const navItems = ["Home", "About", "Contact"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage =
    location.pathname === "/profile" ||
    location.pathname === "/plans" ||
    location.pathname === "/payment-success" ||
    location.pathname === "/payment-cancel" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  // Handle navigation for nav items
  const handleNavClick = (item) => {
    if (item.toLowerCase() === "home") {
      navigate("/");
    } else {
      // If we're not on the home page, navigate to home with hash
      if (location.pathname !== "/") {
        navigate(`/#${item.toLowerCase()}`);
      } else {
        // Just scroll to the section if already on home page
        document
          .getElementById(item.toLowerCase())
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    // Always add the floating-nav and background class for profile page
    if (isProfilePage) {
      navContainerRef.current.classList.add("floating-nav");
      navContainerRef.current.classList.add("profile-page-nav");
    } else if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
      navContainerRef.current.classList.remove("profile-page-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
      navContainerRef.current.classList.remove("profile-page-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
      navContainerRef.current.classList.remove("profile-page-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY, isProfilePage]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Explore button */}
          <div className="flex items-center gap-7">
            <Button
              id="product-button"
              title="Explore"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  href={
                    item.toLowerCase() === "home"
                      ? "/"
                      : `#${item.toLowerCase()}`
                  }
                  className="nav-hover-btn cursor-pointer"
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>

          {/* Sign-in button or user avatar */}
          <div>
            {user ? (
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="flex items-center bg-blue-50 rounded-full px-3 py-1">
                  <span className="text-indigo-600 font-medium">
                    {user.tokens || 0}
                  </span>
                  <span className="ml-1 text-indigo-600 text-sm">Tokens</span>
                </div>
                <UserAvatar user={user} />
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
