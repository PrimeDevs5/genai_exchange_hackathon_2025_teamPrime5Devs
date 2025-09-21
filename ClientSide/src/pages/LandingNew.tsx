import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UploadIcon, 
  BookOpenIcon, 
  FileTextIcon, 
  ShieldIcon, 
  UsersIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ScaleIcon,
  LightbulbIcon,
  TrendingUpIcon,
  ZapIcon
} from 'lucide-react';
import { UploadButton } from '../components/ui/UploadButton';
import { Card } from '../components/ui/Card';

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
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
      <section className="relative bg-gradient-to-br from-legal-50 via-white to-primary-50 pt-20 md:pt-32 pb-24 md:pb-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col lg:flex-row items-center"
          >
            {/* Left Content */}
            <motion.div variants={itemVariants} className="lg:w-1/2 lg:pr-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                AI-Powered Legal Document Analysis
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold text-legal-900 leading-tight mb-8"
              >
                Decode Legal 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                  {" "}Complexity
                </span>
                <br />in Seconds
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-legal-600 max-w-2xl mb-10 leading-relaxed"
              >
                Transform dense legal documents into clear, actionable insights with our advanced AI. 
                Make informed decisions faster than ever before.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UploadButton 
                    onFileSelect={handleFileSelect} 
                    variant="primary" 
                    size="lg" 
                    label="Analyze Document" 
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-xl hover:shadow-2xl text-lg px-8 py-4"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-700 bg-white border-2 border-primary-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    View Dashboard
                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center space-x-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-legal-900">
                    <AnimatedCounter end={50000} />+
                  </div>
                  <div className="text-sm text-legal-600">Documents Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-legal-900">
                    <AnimatedCounter end={95} />%
                  </div>
                  <div className="text-sm text-legal-600">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-legal-900">
                    <AnimatedCounter end={15000} />+
                  </div>
                  <div className="text-sm text-legal-600">Happy Users</div>
                </div>
              </motion.div>
            </motion.div>

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
                          <LightbulbIcon className="w-4 h-4 text-white" />
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
                icon: LightbulbIcon,
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
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
