import React from 'react';
export const Card = ({
  children,
  className = '',
  onClick,
  hover = false
}) => {
  return <div className={`card ${hover ? 'hover:shadow-medium transition-shadow cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>;
};