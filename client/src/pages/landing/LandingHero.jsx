import React from "react";
// import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
// import { healthcareCategories } from "../lib/constant";
//
import { healthcareCategories } from "../../../utils/constant"; // adjust path if needed
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/feature/api/authApi";

const LandingHero = () => {
  // const isAuthenticated = true;
  const { data, isLoading } = useGetMeQuery();
  const isAuthenticated = !!data?.user;
  // later connect to Redux
  const navigate = useNavigate();

  const handleBookConsultation = () => {
    if (isAuthenticated) {
      navigate("/doctor-list");
    } else {
      navigate("/signup/patient");
    }
  };

  const handleCategoryClick = (categoryTitle) => {
    if (isAuthenticated) {
      navigate(`/doctor-list?category=${encodeURIComponent(categoryTitle)}`);
    } else {
      navigate("/signup/patient");
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-900 leading-tight mb-6">
          The place where <br />
          <span className="text-blue-900">doctors listen - to you</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Online primary care that's affordable with or without insurance.
          Quality healthcare, accessible anytime, anywhere.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={handleBookConsultation}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full px-8 py-3 text-lg"
          >
            Book a video visit
          </Button>

          <Link to="/login/doctor">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-3 text-lg"
            >
              Login as Doctor
            </Button>
          </Link>
        </div>

        {/* Healthcare categories */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center overflow-x-auto gap-6 pb-2 scrollbar-hide mx-auto">
              {healthcareCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.title)}
                  className="flex flex-col items-center min-w-[100px] group transition-transform"
                >
                  <div
                    className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center mb-2 group-hover:shadow-xl transition-all duration-200`}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={category.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-blue-900 text-center leading-tight">
                    {category.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>500+ Certified Doctors</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>50,000+ Satisfied Patients</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>24/7 Available</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
