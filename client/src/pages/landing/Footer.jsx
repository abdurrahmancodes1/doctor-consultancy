"use client";

import React from "react";
// import Link from "next/link";
import { Stethoscope } from "lucide-react";
// import { Button } from "../ui/button";
import { contactInfo, footerSections, socials } from "../../../utils/constant";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Brand + contact */}
            <div className="lg:col-span-4">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Medicare +
                </span>
              </Link>

              <p className="text-blue-100 mb-6 leading-relaxed text-sm">
                Your trusted healthcare partner providing quality medical
                consultations with certified doctors online, anytime, anywhere.
              </p>

              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-blue-100 text-sm"
                  >
                    <item.icon className="w-4 h-4 text-blue-300" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-lg mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link, i) => (
                        <li key={i}>
                          <a
                            href={link.href}
                            className="text-blue-200 text-sm hover:text-white transition-colors hover:underline"
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-blue-700/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-1">Stay Updated</h4>
              <p className="text-blue-200 text-sm">
                Get health tips and product updates delivered to your inbox
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-blue-800/50 border border-blue-600 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[260px]"
              />
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-blue-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-blue-200 text-sm text-center md:text-left">
              © 2025 Medicare+, Inc. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-blue-200 text-sm">Follow us</span>
              <div className="flex items-center gap-3">
                {socials.map(({ name, icon: Icon, url }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-8 h-8 rounded-full bg-blue-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
