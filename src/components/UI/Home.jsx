import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "./Hero";
import About from "./About";
import Places from "./Places";
import Contact from "./Contact";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to a specific category section
    if (location.state?.scrollToCategory) {
      const categoryId = location.state.scrollToCategory;

      // Slight delay to ensure the DOM is fully loaded
      setTimeout(() => {
        const categoryElement = document.getElementById(
          `${categoryId}-section`
        );
        if (categoryElement) {
          categoryElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <About />
      <Places />
      <Contact />
    </>
  );
};

export default Home;
