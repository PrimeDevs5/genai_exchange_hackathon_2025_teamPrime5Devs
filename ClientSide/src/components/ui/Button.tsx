import React from 'react';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  icon
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    outline: 'btn-outline'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  return <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>;
};