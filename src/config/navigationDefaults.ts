import { NavigationItem } from "@/types/siteSettings";

export const GET_DEFAULT_NAV = (siteId: string): NavigationItem[] => {
    switch (siteId) {
        case 'noel':
            return [
                { id: 'n-home', name: 'Home', path: '/', order: 1 },
                { id: 'n-services', name: 'Services', path: '/services', order: 2, subItems: [
                    { id: 'n-serv-exterior', name: 'Exterior Work', path: '/services/exterior-work', order: 1 },
                    { id: 'n-serv-sustainable', name: 'Sustainability', path: '/services/sustainability', order: 2 },
                    { id: 'n-serv-decks', name: 'Decks & Patios', path: '/services/decks-patios', order: 3 },
                    { id: 'n-serv-stairs', name: 'Stairs & Railings', path: '/services/stairs-railings', order: 4 },
                    { id: 'n-serv-renovations', name: 'Renovations', path: '/services/renovations', order: 5 },
                    { id: 'n-serv-eco', name: 'Eco-Solutions', path: '/services/eco-solutions', order: 6 },
                    { id: 'n-serv-quote', name: 'Get Quote', path: '/services/get-quote', order: 7 },
                ] },
                { id: 'n-portfolio', name: 'Portfolio', path: '/portfolio', order: 3 },
                { id: 'n-before-after', name: 'Before & After', path: '/before-after', order: 4 },
                { id: 'n-reviews', name: 'Reviews', path: '/reviews', order: 5 },
                { id: 'n-contact', name: 'Contact', path: '/contact', order: 6 },
            ];
        case 'elwg':
            return [
                { id: 'e-home', name: 'Home', path: '/', order: 1 },
                { id: 'e-about', name: 'About Us', path: '/about', order: 2 },
                { id: 'e-programs', name: 'Programs', path: '/programs', order: 3 },
                { id: 'e-volunteers', name: 'Volunteers', path: '/volunteers', order: 4 },
                { id: 'e-contact', name: 'Contact', path: '/contact', order: 5 },
                { id: 'e-donate', name: 'Donate', path: '/donate', order: 6 },
            ];
        case 'phcg':
            return [
                { id: 'p-home', name: 'Home', path: '/', order: 1 },
                { id: 'p-about', name: 'About Us', path: '/about', order: 2 },
                { id: 'p-services', name: 'Care Services', path: '/services', order: 3 },
                { id: 'p-careers', name: 'Join Team', path: '/careers', order: 4 },
                { id: 'p-faq', name: 'FAQs', path: '/faq', order: 5 },
                { id: 'p-contact', name: 'Contact', path: '/contact', order: 6 },
                { id: 'p-appointment', name: 'Free Consultation', path: '/#appointment', order: 7 },
            ];
        case 'aitasol':
            return [
                { id: 'a-home', name: 'Home', path: '/', order: 1 },
                { id: 'a-about', name: 'About Us', path: '/about', order: 2 },
                { id: 'a-destinations', name: 'Destinations', path: '/destinations', order: 3 },
                { id: 'a-services', name: 'Our Services', path: '/services', order: 4 },
                { id: 'a-universities', name: 'Universities', path: '/universities', order: 5 },
                { id: 'a-blog', name: 'Resources', path: '/blog', order: 6 },
                { id: 'a-contact', name: 'Contact', path: '/contact', order: 7 },
                { id: 'a-apply', name: 'Apply Now', path: '/apply', order: 8 },
            ];
        case 'kmfw':
        case 'nspc':
        default:
            return [
                { id: 'nav-home', name: 'Home', path: '/', order: 1 },
                { id: 'nav-about', name: 'About', path: '/about', order: 2, subItems: [
                    { id: 'nav-about-story', name: 'Our Story', path: '/about/our-story', order: 1 },
                    { id: 'nav-about-team', name: 'Meet Our Team', path: '/about/meet-our-team', order: 2 },
                    { id: 'nav-about-plan', name: 'Our Strategic Plan', path: '/about/our-strategic-plan', order: 3 },
                    { id: 'nav-about-founder', name: "Founder's Message", path: '/about/founders-message', order: 4 },
                ] },
                { id: 'nav-services', name: 'Services', path: '/services', order: 3, subItems: [
                    { id: 'nav-serv-prog', name: 'Programs & Services', path: '/services', order: 1 },
                    { id: 'nav-serv-ground', name: 'Grounded Counseling', path: '/services/grounded-counseling', order: 2 },
                ] },
                { id: 'nav-contact', name: 'Contact', path: '/contact', order: 8 },
            ];
    }
};

export const GET_SITE_DEFAULTS = (siteId: string, siteName: string) => {
    switch (siteId) {
        case 'noel':
            return {
                description: 'Noel Construction specializes in luxury renovations, custom woodworking, and architectural craftsmanship in the Kitchener-Waterloo region.',
                keywords: 'Noel Construction, custom woodworking KW, Kitchener renovations, Waterloo basement upgrade, luxury decks ON'
            };
        case 'phcg':
            return {
                description: 'Private Home Care Guru (PHCG) provides professional, compassionate home care services across Ontario, specializing in PSW and nursing care.',
                keywords: 'Home care Ontario, PHCG, Private Home Care Guru, PSW services, nursing care home, elder care Toronto'
            };
        case 'kmfw':
            return {
                description: 'Kind Minds Family Wellness (KMFW) is a Black-led organization providing culturally grounded mental health, counseling, and wellness programs to the Black community in Waterloo Region.',
                keywords: 'Black mental health, KMFW, Kind Minds Family Wellness, Black wellness Waterloo, culturally grounded counseling'
            };
        case 'aitasol':
            return {
                description: 'Aitasol is a leading education consultancy helping students achieve their dreams of studying abroad in the UK, Canada, USA, and beyond.',
                keywords: 'study abroad, education consultancy, student visa, university application, Aitasol'
            };
        default:
            return {
                description: `${siteName} - Professional agency site powered by Digital Maples Agency.`,
                keywords: `${siteName}, agency, web development, digital solutions`
            };
    }
};
