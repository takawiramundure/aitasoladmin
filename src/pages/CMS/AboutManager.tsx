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

interface AboutSection extends SectionContent {
    enabled?: boolean;
    list?: { label: string; value: string }[];
}

interface AboutPageContent extends PageContent {
    sections: Record<string, AboutSection>;
}

const sectionsConfig = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'mission', label: 'Mission Section' },
    { id: 'approach', label: 'Approach Section' },
    { id: 'stats', label: 'Stats Section' },
    { id: 'team', label: 'Team Section' }
];

const AboutManager: React.FC = () => {
    const { currentSite } = useSite();
    const [content, setContent] = useState<AboutPageContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ hero: true });

    useEffect(() => {
        loadContent();
    }, [currentSite.id]);

    const loadContent = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getPageContent("about", currentSite.id);
            if (data) {
                setContent(data as AboutPageContent);
            } else {
                setContent({ sections: {} } as AboutPageContent);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load about page content.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.savePageContent("about", content, currentSite.id);
            setSuccessMsg("About page updated successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleSeedData = async () => {
        if (!confirm(`Initialize "${currentSite.name}" About Page with default front-end content?`)) return;
        setSaving(true);
        try {
            const defaultContent = {
                sections: {
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
                    stats: {
                        heading: "By the Numbers",
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
                }
            };
            await FirestoreService.savePageContent("about", defaultContent as any, currentSite.id);
            setContent(defaultContent as any);
            setSuccessMsg("🌱 Seeded about page defaults successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to seed data.");
        } finally {
            setSaving(false);
        }
    };

    const handleSectionChange = (sectionId: string, field: string, value: any) => {
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

    if (loading) return <div className="p-6 text-center">Loading About Page settings...</div>;

    return (
        <>
            <PageMeta title={`About Page Manager - ${currentSite.name} | CMS`} description="Manage About Page sections" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">About Page Manager</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage the narrative and impact stats on your About page.</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Button variant="outline" onClick={handleSeedData} disabled={saving} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                            🌱 Seed Default Data
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
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
                                        <h3 className={`font-medium ${section.enabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>{config.label}</h3>
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
                                                    value={section.heading || ""}
                                                    onChange={(e) => handleSectionChange(config.id, "heading", e.target.value)}
                                                />
                                            </div>

                                            {config.id === 'stats' ? (
                                                <div className="space-y-4">
                                                    <Label>Impact Statistics</Label>
                                                    {(section.list || []).map((stat, idx) => (
                                                        <div key={idx} className="flex gap-4 items-end bg-white p-3 border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                            <div className="flex-1">
                                                                <Label className="text-xs mb-1">Label (e.g. Projects)</Label>
                                                                <Input
                                                                    value={stat.label}
                                                                    onChange={(e) => {
                                                                        const newList = [...(section.list || [])];
                                                                        newList[idx] = { ...stat, label: e.target.value };
                                                                        handleSectionChange(config.id, "list", newList);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <Label className="text-xs mb-1">Value (e.g. 24+)</Label>
                                                                <Input
                                                                    value={stat.value}
                                                                    onChange={(e) => {
                                                                        const newList = [...(section.list || [])];
                                                                        newList[idx] = { ...stat, value: e.target.value };
                                                                        handleSectionChange(config.id, "list", newList);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        const newList = [...(section.list || []), { label: "", value: "" }];
                                                        handleSectionChange(config.id, "list", newList);
                                                    }}>+ Add Stat</Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Label>Content</Label>
                                                    <RichTextEditor
                                                        value={section.content || ""}
                                                        onChange={(val) => handleSectionChange(config.id, "content", val)}
                                                    />
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
};

export default AboutManager;
