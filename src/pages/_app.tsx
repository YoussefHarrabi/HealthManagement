import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AuthService, { User } from '../services/auth';

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via localStorage
    const storedUser = AuthService.getCurrentUser();
    const token = localStorage.getItem('accessToken');
    
    if (storedUser && token) {
      setUser(storedUser);
      
      // Verify token validity
      AuthService.verifyToken()
        .then((valid) => {
          if (!valid) {
            AuthService.logout();
            setUser(null);
            router.push('/login');
          }
        })
        .catch(() => {
          AuthService.logout();
          setUser(null);
          router.push('/login');
        });
    } else if (storedUser && !token) {
      // User data exists but no token - clear everything
      AuthService.logout();
      setUser(null);
    }
    
    setLoading(false);
    
    // Protect routes
    const publicPaths = ['/', '/login', '/register'];
    const path = router.pathname;
    
    if (!publicPaths.includes(path) && !storedUser) {
      router.push('/login');
    }
  }, [router.pathname]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('healthcareUser', JSON.stringify(userData));
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
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

  // Add any additional props your components might need
  const updatedPageProps = {
    ...pageProps,
    user,
    login,
    logout,
  
  };

  return (
    <>
      <Head>
        <title>Healthcare Management System</title>
        <meta name="description" content="Modern healthcare management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Component {...updatedPageProps} />
    </>
  );
}

export default MyApp;