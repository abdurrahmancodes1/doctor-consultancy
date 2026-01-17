// import { testimonials } from "@/lib/constant";
import { testimonials } from "../../../utils/constant";
import { Quote, Star, User } from "lucide-react";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const TestimonialSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl  font-bold text-slate-900 tracking-tight mb-4">
            Out patient <span className="text-blue-600"> love us</span>
          </h2>
          <div className="flex  items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-foreground ">4.8</span>
            <div className="flex text-yellow-400 ">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-muted-foreground">52K+ reviews</span>
          </div>
        </div>
        {/* TestimonialGrid  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`
                  relative h-full flex flex-col justify-between border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1
                  ${testimonial.bgColor}
                `}
            >
              {/* Decorative Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-600/10 rotate-180" />

              <CardContent className="p-6 pt-8">
                {/* Rating Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-slate-200" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-base text-slate-600 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </CardContent>

              {/* Author Section */}
              <CardFooter className="p-6 pt-0 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-slate-500">
                    {testimonial.location}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
