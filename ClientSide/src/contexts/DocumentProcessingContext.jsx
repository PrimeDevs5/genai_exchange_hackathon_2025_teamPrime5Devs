import React, { createContext, useContext, useState } from 'react';
import PDFProcessor from '../services/pdfProcessor';
import SimplePDFProcessor from '../services/simplePDFProcessor';
import TextProcessor from '../services/textProcessor';

const DocumentProcessingContext = createContext();

export const useDocumentProcessing = () => {
  const context = useContext(DocumentProcessingContext);
  if (!context) {
    throw new Error('useDocumentProcessing must be used within a DocumentProcessingProvider');
  }
  return context;
};

export const DocumentProcessingProvider = ({ children }) => {
  const [currentJob, setCurrentJob] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [processedDocuments, setProcessedDocuments] = useState([]);
  const [error, setError] = useState(null);

  const uploadAndProcessDocuments = async (files, persona, jobToBeDone) => {
    try {
      console.log('📤 DocumentProcessingContext - Starting local document processing');
      console.log('📤 Files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
      console.log('📤 Persona:', persona);
      console.log('📤 Job to be done:', jobToBeDone);
      
      setError(null);
      setProcessingStatus('uploading');

      let result;
      
      // Check file type and process accordingly
      const file = files[0]; // Process first file
      
      if (file.type === 'application/pdf') {
        console.log('📤 Processing PDF file with PDFProcessor...');
        setProcessingStatus('processing');
        try {
          result = await PDFProcessor.processDocuments(files, persona, jobToBeDone);
        } catch (pdfError) {
          console.error('❌ PDF processing failed:', pdfError.message);
          console.log('🔄 Falling back to SimplePDFProcessor...');
          
          try {
            result = await SimplePDFProcessor.processSimplePDF(file, persona, jobToBeDone);
            console.log('✅ SimplePDFProcessor succeeded as fallback');
          } catch (fallbackError) {
            console.error('❌ SimplePDFProcessor also failed:', fallbackError.message);
            
            // If both processors fail, suggest text input alternative
            const friendlyMessage = pdfError.message.includes('version') || pdfError.message.includes('Worker')
              ? 'PDF processing is temporarily unavailable due to a library issue. Please try using the "Input Text" button to paste your document content instead.'
              : `PDF processing failed: ${pdfError.message}`;
            
            throw new Error(friendlyMessage);
          }
        }
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        console.log('📤 Processing text file with TextProcessor...');
        setProcessingStatus('processing');
        
        // Read text content from file
        const textContent = await file.text();
        result = await TextProcessor.processTextDocument(textContent, file.name, persona, jobToBeDone);
      } else {
        throw new Error(`Unsupported file type: ${file.type}. Please upload PDF or text files.`);
      }

      console.log('✅ Local processing completed:', result);
      console.log('✅ Response structure:', {
        hasMetadata: !!result.metadata,
        hasExtractedSections: !!result.extracted_sections,
        hasSectionAnalysis: !!result.subsection_analysis,
        hasProcessingInfo: !!result.processing_info,
        extractedSectionsCount: result.extracted_sections?.length || 0,
        sectionAnalysisCount: result.subsection_analysis?.length || 0
      });

      setProcessingStatus('completed');
      
      // Generate a unique ID for this document
      const documentId = Date.now().toString();
      
      console.log('📋 Creating job result with ID:', documentId);
      
      // Create a job-like structure for compatibility with existing code
      const jobResult = {
        job_id: documentId,
        status: 'completed',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        result: result // The local processing result
      };
      
      setCurrentJob(jobResult);
      
      console.log('📋 Adding to processed documents...');
      
      // Add to processed documents list
      const newDocument = {
        id: documentId,
        files: files.map(f => f.name),
        persona,
        jobToBeDone,
        result: result, // Direct processing result
        completedAt: new Date(),
      };
      
      console.log('📋 New document created:', {
        id: newDocument.id,
        files: newDocument.files,
        hasResult: !!newDocument.result,
        resultStructure: {
          hasMetadata: !!newDocument.result?.metadata,
          hasExtractedSections: !!newDocument.result?.extracted_sections,
          hasSectionAnalysis: !!newDocument.result?.subsection_analysis,
        }
      });
      
      setProcessedDocuments(prev => {
        const updated = [newDocument, ...prev];
        console.log('📋 Updated processed documents list:', updated.length, 'documents');
        return updated;
      });
      
      console.log('✅ Document processing completed successfully');
      return result;
    } catch (err) {
      console.error('❌ Error in uploadAndProcessDocuments:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      setError(err.message);
      setProcessingStatus('error');
      throw err;
    }
  };

  const clearCurrentJob = () => {
    setCurrentJob(null);
    setProcessingStatus('idle');
    setError(null);
  };

  const getDocumentById = (id) => {
    console.log('🔍 DocumentProcessingContext - Getting document by ID:', id);
    console.log('🔍 Available processed documents:', processedDocuments.map(doc => ({ 
      id: doc.id, 
      files: doc.files,
      hasResult: !!doc.result 
    })));
    
    const document = processedDocuments.find(doc => doc.id === id);
    
    console.log('🔍 Found document:', document ? {
      id: document.id,
      files: document.files,
      hasResult: !!document.result,
      resultStructure: document.result ? {
        hasMetadata: !!document.result.metadata,
        hasExtractedSections: !!document.result.extracted_sections,
        hasSectionAnalysis: !!document.result.subsection_analysis,
      } : 'No result'
    } : 'Document not found');
    
    return document;
  };

  const removeDocument = async (id) => {
    try {
      console.log('🗑️ Removing document:', id);
      setProcessedDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
      // Still remove from local state even if API call fails
      setProcessedDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const value = {
    currentJob,
    processingStatus,
    processedDocuments,
    error,
    uploadAndProcessDocuments,
    clearCurrentJob,
    getDocumentById,
    removeDocument,
  };

  return (
    <DocumentProcessingContext.Provider value={value}>
      {children}
    </DocumentProcessingContext.Provider>
  );
};