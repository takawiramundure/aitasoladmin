import React, { useEffect, useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { FirestoreService, PageContent, SectionContent } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import RichTextEditor from "../../components/form/RichTextEditor";
import Alert from "../../components/ui/alert/Alert";
import ImagePicker from '../../components/form/ImagePicker';
import VideoPicker from '../../components/form/VideoPicker';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

interface HomeSection extends SectionContent {
    enabled?: boolean;
}

interface HomePageContent extends PageContent {
    sections: Record<string, HomeSection>;
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
                    { title: 'Programs & Services', desc: 'From counseling to system navigation, discover how we can help you today.', icon: 'Heart', link: '/services' },
                    { title: 'Community Events', desc: 'Join us for our Black Excellence Gala and other local community gatherings.', icon: 'Calendar', link: '/impact/events' }
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

            if (data && data.sections) {
                // Override with existing data from DB
                const sections = data.sections;
                Object.keys(sections).forEach(key => {
                    if (mergedSections[key]) {
                        mergedSections[key] = { ...mergedSections[key], ...sections[key] };
                    } else {
                        mergedSections[key] = sections[key];
                    }
                });
                setContent({ ...data, sections: mergedSections } as HomePageContent);
            } else {
                // Initialize with default structure
                const initialSections: Record<string, HomeSection> = {};
                sectionsConfig.forEach(sec => {
                    const defaults = defaultContentForSite[sec.id] || {};
                    initialSections[sec.id] = {
                        heading: sec.label,
                        content: "",
                        enabled: true,
                        ...defaults
                    };
                });
                setContent({
                    title: "Home Page",
                    sections: initialSections
                });
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
            await FirestoreService.savePageContent('home', content, currentSite.id);
            setSuccessMsg("Home page settings saved successfully!");
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
            sections: {
                ...content.sections,
                [sectionId]: {
                    ...content.sections[sectionId],
                    [field]: value
                }
            }
        });
    };

    const updateItem = (sectionId: string, idx: number, field: string, value: string) => {
        if (!content) return;
        const newItems = [...(content.sections[sectionId].items || [])];
        newItems[idx] = { ...newItems[idx], [field]: value };
        handleSectionChange(sectionId, "items", newItems);
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
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
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="space-y-4">
                    {sectionsConfig.map((config) => {
                        const section = content?.sections[config.id] || { heading: config.label, content: "", enabled: true };
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
                                            <div>
                                                <Label>Heading</Label>
                                                <Input
                                                    type="text"
                                                    value={section.heading || ""}
                                                    onChange={(e) => handleSectionChange(config.id, "heading", e.target.value)}
                                                />
                                            </div>

                                            {/* Optional Subtitle */}
                                            {(config.id === 'coreFoundations' || config.id === 'howItWorks' || config.id === 'testimonials') && (
                                                <div>
                                                    <Label>Subtitle</Label>
                                                    <Input
                                                        type="text"
                                                        value={section.subtitle || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {/* Content only for certain sections like mission, mindfulness, founder */}
                                            {['mission', 'founder', 'mindfulness'].includes(config.id) && (
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

                                            {/* ITEMS EDITOR BLOCKS */}
                                            {['coreFoundations', 'howItWorks', 'testimonials', 'mindfulness'].includes(config.id) && (
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

                                                                {config.id === 'howItWorks' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Title</Label><Input value={item.title || ''} onChange={(e) => updateItem(config.id, idx, 'title', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Description</Label><textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={2} value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'testimonials' && (
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div><Label className="text-xs mb-1">Author Name</Label><Input value={item.author || ''} onChange={(e) => updateItem(config.id, idx, 'author', e.target.value)} /></div>
                                                                        <div><Label className="text-xs mb-1">Role / Subtitle</Label><Input value={item.role || ''} onChange={(e) => updateItem(config.id, idx, 'role', e.target.value)} /></div>
                                                                        <div className="col-span-2"><Label className="text-xs mb-1">Quote</Label><textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} value={item.quote || ''} onChange={(e) => updateItem(config.id, idx, 'quote', e.target.value)} /></div>
                                                                    </div>
                                                                )}

                                                                {config.id === 'mindfulness' && (
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        <div><Label className="text-xs mb-1">Bullet Point Text</Label><Input value={item.text || ''} onChange={(e) => updateItem(config.id, idx, 'text', e.target.value)} /></div>
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
                                                        {(section.images || []).map((img, idx) => (
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
                                                        {(section.stats || []).map((stat, idx) => (
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
