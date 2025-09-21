import React from 'react';
import { XIcon } from 'lucide-react';
export const Tag = ({
  label,
  color = 'gray',
  onRemove,
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-accent-100 text-accent-800',
    gray: 'bg-neutral-100 text-neutral-800'
  };
  return <span className={`tag ${colorClasses[color]} ${className}`}>
      {label}
      {onRemove && <button type="button" className="ml-1 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none" onClick={onRemove}>
          <XIcon className="h-3 w-3" />
        </button>}
    </span>;
};