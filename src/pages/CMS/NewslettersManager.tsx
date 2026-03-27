import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import { FirestoreService } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import { PlusIcon, TrashBinIcon } from "../../icons";
import MediaPickerModal from "../../components/common/MediaPickerModal";

export default function NewslettersManager() {
    const { currentSite } = useSite();
    const [newsletters, setNewsletters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        if (currentSite?.id) {
            loadContent();
        }
    }, [currentSite]);

    const loadContent = async () => {
        setLoading(true);
        try {
            const data: any = await FirestoreService.getPageContent("newsletters", currentSite.id);
            if (data?.items) {
                setNewsletters(data.items);
            } else {
                setNewsletters([]);
            }
        } catch (error) {
            console.error("Error loading newsletters:", error);
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
            await FirestoreService.savePageContent("newsletters", { items: newsletters }, currentSite.id);
            setSuccessMsg("Newsletters saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (error) {
            console.error("Error saving newsletters:", error);
            setError("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const addNewsletter = () => {
        setNewsletters([{
            id: Date.now().toString(),
            title: "New Newsletter",
            pdfUrl: "",
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            isActive: true
        }, ...newsletters]);
    };

    const updateNewsletter = (index: number, field: string, value: any) => {
        const newNewsletters = [...newsletters];
        newNewsletters[index] = { ...newNewsletters[index], [field]: value };
        setNewsletters(newNewsletters);
    };

    const deleteNewsletter = (index: number) => {
        if (confirm("Are you sure you want to delete this newsletter?")) {
            const newNewsletters = newsletters.filter((_, i) => i !== index);
            setNewsletters(newNewsletters);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading Newsletters...</div>;

    return (
        <>
            <PageMeta title="Newsletters Manager | Admin" description="Manage PDF Newsletters" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Newsletter PDF Manager</h2>
                        <p className="text-sm text-gray-500 mt-1 text-primary italic">Note: Media Features/Articles are managed in the Blog Manager.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => {
                            if (!confirm("This will add sample newsletters. Continue?")) return;
                            const samples = [
                                { id: '1', title: "Q1 2024 Community Impact", pdfUrl: "#", date: "March 2024", isActive: true },
                                { id: '2', title: "2023 Annual Review", pdfUrl: "#", date: "December 2023", isActive: true },
                                { id: '3', title: "Fall 2023 Newsletter", pdfUrl: "#", date: "September 2023", isActive: true }
                            ];
                            setNewsletters(prev => [...samples, ...prev]);
                        }}>
                            Seed Data
                        </Button>
                        <Button variant="outline" onClick={addNewsletter} startIcon={<PlusIcon className="w-5 h-5" />}>
                            Add Newsletter
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="space-y-4">
                    {newsletters.map((item, index) => (
                        <div key={item.id || index} className="p-4 border border-gray-100 rounded-xl bg-gray-50 dark:bg-gray-900/20 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <Label>Title</Label>
                                    <Input
                                        value={item.title}
                                        onChange={(e) => updateNewsletter(index, "title", e.target.value)}
                                        placeholder="e.g. Q1 2024 Newsletter"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <Label>PDF URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={item.pdfUrl}
                                            onChange={(e) => updateNewsletter(index, "pdfUrl", e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <Button variant="outline" size="sm" onClick={() => { setActiveIndex(index); setShowMediaPicker(true); }}>
                                            Select
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                     <div className="flex-1">
                                        <Label>Date/Period</Label>
                                        <Input
                                            value={item.date}
                                            onChange={(e) => updateNewsletter(index, "date", e.target.value)}
                                            placeholder="e.g. March 2024"
                                        />
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => deleteNewsletter(index)} 
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 mt-6"
                                    >
                                        <TrashBinIcon className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {newsletters.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No newsletters found. Add your first PDF newsletter above.</p>
                        </div>
                    )}
                </div>

                <MediaPickerModal
                    isOpen={showMediaPicker}
                    onClose={() => setShowMediaPicker(false)}
                    onSelect={(url) => {
                        if (activeIndex !== null) {
                            updateNewsletter(activeIndex, 'pdfUrl', url);
                        }
                    }}
                />
            </div>
        </>
    );
}
