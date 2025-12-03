'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import Sidebar from './sidebar';
import PageTransition from './page-transition';
import SearchModal from './search-modal';
import NotificationsDropdown from './notifications-dropdown';
import UserMenu from './user-menu';
import TeamMembersPopover from './team-members-popover';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, init } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTeamMembersOpen, setIsTeamMembersOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);
  const headerRef = useRef<HTMLElement>(null);

  // Measure header height to position tabs bar correctly
  useEffect(() => {
    const measureHeader = () => {
      if (headerRef.current) {
        // Use getBoundingClientRect for more accurate measurement
        const rect = headerRef.current.getBoundingClientRect();
        const height = rect.height;
        setHeaderHeight(height);
        
        // Also set CSS custom property for more reliable positioning
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // Measure immediately
    measureHeader();
    
    // Measure after multiple delays to catch all render cycles
    const timeoutId1 = setTimeout(measureHeader, 50);
    const timeoutId2 = setTimeout(measureHeader, 150);
    const timeoutId3 = setTimeout(measureHeader, 300);
    
    // Measure on resize
    window.addEventListener('resize', measureHeader);
    
    // Measure on scroll (in case header changes on scroll)
    window.addEventListener('scroll', measureHeader, { passive: true });
    
    // Use ResizeObserver for more accurate measurements
    let resizeObserver: ResizeObserver | null = null;
    if (headerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height;
          setHeaderHeight(height);
          document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
      });
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener('resize', measureHeader);
      window.removeEventListener('scroll', measureHeader);
      if (resizeObserver && headerRef.current) {
        resizeObserver.unobserve(headerRef.current);
      }
    };
  }, [pathname]);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      init();
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router, init]);

  // Re-measure header when navigating to categories page
  useEffect(() => {
    if (pathname === '/dashboard/categories' || pathname.startsWith('/dashboard/categories/')) {
      const measureHeader = () => {
        if (headerRef.current) {
          const rect = headerRef.current.getBoundingClientRect();
          const height = rect.height;
          setHeaderHeight(height);
        }
      };
      
      // Measure immediately and after a delay
      measureHeader();
      const timeoutId = setTimeout(measureHeader, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: 'Related menus', path: null },
  ];

  // Parts Management tabs - show on all Part Management related pages
  const isPartsPage = 
    pathname === '/dashboard/parts' || 
    pathname.startsWith('/dashboard/parts/') ||
    pathname === '/dashboard/categories' ||
    pathname.startsWith('/dashboard/categories/') ||
    pathname === '/dashboard/subcategories' ||
    pathname.startsWith('/dashboard/subcategories/') ||
    pathname === '/dashboard/parts-list' ||
    pathname.startsWith('/dashboard/parts-list/') ||
    pathname === '/dashboard/parts-entry' ||
    pathname.startsWith('/dashboard/parts-entry/') ||
    pathname === '/dashboard/models' ||
    pathname.startsWith('/dashboard/models/') ||
    pathname === '/dashboard/vehicles' ||
    pathname.startsWith('/dashboard/vehicles/') ||
    pathname === '/dashboard/make' ||
    pathname.startsWith('/dashboard/make/') ||
    pathname === '/dashboard/applications' ||
    pathname.startsWith('/dashboard/applications/') ||
    pathname === '/dashboard/dimensions' ||
    pathname.startsWith('/dashboard/dimensions/') ||
    pathname === '/dashboard/companies' ||
    pathname.startsWith('/dashboard/companies/');
  
  const partsTabs = [
    { label: 'Parts Entry', path: '/dashboard/parts', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    )},
    { label: 'Category', path: '/dashboard/categories', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )},
    { label: 'Items', path: '/dashboard/parts-list', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )},
    { label: 'Models', path: '/dashboard/models', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { label: 'Vehicles', path: '/dashboard/vehicles', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    )},
    { label: 'Make', path: '/dashboard/make', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )},
    { label: 'Applications', path: '/dashboard/applications', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )},
    { label: 'Dimensions', path: '/dashboard/dimensions', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    )},
    { label: 'Companies', path: '/dashboard/companies', icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )},
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar 
        isCollapsed={isCollapsed} 
        isHovered={isHovered}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 md:ml-20 pb-16 sm:pb-0">
        {/* Header Bar */}
        <header ref={headerRef} className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center gap-3 sm:gap-6 md:gap-8 min-w-0 flex-1">
              {/* Logo */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 hidden sm:inline">InventoryERP</span>
                <span className="text-base font-semibold text-gray-900 sm:hidden">ERP</span>
              </div>

              {/* Navigation Links (simple, no parts tabs in header) */}
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                  const isActive = item.path ? (pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path))) : false;
                  return (
                    <span
                      key={item.label}
                      className={`
                        text-sm font-medium transition-colors whitespace-nowrap
                        ${isActive 
                          ? 'text-gray-900 border-b-2 border-primary-500 pb-1' 
                          : 'text-gray-600'
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  );
                })}
              </nav>
            </div>

            {/* Right: Team, Search, Notifications, User */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              {/* Team Members */}
              <div className="hidden lg:flex items-center gap-2 relative">
                <button
                  onClick={() => {
                    setIsTeamMembersOpen(!isTeamMembersOpen);
                    setIsSearchOpen(false);
                    setIsNotificationsOpen(false);
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:scale-110 transition-transform"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">+10</span>
                </button>
                <TeamMembersPopover
                  isOpen={isTeamMembersOpen}
                  onClose={() => setIsTeamMembersOpen(false)}
                />
              </div>

              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsNotificationsOpen(false);
                    setIsUserMenuOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
                  aria-label="Search"
                  title="Search (Ctrl+K or Cmd+K)"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="absolute -bottom-1 -right-1 text-[10px] bg-gray-200 text-gray-600 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ⌘K
                  </span>
                </button>
                <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsSearchOpen(false);
                    setIsUserMenuOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Notifications"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <NotificationsDropdown
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              </div>

              {/* User Profile */}
              <div className="relative flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsSearchOpen(false);
                    setIsNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-medium text-xs sm:text-sm cursor-pointer">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:inline text-sm text-gray-700 font-medium">{user?.name || 'User'}</span>
                </button>
                <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
              </div>
            </div>
          </div>
        </header>

        {/* Parts Management Tabs below header */}
        {isPartsPage && (
          <>
            {/* Desktop / Tablet - centered tabs */}
            <div 
              className="hidden md:flex bg-white border-b border-gray-200 shadow-sm parts-tabs-bar overflow-x-auto"
              style={{ top: `${headerHeight}px` }}
            >
              <div className="w-full flex items-center justify-center h-full min-w-max">
                <nav className="flex items-center justify-center gap-3 px-6 h-full">
                {partsTabs.map((tab) => {
                  // Determine active state based on current pathname
                  const isActive = pathname === tab.path || (tab.path !== '/dashboard' && pathname.startsWith(tab.path + '/'));

                  return (
                    <Link
                      key={tab.label}
                      href={tab.path}
                      prefetch={true}
                      className={`
                        flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-full
                        transition-colors whitespace-nowrap min-h-[36px] flex-shrink-0
                        ${
                          isActive
                            ? 'bg-primary-50 text-primary-600 border border-primary-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                        }
                      `}
                    >
                      {tab.icon}
                      {tab.label}
                    </Link>
                  );
                })}
                </nav>
              </div>
            </div>

            {/* Mobile - scrollable row */}
            <div 
              className="md:hidden bg-white border-b border-gray-200 overflow-x-auto shadow-sm parts-tabs-bar"
              style={{ top: `${headerHeight}px` }}
            >
              <nav className="flex items-center gap-1 px-2 h-full">
                {partsTabs.map((tab) => {
                  // Determine active state based on current pathname
                  const isActive = pathname === tab.path || (tab.path !== '/dashboard' && pathname.startsWith(tab.path + '/'));

                  return (
                    <Link
                      key={tab.label}
                      href={tab.path}
                      prefetch={true}
                      className={`
                        flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 rounded-full min-h-[40px]
                        ${
                          isActive
                            ? 'bg-primary-50 text-primary-600 border border-primary-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                        }
                      `}
                    >
                      {tab.icon}
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
