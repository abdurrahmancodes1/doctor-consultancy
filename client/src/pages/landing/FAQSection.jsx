import { Card, CardContent } from "@/components/ui/card";

import { faqs, trustLogos } from "../../../utils/constant";
import React, { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Trust Indicators Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Excellence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 tracking-tight">
            Trusted by Millions{" "}
            <span className="text-slate-400 font-normal">since 2010</span>
          </h2>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center opacity-70">
            {trustLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-12 text-slate-400 font-bold text-xl hover:text-blue-600 hover:scale-105 transition-all duration-300 cursor-default"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12 tracking-tight">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={`
                    transition-all duration-300 border
                    ${
                      openFAQ === index
                        ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-100"
                        : "bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50/50"
                    }
                  `}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span
                      className={`text-lg font-medium pr-8 transition-colors ${openFAQ === index ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                        openFAQ === index ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {/* Note: In a real app with framer-motion, we would animate height here.
                      For standard React, conditional rendering works efficiently.
                    */}
                  {openFAQ === index && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-slate-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
