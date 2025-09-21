import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../contexts/AuthContext';
export const Layout = ({
  children
}) => {
  const {
    currentUser
  } = useAuth();
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>;
};