import React, { useEffect, useState } from 'react';
import PageMeta from "../../components/common/PageMeta";
import { FirestoreService } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import ImagePicker from '../../components/form/ImagePicker';
import { Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_TEAM_DATA = {
    enabled: true,
    hero: {
        title: "The Heart of Our Mission",
        subtitle: "Meet Our Team",
        description: "A collective of professionals, practitioners, and community leaders dedicated to culturally grounded wellness."
    },
    teams: [
        {
            id: 'board',
            title: 'Board Members',
            description: 'As a Black-centered organization, our Board of Directors comprises individuals with Black lived experiences both within and outside of Canada. We value diverse opinions and therefore include board members with diverse social and professional backgrounds. Each board member is committed to working with Black people and providing governance through their expertise, talent, and leadership.',
            icon: 'Shield',
            color: 'bg-primary/10 text-primary'
        },
        {
            id: 'leadership',
            title: 'Leadership Team',
            description: "Our leadership team is comprised of our Founding Director, Executive Director, Director of Operations, Manager of Client Services, Accounting and Operations Personnel, and the Manager of Research and Strategic Initiatives. Collaboratively, our team works to ensure that administration, services, programs, and strategic planning are well-aligned with the KMFW vision, mission, and values. The leadership team's work is ably directed and supported by our competent and experienced Board Members.",
            icon: 'Star',
            color: 'bg-highlight/10 text-highlight'
        },
        {
            id: 'management',
            title: 'Management Team',
            description: 'The Management team is comprised of our Program Coordinators, Research Coordinators, System Navigator, IT Specialist, and the Children & Youth Services Coordinator. Together, our competent and inspiring management team promote quality support using an individualized approach that accommodates the intersections and experiences of our clientele. They ensure that our staff and volunteers are well-supported while delivering services, and play a strategic role in our work with partners and the community.',
            icon: 'Briefcase',
            color: 'bg-accent/10 text-accent'
        },
        {
            id: 'staff',
            title: 'Staff & Members',
            description: 'The mutual goal of our dedicated staff is to harness and leverage their expertise to foster client health and wellness. We pride ourselves in the ability of our staff to selflessly embrace challenges, as they adopt client-centered approaches and intentionally engage the experiences of service users in their delivery of culturally-tailored programs. Coming from different cultural, social, and professional backgrounds, our staff are not only well-informed, but also strategically positioned to address the needs of clients, irrespective of intersectionality.',
            icon: 'Users',
            color: 'bg-primary/10 text-primary'
        },
        {
            id: 'volunteers',
            title: 'Volunteers',
            description: 'Our volunteers are passionate about giving back to their community and are committed to the work relating to Black persons. They are individuals who contribute to the day-to-day running, planning, and delivery of programs and services to our clients and in the community. We have an exceptional team of volunteers here at KMFW — including our Black Youth Impact: Leadership and Entrepreneurial Mentors program.',
            icon: 'Heart',
            color: 'bg-highlight/10 text-highlight'
        }
    ],
    mentors: {
        enabled: true,
        title: "Black Youth Impact",
        subtitle: "Leadership & Entrepreneurial Mentors",
        description: "Hover over each card to meet our mentors — passionate leaders dedicated to empowering the next generation.",
        list: [
            {
                name: 'Mentor Name 1',
                role: 'Leadership Mentor',
                bio: 'A passionate leader dedicated to empowering Black youth through mentorship, entrepreneurship, and community engagement.'
            },
            {
                name: 'Mentor Name 2',
                role: 'Entrepreneurial Mentor',
                bio: 'An entrepreneur committed to helping young people discover their potential and build businesses that create lasting impact.'
            }
        ]
    }
};

export default function MeetOurTeamManager() {
    const { currentSite } = useSite();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ hero: true, teams: true, mentors: true });

    useEffect(() => {
        loadContent();
    }, [currentSite]);

    const loadContent = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getPageContent('meet-our-team', currentSite.id);
            if (data) {
                setContent(data);
            } else {
                setContent(DEFAULT_TEAM_DATA);
            }
        } catch (err: any) {
            console.error(err);
            setError("Failed to load team content.");
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
            await FirestoreService.savePageContent('meet-our-team', content, currentSite.id);
            setSuccessMsg("Team settings saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    const updateNestedField = (field: string, subField: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            [field]: {
                ...prev[field],
                [subField]: value
            }
        }));
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta title="Meet Our Team Manager | Admin Portal" description="Manage team members and categories" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Meet Our Team Manager</h2>
                        <p className="text-sm text-gray-500">Manage the KMFW team structure and invisibility.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                if (window.confirm("Restore defaults? This will overwrite your current changes.")) {
                                    setContent(DEFAULT_TEAM_DATA);
                                }
                            }}
                        >
                            Reset Defaults
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="space-y-6">
                    {/* Global Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-lg ${content.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                {content.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                            </span>
                            <div>
                                <h3 className="font-bold text-gray-800">Page Status</h3>
                                <p className="text-xs text-gray-500">{content.enabled ? 'Visible to public' : 'Hidden from public'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setContent((prev: any) => ({ ...prev, enabled: !prev.enabled }))}
                            className={`w-12 h-6 rounded-full transition-colors relative ${content.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${content.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Hero Section */}
                    <SectionBox 
                        id="hero" 
                        title="Hero Section" 
                        expanded={expandedSections.hero} 
                        onToggle={toggleSection}
                    >
                        <div className="grid gap-4">
                            <div><Label>Subtitle (Tagline)</Label><Input value={content.hero.subtitle} onChange={(e) => updateNestedField('hero', 'subtitle', e.target.value)} /></div>
                            <div><Label>Main Title</Label><Input value={content.hero.title} onChange={(e) => updateNestedField('hero', 'title', e.target.value)} /></div>
                            <div><Label>Description</Label><textarea className="w-full px-4 py-2 border rounded-xl" rows={3} value={content.hero.description} onChange={(e) => updateNestedField('hero', 'description', e.target.value)} /></div>
                        </div>
                    </SectionBox>

                    {/* Team Categories */}
                    <SectionBox 
                        id="teams" 
                        title="Team Categories" 
                        expanded={expandedSections.teams} 
                        onToggle={toggleSection}
                    >
                        <div className="space-y-4">
                            {content.teams.map((team: any, idx: number) => (
                                <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-sm uppercase text-gray-400 tracking-wider">Category {idx + 1}</h4>
                                        <button onClick={() => {
                                            const newTeams = [...content.teams];
                                            newTeams.splice(idx, 1);
                                            setContent({ ...content, teams: newTeams });
                                        }} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div><Label>Title</Label><Input value={team.title} onChange={(e) => {
                                            const newTeams = [...content.teams];
                                            newTeams[idx].title = e.target.value;
                                            setContent({ ...content, teams: newTeams });
                                        }} /></div>
                                        <div><Label>Icon (Lucide Name)</Label><Input value={team.icon} onChange={(e) => {
                                            const newTeams = [...content.teams];
                                            newTeams[idx].icon = e.target.value;
                                            setContent({ ...content, teams: newTeams });
                                        }} /></div>
                                        <div className="md:col-span-2"><Label>Description</Label><textarea className="w-full px-4 py-2 border rounded-xl" rows={3} value={team.description} onChange={(e) => {
                                            const newTeams = [...content.teams];
                                            newTeams[idx].description = e.target.value;
                                            setContent({ ...content, teams: newTeams });
                                        }} /></div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => setContent({ ...content, teams: [...content.teams, { title: '', description: '', icon: 'Users', color: 'bg-primary/10 text-primary' }] })}>
                                <Plus size={16} className="mr-2" /> Add Category
                            </Button>
                        </div>
                    </SectionBox>

                    {/* Mentors Section */}
                    <SectionBox 
                        id="mentors" 
                        title="Mentors Section" 
                        expanded={expandedSections.mentors} 
                        onToggle={toggleSection}
                        action={
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <span className="text-[10px] font-bold uppercase text-gray-400">
                                    {content.mentors.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <button 
                                    onClick={() => updateNestedField('mentors', 'enabled', !content.mentors.enabled)}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${content.mentors.enabled ? 'bg-highlight' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${content.mentors.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        }
                    >
                         <div className="grid gap-4 mb-6">
                            <div><Label>Mentors Subtitle</Label><Input value={content.mentors.subtitle} onChange={(e) => updateNestedField('mentors', 'subtitle', e.target.value)} /></div>
                            <div><Label>Mentors Title</Label><Input value={content.mentors.title} onChange={(e) => updateNestedField('mentors', 'title', e.target.value)} /></div>
                            <div><Label>Description</Label><textarea className="w-full px-4 py-2 border rounded-xl" rows={2} value={content.mentors.description} onChange={(e) => updateNestedField('mentors', 'description', e.target.value)} /></div>
                        </div>
                        
                        <div className="space-y-4">
                            <Label>Mentor List</Label>
                            {content.mentors.list.map((mentor: any, idx: number) => (
                                <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-xs text-highlight uppercase tracking-widest">Mentor {idx + 1}</h4>
                                        <button onClick={() => {
                                            const newList = [...content.mentors.list];
                                            newList.splice(idx, 1);
                                            updateNestedField('mentors', 'list', newList);
                                        }} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div><Label>Name</Label><Input value={mentor.name} onChange={(e) => {
                                            const newList = [...content.mentors.list];
                                            newList[idx].name = e.target.value;
                                            updateNestedField('mentors', 'list', newList);
                                        }} /></div>
                                        <div><Label>Role</Label><Input value={mentor.role} onChange={(e) => {
                                            const newList = [...content.mentors.list];
                                            newList[idx].role = e.target.value;
                                            updateNestedField('mentors', 'list', newList);
                                        }} /></div>
                                        <div>
                                            <ImagePicker 
                                                label="Photo" 
                                                value={mentor.image || ""} 
                                                onChange={(url) => {
                                                    const newList = [...content.mentors.list];
                                                    newList[idx].image = url;
                                                    updateNestedField('mentors', 'list', newList);
                                                }} 
                                            />
                                        </div>
                                        <div><Label>Bio</Label><textarea className="w-full px-4 py-2 border rounded-xl" rows={3} value={mentor.bio} onChange={(e) => {
                                            const newList = [...content.mentors.list];
                                            newList[idx].bio = e.target.value;
                                            updateNestedField('mentors', 'list', newList);
                                        }} /></div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => updateNestedField('mentors', 'list', [...content.mentors.list, { name: '', role: '', bio: '' }])}>
                                <Plus size={16} className="mr-2" /> Add Mentor
                            </Button>
                        </div>
                    </SectionBox>
                </div>
            </div>
        </>
    );
}

function SectionBox({ id, title, expanded, onToggle, action, children }: any) {
    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div 
                className="flex items-center justify-between p-4 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors"
                onClick={() => onToggle(id)}
            >
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-gray-700">{title}</h3>
                    {action}
                </div>
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expanded && (
                <div className="p-6 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
}
