import React, { useEffect, useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { FirestoreService, PageContent, SectionContent } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import RichTextEditor from "../../components/form/RichTextEditor";
import Alert from "../../components/ui/alert/Alert";
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

interface HomeSection extends SectionContent {
    enabled?: boolean;
}

interface HomePageContent extends PageContent {
    sections: Record<string, HomeSection>;
}

const SECTIONS_CONFIG = [
    { id: 'founder', label: 'Message from Founder' },
    { id: 'mission', label: 'Why Choose BWEIC' },
    { id: 'slider', label: 'Image Slider' },
    { id: 'impact', label: 'Impact / Stats' }
];

const DEFAULT_CONTENT: Record<string, SectionContent> = {
    founder: {
        heading: "Message from the founder",
        content: `
            <p class="text-gray-600 leading-relaxed mb-6">
                At BWEIC, we have focused on generating safe spaces and promoting personal sovereignty amongst Black women across Canada. Our journey is rooted in the belief that every woman deserves a pathway from survival to thriving.
            </p>
        `,
        quote: "Since its inception, BWEIC has become an essential refuge for Black women to heal, reclaim their power, and build meaningful lives together.",
        subtitle: "SINCE 2024",
        author_name: "Amelia K. Hamilton",
        author_title: "FOUNDER",
        signature: "A.K. Hamilton",
        enabled: true,
        images: [{ url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", alt: "Founder" }]
    },
    mission: {
        heading: "Creating pathways from survival to sovereignty for Black women across Canada",
        content: "<p><strong>Our Mission:</strong> To create safe, affirming spaces where Black women in Canada can heal, grow, and reclaim their power—emotionally, economically, and socially—through community, education, advocacy, and storytelling.</p>",
        enabled: true
    },
    slider: {
        heading: "Gallery",
        content: "",
        enabled: true,
        images: [
            { url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80", alt: "Gallery Modified 1" },
            { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80", alt: "Gallery Modified 2" },
            { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", alt: "Gallery Modified 3" }
        ]
    },
    impact: {
        heading: "Our Impact",
        content: "",
        enabled: true,
        stats: [
            { value: "500+", label: "Women Empowered" },
            { value: "50+", label: "Workshops Held" },
            { value: "20+", label: "Community Partners" },
            { value: "10k+", label: "Lives Touched" }
        ]
    }
};

export default function HomePageManager() {
    const { currentSite } = useSite();
    const [content, setContent] = useState<HomePageContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadContent();
    }, [currentSite]);

    const loadContent = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getPageContent('home', currentSite.id);
            if (data) {
                // Merge existing data with defaults to ensure new fields are populated
                const mergedSections: Record<string, HomeSection> = {};

                // Start with defaults to ensure all fields exist
                Object.keys(DEFAULT_CONTENT).forEach(key => {
                    mergedSections[key] = { ...DEFAULT_CONTENT[key] };
                });

                // Override with existing data from DB
                if (data.sections) {
                    Object.keys(data.sections).forEach(key => {
                        if (mergedSections[key]) {
                            // Merge incoming data over defaults.
                            // Firestore omits keys that are undefined, so this preserves defaults for missing keys.
                            mergedSections[key] = { ...mergedSections[key], ...data.sections[key] };
                        } else {
                            mergedSections[key] = data.sections[key];
                        }
                    });
                }

                setContent({ ...data, sections: mergedSections } as HomePageContent);
            } else {
                // Initialize with default structure
                const initialSections: Record<string, HomeSection> = {};
                SECTIONS_CONFIG.forEach(sec => {
                    initialSections[sec.id] = {
                        heading: sec.label,
                        content: "",
                        enabled: true
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
                            Toggle visibility and edit content for home page sections.
                        </p>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="space-y-4">
                    {SECTIONS_CONFIG.map((config) => {
                        const section = content?.sections[config.id] || { heading: config.label, content: "", enabled: true };
                        const isExpanded = expandedSections[config.id];

                        return (
                            <div key={config.id} className={`border rounded-lg transition-all duration-200 ${section.enabled ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-white/[0.02]' : 'border-gray-200 bg-gray-100 opacity-75 dark:bg-gray-900'}`}>
                                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection(config.id)}>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button" // Prevent form submission
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

                                            <div>
                                                <div className="mb-2">
                                                    <Label>Body Content</Label>
                                                </div>
                                                <RichTextEditor
                                                    label="" // integrated label above
                                                    value={section.content || ""}
                                                    onChange={(newContent: string) => handleSectionChange(config.id, "content", newContent)}
                                                />
                                            </div>

                                            {/* Slider Section - Gallery Images */}
                                            {config.id === 'slider' && (
                                                <div className="mt-4">
                                                    <Label>Gallery Images</Label>
                                                    <div className="space-y-3">
                                                        {(section.images || []).map((img, idx) => (
                                                            <div key={idx} className="flex gap-4 items-end bg-white p-3 border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                                <div className="flex-1">
                                                                    <Label className="text-xs mb-1">Image URL</Label>
                                                                    <Input
                                                                        value={img.url}
                                                                        onChange={(e) => {
                                                                            const newImages = [...(section.images || [])];
                                                                            newImages[idx] = { ...newImages[idx], url: e.target.value };
                                                                            handleSectionChange(config.id, "images", newImages);
                                                                        }}
                                                                        placeholder="https://..."
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
                                                                    disabled={false}
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

                                            {/* Impact Section - Stats */}
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

                                            {/* Founder Images */}
                                            {config.id === 'founder' && (
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <Label>Main Portrait (Large)</Label>
                                                        <Input
                                                            type="text"
                                                            value={section.images?.[0]?.url || ""}
                                                            onChange={(e) => {
                                                                const newImages = [...(section.images || [])];
                                                                if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                                newImages[0].url = e.target.value;
                                                                handleSectionChange(config.id, "images", newImages);
                                                            }}
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Secondary Image (Small Inset)</Label>
                                                        <Input
                                                            type="text"
                                                            value={section.images?.[1]?.url || ""}
                                                            onChange={(e) => {
                                                                const newImages = [...(section.images || [])];
                                                                if (!newImages[0]) newImages[0] = { url: "", alt: "" };
                                                                if (!newImages[1]) newImages[1] = { url: "", alt: "" };
                                                                newImages[1].url = e.target.value;
                                                                handleSectionChange(config.id, "images", newImages);
                                                            }}
                                                            placeholder="https://..."
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Subtitle / Date</Label>
                                                            <Input
                                                                value={section.subtitle || ""}
                                                                onChange={(e) => handleSectionChange(config.id, "subtitle", e.target.value)}
                                                                placeholder="SINCE 2024"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Author Title</Label>
                                                            <Input
                                                                value={section.author_title || ""}
                                                                onChange={(e) => handleSectionChange(config.id, "author_title", e.target.value)}
                                                                placeholder="FOUNDER"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Author Name</Label>
                                                            <Input
                                                                value={section.author_name || ""}
                                                                onChange={(e) => handleSectionChange(config.id, "author_name", e.target.value)}
                                                                placeholder="Amelia K. Hamilton"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Signature Text</Label>
                                                            <Input
                                                                value={section.signature || ""}
                                                                onChange={(e) => handleSectionChange(config.id, "signature", e.target.value)}
                                                                placeholder="A.K. Hamilton"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label>Quote Text</Label>
                                                        <textarea
                                                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                            rows={3}
                                                            value={section.quote || ""}
                                                            onChange={(e) => handleSectionChange(config.id, "quote", e.target.value)}
                                                            placeholder="Quote..."
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
