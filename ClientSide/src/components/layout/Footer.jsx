import React from 'react';
import { Link } from 'react-router-dom';
export const Footer = () => {
  return <footer className="bg-white border-t border-neutral-200 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-neutral-900">
                DocQueries
              </span>
            </Link>
            <p className="mt-4 text-neutral-600 max-w-md">
              Understand your legal documents in plain English — fast. We
              simplify complex legal jargon so you can make informed decisions.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-neutral-600 hover:text-primary-500">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-neutral-600 hover:text-primary-500">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#integrations" className="text-neutral-600 hover:text-primary-500">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#enterprise" className="text-neutral-600 hover:text-primary-500">
                  Enterprise
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-neutral-600 hover:text-primary-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="text-neutral-600 hover:text-primary-500">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="text-neutral-600 hover:text-primary-500">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-neutral-600 hover:text-primary-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-600 text-sm">
            © 2023 DocQueries. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#terms" className="text-neutral-600 hover:text-primary-500 text-sm">
              Terms of Service
            </a>
            <a href="#privacy" className="text-neutral-600 hover:text-primary-500 text-sm">
              Privacy Policy
            </a>
            <a href="#security" className="text-neutral-600 hover:text-primary-500 text-sm">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>;
};