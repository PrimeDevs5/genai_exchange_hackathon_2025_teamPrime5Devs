import React, { useState } from 'react';
import { FileText, Upload, X, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useDocumentProcessing } from '../../contexts/DocumentProcessingContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const DocumentInput = ({
  onDocumentSubmit,
  className = '',
}) => {
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [persona, setPersona] = useState('');
  const [jobToBeDone, setJobToBeDone] = useState('');
  
  const { uploadAndProcessDocuments, processingStatus, currentJob, error } = useDocumentProcessing();
  const { t } = useLanguage();

  const handleClick = () => {
    setShowInputDialog(true);
  };

  const handleSubmit = async () => {
    if (!documentText.trim() || !persona.trim() || !jobToBeDone.trim()) {
      return;
    }

    try {
      // Create a mock file-like object from the text input
      const textFile = new File(
        [documentText], 
        documentTitle || 'Document.txt', 
        { type: 'text/plain' }
      );

      const result = await uploadAndProcessDocuments([textFile], persona, jobToBeDone);
      
      // Call the parent callback if provided
      if (onDocumentSubmit) {
        onDocumentSubmit(result);
      }
      
      // Reset form
      setDocumentText('');
      setDocumentTitle('');
      setPersona('');
      setJobToBeDone('');
      setShowInputDialog(false);
    } catch (err) {
      console.error('Document processing failed:', err);
    }
  };

  const closeDialog = () => {
    setShowInputDialog(false);
    setDocumentText('');
    setDocumentTitle('');
    setPersona('');
    setJobToBeDone('');
  };

  const loadSampleDocument = () => {
    setDocumentTitle('Software Development Agreement');
    setDocumentText(`**SOFTWARE DEVELOPMENT AGREEMENT**

THIS SOFTWARE DEVELOPMENT AGREEMENT (this "Agreement") is made and entered into as of December 1, 2024 (the "Effective Date"), by and between TECHCORP SOLUTIONS LLC, a Delaware limited liability company ("Company"), and INNOVATION LABS INC., a California corporation ("Developer").

**1. SCOPE OF WORK**

1.1 Development Services. Developer shall provide software development services ("Services") to Company as described in Exhibit A attached hereto and incorporated herein by reference.

1.2 Timeline. Developer shall complete the Services according to the timeline set forth in Exhibit C, with final delivery no later than June 30, 2025.

**2. COMPENSATION**

2.1 Development Fee. In consideration for the Services, Company shall pay Developer a total fee of $150,000 (the "Development Fee"), payable according to the following schedule:
   (a) $30,000 upon execution of this Agreement
   (b) $40,000 upon completion of Phase 1
   (c) $40,000 upon completion of Phase 2
   (d) $25,000 upon completion of Phase 3
   (e) $15,000 upon final delivery and acceptance

2.2 Payment Terms. All payments shall be made within thirty (30) days after Company's receipt of Developer's invoice.

**3. INTELLECTUAL PROPERTY**

3.1 Work Product. All software, code, designs, documentation, and other work product created by Developer in the performance of the Services ("Work Product") shall be deemed "work made for hire" under the United States Copyright Act.

**4. CONFIDENTIALITY**

4.1 Confidential Information. Each party acknowledges that it may receive confidential and proprietary information of the other party ("Confidential Information").

**5. WARRANTIES AND REPRESENTATIONS**

5.1 Developer Warranties. Developer represents and warrants that:
   (a) It has the full corporate power and authority to enter into this Agreement
   (b) The Services will be performed in a professional and workmanlike manner
   (c) The Work Product will be free from material defects for ninety (90) days following delivery

**6. LIMITATION OF LIABILITY**

6.1 Cap on Liability. IN NO EVENT SHALL EITHER PARTY'S TOTAL LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL AMOUNT PAID OR PAYABLE BY COMPANY TO DEVELOPER UNDER THIS AGREEMENT.

**7. TERMINATION**

7.1 Termination for Convenience. Either party may terminate this Agreement at any time upon thirty (30) days' written notice to the other party.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.`);
  };

  const isProcessing = processingStatus === 'uploading' || processingStatus === 'processing';

  return (
    <>
      <div className={className}>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClick} 
          icon={<FileText className="h-5 w-5" />}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {processingStatus === 'uploading' ? 'Processing...' : 'Processing...'}
            </>
          ) : (
            'Input Text'
          )}
        </Button>
      </div>

      {/* Document Input Dialog */}
      {showInputDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Input Document Text
                </h3>
                <button
                  onClick={closeDialog}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Document Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g., Employment Contract, NDA, Service Agreement..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Document Content */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Document Content *
                  </label>
                  <button
                    onClick={loadSampleDocument}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Load Sample Document
                  </button>
                </div>
                <textarea
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your legal document content here..."
                  rows="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {documentText.length} characters
                </p>
              </div>

              {/* Persona Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t?.ui?.persona || 'Your Role/Persona'} *
                </label>
                <input
                  type="text"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  placeholder={t?.ui?.personaPlaceholder || 'e.g., Legal professional, Business owner, Contract manager...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Job to be Done Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t?.ui?.jobToBeDone || 'What do you want to accomplish?'} *
                </label>
                <textarea
                  value={jobToBeDone}
                  onChange={(e) => setJobToBeDone(e.target.value)}
                  placeholder={t?.ui?.jobPlaceholder || 'e.g., Analyze contract terms, Extract key obligations, Identify potential risks...'}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Processing Status */}
              {currentJob && isProcessing && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                    <p className="text-sm text-blue-600">
                      {currentJob.message || (processingStatus === 'uploading' ? 'Processing document...' : 'Analyzing content...')}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={closeDialog}
                  disabled={isProcessing}
                >
                  {t?.ui?.cancel || 'Cancel'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!documentText.trim() || !persona.trim() || !jobToBeDone.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t?.ui?.processing || 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Process Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};