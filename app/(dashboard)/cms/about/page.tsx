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
import { Eye, EyeOff, ChevronDown, ChevronUp, Trash2, Search } from 'lucide-react';
import { SEED_DATA } from "@/config/seedData";
import SEOEditor from "@/components/form/SEOEditor";

interface AboutSection extends SectionContent {
    enabled?: boolean;
}

interface AboutPageContent extends PageContent {
    sections: Record<string, AboutSection>;
    seo?: {
        title?: string;
        description?: string;
        image?: string;
    };
}

const getSectionsConfig = (siteId: string) => {
    if (siteId === 'kmfw') {
        return [
            { id: 'header', label: 'Header & Philosophy' },
            { id: 'strategicPlan', label: 'Strategic Plan Summary' },
            { id: 'coreValues', label: 'Core Values' }
        ];
    }
    if (siteId === 'dmlabs') {
        return [
            { id: 'hero', label: 'Hero Section' },
            { id: 'mission', label: 'Mission Section' },
            { id: 'approach', label: 'Approach Section' },
            { id: 'stats', label: 'Stats Section' },
            { id: 'values', label: 'Core Values Section' },
            { id: 'ai_for_good', label: 'AI For Good Section' },
            { id: 'team', label: 'Team Section' }
        ];
    }
    if (siteId === 'aitasol') {
        return [
            { id: 'hero', label: 'Hero Section' },
            { id: 'mission', label: 'Mission & Vision' },
            { id: 'values', label: 'Core Values' }
        ];
    }
    // Fallback BWEIC config
    return [
        { id: 'header', label: 'About Header' },
        { id: 'mission', label: 'Mission & Vision' }
    ];
};

const getDefaultContent = (siteId: string): Record<string, SectionContent> => {
    if (siteId === 'kmfw') {
        return {
            header: {
                heading: "A gentle hand reaching out when you need it most.",
                subtitle: "Our Philosophy",
                content: "<p>Kind Minds Family Wellness was born from a simple belief: that mental health support should be accessible, warm, and free of clinical coldness.</p><p>We're not just a health portal; we're a community of professionals and families working together to build resilient, healthy homes.</p>",
                enabled: true,
                images: [{ url: '/assets/illustrations/wellness.jpg', alt: 'Culturally grounded wellness' }],
                stats: [{ value: '10+ Years', label: 'Supporting families in our community with compassionate care.' }],
                items: [
                    { title: 'Human Centered', desc: 'We prioritize real connection over clinical labels.', icon: 'Sun' },
                    { title: 'Family Focused', desc: 'Support that encompasses the whole family unit.', icon: 'Heart' }
                ]
            },
            strategicPlan: {
                heading: "Our Strategic Plan",
                content: "<p>Our five-year roadmap focuses on scaling our impact while maintaining the deeply personal, culturally grounded care that defines Kind Minds. We are committed to expanding our evidence-based research and advocacy efforts to create systemic change.</p>",
                enabled: true,
                stats: [{ value: '5+ Years', label: 'Of dedicated service to our community and growing stronger every year.' }],
                items: [
                    { title: 'Expanding mental health services for Black families.', icon: 'Award' },
                    { title: 'Strengthening community advocacy and system navigation.', icon: 'Shield' },
                    { title: 'Building a larger repository of culturally-informed research.', icon: 'BookOpen' }
                ]
            },
            coreValues: {
                heading: "The Values We Live By",
                content: "",
                enabled: true,
                items: [
                    { title: 'Compassion', desc: 'Leading with empathy and understanding in every interaction.', icon: 'Heart' },
                    { title: 'Excellence', desc: 'Committed to the highest quality of care and professionalism.', icon: 'Award' },
                    { title: 'Advocacy', desc: 'Standing up for our community and navigating complex systems.', icon: 'Shield' },
                    { title: 'Community', desc: 'Growing together through shared experiences and support.', icon: 'Users' }
                ]
            }
        };
    }
    
    if (siteId === 'dmlabs') {
        return {
            hero: {
                heading: "About Us",
                content: "At Digital Maples Labs, we specialize in helping nonprofits amplify their impact through modern web development, powerful digital marketing, and smart software solutions. We believe even the smallest organizations can create big change with the right digital tools.",
                enabled: true
            },
            mission: {
                heading: "Our Mission",
                content: "At Digital Maples Labs Inc, we believe every nonprofit deserves the right technology to thrive—tech that’s not only smart but also ethical. Our mission is to bridge the gap between social impact and digital innovation by empowering organizations with custom websites, strategic tools, and responsible AI solutions.",
                enabled: true
            },
            approach: {
                heading: "Our Approach",
                content: "We help nonprofits grow online with custom websites, smart marketing strategies, and powerful software solutions that make an impact. But we don’t stop there—we also make sure your AI behaves responsibly.",
                enabled: true
            },
            values: {
                heading: "The principles that drive every pixel we build.",
                subtitle: "Our Core Values",
                enabled: true,
                items: [
                    { title: "Impact First", desc: "We measure our success by the success of your mission. Every line of code is written to amplify your social footprint.", icon: "🎯" },
                    { title: "Radical Excellence", desc: "Nonprofits shouldn't settle for 'good enough'. We bring enterprise-grade quality to every budget-driven project.", icon: "💎" },
                    { title: "Ethical Partnership", desc: "We don't just build for you; we build with you. Transparency and mission-alignment are at the heart of our work.", icon: "🤝" }
                ]
            },
            ai_for_good: {
                heading: "Responsible AI for Nonprofit Success",
                subtitle: "[ AI FOR GOOD ]",
                content: "AI is changing the world, but it must be handled with care. We help nonprofits implement AI responsibly—auditing for bias, ensuring mission alignment, and training teams to use these powerful tools ethically.",
                enabled: true,
                items: [
                    { text: "Ethical AI Audits & Governance" },
                    { text: "AI Policy Development for Nonprofits" },
                    { text: "Mission-Aligned Algorithm Design" },
                    { text: "Responsible AI Training & Workshops" }
                ],
                images: [{ url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop", alt: "Responsible AI" }]
            },
            stats: {
                list: [
                    { label: 'PROJECTS COMPLETED', value: '24+' },
                    { label: 'YEARS OF EXPERIENCE', value: '05+' },
                    { label: 'CLIENT SATISFACTION', value: '99%' }
                ],
                enabled: true
            },
            team: {
                heading: "Meet the Team",
                content: "Our diverse team of designers, engineers, and strategists are united by one mission: helping good organizations do more good in the world.",
                enabled: true
            }
        };
    }

    if (siteId === 'aitasol') {
        return {
            hero: {
                heading: "Your Partner in Global Education Excellence",
                subtitle: "Empowering Students Since 2014",
                content: "<p>Aitasol is a leading education consultancy dedicated to helping students achieve their dreams of international education.</p>",
                enabled: true,
                images: [{ url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&h=1080&fit=crop', alt: 'Education consultancy' }]
            },
            mission: {
                heading: "Our Mission & Vision",
                content: "<p>Our mission is to simplify the complex process of international university applications and visa processing.</p>",
                enabled: true
            },
            values: {
                heading: "The Values That Guide Us",
                subtitle: "Our Core Principles",
                enabled: true,
                items: [
                    { title: "Integrity", desc: "Honest guidance throughout the process.", icon: "ShieldCheck" },
                    { title: "Excellence", desc: "High success rates in admissions.", icon: "Award" }
                ]
            }
        };
    }
    
    // Default BWEIC fallback
    return {
        header: {
            heading: "About Us",
            content: "<p>Welcome to BWEIC.</p>",
            enabled: true
        },
        mission: {
            heading: "Our Mission",
            content: "<p>Mission</p>",
            enabled: true
        }
    };
};

export default function AboutPageManager() {
    const { currentSite } = useSite();
    const [content, setContent] = useState<AboutPageContent | null>(null);
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
            const data = await FirestoreService.getPageContent('about', currentSite.id);
            const mergedSections: Record<string, AboutSection> = {};

            Object.keys(defaultContentForSite).forEach(key => {
                mergedSections[key] = { ...defaultContentForSite[key] };
            });

            if (data && data.sections) {
                const sections = data.sections;
                Object.keys(sections).forEach(key => {
                    if (mergedSections[key]) {
                        mergedSections[key] = { ...mergedSections[key], ...sections[key] };
                    } else {
                        mergedSections[key] = sections[key];
                    }
                });
                setContent({ ...data, sections: mergedSections } as AboutPageContent);
            } else {
                const initialSections: Record<string, AboutSection> = {};
                sectionsConfig.forEach(sec => {
                    initialSections[sec.id] = {
                        enabled: true,
                        ...(defaultContentForSite[sec.id] || { heading: sec.label, content: "" })
                    };
                });
                setContent({ title: "About Page", sections: initialSections });
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
            await FirestoreService.savePageContent('about', content, currentSite.id);
            setSuccessMsg("About page settings saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    const handleSeedData = async () => {
        if (!confirm(`Initialize "${currentSite.name}" About Page with professional seed data?`)) return;
        setSaving(true);
        try {
            const seed = (SEED_DATA as any)[currentSite.id]?.about;
            if (!seed) {
                throw new Error("No seed data found for this site's about page.");
            }
            await FirestoreService.savePageContent("about", seed, currentSite.id);
            setContent(seed);
            setSuccessMsg("🌱 Seeded about page defaults successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to seed data: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setSaving(false);
        }
    };

    const handleSectionChange = (sectionId: string, field: keyof AboutSection, value: any) => {
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

    const handleSEOChange = (seoData: any) => {
        if (!content) return;
        setContent({
            ...content,
            seo: seoData
        });
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta
                title={`About Page Manager - ${currentSite.name} | Admin Portal`}
                description="Manage About Page sections and content"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            About Page Manager
                        </h2>
                        <p className="text-sm text-gray-500">
                            Manage content for the {currentSite.name} about page.
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

                                            {['header', 'hero', 'values'].includes(config.id) && (
                                                <div>
                                                    <Label>Subtitle / Secondary Heading</Label>
                                                    <Input
                                                        type="text"
                                                        value={section.subtitle || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {['header', 'strategicPlan', 'mission', 'approach', 'hero', 'team', 'values', 'ai_for_good'].includes(config.id) && (
                                                <div>
                                                    <div className="mb-2"><Label>Body Content</Label></div>
                                                    <RichTextEditor
                                                        label=""
                                                        value={section.content || ""}
                                                        onChange={(newContent: string) => handleSectionChange(config.id, "content", newContent)}
                                                    />
                                                </div>
                                            )}

                                            {/* Generic Array Items */}
                                            {['header', 'strategicPlan', 'coreValues', 'values'].includes(config.id) && (
                                                <div className="mt-4">
                                                    <Label>List Items</Label>
                                                    <div className="space-y-3">
                                                        {(section.items || []).map((item: any, idx: number) => (
                                                            <div key={idx} className="flex flex-col gap-3 bg-white p-4 border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-bold text-sm text-gray-500">Item {idx + 1}</span>
                                                                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => {
                                                                        const newItems = [...(section.items || [])];
                                                                        newItems.splice(idx, 1);
                                                                        handleSectionChange(config.id, "items", newItems);
                                                                    }}>Remove</Button>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div><Label>Title/Icon Label</Label><Input value={item.title || ''} onChange={(e) => updateItem(config.id, idx, 'title', e.target.value)} /></div>
                                                                    <div><Label>Icon/Emoji (e.g. 🎯)</Label><Input value={item.icon || ''} onChange={(e) => updateItem(config.id, idx, 'icon', e.target.value)} /></div>
                                                                    {config.id !== 'strategicPlan' && <div className="col-span-2"><Label>Description</Label><Input value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" onClick={() => {
                                                            const newItems = [...(section.items || []), {}];
                                                            handleSectionChange(config.id, "items", newItems);
                                                        }}>+ Add Item</Button>
                                                    </div>
                                                </div>
                                            )}

                                            {config.id === 'ai_for_good' && (
                                                <div className="mt-4">
                                                    <Label>Feature Points</Label>
                                                    <div className="space-y-3">
                                                        {(section.items || []).map((item: any, idx: number) => (
                                                            <div key={idx} className="flex gap-4 items-center bg-white p-3 border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                                <div className="flex-1">
                                                                    <Input 
                                                                        value={item.text} 
                                                                        onChange={(e) => updateItem(config.id, idx, 'text', e.target.value)} 
                                                                        placeholder="Point text"
                                                                    />
                                                                </div>
                                                                <Button variant="outline" size="sm" className="text-red-500" onClick={() => {
                                                                    const newItems = [...(section.items || [])];
                                                                    newItems.splice(idx, 1);
                                                                    handleSectionChange(config.id, "items", newItems);
                                                                }}>Remove</Button>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" onClick={() => {
                                                            const newItems = [...(section.items || []), { text: "" }];
                                                            handleSectionChange(config.id, "items", newItems);
                                                        }}>+ Add Point</Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feature Images */}
                                            {(config.id === 'header' || config.id === 'ai_for_good' || config.id === 'hero') && (
                                                <div className="mt-4">
                                                    <ImagePicker
                                                        label="Main Feature Image / Hero Image"
                                                        value={section.images?.[0]?.url || section.imageUrl || ""}
                                                        onChange={(url) => {
                                                            const newImages = [...(section.images || [])];
                                                            if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                            newImages[0].url = url;
                                                            // Also update imageUrl for backward compatibility/different field names
                                                            handleSectionChange(config.id, "images", newImages);
                                                            handleSectionChange(config.id, "imageUrl", url);
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Emphasized Stats / Badges (Legacy/Header) */}
                                            {['header', 'strategicPlan'].includes(config.id) && (
                                                <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                                    <h4 className="font-bold mb-3 text-sm text-gray-700 dark:text-gray-300">Feature Badge / Statistic</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Highlight Value (e.g. "10+ Years")</Label>
                                                            <Input 
                                                                value={section.stats?.[0]?.value || ""} 
                                                                onChange={(e) => {
                                                                    const newStats = [...(section.stats || [])];
                                                                    if (!newStats[0]) newStats[0] = { value: "", label: "" };
                                                                    newStats[0].value = e.target.value;
                                                                    handleSectionChange(config.id, "stats", newStats);
                                                                }} 
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Label Description</Label>
                                                            <Input 
                                                                value={section.stats?.[0]?.label || ""} 
                                                                onChange={(e) => {
                                                                    const newStats = [...(section.stats || [])];
                                                                    if (!newStats[0]) newStats[0] = { value: "", label: "" };
                                                                    newStats[0].label = e.target.value;
                                                                    handleSectionChange(config.id, "stats", newStats);
                                                                }} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Specialized Stats List for DMLabs */}
                                            {config.id === 'stats' && currentSite.id === 'dmlabs' && (
                                                <div className="mt-4 space-y-4">
                                                    <Label>Impact Metrics List</Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {(section.list || []).map((item: any, idx: number) => (
                                                            <div key={idx} className="bg-white dark:bg-gray-900/50 p-4 border rounded-lg space-y-3 relative">
                                                                <button 
                                                                    className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                                                    onClick={() => {
                                                                        const newList = [...(section.list || [])];
                                                                        newList.splice(idx, 1);
                                                                        handleSectionChange(config.id, "list", newList);
                                                                    }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                                <div>
                                                                    <Label className="text-xs mb-1">Value (e.g. 50+)</Label>
                                                                    <Input value={item.value || ''} onChange={(e) => {
                                                                        const newList = [...(section.list || [])];
                                                                        newList[idx] = { ...newList[idx], value: e.target.value };
                                                                        handleSectionChange(config.id, "list", newList);
                                                                    }} />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs mb-1">Label (e.g. Projects Done)</Label>
                                                                    <Input value={item.label || ''} onChange={(e) => {
                                                                        const newList = [...(section.list || [])];
                                                                        newList[idx] = { ...newList[idx], label: e.target.value };
                                                                        handleSectionChange(config.id, "list", newList);
                                                                    }} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        const newList = [...(section.list || []), { value: '', label: '' }];
                                                        handleSectionChange(config.id, "list", newList);
                                                    }}>+ Add Impact Metric</Button>
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
