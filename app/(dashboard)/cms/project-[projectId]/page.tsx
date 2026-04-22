"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Layers, 
  Type, 
  FileText, 
  Target, 
  Users, 
  Calendar,
  CheckCircle2,
  Database
} from 'lucide-react';
import { FirestoreService } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import RichTextEditor from "@/components/form/RichTextEditor";

const ProjectPageManager: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { currentSite } = useSite();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!projectId) return;
            try {
                const res = await FirestoreService.getPageContent(`project-${projectId}`, currentSite.id);
                setData(res || getDefaults(projectId));
            } catch (error) {
                console.error("Error loading project content:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [projectId, currentSite.id]);

    const getDefaults = (id: string) => {
        const defaults: any = {
            'black-wellness': {
                title: "Black Wellness Project",
                subtitle: "Community Research Initiative",
                description: "Focused on mental wellness within African, Caribbean, and Black communities in the Region of Waterloo.",
                content: "Across Canada, research shows mixed findings. Some surveys suggest many ACB individuals report good mental health, while other studies show higher levels of depression, anxiety, and stress. This points to a gap between how mental health is measured and how it is actually experienced in our communities.\n\nCultural understandings of wellness, along with systemic factors such as racism, financial insecurity, housing challenges, and barriers within health systems, all play a role in shaping mental health outcomes and access to care.\n\nThrough this research, we aim to better understand how ACB adults in the Region of Waterloo experience mental wellness and navigate services, with the goal of informing more culturally responsive supports.",
                objectives: [
                    "Understand how ACB adults experience mental wellness",
                    "Identify barriers to navigating services",
                    "Inform culturally responsive support frameworks"
                ],
                timeline: "Spring 2025 - 2026",
                status: "Active",
                partners: [
                    { name: "Wilfrid Laurier University", role: "Research Partner" },
                    { name: "Wallenstein Feed & Supply Ltd.", role: "Sponsor" }
                ]
            },
            'phac-child-welfare': {
                title: "Strengthening Child Welfare Response",
                subtitle: "PHAC Funded Initiative",
                description: "A Black-led, culturally grounded intervention in Waterloo Region.",
                content: "This project will strengthen how service providers prevent, recognize, and respond to child maltreatment within Black communities. Working with Black caregivers, youth, and service providers, we will co-design culturally grounded training and tools that help organizations respond more effectively to the needs of Black families.\n\nGrounded in Afrocentric and trauma-informed approaches, the project will support organizations across Waterloo Region to integrate culturally responsive practices and address systemic barriers that impact Black families.",
                objectives: [
                    "Strengthen prevention and response to child maltreatment",
                    "Co-design culturally grounded training and tools",
                    "Address systemic barriers impacting Black families"
                ],
                timeline: "April 2026 - March 2030",
                status: "Coming Soon",
                partners: [
                    { name: "Public Health Agency of Canada (PHAC)", role: "Funder" }
                ]
            },
            'umoja-neurodivergent': {
                title: "Umoja Neurodivergent Program",
                subtitle: "Unity in Diversity",
                description: "A critically necessary program born out of necessity for neurodiverse folks in the ACB community.",
                content: "The name Umoja means 'unity' in Swahili. For too long, neurodiverse folks in the ACB community have felt isolated while navigating mainstream institutions and resources. Likewise, the conversation around neurodiversity more broadly has often been framed through a lens that excludes Black voices.\n\nWhen we talk about Black neurodivergence, we must remember to center race and identity, acknowledging that cultural stigmas, systemic barriers, and the history of misdiagnosis have left many individuals and families feeling isolated. Umoja is our response to that isolation.",
                objectives: [
                    "Peer support led by Black folks with lived experience",
                    "Service navigation for complex systems",
                    "Development of a culturally responsive toolkit built by the community",
                    "Identify cultural stigmas and barriers to diagnosis"
                ],
                timeline: "Ongoing",
                status: "Active",
                partners: [
                    { name: "Ontario Trillium Foundation (OTF)", role: "Support" }
                ]
            }
        };
        return defaults[id] || { title: "", subtitle: "", description: "", content: "", objectives: [], timeline: "", status: "", partners: [] };
    };

    const handleSeed = () => {
        if (!projectId) return;
        if (window.confirm("This will overwrite your current changes with the initial hardcoded data. Continue?")) {
            setData(getDefaults(projectId));
        }
    };

    const handleSave = async () => {
        if (!projectId) return;
        setSaving(true);
        try {
            await FirestoreService.savePageContent(`project-${projectId}`, data, currentSite.id);
            alert("Project content saved successfully!");
        } catch (error) {
            console.error("Error saving project content:", error);
            alert("Failed to save project content.");
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setData((prev: any) => ({ ...prev, [field]: value }));
    };

    const addListItem = (field: string, defaultValue: any) => {
        setData((prev: any) => ({
            ...prev,
            [field]: [...(prev[field] || []), defaultValue]
        }));
    };

    const removeListItem = (field: string, index: number) => {
        setData((prev: any) => ({
            ...prev,
            [field]: prev[field].filter((_: any, i: number) => i !== index)
        }));
    };

    const updateListItem = (field: string, index: number, value: any) => {
        setData((prev: any) => ({
            ...prev,
            [field]: prev[field].map((item: any, i: number) => i === index ? value : item)
        }));
    };

    if (loading) return <div className="p-8 text-center">Loading Project Editor...</div>;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/cms/research')}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Project Manager</h1>
                        <p className="text-slate-500 text-sm">Editing: {data.title || projectId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSeed}
                        className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-sm"
                        title="Seed with initial data"
                    >
                        <Database className="w-5 h-5" />
                        Seed Data
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Basic Info Container */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Text Controls */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Type className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Header Content</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Project Title</label>
                            <input 
                                type="text"
                                value={data.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                                placeholder="e.g., Black Wellness Project"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subtitle</label>
                            <input 
                                type="text"
                                value={data.subtitle}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600"
                                placeholder="Research Initiative"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Hero Description</label>
                            <textarea 
                                value={data.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600 h-24 resize-none"
                                placeholder="Brief one-sentence summary..."
                            />
                        </div>
                    </div>
                </div>

                {/* Metadata Controls */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Project Details</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Timeline</label>
                            <input 
                                type="text"
                                value={data.timeline}
                                onChange={(e) => updateField('timeline', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600"
                                placeholder="e.g., 2025 - 2026"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                            <select 
                                value={data.status}
                                onChange={(e) => updateField('status', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all text-slate-600 font-bold"
                            >
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Coming Soon">Coming Soon</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-indigo-500" />
                    <h2 className="text-xl font-black text-slate-800">Initiative Narrative</h2>
                </div>
                <RichTextEditor 
                    label="Initiative Description"
                    value={data.content}
                    onChange={(val: string) => updateField('content', val)}
                />
            </div>

            {/* Objectives Area */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-black text-slate-800">Core Objectives</h2>
                    </div>
                    <button 
                        onClick={() => addListItem('objectives', '')}
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-all text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Objective
                    </button>
                </div>

                <div className="space-y-4">
                    {data.objectives?.map((obj: string, i: number) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-bold shrink-0">{i + 1}</div>
                            <input 
                                type="text"
                                value={obj}
                                onChange={(e) => updateListItem('objectives', i, e.target.value)}
                                className="flex-grow bg-slate-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-600"
                                placeholder="Enter objective..."
                            />
                            <button 
                                onClick={() => removeListItem('objectives', i)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {!data.objectives?.length && <p className="text-center py-8 text-slate-400 italic">No objectives added yet.</p>}
                </div>
            </div>

            {/* Partners Area */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-black text-slate-800">Partners & Stakeholders</h2>
                    </div>
                    <button 
                        onClick={() => addListItem('partners', { name: "", role: "" })}
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-all text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Partner
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    {data.partners?.map((partner: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-2xl relative group">
                            <button 
                                onClick={() => removeListItem('partners', i)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Entity Name</label>
                                    <input 
                                        type="text"
                                        value={partner.name}
                                        onChange={(e) => updateListItem('partners', i, { ...partner, name: e.target.value })}
                                        className="w-full bg-white border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700"
                                        placeholder="e.g., Wilfrid Laurier University"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Role/Support</label>
                                    <input 
                                        type="text"
                                        value={partner.role}
                                        onChange={(e) => updateListItem('partners', i, { ...partner, role: e.target.value })}
                                        className="w-full bg-white border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-500 text-sm"
                                        placeholder="e.g., Research Partner"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {!data.partners?.length && <p className="col-span-full text-center py-8 text-slate-400 italic">No partners added yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProjectPageManager;
