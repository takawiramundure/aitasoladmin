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
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

interface AboutSection extends SectionContent {
    enabled?: boolean;
}

interface AboutPageContent extends PageContent {
    sections: Record<string, AboutSection>;
}

const getSectionsConfig = (siteId: string) => {
    if (siteId === 'kmfw') {
        return [
            { id: 'header', label: 'Header & Philosophy' },
            { id: 'strategicPlan', label: 'Strategic Plan Summary' },
            { id: 'coreValues', label: 'Core Values' }
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

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta
                title={`About Page Manager - ${currentSite.name} | Admin Portal`}
                description="Manage About Page sections and visibility"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            About Page Manager
                        </h2>
                        <p className="text-sm text-gray-500">
                            Configure content for the {currentSite.name} about page sections.
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

                                            {config.id === 'header' && (
                                                <div>
                                                    <Label>Subtitle / Philosophy Label</Label>
                                                    <Input
                                                        type="text"
                                                        value={section.subtitle || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {['header', 'strategicPlan', 'mission'].includes(config.id) && (
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
                                            {['header', 'strategicPlan', 'coreValues'].includes(config.id) && (
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
                                                                    <div><Label>Title</Label><Input value={item.title || ''} onChange={(e) => updateItem(config.id, idx, 'title', e.target.value)} /></div>
                                                                    <div><Label>Icon Name (e.g. Heart, Sun, Award, Shield)</Label><Input value={item.icon || ''} onChange={(e) => updateItem(config.id, idx, 'icon', e.target.value)} /></div>
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

                                            {/* Feature Images */}
                                            {config.id === 'header' && (
                                                <div className="mt-4">
                                                    <ImagePicker
                                                        label="Main Feature Image"
                                                        value={section.images?.[0]?.url || ""}
                                                        onChange={(url) => {
                                                            const newImages = [...(section.images || [])];
                                                            if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                            newImages[0].url = url;
                                                            handleSectionChange(config.id, "images", newImages);
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Emphasized Stats / Badges */}
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
