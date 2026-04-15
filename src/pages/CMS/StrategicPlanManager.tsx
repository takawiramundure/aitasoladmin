import React, { useEffect, useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { FirestoreService } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import ImagePicker from '../../components/form/ImagePicker';
import { Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import SEOEditor from "../../components/form/SEOEditor";

const DEFAULT_DATA = {
    enabled: true,
    hero: {
        title: "Strategic Plan",
        subtitle: "Our Roadmap",
        description: "Visionary goals for a more equitable community."
    },
    roadmap: {
        title: "Our Roadmap",
        intro: [
            "As a Black-led, Black-serving, and Black-mandated organization, we have meticulously crafted a two-year strategic plan to define our vision, mission, and objectives in alignment with our unwavering commitment to addressing the distinctive needs and aspirations of the Black communities in our Region.",
            "This strategic blueprint functions as a comprehensive roadmap, delineating essential initiatives, resource allocations, and timelines to ensure the effective realization of our goals.",
            "In essence, this plan stands as a pivotal communication and alignment instrument, underscoring KMFW's steadfast dedication to advancing the well-being and prosperity of the Black population we serve."
        ],
        pillars: [
            {
                icon: 'Target',
                color: 'bg-primary/10 text-primary',
                title: 'Define Vision & Mission',
                desc: 'Articulate a clear, Black-centered vision and mission that reflects the distinctive needs and aspirations of the Black communities in our Region.'
            },
            {
                icon: 'Eye',
                color: 'bg-highlight/10 text-highlight',
                title: 'Transparency & Trust',
                desc: 'By openly sharing our plan with stakeholders, members of the Black communities, supporters, and partners, KMFW cultivates transparency and fosters trust.'
            },
            {
                icon: 'CheckCircle',
                color: 'bg-accent/10 text-accent',
                title: 'Accountability Framework',
                desc: 'The strategic plan serves as a tool for accountability, safeguarding our unwavering focus on our mission and ensuring meaningful progress.'
            }
        ]
    },
    flyer: {
        enabled: true,
        image: "/assets/strategic-plan-flyer.png",
        alt: "KMFW 2024-2026 Strategic Plan Flyer"
    },
    downloads: {
        pdf: {
            title: "Detailed Strategic Plan",
            description: "We encourage you to explore the full details of our strategic plan. Feel free to reach out if you have any questions — your engagement and feedback are valuable to us.",
            link: "https://www.kindmindsfamilywellness.org/s/KMFW-Strategic-Plan-Booklet-2024-2026.pdf"
        },
        contact: {
            title: "Have Questions?",
            description: "If you have any questions about our strategic plan, feel free to reach out. We are here to answer any questions and provide more information. Your thoughts and input are important to us.",
            email: "info@kindmindsfamilywellness.org"
        }
    }
};

export default function StrategicPlanManager() {
    const { currentSite } = useSite();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [expanded, setExpanded] = useState<Record<string, boolean>>({ hero: true, roadmap: true, flyer: false, downloads: false });

    useEffect(() => { loadContent(); }, [currentSite?.id]);

    const loadContent = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getPageContent('strategic-plan', currentSite.id);
            setContent(data || DEFAULT_DATA);
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
        setSuccessMsg(""); setError("");
        try {
            await FirestoreService.savePageContent('strategic-plan', content, currentSite.id);
            setSuccessMsg("Strategic Plan saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const set = (path: string[], value: any) => {
        setContent((prev: any) => {
            const next = JSON.parse(JSON.stringify(prev)); // deep clone
            let node = next;
            for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
            node[path[path.length - 1]] = value;
            return next;
        });
    };

    const handleSEOChange = (seoData: any) => {
        if (!content) return;
        setContent((prev: any) => ({
            ...prev,
            seo: seoData
        }));
    };

    const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta title="Strategic Plan Manager | Admin Portal" description="Manage the strategic plan page content" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Strategic Plan Manager</h2>
                        <p className="text-sm text-gray-500">Manage the KMFW Strategic Plan page content and visibility.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => { if (window.confirm("Reset to defaults?")) setContent(DEFAULT_DATA); }}>
                            Reset Defaults & Seed
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Saved!" message={successMsg} /></div>}

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
                    {/* Page Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-lg ${content.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                {content.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                            </span>
                            <div>
                                <h3 className="font-bold text-gray-800">Page Visibility</h3>
                                <p className="text-xs text-gray-500">{content.enabled ? 'Visible to public' : 'Hidden from public'}</p>
                            </div>
                        </div>
                        <button onClick={() => set(['enabled'], !content.enabled)} className={`w-12 h-6 rounded-full transition-colors relative ${content.enabled ? 'bg-primary' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${content.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* HERO */}
                    <Section id="hero" title="Hero Section" expanded={expanded.hero} onToggle={toggle}>
                        <div className="grid gap-4">
                            <div><Label>Subtitle (Tagline)</Label><Input value={content.hero.subtitle} onChange={e => set(['hero', 'subtitle'], e.target.value)} /></div>
                            <div><Label>Main Title</Label><Input value={content.hero.title} onChange={e => set(['hero', 'title'], e.target.value)} /></div>
                            <div><Label>Description</Label><textarea className="w-full px-4 py-2 border rounded-xl" rows={2} value={content.hero.description} onChange={e => set(['hero', 'description'], e.target.value)} /></div>
                        </div>
                    </Section>

                    {/* ROADMAP */}
                    <Section id="roadmap" title="Roadmap Section" expanded={expanded.roadmap} onToggle={toggle}>
                        <div className="space-y-6">
                            <div><Label>Section Title</Label><Input value={content.roadmap.title} onChange={e => set(['roadmap', 'title'], e.target.value)} /></div>

                            <div>
                                <Label>Intro Paragraphs</Label>
                                <div className="space-y-2">
                                    {content.roadmap.intro.map((para: string, i: number) => (
                                        <div key={i} className="flex gap-2 items-start">
                                            <textarea
                                                className="w-full px-4 py-2 border rounded-xl text-sm"
                                                rows={3}
                                                value={para}
                                                onChange={e => {
                                                    const newIntro = [...content.roadmap.intro];
                                                    newIntro[i] = e.target.value;
                                                    set(['roadmap', 'intro'], newIntro);
                                                }}
                                            />
                                            <button onClick={() => {
                                                const newIntro = content.roadmap.intro.filter((_: any, idx: number) => idx !== i);
                                                set(['roadmap', 'intro'], newIntro);
                                            }} className="text-red-400 hover:text-red-600 mt-1 flex-shrink-0"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => set(['roadmap', 'intro'], [...content.roadmap.intro, ''])}>
                                        <Plus size={14} className="mr-1" /> Add Paragraph
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label>Strategic Pillars</Label>
                                <div className="space-y-4 mt-2">
                                    {content.roadmap.pillars.map((pillar: any, i: number) => (
                                        <div key={i} className="p-4 border rounded-xl bg-gray-50/50">
                                            <div className="flex justify-between mb-3">
                                                <span className="text-xs font-bold uppercase text-gray-400">Pillar {i + 1}</span>
                                                <button onClick={() => {
                                                    const p = content.roadmap.pillars.filter((_: any, idx: number) => idx !== i);
                                                    set(['roadmap', 'pillars'], p);
                                                }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div><Label>Title</Label><Input value={pillar.title} onChange={e => {
                                                    const p = [...content.roadmap.pillars];
                                                    p[i] = { ...p[i], title: e.target.value };
                                                    set(['roadmap', 'pillars'], p);
                                                }} /></div>
                                                <div><Label>Icon (e.g. Target, Eye, CheckCircle)</Label><Input value={pillar.icon} onChange={e => {
                                                    const p = [...content.roadmap.pillars];
                                                    p[i] = { ...p[i], icon: e.target.value };
                                                    set(['roadmap', 'pillars'], p);
                                                }} /></div>
                                                <div className="md:col-span-2"><Label>Description</Label><textarea className="w-full px-4 py-2 border rounded-xl text-sm" rows={3} value={pillar.desc} onChange={e => {
                                                    const p = [...content.roadmap.pillars];
                                                    p[i] = { ...p[i], desc: e.target.value };
                                                    set(['roadmap', 'pillars'], p);
                                                }} /></div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => set(['roadmap', 'pillars'], [...content.roadmap.pillars, { icon: 'Star', color: 'bg-primary/10 text-primary', title: '', desc: '' }])}>
                                        <Plus size={14} className="mr-1" /> Add Pillar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* FLYER / Full-Width Image */}
                    <Section
                        id="flyer"
                        title="Strategic Plan Flyer (Full-Width Image)"
                        expanded={expanded.flyer}
                        onToggle={toggle}
                        action={
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <span className="text-[10px] font-bold uppercase text-gray-400">{content.flyer.enabled ? 'Shown' : 'Hidden'}</span>
                                <button onClick={() => set(['flyer', 'enabled'], !content.flyer.enabled)} className={`w-8 h-4 rounded-full relative transition-colors ${content.flyer.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${content.flyer.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        }
                    >
                        <div className="grid gap-4">
                            <ImagePicker label="Flyer Image" value={content.flyer.image} onChange={url => set(['flyer', 'image'], url)} />
                            <div><Label>Alt Text</Label><Input value={content.flyer.alt} onChange={e => set(['flyer', 'alt'], e.target.value)} /></div>
                            {content.flyer.image && (
                                <div className="rounded-xl overflow-hidden border border-gray-200">
                                    <img src={content.flyer.image} alt={content.flyer.alt} className="w-full object-cover max-h-64" />
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* DOWNLOADS */}
                    <Section id="downloads" title="Downloads & Contact Cards" expanded={expanded.downloads} onToggle={toggle}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                                <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">PDF Download Card</h4>
                                <div><Label>Title</Label><Input value={content.downloads.pdf.title} onChange={e => set(['downloads', 'pdf', 'title'], e.target.value)} /></div>
                                <div><Label>Description</Label><textarea className="w-full px-4 py-2 border rounded-xl text-sm" rows={3} value={content.downloads.pdf.description} onChange={e => set(['downloads', 'pdf', 'description'], e.target.value)} /></div>
                                <div><Label>PDF URL</Label><Input value={content.downloads.pdf.link} onChange={e => set(['downloads', 'pdf', 'link'], e.target.value)} /></div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                                <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Contact Card</h4>
                                <div><Label>Title</Label><Input value={content.downloads.contact.title} onChange={e => set(['downloads', 'contact', 'title'], e.target.value)} /></div>
                                <div><Label>Description</Label><textarea className="w-full px-4 py-2 border rounded-xl text-sm" rows={3} value={content.downloads.contact.description} onChange={e => set(['downloads', 'contact', 'description'], e.target.value)} /></div>
                                <div><Label>Email</Label><Input value={content.downloads.contact.email} onChange={e => set(['downloads', 'contact', 'email'], e.target.value)} /></div>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </>
    );
}

function Section({ id, title, expanded, onToggle, action, children }: any) {
    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors" onClick={() => onToggle(id)}>
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-gray-700">{title}</h3>
                    {action}
                </div>
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expanded && (
                <div className="p-6 border-t border-gray-100">{children}</div>
            )}
        </div>
    );
}
