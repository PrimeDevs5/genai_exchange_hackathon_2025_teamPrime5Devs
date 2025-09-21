import React, { useRef } from 'react';
import { UploadIcon } from 'lucide-react';
import { Button } from './Button';
interface UploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  variant?: 'primary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
export const UploadButton: React.FC<UploadButtonProps> = ({
  onFileSelect,
  accept = '.pdf,.doc,.docx',
  multiple = false,
  className = '',
  variant = 'primary',
  size = 'md',
  label = 'Upload Document'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        Array.from(files).forEach(file => onFileSelect(file));
      } else {
        onFileSelect(files[0]);
      }
    }
  };
  return <div className={className}>
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept={accept} multiple={multiple} />
      <Button variant={variant} size={size} onClick={handleClick} icon={<UploadIcon className="h-5 w-5" />}>
        {label}
      </Button>
    </div>;
};