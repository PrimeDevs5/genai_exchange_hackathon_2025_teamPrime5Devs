import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { 
  UploadIcon, 
  BookOpenIcon, 
  FileTextIcon, 
  ShieldIcon, 
  BriefcaseIcon, 
  UsersIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ScaleIcon,
  LightBulbIcon,
  ClockIcon,
  TrendingUpIcon,
  StarIcon,
  ZapIcon
} from 'lucide-react';
import { UploadButton } from '../components/ui/UploadButton';
import { Card } from '../components/ui/Card';

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60); // 60 FPS
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

const FadeInWhenVisible = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

export const Landing: React.FC = () => {
  const handleFileSelect = (file: File) => {
    console.log('File selected:', file);
    // In a real app, you would upload the file and redirect to dashboard
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-20 md:pt-32 pb-24 md:pb-32">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM0 0h2v2H0V0zm0 4h2v2H0V4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ZapIcon className="w-4 h-4 mr-2" />
              AI-Powered Legal Intelligence
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-8"
            >
              <span className="text-gray-900">Understand your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                legal documents
              </span>
              <br />
              <span className="text-gray-900">in plain English</span>
              <span className="text-blue-600"> — fast</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-medium"
            >
              <span className="text-blue-600 font-semibold">DocQueries</span> uses AI to translate complex legal jargon into simple, actionable insights that anyone can understand. 
              <span className="block mt-2 text-lg text-gray-500">No legal background required.</span>
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UploadButton 
                  onFileSelect={handleFileSelect} 
                  variant="primary" 
                  size="lg" 
                  label="Upload & Analyze Document" 
                  className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl text-lg px-8 py-4 min-w-[280px]"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md min-w-[280px] sm:min-w-0"
                >
                  View Dashboard
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter end={25000} />+
                </div>
                <div className="text-sm text-gray-600">Documents Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter end={98} />%
                </div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  <AnimatedCounter end={5000} />+
                </div>
                <div className="text-sm text-gray-600">Legal Professionals</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Document Preview Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                See Legal Analysis in Action
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Watch how our AI breaks down complex legal language into clear, actionable insights
              </p>
            </div>
          </FadeInWhenVisible>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Mock Browser Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Employment_Contract_Analysis.pdf
                </div>
                <div className="w-16"></div>
              </div>

              {/* Mock Document Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Document View */}
                <div className="p-8 bg-gray-50">
                  <div className="bg-white rounded-lg shadow-sm p-6 h-96 overflow-hidden">
                    <div className="text-sm text-gray-600 mb-4 font-mono leading-relaxed">
                      <div className="font-bold text-gray-900 mb-2">EMPLOYMENT AGREEMENT</div>
                      <div className="mb-4">This Employment Agreement ("Agreement") is entered into on [DATE] between [COMPANY] and [EMPLOYEE]...</div>
                      <div className="mb-2"><span className="bg-yellow-200 px-1">Section 3. Compensation:</span></div>
                      <div className="mb-2">The Employee shall receive an annual salary of $75,000...</div>
                      <div className="mb-2"><span className="bg-red-200 px-1">Section 8. Non-Compete:</span></div>
                      <div className="mb-2">Employee agrees not to compete for 24 months...</div>
                      <div className="text-gray-400">▼ Continue reading...</div>
                    </div>
                  </div>
                </div>

                {/* Analysis Panel */}
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Key Findings</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-green-900">Competitive Salary</div>
                            <div className="text-sm text-green-700">$75,000 aligns with market standards</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                          <ClockIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-yellow-900">Review Required</div>
                            <div className="text-sm text-yellow-700">Vacation policy needs clarification</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                          <ShieldIcon className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-900">Risk Alert</div>
                            <div className="text-sm text-red-700">24-month non-compete is above standard</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
                        <span className="text-sm font-bold text-gray-900">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-primary-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: "94%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

            {/* Right Content - Interactive Demo */}
            <motion.div 
              variants={itemVariants}
              className="lg:w-1/2 mt-16 lg:mt-0"
            >
              <motion.div
                initial={{ opacity: 0, rotateY: -15 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative"
              >
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <ZapIcon className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Main Demo Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-legal-200 p-8 hover:shadow-3xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-3xl"></div>
                  
                  {/* Document Header */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="flex items-center justify-between mb-8"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                        <FileTextIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-legal-900">
                          Employment_Agreement_2024.pdf
                        </h3>
                        <p className="text-legal-500 text-sm">
                          24 pages • Processed in 3.2s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Analyzed</span>
                    </div>
                  </motion.div>

                  {/* Analysis Results */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="p-6 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-2xl border border-primary-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                          <LightBulbIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-legal-900 mb-2">Key Insight</h4>
                          <p className="text-legal-700 text-sm leading-relaxed">
                            Non-compete clause extends 18 months post-termination, which is above industry standard of 12 months.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.6 }}
                      className="p-6 bg-gradient-to-r from-warning-50 to-warning-100/50 rounded-2xl border border-warning-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-warning-600 rounded-lg flex items-center justify-center">
                          <ScaleIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-legal-900 mb-2">Risk Assessment</h4>
                          <p className="text-legal-700 text-sm leading-relaxed">
                            Termination clause heavily favors employer. Consider negotiating severance terms.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.9, duration: 0.6 }}
                      className="p-6 bg-gradient-to-r from-success-50 to-success-100/50 rounded-2xl border border-success-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-success-600 rounded-lg flex items-center justify-center">
                          <TrendingUpIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-legal-900 mb-2">Recommendation</h4>
                          <p className="text-legal-700 text-sm leading-relaxed">
                            Salary review clause is well-structured with annual increases tied to performance metrics.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 0.6 }}
                    className="mt-8 flex justify-end"
                  >
                    <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center space-x-1 hover:space-x-2 transition-all">
                      <span>View Full Analysis</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                How It Works
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-bold text-legal-900 mb-6">
                Three Steps to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                  {" "}Legal Clarity
                </span>
              </h2>
              <p className="text-xl text-legal-600 max-w-3xl mx-auto">
                Our cutting-edge AI transforms complex legal documents into clear, actionable insights in minutes, not hours.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: UploadIcon,
                title: "Upload & Secure",
                description: "Securely upload any legal document - contracts, agreements, terms of service, or legal notices. Bank-level encryption keeps your data safe.",
                color: "from-primary-500 to-primary-600",
                delay: 0
              },
              {
                icon: BookOpenIcon,
                title: "AI Analysis",
                description: "Advanced AI scans every clause, identifies key terms, risks, and opportunities. Natural language processing breaks down complex legal jargon.",
                color: "from-accent-500 to-accent-600",
                delay: 0.2
              },
              {
                icon: LightBulbIcon,
                title: "Clear Insights",
                description: "Receive plain-English summaries, risk assessments, and actionable recommendations. Make informed decisions with confidence.",
                color: "from-success-500 to-success-600",
                delay: 0.4
              }
            ].map((feature, index) => (
              <FadeInWhenVisible key={index} delay={feature.delay}>
                <motion.div
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="relative group"
                >
                  <Card className="text-center h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-legal-50/30 group-hover:from-legal-50/50 group-hover:to-white">
                    <div className="relative z-10 p-8">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className={`w-20 h-20 mx-auto bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-xl`}
                      >
                        <feature.icon className="h-10 w-10 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-legal-900 mb-6">
                        {feature.title}
                      </h3>
                      <p className="text-legal-600 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Card>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-legal-900 to-legal-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Trusted by Legal Professionals Worldwide
              </h2>
              <p className="text-xl text-legal-300 max-w-3xl mx-auto">
                Join thousands of lawyers, paralegals, and business professionals who rely on our platform daily.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 50000, suffix: "+", label: "Documents Analyzed", icon: FileTextIcon },
              { value: 15000, suffix: "+", label: "Active Users", icon: UsersIcon },
              { value: 95, suffix: "%", label: "Accuracy Rate", icon: CheckCircleIcon },
              { value: 24, suffix: "/7", label: "Support Available", icon: ShieldIcon }
            ].map((stat, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-accent-400 mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter end={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-legal-300 font-medium">{stat.label}</div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-legal-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-legal-900 mb-6">
                Why Choose
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                  {" "}LegalClarity
                </span>
              </h2>
              <p className="text-xl text-legal-600 max-w-3xl mx-auto">
                Experience the future of legal document analysis with enterprise-grade security and unmatched accuracy.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldIcon,
                title: "Enterprise Security",
                description: "Bank-level encryption, SOC 2 compliance, and zero-trust architecture protect your sensitive documents.",
                color: "from-success-500 to-success-600"
              },
              {
                icon: ClockIcon,
                title: "Lightning Fast",
                description: "Analyze 50-page contracts in under 30 seconds. Reduce document review time by 90%.",
                color: "from-primary-500 to-primary-600"
              },
              {
                icon: BriefcaseIcon,
                title: "Professional Grade",
                description: "Built for law firms, corporate legal teams, and business professionals who demand accuracy.",
                color: "from-accent-500 to-accent-600"
              },
              {
                icon: UsersIcon,
                title: "Team Collaboration",
                description: "Share insights, add comments, and collaborate with team members in real-time.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: TrendingUpIcon,
                title: "Smart Insights",
                description: "AI-powered risk assessment, clause comparison, and negotiation recommendations.",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                icon: StarIcon,
                title: "Expert Support",
                description: "24/7 support from legal technology experts who understand your workflow.",
                color: "from-pink-500 to-pink-600"
              }
            ].map((benefit, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-legal-100 group-hover:border-primary-200">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <benefit.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-legal-900 mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-legal-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Ccircle cx="50" cy="50" r="1" fill="white" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grain)"/%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInWhenVisible>
            <div className="text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold text-white mb-8"
              >
                Ready to Transform Your
                <br />Legal Document Workflow?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto mb-12"
              >
                Join thousands of legal professionals who save hours every week with AI-powered document analysis.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UploadButton 
                    onFileSelect={handleFileSelect} 
                    variant="accent" 
                    size="lg" 
                    label="Start Free Analysis" 
                    className="bg-white text-primary-700 hover:bg-legal-50 shadow-2xl text-xl px-10 py-5"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-xl"
                  >
                    View Dashboard
                    <ArrowRightIcon className="ml-3 w-6 h-6" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 text-primary-200 text-lg"
              >
                Free trial • No credit card required • Process up to 5 documents
              </motion.p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
};
};