import React from 'react';
interface ProgressIndicatorProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  status?: 'pending' | 'processing' | 'complete' | 'error';
}
export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  size = 'md',
  className = '',
  showLabel = true,
  status = 'processing'
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  const statusColors = {
    pending: 'bg-neutral-300',
    processing: 'bg-primary-500',
    complete: 'bg-green-500',
    error: 'bg-red-500'
  };
  const bgColor = statusColors[status];
  return <div className={`w-full ${className}`}>
      <div className="w-full bg-neutral-200 rounded-full overflow-hidden">
        <div className={`${bgColor} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-in-out`} style={{
        width: `${progress}%`
      }}></div>
      </div>
      {showLabel && <div className="flex justify-between items-center mt-1">
          <span className="text-xs font-medium text-neutral-600">
            {status === 'pending' && 'Pending'}
            {status === 'processing' && 'Processing'}
            {status === 'complete' && 'Complete'}
            {status === 'error' && 'Error'}
          </span>
          <span className="text-xs font-medium text-neutral-600">
            {progress}%
          </span>
        </div>}
    </div>;
};