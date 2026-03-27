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
                    initialSections[sec.id] = {
                        heading: sec.label,
                        content: "",
                        enabled: true,
                        ...(defaultContentForSite[sec.id] || {})
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
