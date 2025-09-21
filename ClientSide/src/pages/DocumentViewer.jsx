import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon, ShareIcon, BookmarkIcon, PanelLeftIcon, PanelRightIcon, SearchIcon, ChevronDownIcon, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useDocumentProcessing } from '../contexts/DocumentProcessingContext.jsx';
import ChatBot from '../components/ui/ChatBot';
import RiskAnalysis from '../components/ui/RiskAnalysis';
import JobStatusTracker from '../components/ui/JobStatusTracker';

// Rate-limited translation wrapper
const safeTranslateResponse = async (translateResponse, text, targetLanguage, delay = 1500) => {
  return new Promise(async (resolve) => {
    try {
      await new Promise(r => setTimeout(r, delay)); // Rate limiting delay
      const result = await translateResponse(text, targetLanguage);
      resolve(result);
    } catch (error) {
      console.warn('Translation failed, using original text:', error.message);
      resolve(text); // Return original text on error
    }
  });
};

// Function to generate document content from API results
const generateDocumentContent = async (apiResult, t, translateResponse, currentLanguage) => {
  console.log('🏗️ generateDocumentContent - Starting content generation');
  console.log('🏗️ Input apiResult:', apiResult ? {
    hasMetadata: !!apiResult.metadata,
    hasExtractedSections: !!apiResult.extracted_sections,
    hasSectionAnalysis: !!apiResult.subsection_analysis,
    hasProcessingInfo: !!apiResult.processing_info,
    keys: Object.keys(apiResult)
  } : 'No apiResult');

  if (!apiResult) {
    console.log('🏗️ generateDocumentContent - No API result, using default content');
    return getDefaultDocumentContent(t);
  }

  try {
    // Handle direct API response (the actual structure we received)
    const result = apiResult.result || apiResult;
    
    console.log('🏗️ generateDocumentContent - Processing result:', {
      isDirectResult: !apiResult.result,
      hasMetadata: !!result.metadata,
      hasExtractedSections: !!result.extracted_sections,
      hasSectionAnalysis: !!result.subsection_analysis,
      extractedSectionsCount: result.extracted_sections?.length || 0
    });
    
    let content = '';
    
    // Add metadata section
    if (result.metadata) {
      console.log('🏗️ generateDocumentContent - Adding metadata section');
      content += `<div class="metadata-section mb-6 p-4 bg-blue-50 rounded-lg">`;
      content += `<h2 class="text-xl font-bold mb-3 text-blue-900">Document Information</h2>`;
      content += `<p><strong>Document(s):</strong> ${result.metadata.input_documents?.join(', ') || 'N/A'}</p>`;
      content += `<p><strong>Analysis Persona:</strong> ${result.metadata.persona || 'N/A'}</p>`;
      content += `<p><strong>Analysis Goal:</strong> ${result.metadata.job_to_be_done || 'N/A'}</p>`;
      content += `<p><strong>Processed At:</strong> ${new Date(result.metadata.processing_timestamp).toLocaleString()}</p>`;
      content += `</div>`;
    }

    // Add extracted sections
    if (result.extracted_sections && result.extracted_sections.length > 0) {
      content += `<div class="extracted-sections mb-6">`;
      content += `<h2 class="text-xl font-bold mb-3 text-gray-900">Key Sections Identified</h2>`;
      
      // Sort by importance rank
      const sortedSections = [...result.extracted_sections].sort((a, b) => a.importance_rank - b.importance_rank);
      
      sortedSections.forEach(section => {
        const importanceColor = section.importance_rank === 1 ? 'bg-red-50 border-red-200' : 
                               section.importance_rank === 2 ? 'bg-yellow-50 border-yellow-200' : 
                               'bg-green-50 border-green-200';
        
        content += `<div class="section-item mb-3 p-3 border rounded-lg ${importanceColor}">`;
        content += `<h3 class="font-semibold text-lg">${section.section_title}</h3>`;
        content += `<div class="flex justify-between items-center mt-2">`;
        content += `<span class="text-sm text-gray-600">Document: ${section.document}</span>`;
        content += `<div class="flex space-x-2">`;
        content += `<span class="text-xs px-2 py-1 rounded bg-gray-200">Page ${section.page_number}</span>`;
        content += `<span class="text-xs px-2 py-1 rounded ${section.importance_rank === 1 ? 'bg-red-200 text-red-800' : 
                                                              section.importance_rank === 2 ? 'bg-yellow-200 text-yellow-800' : 
                                                              'bg-green-200 text-green-800'}">Priority ${section.importance_rank}</span>`;
        content += `</div></div></div>`;
      });
      content += `</div>`;
    }

    // Add detailed analysis from subsection_analysis
    if (result.subsection_analysis && result.subsection_analysis.length > 0) {
      content += `<div class="detailed-analysis mb-6">`;
      content += `<h2 class="text-xl font-bold mb-3 text-gray-900">Detailed Document Content</h2>`;
      
      // Debug: Log the structure of the first analysis item
      console.log('🔍 First subsection_analysis item structure:', Object.keys(result.subsection_analysis[0]));
      console.log('🔍 Sample analysis item:', result.subsection_analysis[0]);
      
      result.subsection_analysis.forEach((analysis, index) => {
        // Log content lengths for debugging
        console.log(`📊 Section ${index + 1} content lengths:`, {
          refined_text: analysis.refined_text?.length || 0,
          original_text: analysis.original_text?.length || 0,
          extracted_text: analysis.extracted_text?.length || 0,
          content: analysis.content?.length || 0
        });
        
        content += `<div class="analysis-item mb-4 p-4 border rounded-lg bg-gray-50">`;
        content += `<h3 class="font-semibold text-lg mb-2">Section ${index + 1}</h3>`;
        
        // Show refined_text with full content
        if (analysis.refined_text) {
          content += `<div class="refined-text mb-3">`;
          content += `<h4 class="font-medium text-md mb-2 text-gray-700">Processed Content:</h4>`;
          content += `<div class="whitespace-pre-line text-gray-800 leading-relaxed">${analysis.refined_text}</div>`;
          content += `</div>`;
        }
        
        // Show original_text if available for comparison
        if (analysis.original_text && analysis.original_text !== analysis.refined_text) {
          content += `<div class="original-text mb-3 p-3 bg-blue-50 rounded">`;
          content += `<h4 class="font-medium text-md mb-2 text-blue-700">Original Text:</h4>`;
          content += `<div class="whitespace-pre-line text-blue-800 text-sm leading-relaxed">${analysis.original_text}</div>`;
          content += `</div>`;
        }
        
        // Show extracted_text if available
        if (analysis.extracted_text && analysis.extracted_text !== analysis.refined_text && analysis.extracted_text !== analysis.original_text) {
          content += `<div class="extracted-text mb-3 p-3 bg-green-50 rounded">`;
          content += `<h4 class="font-medium text-md mb-2 text-green-700">Extracted Text:</h4>`;
          content += `<div class="whitespace-pre-line text-green-800 text-sm leading-relaxed">${analysis.extracted_text}</div>`;
          content += `</div>`;
        }
        
        // Show any additional content fields
        if (analysis.content && analysis.content !== analysis.refined_text) {
          content += `<div class="additional-content mb-3 p-3 bg-purple-50 rounded">`;
          content += `<h4 class="font-medium text-md mb-2 text-purple-700">Additional Content:</h4>`;
          content += `<div class="whitespace-pre-line text-purple-800 text-sm leading-relaxed">${analysis.content}</div>`;
          content += `</div>`;
        }
        
        // Show analysis summary or insights if available
        if (analysis.summary || analysis.insights || analysis.key_points) {
          content += `<div class="analysis-insights mb-3 p-3 bg-yellow-50 rounded">`;
          content += `<h4 class="font-medium text-md mb-2 text-yellow-700">Analysis Insights:</h4>`;
          if (analysis.summary) content += `<p class="text-yellow-800 text-sm mb-2"><strong>Summary:</strong> ${analysis.summary}</p>`;
          if (analysis.insights) content += `<p class="text-yellow-800 text-sm mb-2"><strong>Insights:</strong> ${analysis.insights}</p>`;
          if (analysis.key_points) content += `<p class="text-yellow-800 text-sm mb-2"><strong>Key Points:</strong> ${analysis.key_points}</p>`;
          content += `</div>`;
        }
        
        // Default fallback if no content available
        if (!analysis.refined_text && !analysis.original_text && !analysis.extracted_text && !analysis.content) {
          content += `<div class="text-gray-500 italic">No detailed content available for this section.</div>`;
        }
        
        content += `<div class="mt-2 text-sm text-gray-600">`;
        content += `<span>Document: ${analysis.document}</span> | `;
        content += `<span>Page: ${analysis.page_number}</span>`;
        if (analysis.section_type) content += ` | <span>Type: ${analysis.section_type}</span>`;
        if (analysis.confidence_score) content += ` | <span>Confidence: ${Math.round(analysis.confidence_score * 100)}%</span>`;
        content += `</div></div>`;
      });
      content += `</div>`;
    }

    // Add processing information
    if (result.processing_info) {
      content += `<div class="processing-info mt-6 p-3 bg-gray-100 rounded-lg">`;
      content += `<h3 class="font-semibold mb-2">Processing Information</h3>`;
      content += `<p><strong>Analysis Type:</strong> ${result.processing_info.analysis_type}</p>`;
      content += `<p><strong>Files Processed:</strong> ${result.processing_info.total_files} (${result.processing_info.files_processed?.join(', ')})</p>`;
      content += `<p><strong>Processed At:</strong> ${new Date(result.processing_info.processed_at).toLocaleString()}</p>`;
      content += `</div>`;
    }

    // If no content was generated, use default
    if (!content.trim()) {
      content = getDefaultDocumentContent(t);
    }

    // Translate content if language is not English
    console.log('🏗️ generateDocumentContent - Content generation completed, length:', content.length);

    // Enable translation for smaller content to avoid rate limits
    const skipContentTranslation = content.length > 10000 || currentLanguage === 'en';
    
    if (!skipContentTranslation && translateResponse && currentLanguage !== 'en') {
      try {
        console.log('🏗️ generateDocumentContent - Starting content translation');
        const translatedContent = await translateResponse(content, currentLanguage);
        console.log('🏗️ generateDocumentContent - Content translation completed');
        return translatedContent;
      } catch (error) {
        console.error('🏗️ generateDocumentContent - Translation failed:', error);
        return content; // Return original content if translation fails
      }
    } else {
      console.log('🏗️ generateDocumentContent - Skipping content translation (length:', content.length, ', language:', currentLanguage, ')');
    }

    return content;
  } catch (error) {
    console.error('Error generating document content:', error);
    return getDefaultDocumentContent(t);
  }
};

// Function to generate document summary from API results
const generateDocumentSummary = async (apiResult, t, translateResponse, currentLanguage) => {
  if (!apiResult) {
    return getDefaultDocumentSummary(t);
  }

  try {
    // Handle direct API response (the actual structure we received)
    const result = apiResult.result || apiResult;
    const summaryItems = [];

    // Create summary from extracted sections
    if (result.extracted_sections && result.extracted_sections.length > 0) {
      // Sort by importance rank
      const sortedSections = [...result.extracted_sections].sort((a, b) => a.importance_rank - b.importance_rank);
      
      sortedSections.forEach((section, index) => {
        const importance = section.importance_rank === 1 ? 'high' : 
                          section.importance_rank === 2 ? 'medium' : 'low';
        
        summaryItems.push({
          title: section.section_title || `Section ${index + 1}`,
          content: `Key section identified in ${section.document} on page ${section.page_number}. Priority level ${section.importance_rank}.`,
          importance: importance,
          section: `Page ${section.page_number}`
        });
      });
    }

    // Add summary from subsection analysis if we have meaningful content
    if (result.subsection_analysis && result.subsection_analysis.length > 0) {
      result.subsection_analysis.forEach((analysis, index) => {
        if (analysis.refined_text && analysis.refined_text.length > 0) {
          // Create a preview of the content (first 200 characters)
          const preview = analysis.refined_text.length > 200 
            ? analysis.refined_text.substring(0, 200) + '...' 
            : analysis.refined_text;

          summaryItems.push({
            title: `Document Content ${index + 1}`,
            content: preview,
            importance: 'medium',
            section: `Page ${analysis.page_number}`
          });
        }
      });
    }

    // Add processing summary
    if (result.processing_info) {
      summaryItems.push({
        title: 'Processing Summary',
        content: `${result.processing_info.analysis_type} completed for ${result.processing_info.total_files} file(s): ${result.processing_info.files_processed?.join(', ')}`,
        importance: 'low',
        section: 'Info'
      });
    }

    // If we have metadata, add it as a summary item
    if (result.metadata) {
      summaryItems.push({
        title: 'Analysis Overview',
        content: `Performed ${result.metadata.job_to_be_done || 'document analysis'} from ${result.metadata.persona || 'system'} perspective on ${result.metadata.input_documents?.length || 0} document(s).`,
        importance: 'medium',
        section: 'Overview'
      });
    }

    // Enable translation for summary items but limit to avoid rate limits
    const skipTranslation = summaryItems.length > 6 || currentLanguage === 'en';
    
    console.log(`📋 generateDocumentSummary - Generated ${summaryItems.length} summary items, skipTranslation: ${skipTranslation}`);
    
    if (!skipTranslation && translateResponse && currentLanguage !== 'en' && summaryItems.length > 0) {
      console.log(`📋 generateDocumentSummary - Starting translation for ${summaryItems.length} items`);
      for (let i = 0; i < summaryItems.length; i++) {
        const item = summaryItems[i];
        try {
          console.log(`📋 Translating item ${i + 1}/${summaryItems.length}: ${item.title.substring(0, 30)}...`);
          item.title = await safeTranslateResponse(translateResponse, item.title, t.language, i * 1000);
          item.content = await safeTranslateResponse(translateResponse, item.content, t.language, i * 1000 + 500);
        } catch (error) {
          console.error(`📋 Translation failed for summary item ${i + 1}:`, error);
          // Continue with original text if translation fails
        }
      }
      console.log(`📋 generateDocumentSummary - Translation completed`);
    } else {
      console.log(`📋 generateDocumentSummary - Skipping translation (items: ${summaryItems.length}, language: ${currentLanguage})`);
    }

    // If no summary items were generated, use default summary
    if (summaryItems.length === 0) {
      return getDefaultDocumentSummary(t);
    }

    // Limit to top 6 summary items for better UX
    return summaryItems.slice(0, 6);
  } catch (error) {
    console.error('Error generating document summary:', error);
    return getDefaultDocumentSummary(t);
  }
};

// Default/fallback document content (existing mock data)
const getDefaultDocumentContent = (t) => {
  return `
    <h2>${t.documentContent.employmentAgreementTitle}</h2>
    <p>${t.documentContent.employmentAgreementIntro}</p>
    <p>${t.documentContent.whereasCompany}</p>
    <p>${t.documentContent.whereasEmployee}</p>
    <h3>${t.documentContent.termOfEmploymentTitle}</h3>
    <p>${t.documentContent.termOfEmploymentContent}</p>
    <h3>${t.documentContent.positionAndDutiesTitle}</h3>
    <p><strong>${t.documentContent.positionSubtitle}</strong> ${t.documentContent.positionContent}</p>
    <p><strong>${t.documentContent.dutiesSubtitle}</strong> ${t.documentContent.dutiesContent}</p>
    <h3>${t.documentContent.compensationAndBenefitsTitle}</h3>
    <p><strong>${t.documentContent.baseSalarySubtitle}</strong> ${t.documentContent.baseSalaryContent}</p>
    <p><strong>${t.documentContent.annualBonusSubtitle}</strong> ${t.documentContent.annualBonusContent}</p>
  `;
};

const getDefaultDocumentSummary = (t) => {
  return [
    {
      title: t.summaryContent.employmentTerm,
      content: t.summaryContent.employmentTermDesc,
      importance: 'high',
      section: '1.1'
    },
    {
      title: t.summaryContent.positionReporting,
      content: t.summaryContent.positionReportingDesc,
      importance: 'medium',
      section: '2.1'
    },
    {
      title: t.summaryContent.exclusivityReq,
      content: t.summaryContent.exclusivityReqDesc,
      importance: 'high',
      section: '2.2'
    },
    {
      title: t.summaryContent.compensation,
      content: t.summaryContent.compensationDesc,
      importance: 'medium',
      section: '3.1-3.2'
    }
  ];
};

const mockDocument = {
  id: '1',
  name: 'Employment_Contract_2023.pdf',
  type: 'Contract',
  uploadDate: '2023-06-15',
  pages: 24
};

export const DocumentViewer = () => {
  const { id } = useParams();
  const { t, translateResponse, currentLanguage } = useLanguage();
  const { getDocumentById } = useDocumentProcessing();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRiskAnalysisOpen, setIsRiskAnalysisOpen] = useState(false);
  const [document, setDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [documentSummary, setDocumentSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load document data based on ID
  useEffect(() => {
    const loadDocument = async () => {
      console.log('📄 DocumentViewer - Loading document with ID:', id);
      setIsLoading(true);
      
      // Try to find processed document by ID
      const processedDoc = getDocumentById(id);
      
      console.log('📄 DocumentViewer - Retrieved document:', processedDoc ? {
        id: processedDoc.id,
        files: processedDoc.files,
        hasResult: !!processedDoc.result,
        resultKeys: processedDoc.result ? Object.keys(processedDoc.result) : []
      } : 'No document found');
      
      if (processedDoc && processedDoc.result) {
        console.log('📄 DocumentViewer - Processing real API result...');
        console.log('📄 API Result structure:', {
          hasMetadata: !!processedDoc.result.metadata,
          hasExtractedSections: !!processedDoc.result.extracted_sections,
          hasSectionAnalysis: !!processedDoc.result.subsection_analysis,
          hasProcessingInfo: !!processedDoc.result.processing_info,
          extractedSectionsCount: processedDoc.result.extracted_sections?.length || 0,
          sectionAnalysisCount: processedDoc.result.subsection_analysis?.length || 0
        });
        
        // Use processed document from backend
        const content = await generateDocumentContent(processedDoc.result, t, translateResponse, currentLanguage);
        const summary = await generateDocumentSummary(processedDoc.result, t, translateResponse, currentLanguage);
        
        console.log('📄 DocumentViewer - Generated content length:', content.length);
        console.log('📄 DocumentViewer - Generated summary items:', summary.length);
        
        setDocument({
          id: processedDoc.id,
          name: processedDoc.files?.join(', ') || 'Processed Document',
          type: 'Processed Document',
          uploadDate: processedDoc.completedAt?.toLocaleDateString() || new Date().toLocaleDateString(),
          pages: processedDoc.result?.metadata?.total_pages || 'N/A'
        });
        
        setDocumentContent(content);
        setDocumentSummary(summary);
      } else {
        console.log('📄 DocumentViewer - No processed document found, using mock data');
        // Use mock/default document
        setDocument(mockDocument);
        setDocumentContent(getDefaultDocumentContent(t));
        setDocumentSummary(getDefaultDocumentSummary(t));
      }
      
      setIsLoading(false);
      console.log('📄 DocumentViewer - Document loading completed');
    };

    loadDocument();
  }, [id, getDocumentById, t, translateResponse]);

  // Update content when language changes
  useEffect(() => {
    const updateContentForLanguage = async () => {
      if (!document) return;
      
      console.log('🌐 DocumentViewer - Updating content for language change');
      
      const processedDoc = getDocumentById(id);
      if (processedDoc && processedDoc.result) {
        console.log('🌐 DocumentViewer - Regenerating content for processed document');
        const content = await generateDocumentContent(processedDoc.result, t, translateResponse, currentLanguage);
        const summary = await generateDocumentSummary(processedDoc.result, t, translateResponse, currentLanguage);
        setDocumentContent(content);
        setDocumentSummary(summary);
        console.log('🌐 DocumentViewer - Content updated for language change');
      } else {
        console.log('🌐 DocumentViewer - Using default content for language change');
        setDocumentContent(getDefaultDocumentContent(t));
        setDocumentSummary(getDefaultDocumentSummary(t));
      }
    };

    updateContentForLanguage();
  }, [currentLanguage, t, translateResponse, id, getDocumentById, document]);
  
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  const highlightSection = (section) => {
    setActiveSection(section === activeSection ? null : section);
    // In a real app, you would scroll to the section in the document
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t.loadingDocument}</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t.documentNotFound}</p>
          <p className="text-gray-500 text-sm mt-2">{t.documentNotFoundDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-12">
      {/* Add Job Status Tracker for processed documents */}
      {getDocumentById(id) && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <JobStatusTracker jobId={id} />
        </div>
      )}

      {/* Document header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()} 
                className="mr-4 p-2 rounded-full hover:bg-neutral-100" 
                title={t.backToDashboard}
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-700" />
              </button>
              <div>
                <div className="flex items-center">
                  <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mr-3">
                    {document.name}
                  </h1>
                  <Tag label={document.type} color="blue" />
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {document.pages} pages • uploaded {document.uploadDate}
                </p>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              {/* Language Selector */}
              <LanguageSelector showLabel={false} className="mr-2" />
              
              <button 
                onClick={() => setIsRiskAnalysisOpen(true)}
                className="btn btn-outline btn-sm flex items-center hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk Analysis
              </button>
              <button className="btn btn-outline btn-sm flex items-center" title={t.downloadDocument}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                {t.downloadDocument}
              </button>
              <button className="btn btn-outline btn-sm flex items-center" title={t.shareDocument}>
                <ShareIcon className="h-4 w-4 mr-2" />
                {t.shareDocument}
              </button>
              <button className="btn btn-primary btn-sm flex items-center" title={t.bookmarkDocument}>
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row">
          {/* Document content */}
          <div className={`w-full ${isPanelOpen ? 'lg:w-7/12' : 'lg:w-full'} transition-all duration-300`}>
            <Card className="mb-6 lg:mb-0 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {t.originalDocument}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      className="input py-1 px-3 text-sm" 
                      placeholder={t.searchPlaceholder} 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <SearchIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                  <button 
                    className="p-2 rounded-full hover:bg-neutral-100 lg:hidden" 
                    onClick={togglePanel}
                  >
                    {isPanelOpen ? (
                      <PanelRightIcon className="h-4 w-4 text-neutral-600" />
                    ) : (
                      <PanelLeftIcon className="h-4 w-4 text-neutral-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{
                __html: documentContent
              }} />
            </Card>
          </div>

          {/* Analysis panel */}
          {isPanelOpen && (
            <div className="w-full lg:w-5/12 lg:pl-6 mt-6 lg:mt-0">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {t.analysisResults}
                  </h2>
                  <button 
                    className="p-2 rounded-full hover:bg-neutral-100 lg:hidden" 
                    onClick={togglePanel}
                  >
                    <PanelRightIcon className="h-4 w-4 text-neutral-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {documentSummary.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        activeSection === item.section 
                          ? 'bg-primary-50 border-primary-200' 
                          : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                      }`}
                      onClick={() => highlightSection(item.section)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-neutral-900 text-sm">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Tag 
                            label={item.importance} 
                            color={item.importance === 'high' ? 'red' : item.importance === 'medium' ? 'yellow' : 'green'} 
                            size="sm" 
                          />
                          <button 
                            className="text-xs text-neutral-500 hover:text-neutral-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              highlightSection(item.section);
                            }}
                          >
                            {t.summaryContent.goToSection} {item.section}
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Risk Analysis Modal */}
      <RiskAnalysis 
        document={document}
        content={documentContent}
        summary={documentSummary}
        isOpen={isRiskAnalysisOpen}
        onClose={() => setIsRiskAnalysisOpen(false)}
      />
      
      {/* ChatBot Component */}
      <ChatBot 
        document={document} 
        content={documentContent}
        summary={documentSummary}
      />
    </div>
  );
};