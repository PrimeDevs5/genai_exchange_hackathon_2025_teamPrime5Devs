import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, UploadIcon, FileTextIcon, PlusIcon, ChevronDownIcon, EyeIcon, DownloadIcon, TrashIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { Tag } from '../components/ui/Tag';
import { UploadButton } from '../components/ui/UploadButton';
import { DocumentInput } from '../components/ui/DocumentInput';
import { useDocumentProcessing } from '../contexts/DocumentProcessingContext';

// Mock data for documents (fallback when no processed documents exist)
const mockDocuments = [{
  id: '1',
  name: 'Employment_Contract_2023.pdf',
  type: 'Contract',
  uploadDate: '2023-06-15',
  status: 'complete',
  progress: 100,
  pages: 24
}, {
  id: '2',
  name: 'NDA_Acme_Corp.docx',
  type: 'NDA',
  uploadDate: '2023-06-10',
  status: 'complete',
  progress: 100,
  pages: 8
}, {
  id: '3',
  name: 'Service_Agreement_Q2.pdf',
  type: 'Agreement',
  uploadDate: '2023-06-05',
  status: 'processing',
  progress: 65,
  pages: 32
}, {
  id: '4',
  name: 'Lease_Amendment_2023.pdf',
  type: 'Lease',
  uploadDate: '2023-06-01',
  status: 'pending',
  progress: 0,
  pages: 12
}];
export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const { processedDocuments, processingStatus, currentJob, removeDocument } = useDocumentProcessing();
  
  console.log('Dashboard - Processed Documents:', processedDocuments);
  console.log('Dashboard - Processing Status:', processingStatus);
  console.log('Dashboard - Current Job:', currentJob);
  
  const handleFileSelect = result => {
    console.log('Dashboard - File processed result:', result);
    // The DocumentProcessingContext already handles adding to processedDocuments
    // No need to manually manage documents array anymore
  };

  // Convert processed documents to dashboard format
  const getDocumentCards = () => {
    const processedCards = processedDocuments.map(doc => {
      console.log('Dashboard - Converting document:', doc);
      
      return {
        id: doc.id,
        name: doc.files?.join(', ') || 'Unknown Document',
        type: 'Analysis',
        uploadDate: doc.completedAt ? new Date(doc.completedAt).toLocaleDateString() : new Date().toLocaleDateString(),
        status: 'complete', // Processed documents are always complete
        progress: 100,
        pages: doc.result?.metadata?.total_pages || 'N/A',
        isProcessed: true, // Flag to identify processed documents
        hasGeminiData: !!doc.result // Check if we have API result data
      };
    });

    // Add current processing job if it exists
    if (currentJob && processingStatus === 'processing') {
      processedCards.unshift({
        id: currentJob.job_id || 'current',
        name: 'Processing...',
        type: 'Processing',
        uploadDate: new Date().toLocaleDateString(),
        status: 'processing',
        progress: 50,
        pages: 'N/A',
        isProcessed: false,
        hasGeminiData: false
      });
    }

    // If no processed documents, show mock data for demo
    if (processedCards.length === 0) {
      console.log('Dashboard - No processed documents, showing mock data');
      return mockDocuments;
    }

    return processedCards;
  };

  const documents = getDocumentCards();
  const filters = ['All', 'Contracts', 'NDAs', 'Agreements', 'Leases', 'Analysis'];
  return <div className="bg-neutral-50 min-h-screen pb-12">
      <div className="bg-white border-b border-neutral-200 mb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Your Documents
              </h1>
              <p className="mt-1 text-neutral-600">
                Upload, process, and review your legal documents
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <UploadButton onFileSelect={handleFileSelect} variant="accent" label="Upload PDF" />
              <DocumentInput onDocumentSubmit={handleFileSelect} />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <SearchBar placeholder="Search documents..." value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-neutral-700">Filter:</span>
            <div className="relative">
              <button className="btn btn-outline btn-sm flex items-center">
                {selectedFilter} <ChevronDownIcon className="ml-2 h-4 w-4" />
              </button>
              {/* Filter dropdown would go here */}
            </div>
          </div>
        </div>
        {/* Document grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upload card */}
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <PlusIcon className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Add a document
            </h3>
            <p className="text-neutral-600 text-sm mb-4">
              Upload a PDF file or input text to analyze and simplify
            </p>
            <div className="flex space-x-2">
              <UploadButton onFileSelect={handleFileSelect} variant="outline" size="sm" label="Upload PDF" />
              <DocumentInput onDocumentSubmit={handleFileSelect} />
            </div>
          </div>
          {/* Document cards */}
          {documents.map(doc => <Card key={doc.id} hover className="overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded bg-primary-100 flex items-center justify-center">
                    <FileTextIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-neutral-900 truncate max-w-[180px]">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {doc.pages} pages • Uploaded {doc.uploadDate}
                    </p>
                  </div>
                </div>
                <Tag label={doc.type} color={doc.type === 'Contract' ? 'blue' : doc.type === 'NDA' ? 'purple' : doc.type === 'Agreement' ? 'green' : doc.type === 'Analysis' ? 'blue' : 'gray'} />
              </div>
              {doc.status !== 'complete' ? <ProgressIndicator progress={doc.progress} status={doc.status} className="mb-4" /> : <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-700">
                    {doc.isProcessed 
                      ? 'Document analysis completed successfully. View to see detailed results.'
                      : 'This document contains an automatic renewal clause that requires 30 days notice for cancellation.'
                    }
                  </p>
                </div>}
              <div className="flex justify-between items-center">
                {/* Only show View button for completed documents with Gemini data */}
                {doc.status === 'complete' && doc.hasGeminiData ? (
                  <Link to={`/document/${doc.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View Analysis
                  </Link>
                ) : doc.status === 'complete' && !doc.isProcessed ? (
                  <Link to={`/document/${doc.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Link>
                ) : (
                  <div className="text-neutral-400 text-sm font-medium flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {doc.status === 'processing' ? 'Processing...' : 'Preparing...'}
                  </div>
                )}
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-neutral-100">
                    <DownloadIcon className="h-4 w-4 text-neutral-700" />
                  </button>
                  {doc.isProcessed && (
                    <button 
                      onClick={() => {
                        console.log('Dashboard - Removing document:', doc.id);
                        removeDocument(doc.id);
                      }}
                      className="p-2 rounded-full hover:bg-neutral-100"
                    >
                      <TrashIcon className="h-4 w-4 text-neutral-700" />
                    </button>
                  )}
                </div>
              </div>
            </Card>)}
        </div>
        {/* Recent activity section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Recent Activity
          </h2>
          <Card>
            <div className="divide-y divide-neutral-200">
              {[1, 2, 3].map(i => <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-200"></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-900">
                          Document{' '}
                          {i === 1 ? 'processed' : i === 2 ? 'uploaded' : 'shared'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {i === 1 ? 'NDA_Acme_Corp.docx' : i === 2 ? 'Service_Agreement_Q2.pdf' : 'Employment_Contract_2023.pdf'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {i === 1 ? '2 hours ago' : i === 2 ? 'Yesterday' : '3 days ago'}
                    </span>
                  </div>
                </div>)}
            </div>
          </Card>
        </div>
      </div>
    </div>;
};