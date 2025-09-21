import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Clock, FileText } from 'lucide-react';
import { useDocumentProcessing } from '../../contexts/DocumentProcessingContext';
import { useLanguage } from '../../contexts/LanguageContext';

const JobStatusTracker = ({ jobId, onComplete, onError }) => {
  const { getDocumentById } = useDocumentProcessing();
  const { t } = useLanguage();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const document = getDocumentById(jobId);
    if (document) {
      setJob(document);
      if (onComplete) {
        onComplete(document);
      }
    }
  }, [jobId, getDocumentById, onComplete]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t?.ui?.processingComplete || 'Processing Complete';
      case 'error':
      case 'failed':
        return t?.error || 'Error occurred';
      case 'processing':
        return t?.ui?.processing || 'Processing...';
      case 'uploading':
        return t?.ui?.uploading || 'Uploading...';
      default:
        return t?.loading || 'Loading...';
    }
  };

  if (!job) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t?.ui?.processingStatus || 'Processing Status'}
        </h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon(job.status)}
          <span className="text-sm font-medium text-gray-700">
            {getStatusText(job.status)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Job ID:</span>
          <span className="font-mono text-gray-800">{job.id}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Files:</span>
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-gray-800">{job.files?.length || 0} file(s)</span>
          </div>
        </div>
        
        {job.files && job.files.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Files:</div>
            <div className="flex flex-wrap gap-1">
              {job.files.map((fileName, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                >
                  {fileName}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between text-sm">
          <span className="text-gray-600">Persona:</span>
          <span className="text-gray-800 text-right max-w-xs">{job.persona}</span>
        </div>
        
        <div className="flex items-start justify-between text-sm">
          <span className="text-gray-600">Task:</span>
          <span className="text-gray-800 text-right max-w-xs">{job.jobToBeDone}</span>
        </div>
        
        {job.completedAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Completed:</span>
            <span className="text-gray-800">
              {job.completedAt.toLocaleString()}
            </span>
          </div>
        )}
      </div>
      
      {job.status === 'completed' && job.result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-green-700">
              {t?.ui?.processingComplete || 'Document processing completed successfully!'}
            </span>
          </div>
        </div>
      )}
      
      {(job.status === 'error' || job.status === 'failed') && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">
              {job.error || (t?.error || 'An error occurred during processing')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobStatusTracker;