import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Upload,
  FileText,
  Search,
  TrendingUp,
  Clock,
  Star,
  Filter,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Plus,
  BarChart3,
  Calendar,
  Users,
  Shield
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  lastViewed?: string;
  status: 'analyzed' | 'processing' | 'pending';
  confidence: number;
  tags: string[];
}

export function DashboardNew() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'analyzed' | 'processing' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      setDocuments([
        {
          id: '1',
          name: 'Contract_Agreement_2024.pdf',
          type: 'Contract',
          size: '2.4 MB',
          uploadDate: '2024-01-15',
          lastViewed: '2024-01-16',
          status: 'analyzed',
          confidence: 94,
          tags: ['Contract', 'Agreement', 'Legal']
        },
        {
          id: '2',
          name: 'Legal_Brief_Case_001.pdf',
          type: 'Brief',
          size: '1.8 MB',
          uploadDate: '2024-01-14',
          status: 'processing',
          confidence: 0,
          tags: ['Brief', 'Case Study']
        },
        {
          id: '3',
          name: 'Terms_Conditions_Update.pdf',
          type: 'Terms',
          size: '956 KB',
          uploadDate: '2024-01-13',
          lastViewed: '2024-01-15',
          status: 'analyzed',
          confidence: 87,
          tags: ['Terms', 'Policy']
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: 'Total Documents',
      value: '247',
      change: '+12%',
      icon: FileText,
      color: 'text-primary-600'
    },
    {
      label: 'Analyzed Today',
      value: '18',
      change: '+8%',
      icon: BarChart3,
      color: 'text-accent-600'
    },
    {
      label: 'Processing',
      value: '3',
      change: '-2%',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      label: 'Avg. Confidence',
      value: '91%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  const getStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case 'analyzed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Analyzed ({confidence}%)
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Document Dashboard</h1>
              <p className="text-gray-600">Manage and analyze your legal documents with AI-powered insights</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Document
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="analyzed">Analyzed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.02)' }}
                  className="p-6 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Uploaded {doc.uploadDate}</span>
                          {doc.lastViewed && (
                            <>
                              <span>•</span>
                              <span>Last viewed {doc.lastViewed}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {getStatusBadge(doc.status, doc.confidence)}
                          <div className="flex space-x-1">
                            {doc.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/document/${doc.id}`}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredDocuments.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Batch Analysis',
              description: 'Analyze multiple documents at once',
              icon: BarChart3,
              color: 'bg-blue-500'
            },
            {
              title: 'Schedule Review',
              description: 'Set up automated document reviews',
              icon: Calendar,
              color: 'bg-purple-500'
            },
            {
              title: 'Team Collaboration',
              description: 'Share documents with your team',
              icon: Users,
              color: 'bg-green-500'
            }
          ].map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600">{action.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
