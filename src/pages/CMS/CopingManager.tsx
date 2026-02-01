import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import { FirestoreService } from "../../services/firestore";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RichTextEditor from "../../components/form/RichTextEditor";

// ---- Sortable Item Component ----
function SortableResourceItem({ id, children }: { id: string; children: React.ReactNode }) {
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

interface CopingResource {
    id: string;
    title: string;
    subtitle: string;
    content: string; // Supports multi-line
    icon: string; // Ionicons name
    link: string; // Optional link for "Contact Now"
    isActive: boolean;
}

export default function CopingManager() {
    const [resources, setResources] = useState<CopingResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Default data from Coping.tsx
    const defaultResources: CopingResource[] = [
        {
            id: '1',
            title: "Hospice Niagara Grief Support",
            subtitle: "",
            content: "Hospice Niagara offers a variety of programs and workshops to help adults as well as programs that give children and youth a safe space to explore their feelings of grief and loss.\n\n(905) 984-8766\ninfo@hospiceniagara.ca",
            icon: "heart-outline",
            link: "tel:9059848766",
            isActive: true
        },
        {
            id: '2',
            title: "Bereaved Families of Ontario",
            subtitle: "",
            content: "An association of parents who have lost a child through death and for children up to 19 years who have lost parents, siblings, or other significant persons through death. One-to-one and telephone support is also available.\n\n905-318-0070",
            icon: "people-outline",
            link: "tel:9053180070",
            isActive: true
        },
        {
            id: '3',
            title: "Grief Share: Niagara Life Centre",
            subtitle: "",
            content: "Grief Share is a friendly support group of people who will walk alongside you through one of life’s most difficult experiences. Groups meet weekly to help you face these challenges and move toward rebuilding your life.\n\n905-934-0021",
            icon: "cafe-outline",
            link: "tel:9059340021",
            isActive: true
        },
        {
            id: '4',
            title: "CMHA Ontario Bereavement Program",
            subtitle: "",
            content: "Whether you need support for your own grief or you’re supporting someone in theirs, grief is unique and CMHA is available to support you on your journey in a safe and supportive environment.",
            icon: "medkit-outline",
            link: "https://ontario.cmha.ca/",
            isActive: true
        },
        {
            id: '5',
            title: "Hope for Wellness Helpline",
            subtitle: "(for Indigenous Peoples)",
            content: "Available to all Indigenous people across Canada. Experienced and culturally competent counsellors are reachable by telephone and online ‘chat’ 24/7.\n\n1-855-242-3310",
            icon: "call-outline",
            link: "tel:18552423310",
            isActive: true
        }
    ];

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        setLoading(true);
        try {
            const data: any = await FirestoreService.getPageContent("coping");
            if (data && data.resources && data.resources.length > 0) {
                setResources(data.resources);
            } else {
                setResources(defaultResources);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.savePageContent("coping", { resources } as any);
            setSuccessMsg("Changes saved successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const addResource = () => {
        const newResource: CopingResource = {
            id: Date.now().toString(),
            title: "New Resource",
            subtitle: "",
            content: "Description...",
            icon: "help-circle-outline",
            link: "",
            isActive: true
        };
        setResources([...resources, newResource]);
    };

    const updateResource = (id: string, field: keyof CopingResource, value: any) => {
        setResources(resources.map(r =>
            r.id === id ? { ...r, [field]: value } : r
        ));
    };

    const removeResource = (id: string) => {
        if (confirm("Are you sure you want to delete this resource?")) {
            setResources(resources.filter(r => r.id !== id));
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setResources((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta title="Coping with Loss Manager | NSPC Admin" description="Manage Coping Section Resources" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            Coping with Loss Manager
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage the list of programs and support groups.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={addResource}>+ Add Resource</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="mb-6 p-4 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200">
                    <p><strong>Note on Icons:</strong> Use valid <a href="https://ionic.io/ionicons" target="_blank" rel="noreferrer" className="text-blue-600 underline">Ionicons names</a> (e.g., 'heart-outline', 'call-outline', 'people-outline').</p>
                </div>

                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <SortableContext items={resources.map(r => r.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {resources.map((resource, index) => (
                                <SortableResourceItem key={resource.id} id={resource.id}>
                                    <div className="p-5 border border-gray-200 rounded-xl bg-gray-50 dark:bg-white/[0.02] dark:border-gray-700 relative group">

                                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                                            <button
                                                onClick={() => updateResource(resource.id, 'isActive', !resource.isActive)}
                                                className={`text-xs px-2 py-1 rounded border ${resource.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-gray-600 border-gray-300'}`}
                                                onPointerDown={(e) => e.stopPropagation()}
                                            >
                                                {resource.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                            <button
                                                onClick={() => removeResource(resource.id)}
                                                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                                                onPointerDown={(e) => e.stopPropagation()}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <span className="inline-block px-2 py-1 text-xs font-mono text-gray-500 bg-gray-200 rounded">Item {index + 1}</span>
                                        </div>

                                        <div className="space-y-6" onPointerDown={(e) => e.stopPropagation()}>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label>Title</Label>
                                                        <Input
                                                            type="text"
                                                            value={resource.title}
                                                            onChange={(e) => updateResource(resource.id, 'title', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Subtitle (Optional)</Label>
                                                        <Input
                                                            type="text"
                                                            value={resource.subtitle || ""}
                                                            onChange={(e) => updateResource(resource.id, 'subtitle', e.target.value)}
                                                            placeholder="e.g. (for Indigenous Peoples)"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <Label>Icon Name (Ionicons)</Label>
                                                        <Input
                                                            type="text"
                                                            value={resource.icon}
                                                            onChange={(e) => updateResource(resource.id, 'icon', e.target.value)}
                                                            placeholder="e.g. heart-outline"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Contact Link / Phone</Label>
                                                        <Input
                                                            type="text"
                                                            value={resource.link || ""}
                                                            onChange={(e) => updateResource(resource.id, 'link', e.target.value)}
                                                            placeholder="e.g. tel:555-555-5555 or https://..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label>Description</Label>
                                                <RichTextEditor
                                                    label=""
                                                    value={resource.content}
                                                    onChange={(value) => updateResource(resource.id, 'content', value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SortableResourceItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </>
    );
}
