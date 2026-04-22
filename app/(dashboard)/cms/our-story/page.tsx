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
import { Eye, EyeOff, ChevronDown, ChevronUp, Video } from 'lucide-react';

interface OurStorySection extends SectionContent {
    enabled?: boolean;
}

interface OurStoryPageContent extends PageContent {
    sections: Record<string, OurStorySection>;
}

const getSectionsConfig = () => {
    return [
        { id: 'header', label: 'Our Story Headings' },
        { id: 'originStory', label: 'Origin Story (How We Began)' },
        { id: 'culturalIdentity', label: 'Cultural Identity & Respect' },
        { id: 'videoSection', label: 'Video Story Section' },
        { id: 'landAcknowledgement', label: 'Land Acknowledgement' }
    ];
};

const getDefaultContent = (): Record<string, SectionContent> => {
    return {
        header: {
            heading: "Our Story",
            subtitle: "About Us",
            content: "<p>How a group of Black professionals came together to build a community rooted in culture, care, and collective healing.</p>",
            enabled: true,
            images: [{ url: '/assets/illustrations/gala-hero-bg.jpg', alt: 'Our Story Hero' }]
        },
        originStory: {
            heading: "How We Began",
            content: "<p>Kind Minds Family Wellness (KMFW) comprises a group of Black professionals who, in over 15 years, have been engaged in trauma-informed work with individuals, families, and groups in various community settings.</p><p>We realized that the majority of Black social service users often struggle and feel overwhelmed — specifically following a life crisis...</p>",
            enabled: true,
            items: [
                { title: 'Trauma-Informed Care', desc: '15+ years of experience delivering trauma-informed support.', icon: 'Heart' },
                { title: 'Collective Approach', desc: 'We engage the worldview and lived experiences of our clients.', icon: 'Users' },
                { title: 'Community-Rooted', desc: 'Grounded in Kitchener-Waterloo, acknowledging the traditional territory of the Anishinaabe, Haudenosaunee, and Neutral Nations.', icon: 'Globe' },
                { title: 'Research-Backed', desc: 'Our work draws on substantial evidence that effective support for the Black community must be grounded in cultural identity and respect.', icon: 'BookOpen' }
            ]
        },
        culturalIdentity: {
            heading: "Rooted in Respect & Recognition",
            content: "<p>For the majority of Black persons, intergenerational trauma evolving from colonialism, slavery, segregation, and persistent discrimination has led to the distrust of the health care and social service system.</p>",
            enabled: true
        },
        videoSection: {
            heading: "Healing Through Connection",
            content: "<p>Experience the heart of Kind Minds Family Wellness. Our journey is one of resilience, community, and the pursuit of mental well-being for all.</p>",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            images: [{ url: '/images/video-thumbnail.png', alt: 'Video Thumbnail' }],
            enabled: true
        },
        landAcknowledgement: {
            heading: "Land Acknowledgement",
            content: "<p>We acknowledge that this land (Kitchener, Waterloo, Cambridge), including the Haldimand Track, is the traditional territory of the Anishinaabe, Haudenosaunee, and Neutral Nations.</p>",
            enabled: true
        }
    };
};

export default function OurStoryManager() {
    const { currentSite } = useSite();
    const [content, setContent] = useState<OurStoryPageContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const sectionsConfig = getSectionsConfig();
    const defaultContentForSite = getDefaultContent();

    useEffect(() => {
        loadContent();
    }, [currentSite]);

    const loadContent = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getPageContent('our-story', currentSite.id);
            const mergedSections: Record<string, OurStorySection> = {};

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
                setContent({ ...data, sections: mergedSections } as OurStoryPageContent);
            } else {
                const initialSections: Record<string, OurStorySection> = {};
                sectionsConfig.forEach(sec => {
                    initialSections[sec.id] = {
                        enabled: true,
                        ...(defaultContentForSite[sec.id] || { heading: sec.label, content: "" })
                    };
                });
                setContent({ title: "Our Story", sections: initialSections });
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
            await FirestoreService.savePageContent('our-story', content, currentSite.id);
            setSuccessMsg("Our Story settings saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    const handleRestoreDefaults = async () => {
        if (!window.confirm("Are you sure you want to restore the original 4-card 'Our Story' configuration? This will overwrite your current settings.")) return;
        setSaving(true);
        try {
            const defaultData = { title: "Our Story", sections: getDefaultContent() };
            await FirestoreService.savePageContent('our-story', defaultData as OurStoryPageContent, currentSite.id);
            setContent(defaultData as OurStoryPageContent);
            setSuccessMsg("Restored original defaults successfully! Please review and click Save Changes if you wish to confirm.");
            setTimeout(() => setSuccessMsg(""), 5000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to restore defaults.");
        } finally {
            setSaving(false);
        }
    };

    const handleSectionChange = (sectionId: string, field: keyof OurStorySection, value: any) => {
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
                title={`Our Story Manager - ${currentSite.name} | Admin Portal`}
                description="Manage Our Story visibility and text"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            Our Story Manager
                        </h2>
                        <p className="text-sm text-gray-500">
                            Configure content for the {currentSite.name} origin story, identity, and background.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleRestoreDefaults} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" disabled={saving}>
                            Restore Original Layout
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
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
                                                <Label>Primary Heading</Label>
                                                <Input
                                                    type="text"
                                                    value={section.heading || ""}
                                                    onChange={(e) => handleSectionChange(config.id, "heading", e.target.value)}
                                                />
                                            </div>

                                            {config.id === 'header' && (
                                                <div>
                                                    <Label>Subtitle</Label>
                                                    <Input
                                                        type="text"
                                                        value={section.subtitle || ""}
                                                        onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {['originStory', 'culturalIdentity', 'landAcknowledgement'].includes(config.id) && (
                                                <div>
                                                    <div className="mb-2"><Label>Body Content (Rich Text)</Label></div>
                                                    <RichTextEditor
                                                        label=""
                                                        value={section.content || ""}
                                                        onChange={(newContent: string) => handleSectionChange(config.id, "content", newContent)}
                                                    />
                                                </div>
                                            )}

                                            {/* Feature Icons */}
                                            {['originStory'].includes(config.id) && (
                                                <div className="mt-4">
                                                    <Label>Feature List Items</Label>
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
                                                                    <div><Label>Icon Name (e.g. Heart, Users, Globe, BookOpen)</Label><Input value={item.icon || ''} onChange={(e) => updateItem(config.id, idx, 'icon', e.target.value)} /></div>
                                                                    <div className="col-span-2"><Label>Description</Label><Input value={item.desc || ''} onChange={(e) => updateItem(config.id, idx, 'desc', e.target.value)} /></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" onClick={() => {
                                                            const newItems = [...(section.items || []), {}];
                                                            handleSectionChange(config.id, "items", newItems);
                                                        }}>+ Add Feature</Button>
                                                    </div>
                                                </div>
                                            )}

                                            {config.id === 'header' && (
                                                <div className="mt-4">
                                                    <ImagePicker
                                                        label="Page Hero Background"
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

                                            {config.id === 'videoSection' && (
                                                <div className="grid gap-5">
                                                    <div>
                                                        <Label>Video Description</Label>
                                                        <RichTextEditor
                                                            label=""
                                                            value={section.content || ""}
                                                            onChange={(newContent: string) => handleSectionChange(config.id, "content", newContent)}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <VideoPicker
                                                            label="Upload or Link Video"
                                                            value={section.videoUrl || ""}
                                                            onChange={(url) => handleSectionChange(config.id, "videoUrl", url)}
                                                            helpText="Upload a video file or paste a YouTube/Vimeo link."
                                                        />
                                                        <ImagePicker
                                                            label="Video Thumbnail"
                                                            value={section.images?.[0]?.url || ""}
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
