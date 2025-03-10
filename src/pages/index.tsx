import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UserGroupIcon, 
  ShieldCheckIcon, 
  ClipboardCheckIcon,
  ChartBarIcon
} from '@heroicons/react/outline';

type HomeProps = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string | null;
  } | null;
  logout: () => void;
};

export default function Home({ user, logout }: HomeProps) {
  const router = useRouter();
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const features = [
    {
      name: 'Patient Management',
      description: 'Efficient patient record management with comprehensive medical history tracking.',
      icon: UserGroupIcon,
    },
    {
      name: 'Secure & Compliant',
      description: 'HIPAA-compliant data security with end-to-end encryption and access controls.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Appointment Scheduling',
      description: 'Streamlined scheduling for patients and healthcare providers with automated reminders.',
      icon: ClipboardCheckIcon,
    },
    {
      name: 'Analytics & Reporting',
      description: 'Comprehensive analytics dashboard with customizable reports for data-driven decisions.',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">HealthcareCare</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                  Sign in
                </div>
              </Link>
              <Link href="/register">
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Sign up
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-transparent mix-blend-multiply" />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Modern Healthcare Management
                </h2>
                <p className="mt-6 max-w-lg text-xl text-blue-100 sm:max-w-2xl">
                  A comprehensive platform for healthcare providers to manage patients, appointments, and medical records with ease.
                </p>
                <div className="mt-10 max-w-sm sm:max-w-none sm:flex">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                    <Link href="/register">
                      <div className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:px-8">
                        Get started
                      </div>
                    </Link>
                    <Link href="/login">
                      <div className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 sm:px-8">
                        Sign in
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to manage healthcare
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our platform streamlines healthcare management for providers of all sizes, from small clinics to large hospitals.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-white">HealthcareCare</h2>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} HealthcareCare. All rights reserved.</p>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-gray-400">
                Built by {" "}
                <span className="text-white font-medium">Feriel Dh</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}