import React from 'react';
import { SearchIcon } from 'lucide-react';
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search',
  value,
  onChange,
  onSubmit,
  className = ''
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };
  return <form className={`relative w-full ${className}`} onSubmit={handleSubmit}>
      <input type="text" className="input pl-10" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-neutral-400" />
      </div>
    </form>;
};