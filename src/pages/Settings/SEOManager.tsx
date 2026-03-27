import React, { useState, useEffect } from 'react';
import { Save, Globe, Search, Share2, RefreshCw, Zap } from 'lucide-react';
import { FirestoreService } from '../../services/firestore';
import { useSite } from '../../context/SiteContext';
import Button from '../../components/ui/button/Button';
import Alert from '../../components/ui/alert/Alert';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';

// All KMFW routes with descriptive labels
const KMFW_PAGES = [
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

// Professional SEO seed data for all KMFW pages
const SEO_SEED_DATA: Record<string, PageSEO> = {
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
    },
    'about': {
        title: 'About KMFW | Our Mission, Vision & Values',
        description: 'Learn about Kind Minds Family Wellness — a Black-led non-profit dedicated to the holistic well-being of Black individuals and families in the Waterloo Region through culturally safe services.',
        keywords: 'KMFW about, Black mental health nonprofit, Black-led organization Waterloo, Kind Minds mission, culturally safe mental health care, Black wellness Ontario',
        ogTitle: 'About Kind Minds Family Wellness',
        ogDescription: 'A Black-led organization rooted in community, culture, and care. Discover our mission to transform Black wellness in Waterloo Region.',
        ogImage: '',
        twitterTitle: 'About KMFW | Black-Led Mental Health Organization',
        twitterDescription: 'Discover the mission, vision, and values driving Kind Minds Family Wellness — serving the Black community in Waterloo Region, Ontario.',
        noIndex: false,
    },
    'our-story': {
        title: 'Our Story | Kind Minds Family Wellness',
        description: 'Discover the founding story of Kind Minds Family Wellness — born from community need, cultural strength, and a vision for Black wellness in Waterloo Region.',
        keywords: 'KMFW origin, Black nonprofit story, community wellness Waterloo, Kind Minds history, Black-founded organization Ontario',
        ogTitle: 'The Story Behind Kind Minds Family Wellness',
        ogDescription: 'From community conversations to a thriving organization. Read the story of how KMFW was born and why it matters.',
        ogImage: '',
        twitterTitle: 'Our Story | KMFW',
        twitterDescription: 'How Kind Minds Family Wellness grew from a community need into a movement for Black wellness and mental health in Ontario.',
        noIndex: false,
    },
    'meet-our-team': {
        title: 'Meet Our Team | Kind Minds Family Wellness',
        description: 'Meet the passionate team of counselors, advocates, and community leaders behind Kind Minds Family Wellness, dedicated to transforming Black health and wellness.',
        keywords: 'KMFW team, Black counselors Waterloo, mental health staff, Black wellness professionals Ontario, Kind Minds leadership',
        ogTitle: 'Meet the KMFW Team',
        ogDescription: 'Our team of culturally grounded counselors, educators, and advocates are here to serve and empower the Black community.',
        ogImage: '',
        twitterTitle: 'Meet Our Team | KMFW',
        twitterDescription: 'Get to know the dedicated professionals behind Kind Minds Family Wellness and our commitment to Black community health.',
        noIndex: false,
    },
    'strategic-plan': {
        title: 'Strategic Plan | Kind Minds Family Wellness',
        description: 'Explore the strategic direction of KMFW — our long-term goals for expanding culturally safe mental health services, community partnerships, and systemic advocacy.',
        keywords: 'KMFW strategic plan, Black nonprofit strategy, mental health goals Waterloo, KMFW 2025 2026, Kind Minds planning, Black wellness initiatives',
        ogTitle: 'KMFW Strategic Plan',
        ogDescription: 'See how Kind Minds Family Wellness is building for the future of Black wellness in Waterloo Region with a clear, community-driven strategic plan.',
        ogImage: '',
        twitterTitle: 'Strategic Plan | KMFW',
        twitterDescription: "Kind Minds Family Wellness's roadmap for expanding culturally grounded care and systemic advocacy for Black communities in Ontario.",
        noIndex: false,
    },
    'services': {
        title: 'Programs & Services | Kind Minds Family Wellness',
        description: "Explore KMFW's full range of culturally grounded programs and services — including counseling, advocacy, community support, and educational workshops for the Black community.",
        keywords: 'KMFW services, Black mental health programs, counseling Waterloo, community support Black families, educational programs Ontario, advocacy Black community',
        ogTitle: 'KMFW Programs & Services',
        ogDescription: 'From counseling to advocacy, KMFW offers a comprehensive range of culturally safe services for Black individuals and families in Waterloo Region.',
        ogImage: '',
        twitterTitle: 'Programs & Services | KMFW',
        twitterDescription: 'Discover culturally safe counseling, community support, and educational programs tailored for the Black community in Waterloo Region.',
        noIndex: false,
    },
    'grounded-counseling': {
        title: 'Grounded Counseling | Kind Minds Family Wellness',
        description: "KMFW's Grounded Counseling service offers culturally safe, trauma-informed therapy for Black individuals and families navigating mental health, relationships, and personal growth.",
        keywords: 'Black counseling Waterloo, culturally safe therapy, trauma-informed counseling Ontario, Black therapist Waterloo, KMFW grounded counseling, mental health Black community',
        ogTitle: 'Grounded Counseling at KMFW',
        ogDescription: 'Culturally grounded, trauma-informed counseling for Black individuals and families. You deserve support that truly understands your experience.',
        ogImage: '',
        twitterTitle: 'Grounded Counseling | KMFW',
        twitterDescription: 'Trauma-informed, culturally safe counseling for the Black community at Kind Minds Family Wellness in Waterloo Region.',
        noIndex: false,
    },
    'educational-programs': {
        title: 'Educational Programs | Kind Minds Family Wellness',
        description: 'KMFW offers culturally enriched educational workshops, seminars, and programs designed to uplift and empower Black youth, families, and community members.',
        keywords: 'KMFW educational programs, Black youth workshops, community education Waterloo, Black empowerment programs, wellness education Ontario',
        ogTitle: 'KMFW Educational Programs',
        ogDescription: "Empowering Black communities through knowledge. Explore KMFW's workshops, seminars, and educational initiatives.",
        ogImage: '',
        twitterTitle: 'Educational Programs | KMFW',
        twitterDescription: 'Culturally enriched educational workshops and programs for Black youth and families in Waterloo Region.',
        noIndex: false,
    },
    'advocacy-education': {
        title: 'Advocacy & Education | Kind Minds Family Wellness',
        description: 'KMFW advocates for systemic change and equity in mental health for Black communities in Ontario. Learn about our advocacy work, public education initiatives, and policy engagement.',
        keywords: 'Black advocacy Ontario, mental health equity, systemic change Black community, KMFW advocacy, anti-Black racism education, community advocacy Waterloo',
        ogTitle: 'Advocacy & Education at KMFW',
        ogDescription: 'Standing up for Black mental health equity. KMFW fights systemic barriers and educates communities toward a more just future.',
        ogImage: '',
        twitterTitle: 'Advocacy & Education | KMFW',
        twitterDescription: 'KMFW advocates for mental health equity and systemic change for Black communities in Ontario and beyond.',
        noIndex: false,
    },
    'community-support': {
        title: 'Community Support | Kind Minds Family Wellness',
        description: 'Connecting Black individuals and families to essential community resources, peer support networks, and wraparound services in the Waterloo Region.',
        keywords: 'Black community support, wraparound services Waterloo, peer support Black families, KMFW community programs, social services Black Ontario',
        ogTitle: 'Community Support Services at KMFW',
        ogDescription: 'You are not alone. KMFW connects Black individuals and families to resources, peer networks, and essential supports in their community.',
        ogImage: '',
        twitterTitle: 'Community Support | KMFW',
        twitterDescription: 'Essential community resources and peer support for Black individuals and families in Waterloo Region, Ontario.',
        noIndex: false,
    },
    'system-navigation': {
        title: 'System Navigation | Kind Minds Family Wellness',
        description: 'KMFW helps Black individuals and families navigate complex health, social, and government systems — ensuring they access the services and support they deserve.',
        keywords: 'system navigation Black community, social services support Waterloo, navigating healthcare Ontario, KMFW navigation service, health equity navigation',
        ogTitle: 'System Navigation at KMFW',
        ogDescription: "Confused by the system? KMFW's system navigators help Black individuals and families access the right services with culturally informed guidance.",
        ogImage: '',
        twitterTitle: 'System Navigation | KMFW',
        twitterDescription: 'Helping Black families navigate health care and social systems in Ontario with culturally grounded support.',
        noIndex: false,
    },
    'events': {
        title: 'Community Events | Kind Minds Family Wellness',
        description: 'Join KMFW at our upcoming community events, workshops, galas, and gatherings celebrating Black culture, wellness, and excellence in the Waterloo Region.',
        keywords: 'KMFW events, Black community events Waterloo, Black wellness workshops, Kind Minds events Ontario, Black Excellence Gala events',
        ogTitle: 'KMFW Community Events',
        ogDescription: 'From wellness workshops to celebratory galas — connect, grow, and thrive with the KMFW community at our upcoming events.',
        ogImage: '',
        twitterTitle: 'Community Events | KMFW',
        twitterDescription: 'Stay connected and inspired. Explore upcoming KMFW community events, workshops, and gatherings in Waterloo Region.',
        noIndex: false,
    },
    'impact': {
        title: 'Our Impact | Kind Minds Family Wellness',
        description: 'Discover the measurable impact of Kind Minds Family Wellness through our community stories, newsletters, and documented achievements in Black wellness and advocacy.',
        keywords: 'KMFW impact, Black community change, wellness outcomes Ontario, Kind Minds results, Black nonprofit impact Waterloo',
        ogTitle: 'The Impact of Kind Minds Family Wellness',
        ogDescription: 'Real stories, real change. See how KMFW is transforming mental health and wellbeing for Black communities in Waterloo Region.',
        ogImage: '',
        twitterTitle: 'Our Impact | KMFW',
        twitterDescription: 'Documented results and community stories showing the difference Kind Minds Family Wellness is making for Black families in Ontario.',
        noIndex: false,
    },
    'newsletters': {
        title: 'Newsletters & Media | Kind Minds Family Wellness',
        description: "Stay informed with KMFW's newsletters, media features, and community updates — covering Black wellness news, event recaps, and organizational announcements.",
        keywords: 'KMFW newsletter, Black wellness news, Kind Minds updates, community newsletter Waterloo, Black organization announcements Ontario',
        ogTitle: 'KMFW Newsletters & Community Updates',
        ogDescription: 'Stay in the loop with the latest news, resources, and stories from Kind Minds Family Wellness.',
        ogImage: '',
        twitterTitle: 'Newsletters | KMFW',
        twitterDescription: 'Community updates, announcements, and wellness resources from Kind Minds Family Wellness.',
        noIndex: false,
    },
    'success-stories': {
        title: 'Success Stories | Kind Minds Family Wellness',
        description: 'Be inspired by the real stories of resilience, growth, and transformation from members of the Black community who have been supported by Kind Minds Family Wellness.',
        keywords: 'KMFW success stories, Black wellness testimonials, mental health recovery stories, community transformation Ontario, Black resilience stories',
        ogTitle: 'Success Stories from the KMFW Community',
        ogDescription: "Inspiring stories of healing, strength, and community from individuals who have been touched by KMFW's programs and services.",
        ogImage: '',
        twitterTitle: 'Success Stories | KMFW',
        twitterDescription: 'Stories of resilience and transformation from the Black community served by Kind Minds Family Wellness.',
        noIndex: false,
    },
    'join-us': {
        title: 'Join Us | Kind Minds Family Wellness',
        description: 'Get involved with KMFW — volunteer, partner, donate, or apply for a career opportunity. Together we can empower the Black community and build healthier futures.',
        keywords: 'join KMFW, volunteer Black organization, partner with KMFW, donate Black wellness, support Black nonprofit Waterloo Ontario',
        ogTitle: 'Join the KMFW Movement',
        ogDescription: 'There are many ways to contribute to our mission. Volunteer, donate, partner, or build a career with KMFW.',
        ogImage: '',
        twitterTitle: 'Join Us | KMFW',
        twitterDescription: 'Join Kind Minds Family Wellness as a volunteer, partner, or supporter. Empower the Black community in Waterloo Region.',
        noIndex: false,
    },
    'careers': {
        title: 'Careers at KMFW | Kind Minds Family Wellness',
        description: 'Explore career opportunities at Kind Minds Family Wellness and join a team passionate about Black community health, mental wellness, and cultural advocacy.',
        keywords: 'KMFW careers, Black organization jobs, mental health jobs Waterloo, nonprofit careers Ontario, Black wellness careers',
        ogTitle: 'Work With KMFW — Careers',
        ogDescription: 'Join a team making a real difference. Explore career openings at Kind Minds Family Wellness in Waterloo Region, Ontario.',
        ogImage: '',
        twitterTitle: 'Careers | KMFW',
        twitterDescription: 'Make a meaningful impact. View open positions at Kind Minds Family Wellness in Waterloo Region.',
        noIndex: false,
    },
    'volunteer': {
        title: 'Volunteer With Us | Kind Minds Family Wellness',
        description: 'Give back to the Black community by volunteering with KMFW. We welcome dedicated individuals who are passionate about wellness, equity, and community empowerment.',
        keywords: 'volunteer KMFW, Black organization volunteering Waterloo, community volunteer Ontario, mental health volunteering, wellness volunteer',
        ogTitle: 'Volunteer at KMFW',
        ogDescription: 'Your time and skills can change lives. Volunteer with Kind Minds Family Wellness and be part of the movement.',
        ogImage: '',
        twitterTitle: 'Volunteer | KMFW',
        twitterDescription: 'Volunteer your time and talents at Kind Minds Family Wellness to uplift the Black community in Waterloo Region.',
        noIndex: false,
    },
    'funders': {
        title: 'Our Funders | Kind Minds Family Wellness',
        description: "Recognizing the foundations, corporations, and government partners who fund KMFW's mission and make our Black wellness programs possible in Waterloo Region.",
        keywords: 'KMFW funders, Black nonprofit funding, charitable funders Ontario, mental health funding Waterloo, Kind Minds supporters',
        ogTitle: 'Our Funders | Kind Minds Family Wellness',
        ogDescription: 'We are deeply grateful to the funders and investors who make Black community wellness possible through KMFW.',
        ogImage: '',
        twitterTitle: 'Our Funders | KMFW',
        twitterDescription: 'Meet the organizations and funders who support Kind Minds Family Wellness and our mission for Black wellness.',
        noIndex: false,
    },
    'partners': {
        title: 'Our Community Partners | Kind Minds Family Wellness',
        description: 'KMFW collaborates with a diverse network of community organizations, healthcare providers, and equity advocates to expand culturally safe care across Waterloo Region.',
        keywords: 'KMFW partners, Black organization partnerships Waterloo, community collaboration Ontario, healthcare partnerships, equity partners',
        ogTitle: 'Community Partners of KMFW',
        ogDescription: "A strong network of community organizations and healthcare providers stands behind Kind Minds Family Wellness's mission.",
        ogImage: '',
        twitterTitle: 'Our Partners | KMFW',
        twitterDescription: 'KMFW collaborates with community organizations and advocates to expand culturally safe care for Black families in Ontario.',
        noIndex: false,
    },
    'research': {
        title: 'Research & Consultancy | Kind Minds Family Wellness',
        description: 'KMFW provides culturally informed research and organizational consultancy services to help institutions better understand and serve Black communities across Canada.',
        keywords: 'KMFW research, Black community research Ontario, cultural consultancy, mental health research Black, organizational consulting diversity equity',
        ogTitle: 'Research & Consultancy at KMFW',
        ogDescription: 'Informed by community, driven by data. KMFW offers culturally grounded research and consultancy services for organizations.',
        ogImage: '',
        twitterTitle: 'Research & Consultancy | KMFW',
        twitterDescription: 'Culturally grounded research and consultancy from Kind Minds Family Wellness to help organizations better serve Black communities.',
        noIndex: false,
    },
    'neuro-divergent': {
        title: 'Neuro-Divergent Project | Kind Minds Family Wellness',
        description: 'The KMFW Neuro-Divergent Project investigates the intersectionality of neurodivergence and race, exploring how ADHD, autism, and related conditions are experienced within Black communities.',
        keywords: 'Black neurodivergent, ADHD Black community, autism Black children, neurodivergence race Ontario, KMFW neuro project, intersectionality mental health',
        ogTitle: 'The Neuro-Divergent Project at KMFW',
        ogDescription: 'Exploring how neurodivergence intersects with race and culture in Black communities — research-driven, community-centred.',
        ogImage: '',
        twitterTitle: 'Neuro-Divergent Project | KMFW',
        twitterDescription: "Research on neurodivergence in the Black community — ADHD, autism, and the intersection of race from Kind Minds Family Wellness's research arm.",
        noIndex: false,
    },
    'gala': {
        title: 'Black Excellence Gala | Kind Minds Family Wellness',
        description: 'The KMFW Black Excellence Gala is an annual celebration honoring the legacy and achievements of Black individuals and families in Canada. Join us for an unforgettable evening.',
        keywords: 'Black Excellence Gala, KMFW gala, Black awards gala Ontario, Black excellence celebration Waterloo, Kind Minds Gala, Black community event',
        ogTitle: 'Black Excellence Gala — Honouring Our Legacy',
        ogDescription: 'An evening of celebration, recognition, and inspiration. Join us at the KMFW Black Excellence Gala honouring Black achievement in Canada.',
        ogImage: '',
        twitterTitle: 'Black Excellence Gala | KMFW',
        twitterDescription: 'A premier celebration of Black excellence and achievement in Ontario. Join KMFW for an unforgettable annual gala.',
        noIndex: false,
    },
    'blog': {
        title: 'Blog | Kind Minds Family Wellness',
        description: 'Read insights, reflections, community stories, and updates from the Kind Minds Family Wellness team on topics including Black mental health, advocacy, and community empowerment.',
        keywords: 'KMFW blog, Black mental health articles, Black wellness stories, community empowerment blog, Black advocacy Ontario',
        ogTitle: 'The KMFW Blog',
        ogDescription: 'Stories, insights, and reflections on Black wellness, mental health, and community from the Kind Minds Family Wellness team.',
        ogImage: '',
        twitterTitle: 'KMFW Blog',
        twitterDescription: 'Insights and stories on Black mental health, advocacy, and community from Kind Minds Family Wellness.',
        noIndex: false,
    },
    'contact': {
        title: 'Contact Us | Kind Minds Family Wellness',
        description: 'Get in touch with Kind Minds Family Wellness. Reach out for program inquiries, partnership opportunities, media requests, or to access mental health support in Waterloo Region.',
        keywords: 'contact KMFW, Kind Minds contact, Waterloo mental health contact, reach KMFW, Black wellness contact Ontario',
        ogTitle: 'Contact Kind Minds Family Wellness',
        ogDescription: 'We are here for you. Contact KMFW for inquiries, support access, media, or partnership opportunities.',
        ogImage: '',
        twitterTitle: 'Contact KMFW',
        twitterDescription: 'Get in touch with Kind Minds Family Wellness for program inquiries or support in Waterloo Region, Ontario.',
        noIndex: false,
    },
    'donate': {
        title: 'Donate | Kind Minds Family Wellness',
        description: "Support KMFW's mission to empower the Black community by making a donation today. Your contribution directly funds culturally grounded wellness programs, counseling, and advocacy.",
        keywords: 'donate KMFW, support Black nonprofit, mental health donation Ontario, charitable donation Waterloo, fund Black wellness, KMFW fundraising',
        ogTitle: 'Donate to Kind Minds Family Wellness',
        ogDescription: 'Your generosity makes Black wellness possible. Donate to KMFW and help fund life-changing programs for our community.',
        ogImage: '',
        twitterTitle: 'Donate to KMFW',
        twitterDescription: 'Support Black community wellness with a donation to Kind Minds Family Wellness. Every dollar makes a difference.',
        noIndex: false,
    },
};

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
    const [seoData, setSeoData] = useState<SEOData>({});
    const [selectedPage, setSelectedPage] = useState<string>(KMFW_PAGES[0].key);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const siteId = currentSite?.id || 'kmfw';

    useEffect(() => {
        loadSEO();
    }, [currentSite]);

    const loadSEO = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getSEOData(siteId);
            if (data) {
                setSeoData(data);
            } else {
                // Start with empty data — prompt user to seed
                const defaults: SEOData = {};
                KMFW_PAGES.forEach(p => { defaults[p.key] = defaultPageSEO(p.label); });
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
        setSeeding(true);
        setStatus(null);
        try {
            await FirestoreService.saveSEOData(siteId, SEO_SEED_DATA);
            setSeoData(SEO_SEED_DATA);
            setStatus({ type: 'success', msg: 'All 26 pages seeded with professional SEO metadata!' });
        } catch (e) {
            console.error('Error seeding SEO:', e);
            setStatus({ type: 'error', msg: 'Failed to seed SEO data. Please try again.' });
        } finally {
            setSeeding(false);
        }
    };

    const currentPage = KMFW_PAGES.find(p => p.key === selectedPage) || KMFW_PAGES[0];
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
                title="SEO Manager | KMFW Admin"
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
                            {seededCount}/{KMFW_PAGES.length} pages have SEO configured.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSeedAll}
                            disabled={seeding}
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
                        title={status.type === 'success' ? 'Saved!' : 'Error'}
                        message={status.msg}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Page Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                Pages
                            </h2>
                            <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                                {KMFW_PAGES.map(page => {
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
                                    placeholder={`${currentPage.label} | Kind Minds Family Wellness`}
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
                                    placeholder="e.g. KMFW, Black wellness, mental health, Waterloo"
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
                                These fields control how the page appears when shared on Facebook, LinkedIn, Twitter/X, and WhatsApp.
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

                        {/* Google Preview */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4">
                                Google Search Preview
                            </h2>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 max-w-xl">
                                <div className="text-sm text-green-700 dark:text-green-400 mb-1">
                                    https://kindmindsfamilywellness.org{currentPage.path}
                                </div>
                                <div className="text-lg text-blue-800 dark:text-blue-300 font-medium hover:underline cursor-pointer leading-snug mb-1">
                                    {pageSEO.title || `${currentPage.label} | KMFW`}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {pageSEO.description || 'No description set. Add a meta description to improve search visibility.'}
                                </div>
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
