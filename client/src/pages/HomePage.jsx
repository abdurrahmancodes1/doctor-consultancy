import React from "react";
import Header from "./landing/Header";
import LandingHero from "./landing/LandingHero";
import TestimonialSection from "./landing/TestimonialSection";
import FAQSection from "./landing/FAQSection";
import Footer from "./landing/Footer";

const HomePage = () => {
  return (
    <div>
      <Header />
      <LandingHero />
      <TestimonialSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;
