import React from "react";
// import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
// import { healthcareCategories } from "../lib/constant";
//
import { healthcareCategories } from "../../../utils/constant"; // adjust path if needed
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/feature/api/authApi";
import { Video } from "lucide-react";

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
      navigate("/register/patient");
    }
  };

  const handleCategoryClick = (categoryTitle) => {
    if (isAuthenticated) {
      navigate(`/doctor-list?category=${encodeURIComponent(categoryTitle)}`);
    } else {
      navigate("/register/patient");
    }
  };

  return (
    <section className="py-20 mt-10 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#2563eb] leading-tight mb-6">
          The place where <br />
          <span className="text-[#2563eb]">doctors listen </span>
          <span className="text-blue-800">- to you</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Online primary care that's affordable with or without insurance.
          Quality healthcare, accessible anytime, anywhere.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={handleBookConsultation}
            size="lg"
            className="w-full sm:w-auto px-12 text-lg py-6 bg-blue-600 text-white  rounded-full font-semibold hover:bg-brand-700 transition shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2"
          >
            <Video size={20} className="w-12 h-12" />
            Book a video visit
          </Button>
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
        <div class="mt-20  lg:block bg-gray-50 border-y border-blue-100">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="flex justify-between items-center text-center divide-x divide-brand-200">
              <div class="flex-1 px-4">
                <div class="text-2xl font-bold text-blue-600 mb-1">500+</div>
                <div class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Certified Doctors
                </div>
              </div>
              <div class="flex-1 px-4">
                <div class="text-2xl font-bold text-blue-600 mb-1">50k+</div>
                <div class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Happy Patients
                </div>
              </div>
              <div class="flex-1 px-4">
                <div class="text-2xl font-bold text-blue-600 mb-1">4.9/5</div>
                <div class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Average Rating
                </div>
              </div>
              <div class="flex-1 px-4">
                <div class="text-2xl font-bold text-blue-600 mb-1">24/7</div>
                <div class="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Online Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
