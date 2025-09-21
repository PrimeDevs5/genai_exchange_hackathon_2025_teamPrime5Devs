import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Share2,
  Bookmark,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Tag,
  Calendar,
  BarChart3,
  Eye
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import ChatBot from '../components/ui/ChatBot';

// Mock document data for demonstration
const getMockDocument = (id) => ({
  id: id || '1',
  name: 'Contract_Agreement_2024.pdf',
  type: 'Contract',
  size: '2.4 MB',
  uploadDate: '2024-01-15',
  status: 'analyzed',
  confidence: 94,
  tags: ['Contract', 'Agreement', 'Legal', 'Commercial'],
  content: `
    COMMERCIAL LEASE AGREEMENT
    
    This Commercial Lease Agreement ("Agreement") is entered into on January 15, 2024, between DocQueries Analytics LLC ("Landlord") and TechStart Innovations Inc. ("Tenant").
    
    1. PREMISES
    Landlord hereby leases to Tenant the commercial space located at 123 Business Park Drive, Suite 400, consisting of approximately 2,500 square feet ("Premises").
    
    2. TERM
    The lease term shall be for a period of three (3) years, commencing on February 1, 2024, and ending on January 31, 2027.
    
    3. RENT
    Tenant agrees to pay monthly rent of $4,500, due on the first day of each month. Rent shall increase by 3% annually.
    
    4. SECURITY DEPOSIT
    Tenant shall provide a security deposit of $9,000 upon execution of this Agreement.
    
    5. USE OF PREMISES
    The Premises shall be used solely for general office purposes and technology development activities.
    
    6. MAINTENANCE AND REPAIRS
    Landlord shall maintain the structural integrity of the building. Tenant shall maintain the interior of the Premises.
    
    7. TERMINATION
    Either party may terminate this Agreement with ninety (90) days written notice.
  `,
  analysisResults: {
    keyPoints: [
      'Three-year commercial lease agreement',
      'Monthly rent: $4,500 with 3% annual increase',
      'Security deposit: $9,000 required',
      '90-day termination notice required',
      'Office and technology development use permitted'
    ],
    risks: [
      'Annual rent increase not capped beyond 3%',
      'Broad termination clause allows early exit',
      'Maintenance responsibilities split between parties',
      'No subletting provisions specified'
    ],
    compliance: [
      'Standard commercial lease structure',
      'Fair termination notice period',
      'Reasonable security deposit amount',
      'Clear use restrictions defined'
    ],
    summary: 'This is a standard three-year commercial lease agreement with competitive terms. The 3% annual rent increase is market-standard, and the 90-day termination clause provides flexibility for both parties.'
  }
});

export function DocumentViewerMultiLingual() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  // Mock API call - replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      setDocument(getMockDocument(id));
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  const getStatusBadge = (status, confidence) => {
    switch (status) {
      case 'analyzed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            {t.analysis.analyzed} ({confidence}%)
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            {t.analysis.processing}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <Clock className="w-4 h-4 mr-1" />
            {t.analysis.pending}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.header.loadingDocument}</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.header.documentNotFound}</h2>
          <p className="text-gray-600 mb-6">The requested document could not be loaded.</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.header.backToDashboard}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title={t.header.backToDashboard}
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {document.type}
                  </span>
                  <span>{document.size}</span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {document.uploadDate}
                  </span>
                  {getStatusBadge(document.status, document.confidence)}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {document.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <LanguageSelector showLabel={false} className="mr-2" />
              
              <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title={t.header.download}>
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title={t.header.share}>
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title={t.header.bookmark}>
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Document Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="xl:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Viewer Controls */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title={t.viewer.zoomOut}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title={t.viewer.zoomIn}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title={t.viewer.rotate}>
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title={t.viewer.search}>
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Document Content */}
              <div className="p-6">
                <div 
                  className="bg-white border border-gray-200 rounded-lg p-8 shadow-inner min-h-[600px]"
                  style={{ fontSize: `${zoomLevel}%` }}
                >
                  <div className="whitespace-pre-line text-gray-900 leading-relaxed">
                    {document.content}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{t.analysis.aiAnalysis}</h2>
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Analysis Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {[
                    { id: 'summary', label: t.analysis.summary, icon: FileText },
                    { id: 'risks', label: t.analysis.risks, icon: AlertTriangle },
                    { id: 'compliance', label: t.analysis.compliance, icon: CheckCircle },
                    { id: 'insights', label: t.analysis.insights, icon: BarChart3 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-1" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {showAnalysis && (
                <div className="p-6">
                  {activeTab === 'summary' && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t.analysis.documentSummary}</h3>
                      <p className="text-gray-700 mb-4">{document.analysisResults.summary}</p>
                      <h4 className="font-medium text-gray-900 mb-2">{t.analysis.keyPoints}</h4>
                      <ul className="space-y-2">
                        {document.analysisResults.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'risks' && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t.analysis.potentialRisks}</h3>
                      <ul className="space-y-2">
                        {document.analysisResults.risks.map((risk, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'compliance' && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t.analysis.complianceCheck}</h3>
                      <ul className="space-y-2">
                        {document.analysisResults.compliance.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'insights' && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t.analysis.aiInsights}</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-900">{t.analysis.confidenceScore}</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${document.confidence}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">{document.confidence}% confidence in analysis</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-900">{t.analysis.overallAssessment}</span>
                          </div>
                          <p className="text-sm text-green-700">Document appears to be well-structured with standard legal terms and reasonable conditions.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ChatBot Integration */}
      <ChatBot currentDocument={document} />
    </div>
  );
}
