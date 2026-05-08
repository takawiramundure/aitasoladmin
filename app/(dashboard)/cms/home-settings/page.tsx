"use client";

import React, { useEffect, useState } from 'react';
import PageMeta from "@/components/common/PageMeta";
import { FirestoreService, PageContent, SectionContent } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import RichTextEditor from "@/components/form/RichTextEditor";
import Alert from "@/components/ui/alert/Alert";
import ImagePicker from "@/components/form/ImagePicker";
import VideoPicker from "@/components/form/VideoPicker";
import { Eye, EyeOff, ChevronDown, ChevronUp, Search, Trash2 } from 'lucide-react';
import { SEED_DATA } from "@/config/seedData";

import SEOEditor from "@/components/form/SEOEditor";
import { useDialog } from "@/context/DialogContext";

interface HomeSection extends SectionContent {
    enabled?: boolean;
    [key: string]: any; // Allow site-specific fields (missionHeading, buttonLink, etc.)
}

interface HomePageContent extends PageContent {
    sections: Record<string, HomeSection>;
    seo?: {
        title?: string;
        description?: string;
        image?: string;
    };
}

const getSectionsConfig = (siteId: string) => {
    if (siteId === 'kmfw') {
        return [
            { id: 'coreFoundations', label: 'Core Foundations' },
            { id: 'mindfulness', label: 'Mindfulness Section' },
            { id: 'mission', label: 'Mission / Objectives' },
            { id: 'whyWeWorkDifferently', label: 'Why We Work Differently' },
            { id: 'slideshow', label: 'Animated Image Slideshow' },
            { id: 'slider', label: 'Gallery Slider' },
            { id: 'howItWorks', label: 'How It Works' },
            { id: 'testimonials', label: 'Testimonials' }
        ];
    }
    if (siteId === 'dmlabs') {
        return [
            { id: 'hero', label: 'Hero Section' },
            { id: 'ticker', label: 'Ticker Section' },
            { id: 'trusted_by', label: 'Trusted By Section' },
            { id: 'who_we_are', label: 'Who We Are' },
            { id: 'pricing', label: 'Pricing Section' },
            { id: 'final_cta', label: 'Final Call to Action' }
        ];
    }
    if (siteId === 'noel') {
        return [
            { id: 'hero', label: 'Hero Section' },
            { id: 'services', label: 'Specialized Services' },
            { id: 'our_story', label: 'Our Story (Home Section)' },
            { id: 'projects', label: 'Recent Projects (Toggle)' },
            { id: 'reviews', label: 'Testimonials (Toggle)' }
        ];
    }
    if (siteId === 'aitasol') {
        return [
            { id: 'hero', label: 'Hero Section' },
            { id: 'stats', label: 'Impact Stats' },
            { id: 'services', label: 'Services Section' },
            { id: 'destinations', label: 'Destinations Section' },
            { id: 'process', label: 'Our Process' },
            { id: 'testimonials', label: 'Testimonials' },
            { id: 'cta', label: 'Call to Action' }
        ];
    }
    return [
        { id: 'founder', label: 'Message from Founder' },
        { id: 'mission', label: 'Why Choose BWEIC' },
        { id: 'slider', label: 'Image Slider' },
        { id: 'impact', label: 'Impact / Stats' }
    ];
};

const getDefaultContent = (siteId: string): Record<string, SectionContent> => {
    if (siteId === 'kmfw') {
        return {
            coreFoundations: {
                heading: "Our Core Foundations",
                subtitle: "Comprehensive culturally-grounded support tailored to the unique needs of our community.",
                content: "",
                enabled: true,
                items: [
                    { title: 'About Our Mission', desc: 'Rooted in community, we provide research-backed, culturally informed support.', icon: 'Users', link: '/about' },
                    { title: 'Meet The Team', desc: 'Discover the passionate individuals driving transformative change.', icon: 'UserCircle', link: '/about/meet-our-team' },
                    { title: 'The KMFW Impact', desc: 'Learn how our dedication is making a real difference in the Waterloo region.', icon: 'Target', link: '/impact' }
                ]
            },
            mindfulness: {
                heading: "Mindful Wellness, Deeply Rooted.",
                content: "<p>We go beyond traditional therapy, incorporating mindfulness practices that resonate with our community's cultural background and spiritual traditions.</p>",
                enabled: true,
                items: [
                    { text: 'Culturally-guided meditation sessions' },
                    { text: 'Holistic wellness workshops' },
                    { text: 'Spiritually-affirming practices' }
                ],
                images: [{ url: '/assets/illustrations/meditation.jpg', alt: 'Mindfulness and Meditation' }],
                videoUrl: ""
            },
            mission: {
                heading: "Mission Statement",
                content: "<p>Your mission statement goes here.</p>",
                enabled: true
            },
            whyWeWorkDifferently: {
                heading: "Why do we have to work differently at KMFW?",
                bodyText: "Below, we share a growing diversity of Black-identified persons in our region based on the recent census by Statistics Canada (2022). Analyzing our region's municipal, provincial, and federal data, we compared numbers between 2016 and 2021, and the increase of more than 5% of new residents to the region being Black-identifying means that the support and services we provide have become more critical as the demand for customized and culturally inclusive support for Black persons grows locally.",
                quote: "Recognizing their experiences of systemic/structural barriers and disenfranchisement in existing (Eurocentric) services, we address the health and social needs of Black-identifying persons who must use a culturally grounded approach. Our approach promises better outcomes as it also targets and addresses the layers of culture and identity within service provision. Also, the data and growth can only validate the need for all Black-serving organizations to intentionally ensure equitable practices, procedures, and protocols inform their services and support to Black-identifying recipients..",
                quoteAuthor: "Ajirioghene Evi",
                quoteAuthorTitle: "Founding Director",
                statsTitle: "Waterloo Region by the Numbers",
                stat2016Value: "~15,000",
                stat2016Label: "Black Population in 2016",
                stat2021Value: "~26,500",
                stat2021Label: "Black Population in 2021",
                growthBadgeText: "+5% increase in Black-identifying new residents to the region between 2016–2021",
                chartImage: "/assets/illustrations/waterloo-region-stats.png",
                subSectionHeading: "WATERLOO REGION BY THE NUMBERS",
                subSectionText: "One of our Research Coordinators has captured the growing diversity of Black-identified persons in our region. They analyzed the Waterloo Region's municipal, provincial, and federal data and compared numbers between 2016 and 2021.",
                statCards: [
                    { stat: "16.7%", color: "#e8f5e9", text: "In Waterloo Region, Blacks (16.7%) were the 2nd most commonly reported visible minority group between 2016 and 2019. This is an increase from 15.1% in 2016. The number of people identifying as Black increased by about 11,455 (Region of Waterloo, 2019, Census Canada, 2023)." },
                    { stat: "2.9%", color: "#e3f2fd", text: "In 2016, 15,110 persons (2.9% of the population) identified as Black in the Waterloo Region (Statistics Canada, 2017)." },
                    { stat: "6.8%", color: "#fff3e0", text: "Blacks are the 2nd most significant minority group in Kitchener, Ontario, according to the 2017 Census. This is a percentage increase from 4.1% in 2016. The total visible minority population in Kitchener is 80,485, and the Black population is 17,510 (21.8%). (Statistics Canada, 2017)" },
                    { stat: "5.0%", color: "#fce4ec", text: "In Hamilton, Ontario, Black persons are the second largest visible minority group. According to the Census, 28,415 (20.2%) were Black-identifying persons, thus making them the 2nd most visible population in 2021. This is an increase from 20,245 persons in Hamilton who identify as Black in 2017. (Social Planning and Research Council of Hamilton, 2017; Statistics Canada, 2017)" },
                    { stat: "22.4%", color: "#f3e5f5", text: "There are 585 (22.4%) Black persons in Stratford, Ontario. Blacks are the 2nd most prominent minority group in Stratford. This is an increase from 335 (18.4%) in 2016. (Statistics Canada, 2017)" },
                    { stat: "14.9%", color: "#e8eaf6", text: "In Cambridge, Ontario, the second largest group is the Black, making up 4,880 (14.9%), an increase from 3,255 people in 2016 (Statistics Canada, 2021)" },
                    { stat: "16.5%", color: "#e0f7fa", text: "In Guelph, Ontario, Black persons are 5,940 (16.5%) – 2nd most in 2021. This moves them up to 2nd most minority group from the 3rd most prominent minority group in Guelph as of 2017 (Statistics Canada, 2017)." },
                    { stat: "4.1%", color: "#f9fbe7", text: "There are 17,450 Black persons in London, Ontario, the 3rd most prominent minority group. This is an increase of about 5,505 persons identifying as Black. (Statistics Canada, 2021)." },
                ],
                enabled: true
            } as any,
            slideshow: {
                heading: "Our Community in Action",
                content: "",
                enabled: true,
                images: []
            },
            slider: {
                heading: "Gallery",
                content: "",
                enabled: true,
                images: []
            },
            howItWorks: {
                heading: "Your Path to Wellness",
                subtitle: "We make it simple and safe to get the support your family needs to thrive.",
                content: "",
                enabled: true,
                items: [
                    { title: 'Initial Connection', desc: 'Reach out via phone or our secure contact form for a brief, compassionate orientation.' },
                    { title: 'Culturally-Informed Matching', desc: 'We match your family with the right counselor or support program based on your unique needs.' },
                    { title: 'Guided Wellness Path', desc: 'Begin your journey with consistent support, advocacy, and a community that understands you.' }
                ]
            },
            testimonials: {
                heading: "Stories from our families",
                subtitle: "Real experiences from people who have walked this path before you.",
                content: "",
                enabled: true,
                items: [
                    { quote: "Finding Kind Minds felt like exhaling after holding my breath for months. They truly listened to our family.", author: "Sarah", role: "Parent of two" }
                ]
            }
        };
    }

    if (siteId === 'dmlabs') {
        return {
            hero: {
                heading: "Hero Section",
                title: "Empowering You Through <br /> Digital Innovation.",
                subtitle: "We help small businesses and nonprofits grow online with custom websites, strategic marketing, and powerful software solutions—while also making sure their AI plays nice. From crafting ethical AI policies and auditing for hidden biases to aligning AI with your mission and training teams on responsible AI use, we ensure technology works for you, not against you.",
                enabled: true
            } as any,
            ticker: {
                items: [
                    { text: "Websites" },
                    { text: "AI Safety" },
                    { text: "Graphics" },
                    { text: "Cyber Sec" }
                ],
                enabled: true
            },
            trusted_by: {
                items: [
                    { name: "Global Health" },
                    { name: "Tech For Good" },
                    { name: "Algoma Foundation" }
                ],
                enabled: true
            },
            who_we_are: {
                heading: "Whether you’re a Startup or budget-driven Non-Profit, we’re here to help you reach new heights online.",
                subtitle: "[ WHO WE ARE ]",
                content: "At Digital Maples Labs Inc., we specialize in helping nonprofits amplify their impact through modern web development, powerful digital marketing, and smart software solutions. We believe even the smallest organizations can create big change with the right digital tools.",
                enabled: true,
                images: [{ url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop", alt: "Digital Maples Team" }],
                missionHeading: "Our Mission",
                missionContent: "At Digital Maples Labs Inc, we believe every nonprofit deserves the right technology to thrive—tech that’s not only smart but also ethical. Our mission is to bridge the gap between social impact and digital innovation by empowering organizations with custom websites, strategic tools, and responsible AI solutions.",
                approachHeading: "Our Approach",
                approachContent: "We help nonprofits grow online with custom websites, smart marketing strategies, and powerful software solutions that make an impact. But we don’t stop there—we also make sure your AI behaves responsibly. Whether it's building ethical systems, auditing algorithms for bias, or training your team to use AI wisely.",
                moreAboutLink: "/about"
            } as any,
            pricing: {
                heading: "Transparent Pricing for Nonprofits",
                subtitle: "PRICING PLANS",
                enabled: true,
                items: [
                    { name: "Foundation", price: { monthly: 99, yearly: 79 }, period: "/mo", features: ["5-Page Professional Website", "Trauma-Informed Design"], cta: "Get Started", link: "/contact" },
                ]
            },
            final_cta: {
                heading: "Get in touch with us to start your nonprofit’s digital transformation today.",
                enabled: true,
                buttonText: "GET IN TOUCH ↗",
                buttonLink: "/contact",
                secondaryText: "SEE MORE PROJECTS →",
                secondaryLink: "/project"
            } as any
        };
    }

    if (siteId === 'noel') {
        return {
            services: {
                heading: "Our Specialized Services",
                subtitle: "WHAT WE DO",
                content: "Providing high-end craftsmanship and professional construction services for your home and business.",
                enabled: true,
                items: [
                    { title: 'Exterior Work', desc: 'From roofing to custom siding, we ensure your home makes a lasting impression.' },
                    { title: 'Woodworking', desc: 'Bespoke cabinetry and custom millwork tailored to your unique style.' },
                    { title: 'Renovations', desc: 'Full-scale interior transformations that blend functionality with elegance.' }
                ]
            },
            our_story: {
                heading: "A Legacy of Craftsmanship",
                subtitle: "OUR STORY",
                content: "<p>At Noel Construction, we believe that every home tells a story. Our journey began with a simple passion for building things that last—not just structures, but legacies.</p><p>With decades of experience in high-end residential and commercial projects, our team brings a meticulous eye for detail to every renovation and custom build. We don't just follow blueprints; we realize visions.</p>",
                enabled: true,
                images: [{ url: "https://images.unsplash.com/photo-1541915059797-bc5cb677749a?w=1200&q=80", alt: "Craftsmanship" }]
            },
            projects: {
                heading: "Featured Craftsmanship",
                subtitle: "RECENT PROJECTS",
                content: "",
                enabled: true
            },
            reviews: {
                heading: "What Our Clients Say",
                subtitle: "TESTIMONIALS",
                content: "",
                enabled: true
            }
        };
    }

    if (siteId === 'aitasol') {
        return {
            hero: {
                badge: "Trusted by 5,000+ Students",
                title: "Your Journey to Global Education Starts Here",
                subtitle: "Unlock world-class opportunities with expert guidance.",
                primaryButton: "Free Consultation",
                secondaryButton: "Explore Destinations",
                primaryLink: "/contact",
                secondaryLink: "/destinations",
                enabled: true
            } as any,
            stats: {
                heading: "Our Impact",
                enabled: true,
                items: [
                    { label: "Students Placed", value: "5,000+", icon: "Users" },
                    { label: "Visa Success Rate", value: "98%", icon: "CheckCircle2" }
                ]
            },
            process: {
                heading: "How We Help You Succeed",
                subtitle: "Our simple 4-step process",
                enabled: true,
                items: [
                    { title: "Free Inquiry", desc: "Submit your details for a free consultation." },
                    { title: "Application", desc: "We manage your entire application process." }
                ]
            },
            services: {
                heading: "Comprehensive Services for Every Step of Your Journey",
                subtitle: "Our Expertise",
                content: "We provide a full spectrum of consultancy services to ensure your transition to international education is seamless and successful.",
                enabled: true
            },
            destinations: {
                heading: "Explore Popular Destinations",
                subtitle: "World-Class Education",
                enabled: true
            },
            testimonials: {
                heading: "What Our Students Say",
                subtitle: "Student Stories",
                content: "Join thousands of successful students who have started their international education journey with Aitasol.",
                enabled: true,
                items: [
                    { name: "Sarah Johnson", university: "University of Toronto", country: "Canada", program: "Master of Computer Science", quote: "Aitasol made my dream of studying in Canada a reality.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
                    { name: "Ahmed Raza", university: "Imperial College London", country: "UK", program: "MSc in Data Science", quote: "The personalized counseling sessions helped me choose the right program.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
                    { name: "Emily Chen", university: "University of Melbourne", country: "Australia", program: "Bachelor of Business", quote: "Highly recommend Aitasol for their pre-departure briefing.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" }
                ]
            },
            cta: {
                heading: "Ready to Start Your Global Success Story?",
                subtitle: "Don't navigate the complex world of international education alone. Let our experts guide you every step of the way.",
                primaryButton: "Book Free Consultation",
                secondaryButton: "WhatsApp Us",
                primaryLink: "/contact",
                whatsappNumber: "1234567890",
                enabled: true
            }
        };
    }
    
    // Default BWEIC
    return {
        founder: {
            heading: "Message from the founder",
            content: `
                <p class="text-gray-600 leading-relaxed mb-6">
                    At BWEIC, we have focused on generating safe spaces and promoting personal sovereignty amongst Black women across Canada.
                </p>
            `,
            quote: "Since its inception, BWEIC has become an essential refuge for Black women...",
            subtitle: "SINCE 2024",
            author_name: "Amelia K. Hamilton",
            author_title: "FOUNDER",
            signature: "A.K. Hamilton",
            enabled: true,
            images: [{ url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", alt: "Founder" }]
        },
        mission: {
            heading: "Creating pathways from survival to sovereignty for Black women across Canada",
            content: "<p><strong>Our Mission:</strong> To create safe, affirming spaces where Black women in Canada can heal...</p>",
            enabled: true
        },
        slider: {
            heading: "Gallery",
            content: "",
            enabled: true,
            images: []
        },
        impact: {
            heading: "Our Impact",
            content: "",
            enabled: true,
            stats: [
                { value: "500+", label: "Women Empowered" },
                { value: "50+", label: "Workshops Held" }
            ]
        }
    };
};

export default function HomePageManager() {
    const { currentSite } = useSite();
    const { confirm, alert: dialogAlert } = useDialog();
    const [content, setContent] = useState<HomePageContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const sectionsConfig = getSectionsConfig(currentSite.id);
    const defaultContentForSite = getDefaultContent(currentSite.id);

    useEffect(() => {
        loadContent();
    }, [currentSite]);

    const loadContent = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getPageContent('home', currentSite.id);
            const mergedSections: Record<string, HomeSection> = {};

            // Start with defaults to ensure all fields exist
            Object.keys(defaultContentForSite).forEach(key => {
                mergedSections[key] = { ...defaultContentForSite[key] };
            });

            if (data) {
                // Determine if data is nested under 'sections' (Modern site structure)
                const sourceData = data.sections ? data.sections : data;
                
                Object.keys(sourceData).forEach(key => {
                    if (mergedSections[key]) {
                        mergedSections[key] = { ...mergedSections[key], ...(sourceData[key] as any) };
                    } else if (key !== 'title' && key !== 'seo' && key !== 'id' && key !== 'sections') {
                        mergedSections[key] = sourceData[key] as any;
                    }
                });
                
                // Preserve non-section fields (title, seo)
                setContent({
                    ...mergedSections,
                    title: data.title || "Home",
                    seo: data.seo || {}
                } as any);
            } else {
                setContent(defaultContentForSite as any);
            }
        } catch (err: any) {
            console.error(err);
            setError("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        setSuccessMsg("");
        setError("");
        try {
            // For modern sites, wrap the content in 'sections' for the dynamic frontend loader
            const modernSites = ['dmlabs', 'noel', 'nspc', 'aitasol'];
            let dataToSave: any = { ...content };
            
            if (modernSites.includes(currentSite.id)) {
                const { title, seo, ...sections } = content as any;
                dataToSave = {
                    title: title || "Home",
                    seo: seo || {},
                    sections: sections
                };
            }

            await FirestoreService.savePageContent("home", dataToSave, currentSite.id);
            setSuccessMsg("Home page content updated successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    const handleSectionChange = (sectionId: string, field: keyof HomeSection, value: any) => {
        if (!content) return;
        setContent({
            ...content,
            [sectionId]: {
                ...(content as any)[sectionId],
                [field]: value
            }
        });
    };

    const updateItem = (sectionId: string, idx: number, field: string, value: string) => {
        if (!content) return;
        const newItems = [...((content as any)[sectionId].items || [])];
        newItems[idx] = { ...newItems[idx], [field]: value };
        handleSectionChange(sectionId, "items" as any, newItems);
    };

    const handleSeedData = async () => {
        const isConfirmed = await confirm({
            title: "Seed Home Page Data",
            message: `This will overwrite the current home page sections for "${currentSite.name}" with professional seed data. This action cannot be undone.`,
            variant: "warning",
            confirmLabel: "Seed Data"
        });

        if (!isConfirmed) return;
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            const seed = (SEED_DATA as any)[currentSite.id]?.home;
            if (!seed) {
                throw new Error("No seed data found for this site's home page.");
            }
            
            // Flatten seed for the editor if it's nested
            const flattenedContent = seed.sections ? { ...seed.sections, title: seed.title, seo: seed.seo } : seed;
            
            // Save in the correctly nested format for the database
            await FirestoreService.savePageContent("home", seed, currentSite.id);
            
            // 2. Seed related collections if data exists (for modern sites like DMLabs)
            const fullSeed = (SEED_DATA as any)[currentSite.id];
            
            // Seed Services
            if (fullSeed.services) {
                let servicesData = fullSeed.services;
                // If it's just an array, wrap it for the useCollection hook
                if (Array.isArray(servicesData)) {
                    servicesData = { services: servicesData };
                }
                // If it's already an object (e.g. { sections, services: [...] }), save it as is
                await FirestoreService.savePageContent("services", servicesData, currentSite.id);
            }
            
            // Seed Projects
            if (fullSeed.projects) {
                let projectsData = fullSeed.projects;
                // Standardize to { projects: [...] } format if it's just an array or using 'items'
                if (Array.isArray(projectsData)) {
                    projectsData = { projects: projectsData };
                } else if (!projectsData.projects && projectsData.items) {
                    projectsData = { ...projectsData, projects: projectsData.items };
                }
                await FirestoreService.savePageContent("projects", projectsData, currentSite.id);
            }

            setContent(flattenedContent);
            setSuccessMsg("Default content seeded successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to seed data: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setSaving(false);
        }
    };

    const handleSEOChange = (seoData: any) => {
        if (!content) return;
        setContent({
            ...content,
            seo: seoData
        });
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta
                title={`Home Page Manager - ${currentSite.name} | Admin Portal`}
                description="Manage Home Page sections and visibility"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            Home Page Manager
                        </h2>
                        <p className="text-sm text-gray-500">
                            Toggle visibility and edit content for {currentSite.name} home page sections.
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {['dmlabs', 'noel', 'aitasol'].includes(currentSite.id) && (
                            <Button variant="outline" onClick={handleSeedData} disabled={saving} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                                🌱 Seed Default Data
                            </Button>
                        )}
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                {/* SEO Settings Section */}
                <div className="mb-8 p-6 border border-indigo-500/20 bg-indigo-500/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Search size={20} className="text-indigo-500" />
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Search Engine Optimization</h3>
                    </div>
                    <SEOEditor 
                        data={content?.seo || {}} 
                        onChange={handleSEOChange}
                    />
                </div>

                <div className="space-y-4">
                    {sectionsConfig.map((config) => {
                        const section = (content as any)?.[config.id] || { heading: config.label, content: "", enabled: true };
                        const isExpanded = expandedSections[config.id];

                        return (
                            <div key={config.id} className={`border rounded-lg transition-all duration-200 ${section.enabled ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-white/[0.02]' : 'border-gray-200 bg-gray-100 opacity-75 dark:bg-gray-900'}`}>
                                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection(config.id)}>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSectionChange(config.id, 'enabled', !section.enabled);
                                            }}
                                            className={`p-1.5 rounded-md transition-colors ${section.enabled ? 'text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-200 dark:text-gray-500'}`}
                                            title={section.enabled ? "Section Visible" : "Section Hidden"}
                                        >
                                            {section.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </button>
                                        <h3 className={`font-medium ${section.enabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                                            {config.label}
                                        </h3>
                                    </div>
                                    <div className="text-gray-400">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 mt-2">
                                        <div className="grid gap-5">
                                            {/* Standard Heading - Hidden for DMLabs Hero Section as it's redundant */}
                                            {!(config.id === 'hero' && currentSite.id === 'dmlabs') && (
                                                <div>
                                                    <Label>Heading</Label>
                                                    <Input
                                                        type="text"
                                                        value={section.heading || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "heading", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {/* Optional Subtitle */}
                                            {['coreFoundations', 'howItWorks', 'testimonials', 'who_we_are', 'services', 'destinations', 'process'].includes(config.id) && (
                                                <div>
                                                    <Label>Subtitle</Label>
                                                    <Input
                                                        type="text"
                                                        value={section.subtitle || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {config.id === 'hero' && (
                                                <div>
                                                    <Label>Hero Title (HTML/Break tags allowed)</Label>
                                                    <Input
                                                        type="text"
                                                        value={(section as any).title || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "title" as any, e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {config.id === 'hero' && currentSite.id === 'aitasol' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Badge Text</Label>
                                                        <Input value={(section as any).badge || ""} onChange={(e) => handleSectionChange(config.id, "badge" as any, e.target.value)} placeholder="e.g. Trusted by 5000+ Students" />
                                                    </div>
                                                    <div>
                                                        <Label>Primary Button Text</Label>
                                                        <Input value={(section as any).primaryButton || ""} onChange={(e) => handleSectionChange(config.id, "primaryButton" as any, e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Secondary Button Text</Label>
                                                        <Input value={(section as any).secondaryButton || ""} onChange={(e) => handleSectionChange(config.id, "secondaryButton" as any, e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Primary Link Path</Label>
                                                        <Input value={(section as any).primaryLink || ""} onChange={(e) => handleSectionChange(config.id, "primaryLink" as any, e.target.value)} placeholder="/contact" />
                                                    </div>
                                                    <div>
                                                        <Label>Secondary Link Path</Label>
                                                        <Input value={(section as any).secondaryLink || ""} onChange={(e) => handleSectionChange(config.id, "secondaryLink" as any, e.target.value)} placeholder="/destinations" />
                                                    </div>
                                                    <div>
                                                        <ImagePicker 
                                                            label="Background Image"
                                                            value={section.imageUrl || ""}
                                                            onChange={(url) => handleSectionChange(config.id, "imageUrl" as any, url)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {config.id === 'cta' && currentSite.id === 'aitasol' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <Label>Description / Subtitle</Label>
                                                        <textarea 
                                                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            rows={3}
                                                            value={section.subtitle || ""}
                                                            onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Primary Button Text</Label>
                                                        <Input value={(section as any).primaryButton || ""} onChange={(e) => handleSectionChange(config.id, "primaryButton" as any, e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Secondary Button Text</Label>
                                                        <Input value={(section as any).secondaryButton || ""} onChange={(e) => handleSectionChange(config.id, "secondaryButton" as any, e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <Label>Primary Link Path</Label>
                                                        <Input value={(section as any).primaryLink || ""} onChange={(e) => handleSectionChange(config.id, "primaryLink" as any, e.target.value)} placeholder="/contact" />
                                                    </div>
                                                    <div>
                                                        <Label>WhatsApp Number</Label>
                                                        <Input value={(section as any).whatsappNumber || ""} onChange={(e) => handleSectionChange(config.id, "whatsappNumber" as any, e.target.value)} placeholder="e.g. 1234567890" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Plain-text description for these section types */}
                                            {['services', 'destinations', 'testimonials', 'process'].includes(config.id) && (
                                                <div>
                                                    <Label>Description</Label>
                                                    <textarea
                                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        rows={3}
                                                        value={section.content || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "content", e.target.value)}
                                                        placeholder="Section description text..."
                                                    />
                                                </div>
                                            )}

                                            {/* Content only for certain sections like mission, mindfulness, founder */}
                                            {['mission', 'founder', 'mindfulness', 'our_story'].includes(config.id) && (
                                                <div>
                                                    <div className="mb-2">
                                                        <Label>Body Content</Label>
                                                    </div>
                                                    <RichTextEditor
                                                        label=""
                                                        value={section.content || ""}
                                                        onChange={(newContent: string) => handleSectionChange(config.id, "content", newContent)}
                                                    />
                                                </div>
                                            )}

                                            {/* Subtitle logic for Noel & DMLabs */}
                                            {(currentSite.id === 'noel' || currentSite.id === 'dmlabs') && ['services', 'our_story', 'projects', 'reviews', 'who_we_are', 'final_cta'].includes(config.id) && (
                                                <div>
                                                    <Label>{currentSite.id === 'dmlabs' ? 'Subheading / Label' : 'Section Subtitle (Overhead Label)'}</Label>
                                                    <Input
                                                        type="text"
                                                        value={section.subtitle || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {/* Specialized Content for DMLabs Who We Are */}
                                            {config.id === 'who_we_are' && currentSite.id === 'dmlabs' && (
                                                <div className="space-y-4 pt-2">
                                                    <div>
                                                        <Label>Intro Paragraph</Label>
                                                        <RichTextEditor
                                                            label=""
                                                            value={section.content || ""}
                                                            onChange={(newContent: string) => handleSectionChange(config.id, "content", newContent)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-gray-100 dark:border-gray-800">
                                                        <div className="space-y-4">
                                                            <div className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">Mission Column</div>
                                                            <div><Label>Heading</Label><Input value={section.missionHeading || ""} onChange={(e) => handleSectionChange(config.id, "missionHeading", e.target.value)} /></div>
                                                            <div><Label>Description</Label><RichTextEditor label="" value={section.missionContent || ""} onChange={(v) => handleSectionChange(config.id, "missionContent", v)} /></div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">Approach Column</div>
                                                            <div><Label>Heading</Label><Input value={section.approachHeading || ""} onChange={(e) => handleSectionChange(config.id, "approachHeading", e.target.value)} /></div>
                                                            <div><Label>Description</Label><RichTextEditor label="" value={section.approachContent || ""} onChange={(v) => handleSectionChange(config.id, "approachContent", v)} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                                        <Label>"More About" Button/Link Path</Label>
                                                        <Input value={section.moreAboutLink || ""} onChange={(e) => handleSectionChange(config.id, "moreAboutLink", e.target.value)} placeholder="/about" />
                                                    </div>
                                                    <div>
                                                        <ImagePicker 
                                                            label="Section Image"
                                                            value={section.images?.[0]?.url || section.imageUrl || ""}
                                                            onChange={(url) => {
                                                                const newImages = [...(section.images || [])];
                                                                if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                                newImages[0].url = url;
                                                                handleSectionChange(config.id, "images", newImages);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hero Subtitle for DMLabs */}
                                            {config.id === 'hero' && currentSite.id === 'dmlabs' && (
                                                <div className="mt-2">
                                                    <Label>Hero Subtitle / Description</Label>
                                                    <textarea 
                                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-theme-sm"
                                                        rows={4}
                                                        value={section.subtitle || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                        placeholder="Small intro text under the title..."
                                                    />
                                                </div>
                                            )}

                                            {/* Ticker Items for DMLabs */}
                                            {config.id === 'ticker' && currentSite.id === 'dmlabs' && (
                                                <div className="mt-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Scrolling Services (Ticker Items)</Label>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => {
                                                                const items = [...(section.items || []), { text: "" }];
                                                                handleSectionChange(config.id, "items", items);
                                                            }}
                                                        >
                                                            + Add Service
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {(section.items || []).map((item: any, idx: number) => (
                                                            <div key={idx} className="flex gap-2 items-center">
                                                                <Input 
                                                                    value={item.text} 
                                                                    onChange={(e) => {
                                                                        const items = [...(section.items || [])];
                                                                        items[idx] = { ...items[idx], text: e.target.value };
                                                                        handleSectionChange(config.id, "items", items);
                                                                    }}
                                                                    placeholder="e.g. Web Design"
                                                                />
                                                                <button 
                                                                    onClick={() => {
                                                                        const items = (section.items || []).filter((_: any, i: number) => i !== idx);
                                                                        handleSectionChange(config.id, "items", items);
                                                                    }}
                                                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {(section.items || []).length === 0 && (
                                                            <div className="text-sm text-gray-400 italic py-2">No services added yet.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Final CTA Buttons for DMLabs */}
                                            {config.id === 'final_cta' && currentSite.id === 'dmlabs' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mt-2">
                                                    <div className="space-y-4">
                                                        <div className="font-bold text-xs uppercase text-gray-400">Primary Button</div>
                                                        <div><Label>Label</Label><Input value={section.buttonText || ""} onChange={(e) => handleSectionChange(config.id, "buttonText", e.target.value)} /></div>
                                                        <div><Label>Link Path</Label><Input value={section.buttonLink || ""} onChange={(e) => handleSectionChange(config.id, "buttonLink", e.target.value)} /></div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="font-bold text-xs uppercase text-gray-400">Secondary Link</div>
                                                        <div><Label>Label</Label><Input value={section.secondaryText || ""} onChange={(e) => handleSectionChange(config.id, "secondaryText", e.target.value)} /></div>
                                                        <div><Label>Link Path</Label><Input value={section.secondaryLink || ""} onChange={(e) => handleSectionChange(config.id, "secondaryLink", e.target.value)} /></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Specialized Content for Noel Services */}
                                            {config.id === 'services' && currentSite.id === 'noel' && (
                                                <div className="mt-4">
                                                    <Label>Services Description (Brief)</Label>
                                                    <textarea
                                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-theme-sm"
                                                        rows={2}
                                                        value={section.content || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "content", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {/* Specialized Stats for Noel Our Story */}
                                            {config.id === 'our_story' && currentSite.id === 'noel' && (
                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-white/[0.03] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                                    <div className="space-y-4">
                                                        <div className="text-xs font-bold text-brand-500 uppercase tracking-widest">Stat 1 (Experience)</div>
                                                        <div><Label>Value (e.g. 35+)</Label><Input value={(section as any).stat1Value || ""} onChange={(e) => handleSectionChange(config.id, "stat1Value" as any, e.target.value)} /></div>
                                                        <div><Label>Label</Label><Input value={(section as any).stat1Label || ""} onChange={(e) => handleSectionChange(config.id, "stat1Label" as any, e.target.value)} /></div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="text-xs font-bold text-brand-500 uppercase tracking-widest">Stat 2 (Certification)</div>
                                                        <div><Label>Value (e.g. 2008)</Label><Input value={(section as any).stat2Value || ""} onChange={(e) => handleSectionChange(config.id, "stat2Value" as any, e.target.value)} /></div>
                                                        <div><Label>Label</Label><Input value={(section as any).stat2Label || ""} onChange={(e) => handleSectionChange(config.id, "stat2Label" as any, e.target.value)} /></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ITEMS EDITOR BLOCKS */}
                                            {['coreFoundations', 'howItWorks', 'testimonials', 'mindfulness', 'pricing', 'trusted_by', 'stats', 'process'].includes(config.id) && (
                                                <div className="mt-4">
                                                    <Label>List Items</Label>
                                                    <div className="space-y-3">
                                                        {(section.items || []).map((item: any, idx: number) => (
                                                            <div key={idx} className="flex flex-col gap-3 bg-white p-4 border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">Item {idx + 1}</span>
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm" 
                                                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                                                        onClick={() => {
                                                                            const newItems = [...(section.items || [])];
                                                                            newItems.splice(idx, 1);
                                                                            handleSectionChange(config.id, "items", newItems);
                                                                        }}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>

                                                                {config.id === 'coreFoundations' && (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div><Label className="text-xs mb-1">Title</Label><Input value={item.title || ''} onChange={(e) => updateItem(config.id, idx, 'title', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Link (e.g., /about)</Label><Input value={item.link || ''} onChange={(e) => updateItem(config.id, idx, 'link', e.target.value)} /></div>
                                                                        <div className="col-span-2"><Label className="text-xs mb-1">Description</Label><Input value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'stats' && (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div><Label className="text-xs mb-1">Label</Label><Input value={item.label || ''} onChange={(e) => updateItem(config.id, idx, 'label', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Value</Label><Input value={item.value || ''} onChange={(e) => updateItem(config.id, idx, 'value', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Icon (Lucide name)</Label><Input value={item.icon || ''} onChange={(e) => updateItem(config.id, idx, 'icon', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Text Color Class</Label><Input value={item.color || ''} onChange={(e) => updateItem(config.id, idx, 'color', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'howItWorks' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Title</Label><Input value={item.title || ''} onChange={(e) => updateItem(config.id, idx, 'title', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Description</Label><textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={2} value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>
                                                                    </div>
                                                                )}
                                                                {config.id === 'testimonials' && (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div><Label className="text-xs mb-1">Author Name</Label><Input value={item.author || item.name || ''} onChange={(e) => updateItem(config.id, idx, item.author ? 'author' : 'name', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">University</Label><Input value={item.university || item.role || ''} onChange={(e) => updateItem(config.id, idx, 'university', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Country</Label><Input value={item.country || ''} onChange={(e) => updateItem(config.id, idx, 'country', e.target.value)} placeholder="e.g. Canada" /></div>
                                                                        <div><Label className="text-xs mb-1">Program</Label><Input value={item.program || ''} onChange={(e) => updateItem(config.id, idx, 'program', e.target.value)} placeholder="e.g. Master of Computer Science" /></div>
                                                                        <div className="col-span-2"><Label className="text-xs mb-1">Quote</Label><textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} value={item.quote || ''} onChange={(e) => updateItem(config.id, idx, 'quote', e.target.value)} /></div>
                                                                        <div className="col-span-2">
                                                                            <ImagePicker
                                                                                label="Author Photo"
                                                                                value={item.image || ''}
                                                                                onChange={(url) => updateItem(config.id, idx, 'image', url)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'services' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Service Title</Label><Input value={item.title || ''} onChange={(e) => updateItem(config.id, idx, 'title', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Description</Label><textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={2} value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Icon (Lucide name)</Label><Input value={item.icon || ''} onChange={(e) => updateItem(config.id, idx, 'icon', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'destinations' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Destination Name</Label><Input value={item.name || ''} onChange={(e) => updateItem(config.id, idx, 'name', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Description</Label><textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={2} value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>
                                                                        <div>
                                                                            <ImagePicker
                                                                                label="Destination Image"
                                                                                value={item.image || ''}
                                                                                onChange={(url) => updateItem(config.id, idx, 'image', url)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'mindfulness' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Bullet Point Text</Label><Input value={item.text || ''} onChange={(e) => updateItem(config.id, idx, 'text', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'process' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Title</Label><Input value={item.title || ''} onChange={(e) => updateItem(config.id, idx, 'title', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Description</Label><textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={2} value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Icon (Lucide name)</Label><Input value={item.icon || ''} onChange={(e) => updateItem(config.id, idx, 'icon', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'ticker' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Service/Keyword</Label><Input value={item.text || ''} onChange={(e) => updateItem(config.id, idx, 'text', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'trusted_by' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Partner/Client Name (Logo text)</Label><Input value={item.name || ''} onChange={(e) => updateItem(config.id, idx, 'name', e.target.value)} /></div>
                                                                    </div>
                                                                )}


                                                                 {config.id === 'pricing' && (
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label className="text-xs mb-1">Plan Name</Label>
                                                                                <Input value={item.name || item.title || ''} onChange={(e) => updateItem(config.id, idx, 'name', e.target.value)} />
                                                                            </div>
                                                                            <div className="flex items-center gap-2 pt-6">
                                                                                <input 
                                                                                    type="checkbox" 
                                                                                    checked={item.highlighted || item.isPopular || false} 
                                                                                    onChange={(e) => updateItem(config.id, idx, 'isPopular', e.target.checked as any)}
                                                                                    className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                                                                                />
                                                                                <Label className="text-xs">Highlighted / Popular</Label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                             {typeof item.price === 'object' && item.price !== null ? (
                                                                                <div className="flex gap-2 items-end">
                                                                                    <div className="flex-1">
                                                                                        <Label className="text-[10px] mb-1 text-blue-500 uppercase font-bold">Monthly $</Label>
                                                                                        <Input 
                                                                                            value={item.price?.monthly || ''} 
                                                                                            onChange={(e) => {
                                                                                                const newVal = e.target.value.replace(/[^0-9.]/g, '');
                                                                                                updateItem(config.id, idx, 'price', { ...item.price, monthly: newVal });
                                                                                            }} 
                                                                                        />
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <Label className="text-[10px] mb-1 text-green-500 uppercase font-bold">Yearly $</Label>
                                                                                        <Input 
                                                                                            value={item.price?.yearly || ''} 
                                                                                            onChange={(e) => {
                                                                                                const newVal = e.target.value.replace(/[^0-9.]/g, '');
                                                                                                updateItem(config.id, idx, 'price', { ...item.price, yearly: newVal });
                                                                                            }} 
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                             ) : (
                                                                                <div>
                                                                                    <Label className="text-xs mb-1">Price (e.g. 999)</Label>
                                                                                    <Input 
                                                                                        value={item.price || ''} 
                                                                                        onChange={(e) => {
                                                                                            const newVal = e.target.value.replace(/[^0-9.]/g, '');
                                                                                            // Initialize as object on first edit if possible
                                                                                            updateItem(config.id, idx, 'price', JSON.stringify({ monthly: newVal, yearly: newVal }));
                                                                                        }} 
                                                                                    />
                                                                                </div>
                                                                             )}
                                                                             <div>
                                                                                 <Label className="text-xs mb-1">Period (e.g. one-time, /mo)</Label>
                                                                                 <Input value={item.period || ''} onChange={(e) => updateItem(config.id, idx, 'period', e.target.value)} />
                                                                             </div>
                                                                         </div>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label className="text-xs mb-1">CTA Text</Label>
                                                                                <Input value={item.cta || ''} onChange={(e) => updateItem(config.id, idx, 'cta', e.target.value)} />
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-xs mb-1">CTA Link</Label>
                                                                                <Input value={item.link || ''} onChange={(e) => updateItem(config.id, idx, 'link', e.target.value)} />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs mb-1">Features (One per line)</Label>
                                                                            <textarea 
                                                                                className="w-full px-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                                                rows={4}
                                                                                value={Array.isArray(item.features) ? item.features.join('\n') : (item.features || '')}
                                                                                onChange={(e) => {
                                                                                    const features = e.target.value.split('\n').filter(f => f.trim() !== '');
                                                                                    updateItem(config.id, idx, 'features', features as any);
                                                                                }}
                                                                                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newItems = [...(section.items || []), {}];
                                                                handleSectionChange(config.id, "items", newItems);
                                                            }}
                                                        >
                                                            + Add Item
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                             {/* Slider & Slideshow Section - Gallery Images */}
                                            {(config.id === 'slider' || config.id === 'slideshow') && (
                                                <div className="mt-4">
                                                    <Label>Gallery Images</Label>
                                                    <div className="space-y-3">
                                                        {(section.images || []).map((img: { url: string; alt: string }, idx: number) => (
                                                            <div key={idx} className="flex gap-4 items-end bg-white p-3 border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                                <div className="flex-1">
                                                                    <ImagePicker
                                                                        label="Image URL"
                                                                        value={img.url}
                                                                        helpText="Recommended: 800x600px (4:3) or 800x800px (1:1)."
                                                                        onChange={(url) => {
                                                                            const newImages = [...(section.images || [])];
                                                                            newImages[idx] = { ...newImages[idx], url };
                                                                            handleSectionChange(config.id, "images", newImages);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Label className="text-xs mb-1">Alt Text</Label>
                                                                    <Input
                                                                        value={img.alt}
                                                                        onChange={(e) => {
                                                                            const newImages = [...(section.images || [])];
                                                                            newImages[idx] = { ...newImages[idx], alt: e.target.value };
                                                                            handleSectionChange(config.id, "images", newImages);
                                                                        }}
                                                                        placeholder="Image description"
                                                                    />
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newImages = [...(section.images || [])];
                                                                        newImages.splice(idx, 1);
                                                                        handleSectionChange(config.id, "images", newImages);
                                                                    }}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newImages = [...(section.images || []), { url: "", alt: "" }];
                                                                handleSectionChange(config.id, "images", newImages);
                                                            }}
                                                        >
                                                            + Add Image
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mindfulness Image / General Specific Image block */}
                                            {config.id === 'mindfulness' && (
                                                  <div className="mt-4 space-y-4">
                                                      <div>
                                                         <VideoPicker
                                                             label="Video URL (YouTube or Media Library)"
                                                             value={section.videoUrl || ""} 
                                                             onChange={(url) => handleSectionChange(config.id, "videoUrl", url)} 
                                                             placeholder="https://www.youtube.com/watch?v=..."
                                                             helpText="Paste a YouTube link or pick an uploaded MP4 from the Media Library.\nMax individual video duration: 2 minutes."
                                                         />
                                                     </div>
                                                     <div>
                                                         <ImagePicker
                                                             label="Feature Image (Fallback)"
                                                             value={section.images?.[0]?.url || ""}
                                                             helpText="Recommended: 800x1000px portrait."
                                                             onChange={(url) => {
                                                                 const newImages = [...(section.images || [])];
                                                                 if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                                 newImages[0].url = url;
                                                                 handleSectionChange(config.id, "images", newImages);
                                                             }}
                                                         />
                                                     </div>
                                                 </div>
                                            )}

                                            {/* Why We Work Differently — dedicated editor */}
                                            {config.id === 'whyWeWorkDifferently' && (
                                                <div className="space-y-5 mt-4">
                                                    <div>
                                                        <Label>Body Text</Label>
                                                        <textarea
                                                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            rows={5}
                                                            value={(section as any).bodyText || ""}
                                                            onChange={(e) => handleSectionChange(config.id, "bodyText" as any, e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Pull Quote</Label>
                                                        <textarea
                                                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            rows={5}
                                                            value={(section as any).quote || ""}
                                                            onChange={(e) => handleSectionChange(config.id, "quote" as any, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Quote Author Name</Label>
                                                            <Input value={(section as any).quoteAuthor || ""} onChange={(e) => handleSectionChange(config.id, "quoteAuthor" as any, e.target.value)} placeholder="Ajirioghene Evi" />
                                                        </div>
                                                        <div>
                                                            <Label>Quote Author Title</Label>
                                                            <Input value={(section as any).quoteAuthorTitle || ""} onChange={(e) => handleSectionChange(config.id, "quoteAuthorTitle" as any, e.target.value)} placeholder="Founding Director" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Stats Box Title</Label>
                                                        <Input value={(section as any).statsTitle || ""} onChange={(e) => handleSectionChange(config.id, "statsTitle" as any, e.target.value)} placeholder="Waterloo Region by the Numbers" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>2016 Stat Value</Label>
                                                            <Input value={(section as any).stat2016Value || ""} onChange={(e) => handleSectionChange(config.id, "stat2016Value" as any, e.target.value)} placeholder="~15,000" />
                                                        </div>
                                                        <div>
                                                            <Label>2016 Stat Label</Label>
                                                            <Input value={(section as any).stat2016Label || ""} onChange={(e) => handleSectionChange(config.id, "stat2016Label" as any, e.target.value)} placeholder="Black Population in 2016" />
                                                        </div>
                                                        <div>
                                                            <Label>2021 Stat Value</Label>
                                                            <Input value={(section as any).stat2021Value || ""} onChange={(e) => handleSectionChange(config.id, "stat2021Value" as any, e.target.value)} placeholder="~26,500" />
                                                        </div>
                                                        <div>
                                                            <Label>2021 Stat Label</Label>
                                                            <Input value={(section as any).stat2021Label || ""} onChange={(e) => handleSectionChange(config.id, "stat2021Label" as any, e.target.value)} placeholder="Black Population in 2021" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Growth Badge Text</Label>
                                                        <Input value={(section as any).growthBadgeText || ""} onChange={(e) => handleSectionChange(config.id, "growthBadgeText" as any, e.target.value)} placeholder="+5% increase..." />
                                                    </div>
                                                    <div>
                                                        <ImagePicker
                                                            label="Bar Chart Image"
                                                            value={(section as any).chartImage || ""}
                                                            helpText="Upload or select the statistics chart image from the Media Library."
                                                            onChange={(url) => handleSectionChange(config.id, "chartImage" as any, url)}
                                                        />
                                                    </div>

                                                    {/* Sub-section */}
                                                    <div className="border-t pt-4 mt-2">
                                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Regional Stats Sub-Section</p>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <Label>Sub-Section Heading</Label>
                                                                <Input value={(section as any).subSectionHeading || ""} onChange={(e) => handleSectionChange(config.id, "subSectionHeading" as any, e.target.value)} placeholder="WATERLOO REGION BY THE NUMBERS" />
                                                            </div>
                                                            <div>
                                                                <Label>Sub-Section Description</Label>
                                                                <textarea
                                                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                                    rows={3}
                                                                    value={(section as any).subSectionText || ""}
                                                                    onChange={(e) => handleSectionChange(config.id, "subSectionText" as any, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Stat Cards Editor */}
                                                    <div className="border-t pt-4 mt-2">
                                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Regional Stat Cards</p>
                                                        <div className="space-y-4">
                                                            {((section as any).statCards || []).map((card: any, idx: number) => (
                                                                <div key={idx} className="flex flex-col gap-3 bg-white p-4 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                                    <div className="flex justify-between items-center">
                                                                        <span
                                                                            className="text-xs font-bold uppercase tracking-widest text-gray-500 px-2 py-1 rounded"
                                                                            style={{ backgroundColor: card.color || '#f3f4f6' }}
                                                                        >
                                                                            Card {idx + 1}
                                                                        </span>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                                                            onClick={() => {
                                                                                const cards = [...((section as any).statCards || [])];
                                                                                cards.splice(idx, 1);
                                                                                handleSectionChange(config.id, "statCards" as any, cards);
                                                                            }}
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </div>
                                                                    <div className="grid grid-cols-3 gap-3 items-end">
                                                                        <div>
                                                                            <Label className="text-xs mb-1">Stat (e.g. 16.7%)</Label>
                                                                            <Input
                                                                                value={card.stat || ""}
                                                                                onChange={(e) => {
                                                                                    const cards = [...((section as any).statCards || [])];
                                                                                    cards[idx] = { ...cards[idx], stat: e.target.value };
                                                                                    handleSectionChange(config.id, "statCards" as any, cards);
                                                                                }}
                                                                                placeholder="16.7%"
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-2">
                                                                            <Label className="text-xs mb-1">Card Background Color</Label>
                                                                            <div className="flex items-center gap-2">
                                                                                <input
                                                                                    type="color"
                                                                                    value={card.color || "#f3f4f6"}
                                                                                    onChange={(e) => {
                                                                                        const cards = [...((section as any).statCards || [])];
                                                                                        cards[idx] = { ...cards[idx], color: e.target.value };
                                                                                        handleSectionChange(config.id, "statCards" as any, cards);
                                                                                    }}
                                                                                    className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                                                                                />
                                                                                <Input
                                                                                    value={card.color || "#f3f4f6"}
                                                                                    onChange={(e) => {
                                                                                        const cards = [...((section as any).statCards || [])];
                                                                                        cards[idx] = { ...cards[idx], color: e.target.value };
                                                                                        handleSectionChange(config.id, "statCards" as any, cards);
                                                                                    }}
                                                                                    placeholder="#e8f5e9"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs mb-1">Card Text (verbatim)</Label>
                                                                        <textarea
                                                                            className="w-full px-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                                            rows={3}
                                                                            value={card.text || ""}
                                                                            onChange={(e) => {
                                                                                const cards = [...((section as any).statCards || [])];
                                                                                cards[idx] = { ...cards[idx], text: e.target.value };
                                                                                handleSectionChange(config.id, "statCards" as any, cards);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const cards = [...((section as any).statCards || []), { stat: "", text: "", color: "#f3f4f6" }];
                                                                    handleSectionChange(config.id, "statCards" as any, cards);
                                                                }}
                                                            >
                                                                + Add Stat Card
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Impact Section - Stats (Legacy handling for BWEIC mostly) */}
                                            {config.id === 'impact' && (
                                                <div className="mt-4">
                                                    <Label>Impact Statistics</Label>
                                                    <div className="space-y-3">
                                                        {(section.stats || []).map((stat: { value: string; label: string }, idx: number) => (
                                                            <div key={idx} className="flex gap-4 items-end bg-white p-3 border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                                <div className="flex-1">
                                                                    <Label className="text-xs mb-1">Value (e.g. 500+)</Label>
                                                                    <Input
                                                                        value={stat.value}
                                                                        onChange={(e) => {
                                                                            const newStats = [...(section.stats || [])];
                                                                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                                                                            handleSectionChange(config.id, "stats", newStats);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <Label className="text-xs mb-1">Label (e.g. Women Empowered)</Label>
                                                                    <Input
                                                                        value={stat.label}
                                                                        onChange={(e) => {
                                                                            const newStats = [...(section.stats || [])];
                                                                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                                                                            handleSectionChange(config.id, "stats", newStats);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                                                    onClick={() => {
                                                                        const newStats = [...(section.stats || [])];
                                                                        newStats.splice(idx, 1);
                                                                        handleSectionChange(config.id, "stats", newStats);
                                                                    }}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newStats = [...(section.stats || []), { value: "", label: "" }];
                                                                handleSectionChange(config.id, "stats", newStats);
                                                            }}
                                                        >
                                                            + Add Stat
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Founder Specific Meta (Legacy BWEIC mostly) */}
                                            {config.id === 'founder' && (
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <ImagePicker
                                                            label="Main Portrait (Large)"
                                                            value={section.images?.[0]?.url || ""}
                                                            helpText="Recommended: 600x800px (3:4 portrait)."
                                                            onChange={(url) => {
                                                                const newImages = [...(section.images || [])];
                                                                if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                                newImages[0].url = url;
                                                                handleSectionChange(config.id, "images", newImages);
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <ImagePicker
                                                            label="Secondary Image (Small Inset)"
                                                            value={section.images?.[1]?.url || ""}
                                                            helpText="Recommended: 400x400px (1:1 square)."
                                                            onChange={(url) => {
                                                                const newImages = [...(section.images || [])];
                                                                if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                                if (!newImages[1]) newImages[1] = { url: "", alt: "" };
                                                                newImages[1].url = url;
                                                                handleSectionChange(config.id, "images", newImages);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div><Label>Subtitle / Date</Label><Input value={section.subtitle || ""} onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)} placeholder="SINCE 2024" /></div>
                                                        <div><Label>Author Title</Label><Input value={section.author_title || ""} onChange={(e) => handleSectionChange(config.id, "author_title", e.target.value)} placeholder="FOUNDER" /></div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div><Label>Author Name</Label><Input value={section.author_name || ""} onChange={(e) => handleSectionChange(config.id, "author_name", e.target.value)} placeholder="Amelia K. Hamilton" /></div>
                                                        <div><Label>Signature Text</Label><Input value={section.signature || ""} onChange={(e) => handleSectionChange(config.id, "signature", e.target.value)} placeholder="A.K. Hamilton" /></div>
                                                    </div>

                                                    <div>
                                                        <Label>Quote Text</Label>
                                                        <textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} value={section.quote || ""} onChange={(e) => handleSectionChange(config.id, "quote", e.target.value)} placeholder="Quote..." />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
