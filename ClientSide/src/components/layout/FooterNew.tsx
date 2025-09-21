import React from 'react';
import { motion } from 'framer-motion';
import { 
  ScaleIcon, 
  TwitterIcon, 
  LinkedinIcon, 
  GithubIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon
} from 'lucide-react';

export const FooterNew: React.FC = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'API', href: '#api' },
        { name: 'Integrations', href: '#integrations' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Careers', href: '#careers' },
        { name: 'Press', href: '#press' },
        { name: 'Blog', href: '#blog' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#docs' },
        { name: 'Help Center', href: '#help' },
        { name: 'Legal Templates', href: '#templates' },
        { name: 'Community', href: '#community' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Cookie Policy', href: '#cookies' },
        { name: 'GDPR', href: '#gdpr' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: TwitterIcon, href: '#twitter', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: LinkedinIcon, href: '#linkedin', color: 'hover:text-blue-600' },
    { name: 'GitHub', icon: GithubIcon, href: '#github', color: 'hover:text-gray-400' }
  ];

  return (
    <footer className="bg-gradient-to-br from-legal-900 via-legal-800 to-legal-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-legal-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with Legal Tech Insights
            </h3>
            <p className="text-xl text-legal-300 mb-8">
              Get the latest updates on legal technology, AI advancements, and industry insights delivered to your inbox.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row max-w-md mx-auto gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <ScaleIcon className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  LegalClarity
                </span>
              </div>
              <p className="text-lg text-legal-300 mb-8 leading-relaxed">
                Empowering legal professionals and businesses with AI-powered document analysis. 
                Transform complex legal documents into clear, actionable insights in minutes.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-legal-300">
                  <MailIcon className="w-5 h-5 text-accent-400" />
                  <span>hello@legalclarity.com</span>
                </div>
                <div className="flex items-center space-x-3 text-legal-300">
                  <PhoneIcon className="w-5 h-5 text-accent-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-legal-300">
                  <MapPinIcon className="w-5 h-5 text-accent-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-legal-400 ${social.color} transition-all duration-300 hover:bg-white/20`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <h4 className="text-lg font-bold text-white mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-legal-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-legal-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            <div className="text-legal-400 text-sm">
              © {new Date().getFullYear()} LegalClarity. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-legal-400">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </span>
              <span>Built with ❤️ for legal professionals</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
