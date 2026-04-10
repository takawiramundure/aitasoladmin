import { SiteSettings, NavigationItem } from "../types/siteSettings";

// Extract current BWEIC navigation from Navbar.tsx
const bweicNavigation: NavigationItem[] = [
    {
        id: 'nav-who-we-are',
        name: 'WHO WE ARE',
        path: '/who-we-are',
        order: 1,
        subItems: [
            { id: 'nav-our-story', name: 'Our Story', path: '/our-story', order: 1 },
            { id: 'nav-leadership', name: 'Leadership', path: '/leadership', order: 2 },
            { id: 'nav-board-members', name: 'Board Members', path: '/board-members', order: 3 },
            { id: 'nav-partners', name: 'Partners', path: '/partners', order: 4 },
            { id: 'nav-careers', name: 'Careers', path: '/careers', order: 5 }
        ]
    },
    {
        id: 'nav-our-work',
        name: 'OUR WORK',
        path: '/our-work',
        order: 2,
        subItems: [
            { id: 'nav-healing', name: 'Healing & Wellness', path: '/signature-programs', order: 1 },
            { id: 'nav-empowerment', name: 'Empowerment & Capacity Building', path: '/special-initiatives', order: 2 },
            { id: 'nav-community', name: 'Community & Belonging', path: '/policy-research', order: 3 },
            { id: 'nav-sovereignty', name: 'The Sovereignty Circle', path: '/publications', order: 4 }
        ]
    },
    {
        id: 'nav-take-action',
        name: 'TAKE ACTION',
        path: '/take-action',
        order: 3
    },
    {
        id: 'nav-media-center',
        name: 'MEDIA CENTER',
        path: '/media-center',
        order: 4,
        subItems: [
            { id: 'nav-videos', name: 'Videos', path: '/videos', order: 1 },
            { id: 'nav-upcoming-events', name: 'Upcoming Events', path: '/upcoming-events', order: 2 },
            { id: 'nav-media-partners', name: 'Partners', path: '/partners', order: 3 }
        ]
    },
    {
        id: 'nav-blog',
        name: 'BLOG',
        path: '/blogs',
        order: 5
    },
    {
        id: 'nav-shop',
        name: 'SHOP',
        path: '/shop',
        order: 6
    }
];

const nspcNavigation: NavigationItem[] = [
    { id: 'nav-home', name: 'Home', path: '/', order: 1 },
    { id: 'nav-resources', name: 'Resources', path: '/resources', order: 2 },
    { id: 'nav-understanding', name: 'Understanding', path: '/understanding', order: 3 },
    { id: 'nav-coping', name: 'Coping', path: '/coping', order: 4 },
    { id: 'nav-programs', name: 'Programs', path: '/programs', order: 5 }
];

const kmfwNavigation: NavigationItem[] = [
    { id: 'nav-home', name: 'Home', path: '/', order: 1 },
    { id: 'nav-about', name: 'Our Story', path: '/about', order: 2 },
    { id: 'nav-services', name: 'Programs & Services', path: '/services', order: 3 },
    { id: 'nav-impact', name: 'Impact', path: '/impact', order: 4 },
    { id: 'nav-join-us', name: 'Join Us', path: '/join', order: 5 },
    { id: 'nav-contact', name: 'Contact', path: '/contact', order: 6 }
];

const elwgNavigation: NavigationItem[] = [
    { id: 'nav-home', name: 'Home', path: '/', order: 1 },
    { id: 'nav-about', name: 'About Us', path: '/about', order: 2 },
    { id: 'nav-programs', name: 'Programs', path: '/programs', order: 3 },
    { id: 'nav-volunteers', name: 'Volunteers', path: '/volunteers', order: 4 },
    { id: 'nav-contact', name: 'Contact', path: '/contact', order: 5 },
    { id: 'nav-donate', name: 'Donate', path: '/donate', order: 6 }
];

export const SETTINGS_SEED_DATA: Record<string, SiteSettings> = {
    nspc: {
        siteId: 'nspc',
        branding: {
            logo: '/nspc-logo.png',
            siteName: 'Niagara Suicide Prevention Coalition',
            favicon: '/favicon.ico'
        },
        theme: {
            primary: '#00A8B4',
            secondary: '#2C3E50',
            accent: '#A5C93F',
            textDark: '#1A1A1A',
            textLight: '#FFFFFF',
            brandColor: '#00A8B4',
            brandColorDark: '#008C96',
            brandColorLight: '#46C3CC',
            topBarBg: '#00A8B4',
            headerBg: '#FFFFFF'
        },
        navigation: nspcNavigation,
        metadata: {
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system'
        }
    },
    bweic: {
        siteId: 'bweic',
        branding: {
            logo: '/logo.png',
            siteName: 'Black Women Empowerment Initiative Canada',
            favicon: '/favicon.ico'
        },
        theme: {
            primary: '#BA9731',
            secondary: '#0D0D0D',
            accent: '#DACE84',
            textDark: '#0D0D0D',
            textLight: '#FEFEFE',
            brandColor: '#BA9731',
            brandColorDark: '#8E7324',
            brandColorLight: '#DACE84',
            topBarBg: '#0D0D0D',
            headerBg: '#FEFEFE'
        },
        navigation: bweicNavigation,
        metadata: {
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system'
        }
    },
    kmfw: {
        siteId: 'kmfw',
        branding: {
            logo: '/logo-dark.png',
            siteName: 'Kind Minds Family Wellness',
            favicon: '/favicon.ico'
        },
        theme: {
            primary: '#0D9488',
            secondary: '#1C1917',
            accent: '#D97706',
            textDark: '#1C1917',
            textLight: '#FFFFFF',
            brandColor: '#0D9488',
            brandColorDark: '#0a7a70',
            brandColorLight: '#0f9f92',
            topBarBg: '#0D9488',
            headerBg: '#FFFFFF'
        },
        navigation: kmfwNavigation,
        metadata: {
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system'
        }
    },
    elwg: {
        siteId: 'elwg',
        branding: {
            logo: '/logo.png', // Replace with actual logo path if known
            siteName: 'Elliot Lake Women\'s Group',
            favicon: '/favicon.ico'
        },
        theme: {
            primary: '#71220B', // Burgundy
            secondary: '#111827', // Gray-900
            accent: '#D4AF37', // Gold
            textDark: '#111827',
            textLight: '#FFFFFF',
            brandColor: '#71220B',
            brandColorDark: '#5E1D09',
            brandColorLight: '#8B2C0D',
            topBarBg: '#71220B',
            headerBg: '#FAF9F6' // Off-white
        },
        navigation: elwgNavigation,
        metadata: {
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system'
        }
    }
};
