import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false
}) => {
  return <div className={`card ${hover ? 'hover:shadow-medium transition-shadow cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>;
};