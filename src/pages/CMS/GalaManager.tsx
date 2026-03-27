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
import LinkPicker from '../../components/form/LinkPicker';
import { Eye, EyeOff, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

interface GalaSection extends SectionContent {
    enabled?: boolean;
    subheading?: string;
    subtitle?: string;
    date?: string;
    location?: string;
    images?: { url: string; alt: string }[];
    videoUrl?: string;
    items?: any[];
    details?: { label: string; value: string }[];
    networkPartners?: { name: string; imageUrl: string; link: string }[];
    platinum?: any[];
    gold?: any[];
    buttonText?: string;
    link?: string;
    buttonText2?: string;
    link2?: string;
    content: string; // Ensure compatibility with SectionContent
}

interface GalaPageContent extends PageContent {
    sections: Record<string, GalaSection>;
}

const GALA_SECTIONS = [
    { id: 'hero', label: 'Gala Hero' },
    { id: 'mission', label: 'Gala Mission' },
    { id: 'awards', label: 'Award Categories' },
    { id: 'nominations', label: 'Nominations CTA' },
    { id: 'sponsors', label: 'Sponsors' },
    { id: 'network', label: 'Our Esteemed Network' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'finalCta', label: 'Final Call to Action' }
];

export default function GalaManager() {
    const { currentSite } = useSite();
    const [content, setContent] = useState<GalaPageContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ hero: true });

    useEffect(() => {
        loadContent();
    }, [currentSite]);

    const loadContent = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getPageContent('gala', currentSite.id);
            
            // Define defaults that match the frontend fallbacks
            const defaultMissionDetails = [
                { label: "Dress Code", value: "Formal / Semi-Formal Gala Attire" },
                { label: "Ages", value: "15+" },
                { label: "Seating", value: "Limited seating, early booking recommended" }
            ];
            const defaultNetworkPartners = [
                { name: "Partner 1", imageUrl: "https://via.placeholder.com/150", link: "#" },
                { name: "Partner 2", imageUrl: "https://via.placeholder.com/150", link: "#" },
                { name: "Partner 3", imageUrl: "https://via.placeholder.com/150", link: "#" }
            ];
            const defaultHeroButtons = {
                buttonText: "Get Early Bird Tickets",
                link: "https://www.eventbrite.ca/e/black-excellence-awards-gala-tickets-1977921994931?aff=oddtdtcreator",
                buttonText2: "Learn More",
                link2: "#about"
            };

            if (data && data.sections) {
                // Merge defaults into existing data if fields are missing
                const updatedSections: Record<string, GalaSection> = { ...data.sections as Record<string, GalaSection> };
                
                if (updatedSections.mission) {
                    const mission = updatedSections.mission;
                    if (!mission.details || mission.details.length === 0) {
                        mission.details = defaultMissionDetails;
                    }
                }
                
                if (updatedSections.hero) {
                    const hero = updatedSections.hero;
                    if (!hero.buttonText) hero.buttonText = defaultHeroButtons.buttonText;
                    if (!hero.link) hero.link = defaultHeroButtons.link;
                    if (!hero.buttonText2) hero.buttonText2 = defaultHeroButtons.buttonText2;
                    if (!hero.link2) hero.link2 = defaultHeroButtons.link2;
                }

                if (updatedSections.network && (!updatedSections.network.networkPartners || updatedSections.network.networkPartners.length === 0)) {
                    updatedSections.network.networkPartners = defaultNetworkPartners;
                }

                setContent({ ...data, sections: updatedSections } as GalaPageContent);
            } else {
                // Initialize with full defaults
                const initialSections: Record<string, GalaSection> = {};
                GALA_SECTIONS.forEach(sec => {
                    initialSections[sec.id] = { heading: sec.label, enabled: true, content: "" };
                });
                
                initialSections.mission.details = defaultMissionDetails;
                initialSections.hero.buttonText = defaultHeroButtons.buttonText;
                initialSections.hero.link = defaultHeroButtons.link;
                initialSections.hero.buttonText2 = defaultHeroButtons.buttonText2;
                initialSections.hero.link2 = defaultHeroButtons.link2;
                
                initialSections.network.networkPartners = defaultNetworkPartners;
                initialSections.network.heading = "Our Esteemed Network";
                
                setContent({ title: "Black Excellence Gala", sections: initialSections });
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
            await FirestoreService.savePageContent('gala', content, currentSite.id);
            setSuccessMsg("Gala settings saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    const handleSectionChange = (sectionId: string, field: keyof GalaSection, value: any) => {
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

    const seedGalaData = async () => {
        if (!confirm("This will overwrite your current Gala settings with default data. Continue?")) return;

        const fullSeedData: GalaPageContent = {
            title: "Black Excellence Gala",
            sections: {
                hero: {
                    heading: "Black *Excellence*<br />Awards Gala 2026",
                    subtitle: "Honouring the present, Building the future.",
                    date: "Saturday, April 11, 2026",
                    location: "St. George Banquet Hall",
                    images: [{ url: '/assets/illustrations/gala-hero-bg.jpg', alt: 'Gala Hero' }],
                    buttonText: "Get Early Bird Tickets",
                    link: "https://www.eventbrite.ca/e/black-excellence-awards-gala-tickets-1977921994931?aff=oddtdtcreator",
                    buttonText2: "Learn More",
                    link2: "#about",
                    content: "", // Added to satisfy GalaSection interface
                    enabled: true // Added to satisfy GalaSection interface
                },
                mission: {
                    heading: "A Night to Celebrate *Black Excellence*",
                    subheading: "Join us for an unforgettable, inspiring evening that honours the past, uplifts today's voices, and builds what's next for our community.",
                    content: "The Black Excellence Awards Gala is more than an event; it is a movement. It is a dedicated space to shine a light on the unsung heroes, the visionary innovators, and the steadfast leaders who continuously shape and uplift our society. We gather not just to give accolades, but to strengthen the bonds of our community.",
                    subtitle: "Honouring Our Legacy, Inspiring Our Future", // Used as Legacy Heading
                    enabled: true,
                    videoUrl: "",
                    items: [
                        { title: "Awards & Recognition", icon: "Award", desc: "" },
                        { title: "Keynote Speaker", icon: "Mic", desc: "" },
                        { title: "Halal Buffet", icon: "Utensils", desc: "" },
                        { title: "Professional Networking", icon: "Users", desc: "" }
                    ],
                    details: [
                        { label: "Dress Code", value: "Formal / Semi-Formal Gala Attire" },
                        { label: "Ages", value: "15+" },
                        { label: "Seating", value: "Limited seating, early booking recommended" }
                    ]
                },
                awards: {
                    heading: "Award Categories",
                    subtitle: "Celebrating the ongoing excellence across various domains. Here are the categories for our inaugural celebration.",
                    items: [
                        { name: "Youth Leadership & Innovation Award", icon: "Sparkles", desc: "Recognizing young trailblazers making a difference." },
                        { name: "Community Leadership & Service Award", icon: "Users", desc: "Honouring those dedicated to serving others." },
                        { name: "Social Justice & Advocacy Award", icon: "Scale", desc: "Uplifting voices for equity and justice." },
                        { name: "Education & Mentorship Award", icon: "BookOpen", desc: "Celebrating educators and mentors." },
                        { name: "Business & Entrepreneurship Award", icon: "Briefcase", desc: "Recognizing excellence in business." },
                        { name: "Arts & Culture Award", icon: "Palette", desc: "Honouring creative contributions." },
                        { name: "Lifetime Achievement & Legacy Award", icon: "Trophy", desc: "Celebrating a lifetime of excellence." },
                        { name: "Health & Wellness Award", icon: "Heart", desc: "Honouring health champions." },
                        { name: "Community Allyship & Solidarity Award", icon: "Handshake", desc: "Celebrating allies in the movement." },
                        { name: "Equity in Action Award", icon: "BadgeCheck", desc: "Recognizing measurable progress in equity." },
                        { name: "Digital Innovation and Community Award", icon: "Globe", desc: "Honouring tech-driven community impact." }
                    ],
                    content: "", // Added to satisfy GalaSection interface
                    enabled: true // Added to satisfy GalaSection interface
                },
                nominations: {
                    heading: "Nominations Close *February 6, 2026*",
                    content: "Help us recognize the outstanding contributions within our community. Nominate those who inspire change and embody Black excellence.",
                    buttonText: "Black Individuals Nomination",
                    link: "https://forms.gle/Y2d7a9XN61DzWcZ58",
                    buttonText2: "Organizations & Allies Nomination",
                    link2: "https://forms.gle/UupDh6HerBsAoj7W6",
                    enabled: true
                },
                sponsors: {
                    heading: "Proudly Supported By",
                    platinum: [
                        { name: 'TD Bank', logo: '/assets/images/td-bank.svg' }
                    ],
                    gold: [
                        { name: 'ISKo Consulting', logo: '/assets/images/ISKY.png' },
                        { name: 'TMMC', logo: '/assets/images/tmmc.jpg' }
                    ],
                    enabled: true,
                    content: "" // Added to satisfy GalaSection interface
                },
                network: {
                    heading: "Our Esteemed Network",
                    enabled: true,
                    content: "A powerful alliance of organizations committed to excellence and community impact.",
                    networkPartners: [
                        { name: "Alliance", imageUrl: "https://via.placeholder.com/150", link: "https://alliance.com" },
                        { name: "Innovate Now", imageUrl: "https://via.placeholder.com/150", link: "https://innovatenow.com" },
                        { name: "Urban Excellence", imageUrl: "https://via.placeholder.com/150", link: "https://urbanexcellence.com" },
                        { name: "Frontline Leaders", imageUrl: "https://via.placeholder.com/150", link: "https://frontlineleaders.com" },
                        { name: "Synergy", imageUrl: "https://via.placeholder.com/150", link: "https://synergy.com" }
                    ]
                },
                testimonials: {
                    heading: "Voices from the Gala",
                    items: [
                        { quote: "An unforgettable evening that truly captured the spirit, resilience, and brilliance of our community.", author: "James T.", role: "2025 Attendee" },
                        { quote: "The level of excellence showcased across all categories was astounding. A benchmark event.", author: "Alicia M.", role: "Community Organizer" },
                        { quote: "More than just an awards ceremony; it's a profound gathering of minds and hearts.", author: "Dr. K. Williams", role: "Keynote Speaker" }
                    ],
                    content: "", // Added to satisfy GalaSection interface
                    enabled: true // Added to satisfy GalaSection interface
                },
                finalCta: {
                    heading: "Secure your *Legacy*",
                    content: "Tickets are limited. Join us in celebrating the monumental achievements shaping our common future.",
                    buttonText: "Purchase Tickets",
                    link: "https://www.eventbrite.ca/e/black-excellence-awards-gala-tickets-1977921994931?aff=oddtdtcreator",
                    enabled: true
                }
            }
        };

        await FirestoreService.savePageContent('gala', fullSeedData, currentSite.id);
        setSuccessMsg("Full Gala seed data applied! Page reloaded.");
        loadContent();
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta title="Gala Page Manager | Admin Portal" description="Manage Gala sections" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Black Excellence Gala Manager</h2>
                        <p className="text-sm text-gray-500 mt-1 italic text-primary">Manage the specialized Gala page components.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={seedGalaData}>Seed Data</Button>
                        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="space-y-4">
                    {GALA_SECTIONS.map((config) => {
                        const section = (content?.sections[config.id] || { heading: config.label, enabled: true, content: '' }) as GalaSection;
                        const isExpanded = expandedSections[config.id];

                        return (
                            <div key={config.id} className="border border-gray-200 rounded-lg dark:border-gray-700 overflow-hidden">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer" onClick={() => toggleSection(config.id)}>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleSectionChange(config.id, 'enabled', !section.enabled); }}
                                            className={`p-1 ${section.enabled ? 'text-green-500' : 'text-gray-400'}`}
                                        >
                                            {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <h3 className="font-bold text-gray-700 dark:text-white">{config.label}</h3>
                                    </div>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>

                                {isExpanded && (
                                    <div className="p-6 space-y-6 bg-white dark:bg-transparent border-t border-gray-100 dark:border-gray-800">
                                        {config.id === 'hero' && (
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="md:col-span-2"><Label>Main Heading</Label><Input value={section.heading} onChange={(e) => handleSectionChange('hero', 'heading', e.target.value)} /></div>
                                                <div className="md:col-span-2"><Label>Subtitle</Label><Input value={section.subtitle} onChange={(e) => handleSectionChange('hero', 'subtitle', e.target.value)} /></div>
                                                <div><Label>Date</Label><Input value={section.date} onChange={(e) => handleSectionChange('hero', 'date', e.target.value)} /></div>
                                                <div><Label>Location</Label><Input value={section.location} onChange={(e) => handleSectionChange('hero', 'location', e.target.value)} /></div>
                                                
                                                <div className="md:col-span-1 border-t pt-4">
                                                    <Label>Button 1 Text (Tickets)</Label>
                                                    <Input value={section.buttonText || ''} onChange={(e) => handleSectionChange('hero', 'buttonText', e.target.value)} />
                                                </div>
                                                <div className="md:col-span-1 border-t pt-4">
                                                    <Label>Button 1 Link</Label>
                                                    <LinkPicker value={section.link || ''} onChange={(val) => handleSectionChange('hero', 'link', val)} />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <Label>Button 2 Text (Learn More)</Label>
                                                    <Input value={section.buttonText2 || ''} onChange={(e) => handleSectionChange('hero', 'buttonText2', e.target.value)} />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <Label>Button 2 Link</Label>
                                                    <LinkPicker value={section.link2 || ''} onChange={(val) => handleSectionChange('hero', 'link2', val)} />
                                                </div>

                                                <div className="md:col-span-2 border-t pt-4"><Label>Hero Image</Label><ImagePicker value={section.images?.[0]?.url || ''} onChange={(url) => handleSectionChange('hero', 'images', [{url, alt: ''}])} /></div>
                                            </div>
                                        )}

                                        {config.id === 'mission' && (
                                            <div className="space-y-4">
                                                <Label>Mission Heading</Label><Input value={section.heading} onChange={(e) => handleSectionChange('mission', 'heading', e.target.value)} />
                                                <Label>Mission Subheading</Label><textarea className="w-full p-3 rounded-lg border dark:bg-gray-800" rows={2} value={section.subheading || ''} onChange={(e) => handleSectionChange('mission', 'subheading', e.target.value)} />
                                                
                                                <div className="mt-6">
                                                    <Label>Highlight Cards (4 expected)</Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {(section.items || []).map((item: any, idx: number) => (
                                                            <div key={idx} className="p-4 border rounded-xl bg-gray-50/50 space-y-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-xs font-bold text-gray-400">Card {idx + 1}</span>
                                                                    <Button variant="outline" size="sm" className="text-red-500 h-6 px-2" onClick={() => {
                                                                        const newItems = [...(section.items || [])];
                                                                        newItems.splice(idx, 1);
                                                                        handleSectionChange('mission', 'items', newItems);
                                                                    }}>Remove</Button>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div><Label>Title</Label><Input value={item.title} onChange={(e) => {
                                                                        const newItems = [...(section.items || [])];
                                                                        newItems[idx].title = e.target.value;
                                                                        handleSectionChange('mission', 'items', newItems);
                                                                    }} /></div>
                                                                    <div><Label>Icon (Lucide)</Label><Input value={item.icon} onChange={(e) => {
                                                                        const newItems = [...(section.items || [])];
                                                                        newItems[idx].icon = e.target.value;
                                                                        handleSectionChange('mission', 'items', newItems);
                                                                    }} /></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button variant="outline" size="sm" className="mt-3" onClick={() => handleSectionChange('mission', 'items', [...(section.items || []), {title: '', icon: '', desc: ''}])}>+ Highlight Card</Button>
                                                </div>

                                                <div className="mt-6">
                                                    <Label>Event Details (Dress Code, Ages, etc.)</Label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {(section.details || []).map((detail: any, idx: number) => (
                                                            <div key={idx} className="flex gap-2 items-center">
                                                                <Input placeholder="Label" value={detail.label} onChange={(e) => {
                                                                    const newDetails = [...(section.details || [])];
                                                                    newDetails[idx].label = e.target.value;
                                                                    handleSectionChange('mission', 'details', newDetails);
                                                                }} />
                                                                <Input placeholder="Value" value={detail.value} onChange={(e) => {
                                                                    const newDetails = [...(section.details || [])];
                                                                    newDetails[idx].value = e.target.value;
                                                                    handleSectionChange('mission', 'details', newDetails);
                                                                }} />
                                                                <button title="Remove detail" onClick={() => {
                                                                    const newDetails = (section.details || []).filter((_: any, i: number) => i !== idx);
                                                                    handleSectionChange('mission', 'details', newDetails);
                                                                }} className="text-red-500"><Trash2 size={18} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button variant="outline" size="sm" className="mt-3" onClick={() => handleSectionChange('mission', 'details', [...(section.details || []), {label: '', value: ''}])}>+ Event Detail</Button>
                                                </div>

                                                <div className="pt-6 border-t mt-6">
                                                    <Label>Legacy Section Heading</Label><Input value={section.subtitle || ''} onChange={(e) => handleSectionChange('mission', 'subtitle', e.target.value)} />
                                                    <Label className="mt-4">Legacy Content</Label><textarea className="w-full p-3 rounded-lg border dark:bg-gray-800" rows={5} value={section.content} onChange={(e) => handleSectionChange('mission', 'content', e.target.value)} />
                                                </div>
                                                
                                                <Label>Hero Video (YouTube Embed URL)</Label><Input value={section.videoUrl || ''} onChange={(e) => handleSectionChange('mission', 'videoUrl', e.target.value)} />
                                            </div>
                                        )}

                                        {config.id === 'awards' && (
                                            <div className="space-y-4">
                                                <Label>Section Heading</Label><Input value={section.heading} onChange={(e) => handleSectionChange('awards', 'heading', e.target.value)} />
                                                <div className="space-y-4 pt-4">
                                                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Award Items</h4>
                                                    {(section.items || []).map((item: any, idx: number) => (
                                                        <div key={idx} className="p-4 border rounded-xl flex gap-4 items-start bg-gray-50/50">
                                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                                <div className="col-span-1"><Label>Award Name</Label><Input value={item.name} onChange={(e) => {
                                                                    const newItems = [...(section.items || [])];
                                                                    newItems[idx].name = e.target.value;
                                                                    handleSectionChange('awards', 'items', newItems);
                                                                }} /></div>
                                                                <div className="col-span-1"><Label>Icon (Lucide name)</Label><Input value={item.icon} onChange={(e) => {
                                                                    const newItems = [...(section.items || [])];
                                                                    newItems[idx].icon = e.target.value;
                                                                    handleSectionChange('awards', 'items', newItems);
                                                                }} /></div>
                                                                <div className="col-span-2"><Label>Description</Label><Input value={item.desc} onChange={(e) => {
                                                                    const newItems = [...(section.items || [])];
                                                                    newItems[idx].desc = e.target.value;
                                                                    handleSectionChange('awards', 'items', newItems);
                                                                }} /></div>
                                                            </div>
                                                            <button onClick={() => {
                                                                const newItems = (section.items || []).filter((_: any, i: number) => i !== idx);
                                                                handleSectionChange('awards', 'items', newItems);
                                                            }} className="text-red-500 pt-8"><Trash2 size={18} /></button>
                                                        </div>
                                                    ))}
                                                    <Button variant="outline" size="sm" onClick={() => handleSectionChange('awards', 'items', [...(section.items || []), {name: '', icon: '', desc: ''}])}><Plus size={16} className="mr-2" /> Add Award Category</Button>
                                                </div>
                                            </div>
                                        )}

                                         {config.id === 'sponsors' && (
                                            <div className="space-y-8">
                                                <div>
                                                    <h4 className="font-bold text-primary mb-4">Platinum Sponsors</h4>
                                                    <div className="grid gap-4">
                                                        {(section.platinum || []).map((s: any, idx: number) => (
                                                            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl">
                                                                <div className="flex-1"><Label>Name</Label><Input value={s.name} onChange={(e) => {
                                                                    const newS = [...(section.platinum || [])];
                                                                    newS[idx].name = e.target.value;
                                                                    handleSectionChange('sponsors', 'platinum', newS);
                                                                }} /></div>
                                                                <div className="flex-1"><Label>Logo URL</Label><Input value={s.logo} onChange={(e) => {
                                                                    const newS = [...(section.platinum || [])];
                                                                    newS[idx].logo = e.target.value;
                                                                    handleSectionChange('sponsors', 'platinum', newS);
                                                                }} /></div>
                                                                <button onClick={() => handleSectionChange('sponsors', 'platinum', (section.platinum || []).filter((_:any, i:number) => i !== idx))} className="text-red-500 mb-2"><Trash2 size={18} /></button>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" className="w-fit" onClick={() => handleSectionChange('sponsors', 'platinum', [...(section.platinum || []), {name: '', logo: ''}])}>+ Platinum</Button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-yellow-600 mb-4">Gold Sponsors</h4>
                                                    <div className="grid gap-4">
                                                        {(section.gold || []).map((s: any, idx: number) => (
                                                            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl">
                                                                <div className="flex-1"><Label>Name</Label><Input value={s.name} onChange={(e) => {
                                                                    const newS = [...(section.gold || [])];
                                                                    newS[idx].name = e.target.value;
                                                                    handleSectionChange('sponsors', 'gold', newS);
                                                                }} /></div>
                                                                <div className="flex-1"><Label>Logo URL</Label><Input value={s.logo} onChange={(e) => {
                                                                    const newS = [...(section.gold || [])];
                                                                    newS[idx].logo = e.target.value;
                                                                    handleSectionChange('sponsors', 'gold', newS);
                                                                }} /></div>
                                                                <button onClick={() => handleSectionChange('sponsors', 'gold', (section.gold || []).filter((_:any, i:number) => i !== idx))} className="text-red-500 mb-2"><Trash2 size={18} /></button>
                                                            </div>
                                                        ))}
                                                        <Button variant="outline" size="sm" className="w-fit" onClick={() => handleSectionChange('sponsors', 'gold', [...(section.gold || []), {name: '', logo: ''}])}>+ Gold</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {config.id === 'network' && (
                                            <div className="space-y-4">
                                                <Label>Network Partners</Label>
                                                <div className="grid gap-4">
                                                    {section.networkPartners?.map((partner, index) => (
                                                        <div key={index} className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-900/40 relative">
                                                            <button 
                                                                onClick={() => {
                                                                    const newList = [...(section.networkPartners || [])];
                                                                    newList.splice(index, 1);
                                                                    handleSectionChange('network', 'networkPartners', newList);
                                                                }}
                                                                className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>Partner Name</Label>
                                                                    <Input 
                                                                        value={partner.name} 
                                                                        onChange={(e) => {
                                                                            const newList = [...(section.networkPartners || [])];
                                                                            newList[index].name = e.target.value;
                                                                            handleSectionChange('network', 'networkPartners', newList);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Website Link</Label>
                                                                    <LinkPicker 
                                                                        value={partner.link} 
                                                                        onChange={(val) => {
                                                                            const newList = [...(section.networkPartners || [])];
                                                                            newList[index].link = val;
                                                                            handleSectionChange('network', 'networkPartners', newList);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="md:col-span-2">
                                                                    <Label>Partner Logo</Label>
                                                                    <ImagePicker 
                                                                        value={partner.imageUrl} 
                                                                        onChange={(url) => {
                                                                            const newList = [...(section.networkPartners || [])];
                                                                            newList[index].imageUrl = url;
                                                                            handleSectionChange('network', 'networkPartners', newList);
                                                                        }} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        startIcon={<Plus size={16} />}
                                                        onClick={() => {
                                                            const newList = [...(section.networkPartners || []), { name: "", imageUrl: "", link: "" }];
                                                            handleSectionChange('network', 'networkPartners', newList);
                                                        }}
                                                    >
                                                        Add Partner
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {config.id === 'testimonials' && (
                                            <div className="space-y-4">
                                                {(section.items || []).map((t: any, idx: number) => (
                                                    <div key={idx} className="p-4 border rounded-xl bg-gray-50/50 space-y-3">
                                                        <Label>Quote</Label><textarea className="w-full p-3 rounded-lg border dark:bg-gray-800" rows={2} value={t.quote} onChange={(e) => {
                                                            const newT = [...(section.items || [])];
                                                            newT[idx].quote = e.target.value;
                                                            handleSectionChange('testimonials', 'items', newT);
                                                        }} />
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div><Label>Author</Label><Input value={t.author} onChange={(e) => {
                                                                const newT = [...(section.items || [])];
                                                                newT[idx].author = e.target.value;
                                                                handleSectionChange('testimonials', 'items', newT);
                                                            }} /></div>
                                                            <div><Label>Role</Label><Input value={t.role} onChange={(e) => {
                                                                const newT = [...(section.items || [])];
                                                                newT[idx].role = e.target.value;
                                                                handleSectionChange('testimonials', 'items', newT);
                                                            }} /></div>
                                                        </div>
                                                        <button onClick={() => handleSectionChange('testimonials', 'items', (section.items || []).filter((_:any, i:number) => i !== idx))} className="text-red-500 flex items-center text-sm gap-1"><Trash2 size={16}/> Remove</button>
                                                    </div>
                                                ))}
                                                <Button variant="outline" onClick={() => handleSectionChange('testimonials', 'items', [...(section.items || []), {quote: '', author: '', role: ''}])}>+ Testimonial</Button>
                                            </div>
                                        )}

                                        {config.id === 'nominations' && (
                                            <div className="space-y-4">
                                                <Label>CTA Heading</Label><Input value={section.heading} onChange={(e) => handleSectionChange('nominations', 'heading', e.target.value)} />
                                                <Label>CTA Content</Label><textarea className="w-full p-3 rounded-lg border dark:bg-gray-800" rows={3} value={section.content} onChange={(e) => handleSectionChange('nominations', 'content', e.target.value)} />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><Label>Button 1 Text</Label><Input value={section.buttonText || ''} onChange={(e) => handleSectionChange('nominations', 'buttonText', e.target.value)} /></div>
                                                    <div><Label>Link 1</Label><LinkPicker value={section.link || ''} onChange={(val) => handleSectionChange('nominations', 'link', val)} /></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><Label>Button 2 Text</Label><Input value={section.buttonText2 || ''} onChange={(e) => handleSectionChange('nominations', 'buttonText2', e.target.value)} /></div>
                                                    <div><Label>Link 2</Label><LinkPicker value={section.link2 || ''} onChange={(val) => handleSectionChange('nominations', 'link2', val)} /></div>
                                                </div>
                                            </div>
                                        )}

                                        {config.id === 'finalCta' && (
                                            <div className="space-y-4">
                                                <Label>CTA Heading</Label><Input value={section.heading} onChange={(e) => handleSectionChange('finalCta', 'heading', e.target.value)} />
                                                <Label>CTA Content</Label><textarea className="w-full p-3 rounded-lg border dark:bg-gray-800" rows={3} value={section.content} onChange={(e) => handleSectionChange('finalCta', 'content', e.target.value)} />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><Label>Button Text</Label><Input value={section.buttonText || ''} onChange={(e) => handleSectionChange('finalCta', 'buttonText', e.target.value)} /></div>
                                                    <div><Label>Link</Label><LinkPicker value={section.link || ''} onChange={(val) => handleSectionChange('finalCta', 'link', val)} /></div>
                                                </div>
                                            </div>
                                        )}
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
