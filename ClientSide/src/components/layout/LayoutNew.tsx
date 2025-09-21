import React from 'react';
import { NavbarNew } from './NavbarNew';
import { FooterNew } from './FooterNew';

interface LayoutNewProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  isAuthenticated?: boolean;
}

export const LayoutNew: React.FC<LayoutNewProps> = ({ 
  children, 
  hideFooter = false, 
  isAuthenticated = false 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-legal-50">
      <NavbarNew isAuthenticated={isAuthenticated} />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <FooterNew />}
    </div>
  );
};
