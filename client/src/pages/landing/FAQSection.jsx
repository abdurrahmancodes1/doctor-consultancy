"use client";
import { Card, CardContent } from "@/components/ui/card";
// import { faqs, trustLogos } from "@/lib/constant"
// impo\\;
import { faqs, trustLogos } from "../../../utils/constant";
import React, { useState } from "react";

// import { Card, CardContent } from "../ui/card";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-12">
            Trusted by Millions since 2010
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {trustLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center h-16 text-muted-foreground font-medium text-sm opacity-60 hover:opacity-80 transition-opacity duration-300"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* FAQ SECTIOn  */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-card border border-border">
              <CardContent className="p-0">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-accent/50 transition-colors duration-300"
                >
                  <span className="text-lg font-medium text-primary pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-muted-foreground transform transition-transform duration-300 shrink-0 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4 ">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
