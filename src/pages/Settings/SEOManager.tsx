import React, { useState, useEffect } from 'react';
import { Save, Globe, Search, Share2, RefreshCw, Zap } from 'lucide-react';
import { FirestoreService } from '../../services/firestore';
import { useSite } from '../../context/SiteContext';
import Button from '../../components/ui/button/Button';
import Alert from '../../components/ui/alert/Alert';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

interface PageDef {
    path: string;
    label: string;
    key: string;
}

interface PageSEO {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
    noIndex: boolean;
}

type SEOData = Record<string, PageSEO>;

// All KMFW routes
const KMFW_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/about', label: 'About Us', key: 'about' },
    { path: '/our-story', label: 'Our Story', key: 'our-story' },
    { path: '/meet-our-team', label: 'Meet Our Team', key: 'meet-our-team' },
    { path: '/strategic-plan', label: 'Strategic Plan', key: 'strategic-plan' },
    { path: '/services', label: 'Services (Overview)', key: 'services' },
    { path: '/services/grounded-counseling', label: 'Grounded Counseling', key: 'grounded-counseling' },
    { path: '/services/educational-programs', label: 'Educational Programs', key: 'educational-programs' },
    { path: '/services/advocacy-education', label: 'Advocacy & Education', key: 'advocacy-education' },
    { path: '/services/community-support', label: 'Community Support', key: 'community-support' },
    { path: '/services/system-navigation', label: 'System Navigation', key: 'system-navigation' },
    { path: '/events', label: 'Community Events', key: 'events' },
    { path: '/impact', label: 'Impact (Overview)', key: 'impact' },
    { path: '/impact/newsletters', label: 'Newsletters', key: 'newsletters' },
    { path: '/impact/success-stories', label: 'Success Stories', key: 'success-stories' },
    { path: '/join-us', label: 'Join Us (Overview)', key: 'join-us' },
    { path: '/join-us/careers', label: 'Careers', key: 'careers' },
    { path: '/join-us/volunteer', label: 'Volunteer', key: 'volunteer' },
    { path: '/join-us/funders', label: 'Our Funders', key: 'funders' },
    { path: '/join-us/partners', label: 'Our Partners', key: 'partners' },
    { path: '/research', label: 'Research & Consultancy', key: 'research' },
    { path: '/research/neuro-divergent', label: 'Neuro-Divergent Project', key: 'neuro-divergent' },
    { path: '/black-excellence-gala', label: 'Black Excellence Gala', key: 'gala' },
    { path: '/blog', label: 'Blog', key: 'blog' },
    { path: '/contact', label: 'Contact Us', key: 'contact' },
    { path: '/donate', label: 'Donate', key: 'donate' },
];

// Noel Construction Pages
const NOEL_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/services', label: 'Services (Overview)', key: 'services' },
    { path: '/services/exterior-work', label: 'Exterior Work', key: 'exterior' },
    { path: '/services/sustainability', label: 'Sustainability', key: 'sustainability' },
    { path: '/services/decks-patios', label: 'Decks & Patios', key: 'decks' },
    { path: '/services/stairs-railings', label: 'Stairs & Railings', key: 'stairs' },
    { path: '/services/renovations', label: 'Renovations', key: 'renovations' },
    { path: '/services/eco-solutions', label: 'Eco-Solutions', key: 'eco' },
    { path: '/get-quote', label: 'Get Quote', key: 'quote' },
    { path: '/portfolio', label: 'Portfolio', key: 'portfolio' },
    { path: '/before-after', label: 'Before & After', key: 'before-after' },
    { path: '/reviews', label: 'Reviews', key: 'reviews' },
    { path: '/contact', label: 'Contact', key: 'contact' },
];

const SITE_PAGES: Record<string, PageDef[]> = {
    kmfw: KMFW_PAGES,
    noel: NOEL_PAGES,
    elwg: [
        { path: '/', label: 'Home', key: 'home' },
        { path: '/about', label: 'About Us', key: 'about' },
        { path: '/programs', label: 'Programs', key: 'programs' },
        { path: '/volunteers', label: 'Volunteers', key: 'volunteers' },
        { path: '/contact', label: 'Contact', key: 'contact' },
        { path: '/donate', label: 'Donate', key: 'donate' },
    ]
};

const NOEL_SEO_SEED: SEOData = {
    'home': {
        title: 'Master Craftsmanship | Noel Construction KW',
        description: 'Noel Construction specializes in luxury renovations, custom woodworking, and sustainable garden solutions in the Kitchener-Waterloo region. 35+ years of experience.',
        keywords: 'Noel Construction, KW renovations, luxury woodworking Kitchener, custom decks Waterloo, sustainable gardening, home additions KW',
        ogTitle: 'Noel Construction – High-End Renovation & Woodworking',
        ogDescription: 'From ground-up builds to intricate residential renovations, we bring your vision to life with precision and safety.',
        ogImage: '',
        twitterTitle: 'Noel Construction | Legacy of Craftsmanship',
        twitterDescription: 'Professional construction services specializing in custom woodworking and premium home transformations.',
        noIndex: false,
    },
    'services': {
        title: 'Our Specialized Services | Custom Renovations & Woodworking',
        description: 'Explore our range of high-end services: from fine finish carpentry and architectural staircases to vegetable garden setups and water management.',
        keywords: 'construction services KW, garden beds installation, basement upgrades Waterloo, master woodworking, food security gardens',
        ogTitle: 'Specialized Construction Services by Noel',
        ogDescription: 'Quality over quantity. We deliver specialized construction services tailored to your lifestyle and needs.',
        ogImage: '',
        twitterTitle: 'Specialized Services | Noel Construction',
        twitterDescription: 'Explore our master-crafted woodworking and modern renovation services.',
        noIndex: false,
    },
    'exterior': {
        title: 'Exterior Construction & Curb Appeal | Noel Construction',
        description: 'Professional exterior renovations, siding, and structural improvements designed to enhance your home’s character and longevity.',
        keywords: 'exterior renovations KW, home siding Waterloo, curb appeal improvements, structural construction',
        ogTitle: 'Exterior Construction Excellence',
        ogDescription: 'Enhance your home’s exterior with our expert craftsmanship and durable solutions.',
        ogImage: '',
        twitterTitle: 'Exterior Work | Noel Construction',
        twitterDescription: 'Premium exterior renovations for modern homes.',
        noIndex: false,
    },
    'sustainability': {
        title: 'Sustainable Building & Green Solutions | Noel Construction',
        description: 'Eco-conscious construction practices focusing on energy efficiency, sustainable materials, and long-term environmental value.',
        keywords: 'sustainable building KW, green construction Waterloo, eco-friendly renovations, energy efficient home',
        ogTitle: 'Sustainable Construction Solutions',
        ogDescription: 'Building for the future with eco-friendly materials and sustainable building practices.',
        ogImage: '',
        twitterTitle: 'Sustainability | Noel Construction',
        twitterDescription: 'Building a greener future through sustainable construction.',
        noIndex: false,
    },
    'decks': {
        title: 'Custom Decks & Premium Patios | Noel Construction',
        description: 'High-end outdoor living spaces, custom cedar decks, and perfectly leveled stone patios in Kitchener-Waterloo.',
        keywords: 'custom decks KW, patio installation Waterloo, cedar decks, outdoor living spaces',
        ogTitle: 'Luxury Decks & Patios',
        ogDescription: 'Master-crafted outdoor spaces designed for relaxation and longevity.',
        ogImage: '',
        twitterTitle: 'Custom Decks | Noel Construction',
        twitterDescription: 'Premium outdoor spaces for your home.',
        noIndex: false,
    },
    'stairs': {
        title: 'Architectural Stairs & Custom Railings | Noel Construction',
        description: 'Specialized finish carpentry for custom staircases, modern railings, and architectural wood details.',
        keywords: 'custom stairs KW, modern railings Waterloo, architectural woodworking, finish carpentry stairs',
        ogTitle: 'Architectural Stairs & Railings',
        ogDescription: 'Transform your interior with custom staircases and precision railing installations.',
        ogImage: '',
        twitterTitle: 'Stairs & Railings | Noel Construction',
        twitterDescription: 'Precision finish carpentry for high-end staircases.',
        noIndex: false,
    },
    'renovations': {
        title: 'High-End Home Renovations | Noel Construction',
        description: 'Complete home transformations, basement finishing, and master-suite renovations with a focus on quality and building code compliance.',
        keywords: 'home renovations KW, basement finishing Waterloo, luxury home updates, construction master',
        ogTitle: 'High-End Renovations & Extensions',
        ogDescription: 'Ground-up renovations that redefine your living space.',
        ogImage: '',
        twitterTitle: 'Premium Renovations | Noel Construction',
        twitterDescription: 'Expert home transformations with 35+ years of experience.',
        noIndex: false,
    },
    'eco': {
        title: 'Eco-Solutions & Food Security Gardens | Noel Construction',
        description: 'Specialized garden setups, raised beds, and local food security solutions designed for urban and residential spaces.',
        keywords: 'food security gardens KW, raised beds Waterloo, eco-solutions gardening, vegetable gardens',
        ogTitle: 'Eco-Solutions & Garden Systems',
        ogDescription: 'Secure your food future with our custom garden setups and eco-friendly outdoor solutions.',
        ogImage: '',
        twitterTitle: 'Eco-Solutions | Noel Construction',
        twitterDescription: 'Building sustainable food systems in your own backyard.',
        noIndex: false,
    },
    'quote': {
        title: 'Get a Professional Quote | Noel Construction KW',
        description: 'Start your high-end renovation project today. Request a professional estimate for custom woodworking, decks, or structural renovations.',
        keywords: 'construction quote KW, renovation estimate Waterloo, request construction services',
        ogTitle: 'Contact Noel Construction for a Quote',
        ogDescription: 'Let’s bring your vision to life. Request a professional consultation and quote.',
        ogImage: '',
        twitterTitle: 'Request a Quote | Noel Construction',
        twitterDescription: 'Start your next project with a master builder.',
        noIndex: false,
    }
};

const SITE_SEED_DATA: Record<string, SEOData> = {
    noel: NOEL_SEO_SEED
    // Add others as needed
};

const defaultPageSEO = (label: string): PageSEO => ({
    title: label,
    description: '',
    keywords: '',
    ogTitle: label,
    ogDescription: '',
    ogImage: '',
    twitterTitle: label,
    twitterDescription: '',
    noIndex: false,
});

export default function SEOManager() {
    const { currentSite } = useSite();
    const siteId = currentSite?.id || 'kmfw';
    
    // Get pages for the current site
    const pages = SITE_PAGES[siteId] || [{ path: '/', label: 'Home', key: 'home' }];
    
    const [seoData, setSeoData] = useState<SEOData>({});
    const [selectedPage, setSelectedPage] = useState<string>(pages[0].key);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    // Reset selection when site changes
    useEffect(() => {
        if (pages.length > 0) {
            setSelectedPage(pages[0].key);
        }
        loadSEO();
    }, [currentSite]);

    const loadSEO = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getSEOData(siteId);
            if (data) {
                setSeoData(data);
            } else {
                const defaults: SEOData = {};
                pages.forEach(p => { defaults[p.key] = defaultPageSEO(p.label); });
                setSeoData(defaults);
            }
        } catch (e) {
            console.error('Error loading SEO:', e);
            setStatus({ type: 'error', msg: 'Failed to load SEO settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            await FirestoreService.saveSEOData(siteId, seoData);
            setStatus({ type: 'success', msg: 'SEO settings saved successfully!' });
        } catch (e) {
            console.error('Error saving SEO:', e);
            setStatus({ type: 'error', msg: 'Failed to save. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleSeedAll = async () => {
        const seedData = SITE_SEED_DATA[siteId];
        if (!seedData) {
            setStatus({ type: 'error', msg: `No professional seed data available yet for ${currentSite?.name || siteId}.` });
            return;
        }

        setSeeding(true);
        setStatus(null);
        try {
            await FirestoreService.saveSEOData(siteId, seedData);
            setSeoData(seedData);
            setStatus({ type: 'success', msg: `Seeded with professional metadata for ${siteId}!` });
        } catch (e) {
            console.error('Error seeding SEO:', e);
            setStatus({ type: 'error', msg: 'Failed to seed SEO data. Please try again.' });
        } finally {
            setSeeding(false);
        }
    };

    const currentPage = pages.find(p => p.key === selectedPage) || pages[0];
    const pageSEO: PageSEO = seoData[selectedPage] || defaultPageSEO(currentPage.label);

    const update = (field: keyof PageSEO, value: string | boolean) => {
        setSeoData(prev => ({
            ...prev,
            [selectedPage]: { ...pageSEO, [field]: value }
        }));
    };

    const syncFromTitle = () => {
        update('ogTitle', pageSEO.title);
        update('twitterTitle', pageSEO.title);
    };

    const syncFromDescription = () => {
        update('ogDescription', pageSEO.description);
        update('twitterDescription', pageSEO.description);
    };

    const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white";
    const textareaClass = `${inputClass} resize-none`;
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

    const seededCount = Object.values(seoData).filter(p => p.description?.length > 0).length;

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-gray-500">Loading SEO settings...</div>;
    }

    return (
        <>
            <PageMeta
                title={`SEO Manager | ${currentSite?.name || 'Admin'}`}
                description="Manage per-page SEO metadata and Open Graph tags"
            />
            <PageBreadcrumb pageTitle="SEO Manager" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Search className="w-6 h-6 text-blue-600" />
                            SEO & Metadata Manager
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {seededCount}/{pages.length} pages have SEO configured for {currentSite?.name}.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSeedAll}
                            disabled={seeding || !SITE_SEED_DATA[siteId]}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            <Zap className="w-4 h-4" />
                            {seeding ? 'Seeding...' : 'Seed All Pages (AI)'}
                        </button>
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {status && (
                    <Alert
                        variant={status.type}
                        title={status.type === 'success' ? 'Saved!' : 'Notice'}
                        message={status.msg}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Page Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                {currentSite?.name} Pages
                            </h2>
                            <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                                {pages.map(page => {
                                    const hasSEO = seoData[page.key]?.description?.length > 0;
                                    return (
                                        <button
                                            key={page.key}
                                            onClick={() => setSelectedPage(page.key)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
                                                selectedPage === page.key
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <span className="truncate">{page.label}</span>
                                            {hasSEO && (
                                                <span className={`flex-shrink-0 w-2 h-2 rounded-full ${selectedPage === page.key ? 'bg-green-300' : 'bg-green-500'}`} title="Has SEO" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* SEO Editor */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Page URL Preview */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center gap-3">
                            <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Editing</div>
                                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    {currentPage.label} — <code className="text-xs">{currentPage.path}</code>
                                </div>
                            </div>
                        </div>

                        {/* Basic SEO */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <Search className="w-5 h-5 text-gray-500" />
                                Basic SEO
                            </h2>

                            <div>
                                <label className={labelClass}>
                                    Page Title <span className="text-gray-400 font-normal">(shown in browser tab & search results)</span>
                                </label>
                                <input
                                    type="text"
                                    value={pageSEO.title}
                                    onChange={e => update('title', e.target.value)}
                                    placeholder={`${currentPage.label} | ${currentSite?.name}`}
                                    className={inputClass}
                                    maxLength={70}
                                />
                                <p className={`text-xs mt-1 ${pageSEO.title.length > 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {pageSEO.title.length}/70 characters (recommended: under 60)
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Meta Description <span className="text-gray-400 font-normal">(shown in Google search results)</span>
                                </label>
                                <textarea
                                    value={pageSEO.description}
                                    onChange={e => update('description', e.target.value)}
                                    placeholder="Briefly describe this page for search engines..."
                                    className={textareaClass}
                                    rows={3}
                                    maxLength={160}
                                />
                                <p className={`text-xs mt-1 ${pageSEO.description.length > 155 ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {pageSEO.description.length}/160 characters (recommended: 120–160)
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Keywords <span className="text-gray-400 font-normal">(comma-separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={pageSEO.keywords}
                                    onChange={e => update('keywords', e.target.value)}
                                    placeholder="e.g. Construction, Renovation, Woodworking"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <input
                                    id={`noindex-${selectedPage}`}
                                    type="checkbox"
                                    checked={pageSEO.noIndex}
                                    onChange={e => update('noIndex', e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600"
                                />
                                <label htmlFor={`noindex-${selectedPage}`} className="text-sm text-gray-700 dark:text-gray-300">
                                    Hide this page from search engines (noindex)
                                </label>
                            </div>
                        </div>

                        {/* Open Graph / Social */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-gray-500" />
                                    Social Sharing (Open Graph & Twitter)
                                </h2>
                                <button
                                    onClick={() => { syncFromTitle(); syncFromDescription(); }}
                                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Sync from Basic SEO
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                These fields control how the page appears when shared on social media platforms.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>OG Title (Facebook / LinkedIn)</label>
                                    <input type="text" value={pageSEO.ogTitle} onChange={e => update('ogTitle', e.target.value)} placeholder={pageSEO.title} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Twitter Title</label>
                                    <input type="text" value={pageSEO.twitterTitle} onChange={e => update('twitterTitle', e.target.value)} placeholder={pageSEO.title} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>OG Description</label>
                                    <textarea value={pageSEO.ogDescription} onChange={e => update('ogDescription', e.target.value)} placeholder={pageSEO.description} className={textareaClass} rows={3} />
                                </div>
                                <div>
                                    <label className={labelClass}>Twitter Description</label>
                                    <textarea value={pageSEO.twitterDescription} onChange={e => update('twitterDescription', e.target.value)} placeholder={pageSEO.description} className={textareaClass} rows={3} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Social Sharing Image URL <span className="text-gray-400 font-normal">(1200×630px recommended)</span>
                                </label>
                                <input type="url" value={pageSEO.ogImage} onChange={e => update('ogImage', e.target.value)} placeholder="https://..." className={inputClass} />
                                {pageSEO.ogImage && (
                                    <img src={pageSEO.ogImage} alt="OG Preview" className="mt-2 h-24 w-auto rounded border object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save All Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Re-add KMFW seed data at the end for reference or move to constants file
const KMFW_SEO_SEED: SEOData = {
    'home': {
        title: 'Kind Minds Family Wellness | Black Mental Health & Wellness in Waterloo Region',
        description: 'Kind Minds Family Wellness (KMFW) is a Black-led organization providing culturally grounded mental health, counseling, and wellness programs to the Black community in Waterloo Region, Ontario.',
        keywords: 'Black mental health, KMFW, Kind Minds Family Wellness, Black wellness Waterloo, Black community support Ontario, culturally grounded counseling, Black family wellness',
        ogTitle: 'Kind Minds Family Wellness – Healing, Growth & Community',
        ogDescription: 'Culturally grounded mental health and wellness programs for the Black community in Waterloo Region. Join us in building a healthier, more empowered community.',
        ogImage: '',
        twitterTitle: 'Kind Minds Family Wellness | Black-Led Wellness in Ontario',
        twitterDescription: 'Mental health, counseling, and community support for the Black community in Waterloo Region. Certified, compassionate, and culturally grounded.',
        noIndex: false,
    }
};

SITE_SEED_DATA.kmfw = KMFW_SEO_SEED;
