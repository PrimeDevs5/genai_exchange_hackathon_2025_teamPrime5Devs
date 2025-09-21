import React, { useRef, useState } from 'react';
import { UploadIcon, FileIcon, X, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useDocumentProcessing } from '../../contexts/DocumentProcessingContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const UploadButton = ({
  onFileSelect,
  accept = '.pdf,.txt',
  multiple = true,
  className = '',
  variant = 'primary',
  size = 'md',
  label = 'Upload Document'
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [persona, setPersona] = useState('');
  const [jobToBeDone, setJobToBeDone] = useState('');
  
  const { uploadAndProcessDocuments, processingStatus, currentJob, error } = useDocumentProcessing();
  const { t } = useLanguage();

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    if (files && files.length > 0) {
      setSelectedFiles(files);
      setShowUploadDialog(true);
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async () => {
    if (!persona.trim() || !jobToBeDone.trim() || selectedFiles.length === 0) {
      return;
    }

    try {
      const result = await uploadAndProcessDocuments(selectedFiles, persona, jobToBeDone);
      
      // Call the parent callback if provided
      if (onFileSelect) {
        onFileSelect(result);
      }
      
      // Reset form
      setSelectedFiles([]);
      setPersona('');
      setJobToBeDone('');
      setShowUploadDialog(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const closeDialog = () => {
    setShowUploadDialog(false);
    setSelectedFiles([]);
    setPersona('');
    setJobToBeDone('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isProcessing = processingStatus === 'uploading' || processingStatus === 'processing';

  return (
    <>
      <div className={className}>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          multiple={multiple} 
        />
        <Button 
          variant={variant} 
          size={size} 
          onClick={handleClick} 
          icon={<UploadIcon className="h-5 w-5" />}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {processingStatus === 'uploading' ? t?.ui?.uploading || 'Uploading...' : t?.ui?.processing || 'Processing...'}
            </>
          ) : (
            label
          )}
        </Button>
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t?.ui?.uploadDocuments || 'Upload Documents'}
                </h3>
                <button
                  onClick={closeDialog}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Selected Files */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t?.ui?.selectedFiles || 'Selected Files'} ({selectedFiles.length})
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FileIcon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-900 truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  placeholder={t?.ui?.personaPlaceholder || 'e.g., Legal professional, Student, Business owner...'}
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
                  placeholder={t?.ui?.jobPlaceholder || 'e.g., Analyze contract terms, Extract key information, Summarize document...'}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 font-medium">Processing Error</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  {error.includes('PDF processing') && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-700">
                        💡 <strong>Tip:</strong> Try using the "Input Text" button instead - you can copy and paste your document content there for analysis.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Processing Status */}
              {currentJob && isProcessing && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                    <p className="text-sm text-blue-600">
                      {currentJob.message || (processingStatus === 'uploading' ? 'Uploading files...' : 'Processing documents...')}
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
                  onClick={handleUpload}
                  disabled={!persona.trim() || !jobToBeDone.trim() || selectedFiles.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {processingStatus === 'uploading' ? t?.ui?.uploading || 'Uploading...' : t?.ui?.processing || 'Processing...'}
                    </>
                  ) : (
                    t?.ui?.uploadAndProcess || 'Upload & Process'
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