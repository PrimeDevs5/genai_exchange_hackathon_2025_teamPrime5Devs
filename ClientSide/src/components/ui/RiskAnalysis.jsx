import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Shield, Eye, DollarSign, FileText, Clock } from 'lucide-react';

const RiskAnalysis = ({ document, content, summary, isOpen, onClose }) => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const riskCategories = {
    'Legal': { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
    'Financial': { icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    'Operational': { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
    'Compliance': { icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
    'Timeline': { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' }
  };

  const riskLevels = {
    'critical': { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300' },
    'high': { color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300' },
    'medium': { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-300' },
    'low': { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300' }
  };

  const analyzeRisks = async () => {
    if (!content && !summary) {
      setError('No document content available for analysis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Please analyze the following document for potential risks and concerns. Focus on identifying specific risks in these categories: Legal, Financial, Operational, Compliance, and Timeline.

Document title: ${document?.name || 'Unknown Document'}
Document summary: ${summary || 'No summary available'}
Document content: ${content || 'No content available'}

Please provide a detailed risk analysis in the following JSON format:
{
  "risks": [
    {
      "id": 1,
      "title": "Risk Title",
      "description": "Detailed description of the risk and its implications",
      "level": "critical|high|medium|low",
      "category": "Legal|Financial|Operational|Compliance|Timeline",
      "recommendation": "Specific recommendation to mitigate this risk"
    }
  ]
}

Focus on actual content from the document. Identify real risks based on what's written, not hypothetical scenarios. Be specific and actionable.`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.candidates[0]?.content?.parts[0]?.text;

      if (!analysisText) {
        throw new Error('No analysis received from API');
      }

      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse risk analysis response');
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      setRisks(analysisData.risks || []);

    } catch (error) {
      console.error('Risk analysis failed:', error);
      setError(error.message || 'Failed to analyze document risks');
      
      // Fallback: Create a basic analysis based on document type
      const fallbackRisks = generateFallbackRisks();
      setRisks(fallbackRisks);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackRisks = () => {
    const documentName = document?.name?.toLowerCase() || '';
    const documentContent = (content || summary || '').toLowerCase();

    const fallbackRisks = [];

    // Basic risk detection based on document content
    if (documentContent.includes('contract') || documentContent.includes('agreement')) {
      fallbackRisks.push({
        id: 1,
        title: "Contract Terms Review Needed",
        description: "This document contains contractual terms that require careful review to understand obligations and rights.",
        level: "medium",
        category: "Legal",
        recommendation: "Have a legal professional review all contract terms before signing."
      });
    }

    if (documentContent.includes('payment') || documentContent.includes('salary') || documentContent.includes('money')) {
      fallbackRisks.push({
        id: 2,
        title: "Financial Terms Present",
        description: "Document contains financial terms that need verification and understanding.",
        level: "medium",
        category: "Financial",
        recommendation: "Verify all financial terms and payment schedules are acceptable."
      });
    }

    if (documentContent.includes('deadline') || documentContent.includes('date') || documentContent.includes('term')) {
      fallbackRisks.push({
        id: 3,
        title: "Time-Sensitive Elements",
        description: "Document contains dates or deadlines that require attention.",
        level: "medium",
        category: "Timeline",
        recommendation: "Mark all important dates and deadlines in your calendar."
      });
    }

    // If no specific risks found, add a general review recommendation
    if (fallbackRisks.length === 0) {
      fallbackRisks.push({
        id: 1,
        title: "General Document Review",
        description: "This document requires careful review to identify potential issues or important information.",
        level: "low",
        category: "Legal",
        recommendation: "Read through the entire document carefully and consult professionals if needed."
      });
    }

    return fallbackRisks;
  };

  useEffect(() => {
    if (isOpen && (content || summary)) {
      analyzeRisks();
    }
  }, [isOpen, content, summary]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">Risk Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Document Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Document</h3>
            <p className="text-sm text-gray-600">{document?.name || 'Unknown Document'}</p>
            {summary && (
              <p className="text-sm text-gray-500 mt-2">
                {typeof summary === 'string' ? summary.substring(0, 200) + '...' : 'Document processed successfully'}
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Analyzing document risks...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 font-medium">Analysis Error</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <p className="text-red-600 text-sm mt-2">Showing basic analysis based on document content.</p>
            </div>
          )}

          {/* Risk Cards */}
          {risks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Identified Risks ({risks.length})
              </h3>
              
              {risks.map((risk) => {
                const category = riskCategories[risk.category] || riskCategories['Legal'];
                const level = riskLevels[risk.level] || riskLevels['medium'];
                const IconComponent = category.icon;

                return (
                  <div
                    key={risk.id}
                    className={`border rounded-lg p-4 ${level.border} ${level.bg}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-5 w-5 ${category.color}`} />
                        <h4 className="font-medium text-gray-900">{risk.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full bg-white ${level.color} font-medium`}>
                          {risk.level.toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${category.bg} ${category.color} font-medium`}>
                          {risk.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3">{risk.description}</p>
                    
                    {risk.recommendation && (
                      <div className="bg-white bg-opacity-50 rounded p-3">
                        <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Recommendation
                        </h5>
                        <p className="text-sm text-gray-700">{risk.recommendation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* No Risks Found */}
          {!loading && !error && risks.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Significant Risks Detected</h3>
              <p className="text-gray-600">
                The document appears to have minimal risk factors. However, always review important documents carefully.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <p className="text-xs text-gray-500">
            This analysis is AI-generated and should not replace professional legal or financial advice. 
            Always consult qualified professionals for important documents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;