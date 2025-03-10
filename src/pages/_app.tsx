import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

// Define user role type
type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient' | 'department-head' | 'radiologist' | null;

// Auth context could be implemented more robustly in a real app
function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via localStorage
    // In a real app, you would use cookies or JWT tokens
    const storedUser = localStorage.getItem('healthcareUser');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Invalid stored data
        localStorage.removeItem('healthcareUser');
      }
    }
    
    setLoading(false);
    
    // Protect routes
    const publicPaths = ['/', '/login', '/register'];
    const path = router.pathname;
    
    if (!publicPaths.includes(path) && !storedUser) {
      router.push('/login');
    }
  }, [router.pathname]);

  const login = (userData: typeof user) => {
    setUser(userData);
    localStorage.setItem('healthcareUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthcareUser');
    router.push('/login');
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Healthcare Management System</title>
        <meta name="description" content="Modern healthcare management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Component 
        {...pageProps} 
        user={user}
        login={login}
        logout={logout}
      />
    </>
  );
}

export default MyApp;