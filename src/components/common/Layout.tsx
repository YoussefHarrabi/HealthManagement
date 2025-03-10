import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
    user?: {
        name: string;
       
        userRole: string;}
  children: ReactNode;
  userRole?: string;
}

export default function Layout({ children, userRole = 'admin' }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar user={{
        name: 'YoussefHarrabi',
        email: 'youssef.harrabi@example.com',
        imageUrl: '/images/profile.png',
      }} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userRole={userRole} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}