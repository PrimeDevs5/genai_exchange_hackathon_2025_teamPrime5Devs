import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileTextIcon, 
  ShieldIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ZapIcon,
  BookOpenIcon,
  LightbulbIcon,
  ScaleIcon,
  UsersIcon,
  StarIcon,
  TrendingUpIcon,
  ClockIcon,
  SparklesIcon,
  BrainIcon,
  SearchIcon,
  BarChart3Icon
} from 'lucide-react';
import { UploadButton } from '../components/ui/UploadButton';

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

// Floating Animation Component
const FloatingElement = ({ children, delay = 0, duration = 4 }: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <motion.div
    animate={{
      y: [-20, 20, -20],
      rotate: [-5, 5, -5],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  >
    {children}
  </motion.div>
);

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Hero Section with Snowflake-inspired design */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes */}
          <FloatingElement delay={0} duration={6}>
            <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-3xl blur-sm" />
          </FloatingElement>
          <FloatingElement delay={1} duration={8}>
            <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full blur-sm" />
          </FloatingElement>
          <FloatingElement delay={2} duration={7}>
            <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl blur-sm" />
          </FloatingElement>
          <FloatingElement delay={0.5} duration={9}>
            <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-indigo-400/25 to-purple-600/25 rounded-xl blur-sm" />
          </FloatingElement>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <BrainIcon className="w-4 h-4 mr-2" />
                AI-Powered Legal Intelligence
              </motion.div>
              
              {/* Main Headline */}
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8"
              >
                <span className="text-gray-900">Understand your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  legal documents
                </span>
                <br />
                <span className="text-gray-700">in plain English</span>
                <span className="text-blue-600"> — fast</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.div 
                variants={itemVariants}
                className="mb-10"
              >
                <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
                  <span className="font-bold text-blue-600">LegalDoc</span> uses AI to translate complex legal jargon 
                  into simple, actionable insights that anyone can understand.
                </p>
                <p className="text-lg text-gray-500">
                  No legal background required. Get clarity in minutes, not hours.
                </p>
              </motion.div>
              
              {/* CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <UploadButton 
                    onFileSelect={handleFileSelect} 
                    variant="primary" 
                    size="lg" 
                    label="Upload Document - It's Free" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl text-lg px-8 py-4 rounded-xl font-semibold group-hover:shadow-blue-500/25 transition-all duration-300"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/dashboard" 
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    See Examples
                    <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Trust Indicators */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-8 text-sm text-gray-600"
              >
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center">
                  <ShieldIcon className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Secure & private</span>
                </div>
                <div className="flex items-center">
                  <ZapIcon className="w-4 h-4 text-yellow-600 mr-2" />
                  <span>Results in seconds</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Demo */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              {/* Floating Action Cards */}
              <div className="relative">
                {/* Main Demo Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-500"
                >
                  {/* Document Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <FileTextIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Employment_Contract.pdf
                        </h3>
                        <p className="text-gray-500 text-sm">
                          12 pages • Analyzed in 2.3s
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Complete</span>
                    </div>
                  </div>

                  {/* Analysis Results */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                          <LightbulbIcon className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">Key Insight</h4>
                          <p className="text-gray-700 text-sm">
                            Your salary of $85,000 is 12% above market average for this role.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-600 rounded-lg flex items-center justify-center">
                          <ScaleIcon className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">Needs Attention</h4>
                          <p className="text-gray-700 text-sm">
                            The 18-month non-compete period is longer than typical (usually 6-12 months).
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6, duration: 0.6 }}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
                          <CheckCircleIcon className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">Good Terms</h4>
                          <p className="text-gray-700 text-sm">
                            Generous vacation policy with 20 days PTO plus holidays.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.6 }}
                    className="mt-6 pt-4 border-t border-gray-100"
                  >
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Analysis Confidence</span>
                      <span className="font-bold text-gray-900">96%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "96%" }}
                        transition={{ duration: 2, delay: 2.2, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating Action Cards */}
                <FloatingElement delay={3} duration={5}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.5, duration: 0.6 }}
                    className="absolute -top-8 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <BarChart3Icon className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Risk Score: Low</span>
                    </div>
                  </motion.div>
                </FloatingElement>

                <FloatingElement delay={4} duration={6}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3, duration: 0.6 }}
                    className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">2.3s analysis</span>
                    </div>
                  </motion.div>
                </FloatingElement>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by thousands of professionals
            </h2>
            <p className="text-xl text-gray-600">
              Join the growing community making legal documents accessible
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 25000, suffix: "+", label: "Documents Analyzed", icon: FileTextIcon },
              { value: 5000, suffix: "+", label: "Happy Users", icon: UsersIcon },
              { value: 98, suffix: "%", label: "Accuracy Rate", icon: CheckCircleIcon },
              { value: 15, suffix: "s", label: "Avg. Analysis Time", icon: ClockIcon }
            ].map((stat, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50 hover:shadow-lg transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter end={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How DocQueries works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Three simple steps to understand any legal document
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: FileTextIcon,
                title: "Upload Your Document",
                description: "Drag & drop any legal document - contracts, terms of service, NDAs, employment agreements, and more.",
                color: "from-blue-500 to-blue-600"
              },
              {
                step: "2", 
                icon: SearchIcon,
                title: "AI Analyzes Everything",
                description: "Our AI reads through every clause, identifies key terms, potential risks, and important details.",
                color: "from-indigo-500 to-purple-600"
              },
              {
                step: "3",
                icon: LightbulbIcon,
                title: "Get Plain English Summary",
                description: "Receive clear explanations, risk assessments, and actionable insights you can actually understand.",
                color: "from-purple-500 to-pink-600"
              }
            ].map((step, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.2}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInWhenVisible>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold text-white mb-8"
            >
              Ready to understand your documents?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto mb-12"
            >
              Join thousands who've already simplified their legal document review process
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <UploadButton 
                  onFileSelect={handleFileSelect} 
                  variant="accent" 
                  size="lg" 
                  label="Get Started - Free" 
                  className="bg-white text-blue-600 hover:bg-gray-50 shadow-2xl text-xl px-10 py-5 font-semibold rounded-xl"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-xl"
                >
                  See Examples
                  <ArrowRightIcon className="ml-3 w-6 h-6" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 text-blue-200 text-lg"
            >
              No signup required • Analyze up to 3 documents free • Results in seconds
            </motion.p>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
};
