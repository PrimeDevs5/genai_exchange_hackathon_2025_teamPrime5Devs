import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileTextIcon, 
  ShieldIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  TrendingUpIcon,
  ZapIcon,
  BookOpenIcon,
  LightbulbIcon,
  ScaleIcon,
  UsersIcon
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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          <motion.div
            animate={{ 
              x: [0, 100, -50, 0],
              y: [0, -80, 50, 0],
              scale: [1, 1.2, 0.8, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              x: [0, -80, 100, 0],
              y: [0, 60, -40, 0],
              scale: [1, 0.8, 1.3, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              x: [0, 60, -100, 0],
              y: [0, -50, 80, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-2xl"
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Elegant Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 mb-8 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-full text-gray-700 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
              AI-Powered Legal Analysis Platform
            </motion.div>
            
            {/* Main Headline - More Elegant */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-900 leading-[0.9] mb-8 tracking-tight"
            >
              Understand your
              <span className="block font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                legal documents
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-light text-gray-600 mt-4">
                in plain English — fast
              </span>
            </motion.h1>
            
            {/* Subtitle - Improved */}
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
            >
              LegalDoc uses AI to translate complex legal jargon into simple, 
              <span className="font-medium text-gray-800"> actionable insights</span> that anyone can understand.
            </motion.p>
            
            {/* CTA Buttons - Perfectly Aligned and Styled */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full sm:w-auto"
              >
                <UploadButton 
                  onFileSelect={handleFileSelect} 
                  variant="primary" 
                  size="lg" 
                  label="Try It Free" 
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl text-lg px-12 py-4 rounded-full font-medium transition-all duration-300 border-0 min-w-[200px] h-[56px] flex items-center justify-center"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full sm:w-auto"
              >
                <Link 
                  to="/dashboard" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-4 text-lg font-medium text-gray-700 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px] h-[56px]"
                >
                  View Demo
                  <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Trust Indicators - Minimalist */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center items-center space-x-8 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
                <span>Free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                  <ShieldIcon className="w-4 h-4 text-white" />
                </div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
                  <ZapIcon className="w-4 h-4 text-white" />
                </div>
                <span>Instant Analysis</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Document Preview Section - Simplified */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                See the magic in action
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                Transform complex legal language into clear, understandable insights
              </p>
            </div>
          </FadeInWhenVisible>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Clean Header */}
              <div className="flex items-center justify-between px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Employment_Contract.pdf
                </div>
                <div className="w-16"></div>
              </div>

              {/* Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                {/* Document Side */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100/50">
                  <div className="bg-white rounded-2xl shadow-sm p-8 h-full">
                    <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                      <div className="text-lg font-semibold text-gray-900">EMPLOYMENT AGREEMENT</div>
                      <div className="text-gray-700">
                        This Employment Agreement is entered into between LegalCorp Inc. and John Doe...
                      </div>
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <span className="font-medium text-yellow-800">Section 3. Compensation:</span>
                        <div className="text-yellow-700 mt-1">Annual salary of $85,000...</div>
                      </div>
                      <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                        <span className="font-medium text-red-800">Section 8. Non-Compete:</span>
                        <div className="text-red-700 mt-1">Employee agrees not to compete for 24 months...</div>
                      </div>
                      <div className="text-gray-400 text-center py-4">
                        ⋯ and 12 more sections
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Side */}
                <div className="p-8 bg-gradient-to-br from-white to-blue-50/30">
                  <div className="space-y-6 h-full flex flex-col justify-center">
                    <div>
                      <h3 className="text-2xl font-light text-gray-900 mb-6">Key Insights</h3>
                      <div className="space-y-4">
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          className="flex items-start space-x-4 p-4 bg-green-50/80 backdrop-blur-sm rounded-2xl border border-green-200/50"
                        >
                          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-green-900">Competitive Salary</div>
                            <div className="text-sm text-green-700 mt-1">$85,000 is 15% above market average</div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                          className="flex items-start space-x-4 p-4 bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-200/50"
                        >
                          <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <ShieldIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-red-900">Risk Alert</div>
                            <div className="text-sm text-red-700 mt-1">24-month non-compete exceeds industry standard</div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
                        <span className="text-2xl font-light text-gray-900">96%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: "96%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.7 }}
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

      {/* Features Section - Simplified */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                Why choose DocQueries?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                Simple, powerful, and designed for everyone
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: ZapIcon,
                title: "Lightning Fast",
                description: "Get results in seconds, not hours. Upload and analyze any legal document instantly.",
                color: "from-blue-500 to-indigo-600"
              },
              {
                icon: LightbulbIcon,
                title: "Plain English",
                description: "Complex legal jargon translated into clear, understandable language anyone can follow.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: ShieldIcon,
                title: "Completely Secure",
                description: "Your documents are encrypted and private. We never store or share your data.",
                color: "from-green-500 to-emerald-600"
              }
            ].map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.2}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="text-center group"
                >
                  <div className="relative mb-8">
                    <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-light text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">
                    {feature.description}
                  </p>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Minimal */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-light text-white mb-4"
            >
              Trusted by thousands
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: 25000, suffix: "+", label: "Documents", icon: FileTextIcon },
              { value: 5000, suffix: "+", label: "Users", icon: UsersIcon },
              { value: 98, suffix: "%", label: "Accuracy", icon: CheckCircleIcon },
              { value: 3, suffix: "s", label: "Average Time", icon: ClockIcon }
            ].map((stat, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="text-4xl md:text-5xl font-light text-white mb-2">
                    <AnimatedCounter end={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-gray-400 font-light text-sm uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Clean and Simple */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeInWhenVisible>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight"
            >
              Ready to understand
              <span className="block font-normal">your legal documents?</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light"
            >
              Join thousands who've simplified their legal document analysis
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <UploadButton 
                  onFileSelect={handleFileSelect} 
                  variant="accent" 
                  size="lg" 
                  label="Try DocQueries Free" 
                  className="bg-white text-indigo-700 hover:bg-gray-50 shadow-2xl text-xl px-12 py-4 rounded-full font-medium border-0"
                />
              </motion.div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 text-white/60 text-sm"
            >
              No signup required • Upload and analyze instantly • 100% free
            </motion.p>
          </FadeInWhenVisible>
        </div>
      </section>
    </div>
  );
};
