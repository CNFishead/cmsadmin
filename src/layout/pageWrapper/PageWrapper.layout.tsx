'use client';
import React, { useMemo, useEffect } from 'react';
import PageLayout from '@/layout/page/Page.layout';
import { useLayoutStore } from '@/state/layout';
import { getNavigationByKey, getAllNavigationItems } from '@/utils/getNavigationByKey';
import { navigation } from '@/data/navigation';
import { usePathname } from 'next/navigation';

interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * Client component wrapper that determines page navigation based on state
 * The active navigation is set by the sidebar when links are clicked
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const activeNavigationKey = useLayoutStore((state) => state.activeNavigationKey);
  const setActiveNavigationKey = useLayoutStore((state) => state.setActiveNavigationKey);

  // Update active navigation when pathname changes (after navigation completes)
  useEffect(() => {
    const allNavItems = getAllNavigationItems();

    // Sort by link length descending to match most specific routes first
    const sortedItems = [...allNavItems].sort((a, b) => {
      const aLen = a.link?.length || 0;
      const bLen = b.link?.length || 0;
      return bLen - aLen;
    });

    // Find navigation item that matches current pathname
    const matchingItem = sortedItems.find((item) => {
      if (!item.link) return false;

      // Exact match
      if (item.link === pathname) {
        return true;
      }

      // Pattern match for dynamic routes (e.g., /management/users/123 matches /management/users)
      // But don't match root '/' to everything
      if (item.link !== '/' && pathname.startsWith(item.link)) {
        return true;
      }

      return false;
    });

    // Update state if we found a match and it's different from current
    if (matchingItem && matchingItem.key && matchingItem.key !== activeNavigationKey) {
      setActiveNavigationKey(matchingItem.key);
    }
  }, [pathname, activeNavigationKey, setActiveNavigationKey]);

  // Find the navigation page based on the active key
  const pages = useMemo(() => {
    const navItem = getNavigationByKey(activeNavigationKey);

    // Return the found item or fallback to home
    if (navItem) {
      return [navItem];
    }

    return [navigation().home.links.home];
  }, [activeNavigationKey]);

  return <PageLayout pages={pages}>{children}</PageLayout>;
};

export default PageWrapper;
