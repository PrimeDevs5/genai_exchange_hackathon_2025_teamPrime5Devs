import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadIcon, BookOpenIcon, FileTextIcon, ShieldIcon, BriefcaseIcon, UsersIcon } from 'lucide-react';
import { UploadButton } from '../components/ui/UploadButton';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
export const Landing = () => {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const handleFileSelect = file => {
    console.log('File selected:', file);
    // If not logged in, redirect to auth page
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }
    // In a real app, you would upload the file and redirect to dashboard
  };

  // Determine where buttons should link based on auth state
  const dashboardOrAuthLink = currentUser ? '/dashboard' : '/auth/login';
  return <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-neutral-50 pt-16 md:pt-24 pb-20 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                Understand your legal documents in plain English — fast
              </h1>
              <p className="mt-6 text-lg md:text-xl text-neutral-700 max-w-lg">
                DocQueries uses AI to translate complex legal jargon into simple,
                actionable insights that anyone can understand.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <UploadButton onFileSelect={handleFileSelect} variant="accent" size="lg" label="Upload Document" />
                <Link to={dashboardOrAuthLink} className="btn btn-outline btn-lg">
                  {currentUser ? "View Dashboard" : "Sign In to Dashboard"}
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-neutral-300 border-2 border-white" />)}
                </div>
                <span className="ml-3 text-sm text-neutral-600">
                  Trusted by 10,000+ professionals
                </span>
              </div>
            </div>
            <div className="mt-12 md:mt-0 md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur opacity-25"></div>
                <div className="relative bg-white p-6 sm:p-10 rounded-lg shadow-medium border border-neutral-200">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded bg-primary-100 flex items-center justify-center">
                        <FileTextIcon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-neutral-900">
                          Contract_Agreement_2023.pdf
                        </h3>
                        <p className="text-xs text-neutral-500">
                          12 pages • PDF
                        </p>
                      </div>
                    </div>
                    <span className="tag bg-green-100 text-green-800">
                      Processed
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                      <h4 className="text-sm font-medium text-neutral-900 mb-2">
                        Key Finding
                      </h4>
                      <p className="text-sm text-neutral-700">
                        Section 8.3 requires a 60-day notice period before
                        termination, rather than the standard 30 days.
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                      <h4 className="text-sm font-medium text-neutral-900 mb-2">
                        Simplified Summary
                      </h4>
                      <p className="text-sm text-neutral-700">
                        This contract includes an automatic renewal clause that
                        extends the agreement by 12 months unless cancelled.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="text-sm text-primary-600 font-medium hover:text-primary-700" onClick={() => currentUser ? navigate('/dashboard') : navigate('/auth/login')}>
                      View full analysis →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              How DocQueries Works
            </h2>
            <p className="mt-4 text-lg text-neutral-700 max-w-2xl mx-auto">
              Our platform uses advanced AI to break down complex legal
              documents into clear, actionable insights.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center px-6 py-8">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <UploadIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900">
                Upload Your Document
              </h3>
              <p className="mt-4 text-neutral-700">
                Simply upload any legal document in PDF, Word, or text format to
                get started.
              </p>
            </Card>
            <Card className="text-center px-6 py-8">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <BookOpenIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900">
                AI Processing
              </h3>
              <p className="mt-4 text-neutral-700">
                Our AI analyzes the document, identifies key clauses, and
                translates legal jargon.
              </p>
            </Card>
            <Card className="text-center px-6 py-8">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900">
                Get Clear Insights
              </h3>
              <p className="mt-4 text-neutral-700">
                Review a plain-English summary with highlighted key points and
                potential concerns.
              </p>
            </Card>
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Why Choose DocQueries
            </h2>
            <p className="mt-4 text-lg text-neutral-700 max-w-2xl mx-auto">
              Our platform helps professionals and individuals save time and
              make informed decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent-100 rounded-md flex items-center justify-center">
                  <ShieldIcon className="h-6 w-6 text-accent-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-neutral-900">
                  Security First
                </h3>
                <p className="mt-2 text-neutral-700">
                  Bank-level encryption and privacy controls keep your documents
                  secure and confidential.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent-100 rounded-md flex items-center justify-center">
                  <BriefcaseIcon className="h-6 w-6 text-accent-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-neutral-900">
                  Time Saving
                </h3>
                <p className="mt-2 text-neutral-700">
                  Reduce review time by up to 80% with instant summaries and key
                  point extraction.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent-100 rounded-md flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-accent-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-neutral-900">
                  Collaboration
                </h3>
                <p className="mt-2 text-neutral-700">
                  Share insights with team members and stakeholders with custom
                  permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to simplify your legal documents?
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            Join thousands of professionals who are saving time and making
            better decisions with DocQueries.
          </p>
          <div className="mt-8">
            <Link to={dashboardOrAuthLink} className="btn bg-white text-primary-600 hover:bg-neutral-100 btn-lg">
              {currentUser ? "Go to Dashboard" : "Get Started For Free"}
            </Link>
          </div>
        </div>
      </section>
    </div>;
};