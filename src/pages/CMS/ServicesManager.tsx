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
import { GridIcon } from "../../icons";

interface ServiceItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    icon: string;
    isActive: boolean;
}

function SortableServiceItem({ id, children }: { id: string; children: React.ReactNode }) {
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

export default function ServicesManager() {
    const { currentSite } = useSite();
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    useEffect(() => {
        loadServices();
    }, [currentSite]);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data: any = await FirestoreService.getPageContent("services", currentSite.id);
            if (data && data.services) {
                setServices(data.services);
            } else {
                // Fallback to seed data
                const siteSeed = SEED_DATA[currentSite.id as keyof typeof SEED_DATA];
                // @ts-ignore
                if (siteSeed?.services) {
                    // @ts-ignore
                    setServices(siteSeed.services);
                } else {
                    setServices([]);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.savePageContent("services", { services } as any, currentSite.id);
            setSuccessMsg("Services saved successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const addService = () => {
        const newService: ServiceItem = {
            id: Date.now().toString(),
            title: "New Service",
            description: "Service details...",
            imageUrl: "",
            icon: "construction",
            isActive: true
        };
        setServices([...services, newService]);
    };

    const updateService = (id: string, field: keyof ServiceItem, value: any) => {
        setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeService = (id: string) => {
        if (confirm("Delete this service?")) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setServices((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (loading) return <div className="p-6">Loading Services...</div>;

    return (
        <>
            <PageMeta title="Services Manager | Noel Construction" description="Manage High-End Services" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Construction & Woodworking Services</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage the core offerings displayed on the website.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={addService}>+ Add Service</Button>
                        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                    <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {services.map((service, index) => (
                                <SortableServiceItem key={service.id} id={service.id}>
                                    <div className="p-5 border border-gray-200 rounded-xl bg-gray-50 dark:bg-white/[0.02] dark:border-gray-700 relative group">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => updateService(service.id, 'isActive', !service.isActive)} className={`text-xs px-2 py-1 rounded border ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`} onPointerDown={(e) => e.stopPropagation()}>
                                                {service.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                            <button onClick={() => removeService(service.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700" onPointerDown={(e) => e.stopPropagation()}>Delete</button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                                            <div className="space-y-4" onPointerDown={(e) => e.stopPropagation()}>
                                                <div>
                                                    <Label>Service Title</Label>
                                                    <Input type="text" value={service.title} onChange={(e) => updateService(service.id, 'title', e.target.value)} />
                                                </div>
                                                <div>
                                                    <Label>Icon Name (e.g., home, hammer, brush)</Label>
                                                    <Input type="text" value={service.icon} onChange={(e) => updateService(service.id, 'icon', e.target.value)} />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <textarea className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm h-32" value={service.description} onChange={(e) => updateService(service.id, 'description', e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="space-y-4" onPointerDown={(e) => e.stopPropagation()}>
                                                <Label>Service Illustration / Image</Label>
                                                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                                    {service.imageUrl ? <img src={service.imageUrl} className="w-full h-full object-cover" /> : <span className="text-gray-400">No Image Selected</span>}
                                                </div>
                                                <Button variant="outline" className="w-full" onClick={() => { setActiveServiceId(service.id); setShowMediaPicker(true); }}>Select from Library</Button>
                                            </div>
                                        </div>
                                    </div>
                                </SortableServiceItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <MediaPickerModal isOpen={showMediaPicker} onClose={() => setShowMediaPicker(false)} onSelect={(url) => { if (activeServiceId) updateService(activeServiceId, 'imageUrl', url); }} />
            </div>
        </>
    );
}
