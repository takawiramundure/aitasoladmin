import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import { FirestoreService } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MediaPickerModal from "../../components/common/MediaPickerModal";
import { SEED_DATA } from "../../config/seedData";

interface ProjectItem {
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    beforeImage?: string;
    afterImage?: string;
    isActive: boolean;
}

function SortableProjectItem({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
            {children}
        </div>
    );
}

export default function PortfolioManager() {
    const { currentSite } = useSite();
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [activeSelection, setActiveSelection] = useState<{ id: string, field: keyof ProjectItem } | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    useEffect(() => {
        loadProjects();
    }, [currentSite]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const data: any = await FirestoreService.getPageContent("projects", currentSite.id);
            if (data && data.projects) {
                setProjects(data.projects);
            } else {
                const siteSeed = SEED_DATA[currentSite.id as keyof typeof SEED_DATA];
                // @ts-ignore
                if (siteSeed?.projects) {
                    // @ts-ignore
                    setProjects(siteSeed.projects);
                } else {
                    setProjects([]);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.savePageContent("projects", { projects } as any, currentSite.id);
            setSuccessMsg("Portfolio updated successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to save portfolio.");
        } finally {
            setSaving(false);
        }
    };

    const addProject = () => {
        const newProject: ProjectItem = {
            id: Date.now().toString(),
            title: "New Project",
            category: "Renovation",
            description: "Detailed project description...",
            imageUrl: "",
            isActive: true
        };
        setProjects([...projects, newProject]);
    };

    const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
        setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const removeProject = (id: string) => {
        if (confirm("Delete this project from portfolio?")) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setProjects((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (loading) return <div className="p-6">Loading Portfolio...</div>;

    return (
        <>
            <PageMeta title="Portfolio Manager | Noel Construction" description="Manage Showcase Projects" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Portfolio & Projects Showcase</h2>
                        <p className="text-sm text-gray-500 mt-1">Showcase your high-end renovations with before/after comparisons.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={addProject}>+ Add Project</Button>
                        <Button onClick={handleSave} disabled={saving}>{saving ? "Updating..." : "Save Changes"}</Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                    <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-6">
                            {projects.map((project, index) => (
                                <SortableProjectItem key={project.id} id={project.id}>
                                    <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-white/[0.02] dark:border-gray-700 relative group">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => updateProject(project.id, 'isActive', !project.isActive)} className={`text-xs px-2 py-1 rounded border ${project.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`} onPointerDown={(e) => e.stopPropagation()}>
                                                {project.isActive ? 'Published' : 'Draft'}
                                            </button>
                                            <button onClick={() => removeProject(project.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700" onPointerDown={(e) => e.stopPropagation()}>Delete</button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                                            {/* Details Section */}
                                            <div className="lg:col-span-1 space-y-4" onPointerDown={(e) => e.stopPropagation()}>
                                                <div>
                                                    <Label>Project Title</Label>
                                                    <Input type="text" value={project.title} onChange={(e) => updateProject(project.id, 'title', e.target.value)} />
                                                </div>
                                                <div>
                                                    <Label>Category</Label>
                                                    <Input type="text" value={project.category} onChange={(e) => updateProject(project.id, 'category', e.target.value)} />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <textarea className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm h-32" value={project.description} onChange={(e) => updateProject(project.id, 'description', e.target.value)} />
                                                </div>
                                            </div>

                                            {/* Media Section */}
                                            <div className="lg:col-span-2 space-y-4" onPointerDown={(e) => e.stopPropagation()}>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-center block">Main Showcase Image</Label>
                                                        <div className="h-32 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center cursor-pointer" onClick={() => { setActiveSelection({ id: project.id, field: 'imageUrl' }); setShowMediaPicker(true); }}>
                                                            {project.imageUrl ? <img src={project.imageUrl} className="object-cover w-full h-full" /> : <span className="text-xs text-gray-400">Select Image</span>}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-rose-600">
                                                        <Label className="text-center block">Before Image</Label>
                                                        <div className="h-32 bg-rose-50 rounded-lg overflow-hidden border border-rose-100 flex items-center justify-center cursor-pointer" onClick={() => { setActiveSelection({ id: project.id, field: 'beforeImage' }); setShowMediaPicker(true); }}>
                                                            {project.beforeImage ? <img src={project.beforeImage} className="object-cover w-full h-full" /> : <span className="text-xs text-rose-300">Select Before</span>}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-emerald-600">
                                                        <Label className="text-center block">After Image</Label>
                                                        <div className="h-32 bg-emerald-50 rounded-lg overflow-hidden border border-emerald-100 flex items-center justify-center cursor-pointer" onClick={() => { setActiveSelection({ id: project.id, field: 'afterImage' }); setShowMediaPicker(true); }}>
                                                            {project.afterImage ? <img src={project.afterImage} className="object-cover w-full h-full" /> : <span className="text-xs text-emerald-300">Select After</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 text-center italic">Tip: Click on any image box to select from the Media Library.</p>
                                            </div>
                                        </div>
                                    </div>
                                </SortableProjectItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <MediaPickerModal isOpen={showMediaPicker} onClose={() => setShowMediaPicker(false)} onSelect={(url) => { if (activeSelection) updateProject(activeSelection.id, activeSelection.field, url); }} />
            </div>
        </>
    );
}
