import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, MinusIcon, BellIcon } from "@heroicons/react/outline";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

interface UserProfile {
  name: string;
  email: string;
  imageUrl: string;
}

interface NavbarProps {
  user?: UserProfile;
}

export default function Navbar({ user = {
  name: 'Feriel Mariemh',
  email: 'Feriel Mariem@example.com',
  imageUrl: '/images/profile.png',
}}: NavbarProps) {
  const router = useRouter();
  const currentDate = new Date('2025-03-08 15:15:27').toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MinusIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              
              <div className="flex-1 flex items-center justify-center md:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <div className="text-lg font-bold text-primary-600">HealthCare Management System</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="hidden md:block">
                  <div className="text-sm text-gray-500">{currentDate}</div>
                </div>
                
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Notifications dropdown */}
                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                          {user?.imageUrl ? (
                            <Image
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                              width={32}
                              height={32}
                            />
                          ) : (
                            <span className="h-full w-full flex items-center justify-center text-gray-500">
                              {user?.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none z-10">
                        <Menu.Item>
                          {({ active }) => (
                            <div className="px-4 py-2 border-b">
                              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/profile" legacyBehavior>
                              <a className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                                Your Profile
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/settings" legacyBehavior>
                              <a className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                                Settings
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/auth/login" legacyBehavior>
                              <a className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                                Sign out
                              </a>
                            </Link>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {/* Mobile menu content */}
              <Disclosure.Button
                as="a"
                href="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-primary-500 text-primary-700 bg-primary-50"
              >
                Dashboard
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/appointments"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                Appointments
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/patients"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                Patients
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}