import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Site, SITES, getSiteById, getDefaultSite } from '../config/sites';

interface SiteContextType {
    currentSite: Site;
    switchSite: (siteId: string) => void;
    sites: Site[];
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedSiteId';

import { useAuth } from './AuthContext';

export function SiteProvider({ children }: { children: ReactNode }) {
    const { profile } = useAuth();

    // Calculate available sites based on profile
    const availableSites = React.useMemo(() => {
        if (!profile) return [];
        if (profile.role === 'super_admin') return SITES;

        // For editors, filter strictly
        return SITES.filter(site => profile.allowedSites?.includes(site.id));
    }, [profile]);

    const [currentSite, setCurrentSite] = useState<Site>(() => {
        const savedSiteId = localStorage.getItem(STORAGE_KEY);
        // We can't validate against profile yet on init, so rely on effect to correct it later
        if (savedSiteId) {
            const site = getSiteById(savedSiteId);
            if (site) return site;
        }
        return getDefaultSite();
    });

    // Validate and correct current site when profile/availableSites changes
    useEffect(() => {
        if (availableSites.length === 0) return;

        const isAllowed = availableSites.find(s => s.id === currentSite.id);
        if (!isAllowed) {
            // Default to first available
            const firstAvailable = availableSites[0];
            setCurrentSite(firstAvailable);
            localStorage.setItem(STORAGE_KEY, firstAvailable.id);
        }
    }, [availableSites, currentSite]);

    const switchSite = (siteId: string) => {
        // Validation check
        const isAllowed = availableSites.find(s => s.id === siteId);
        if (isAllowed) {
            setCurrentSite(isAllowed);
            localStorage.setItem(STORAGE_KEY, siteId);
        } else {
            console.warn("Attempted to switch to unauthorized site");
        }
    };

    const value = React.useMemo(() => ({
        currentSite,
        switchSite,
        sites: availableSites
    }), [currentSite, switchSite, availableSites]);

    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
}
