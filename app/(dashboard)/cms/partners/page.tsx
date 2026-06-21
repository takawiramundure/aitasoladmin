"use client";

import { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Alert from "@/components/ui/alert/Alert";
import { Modal } from "@/components/ui/modal";
import { FirestoreService } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import MediaLibrary from "@/components/common/MediaLibrary";
import { useDialog } from "@/context/DialogContext";
import {
    PencilIcon,
    TrashBinIcon,
    PlusIcon,
} from "@/icons";

interface Partner {
    id: string;
    name: string;
    type: string;
    description: string;
    website: string;
    logo: string;
    services: string[];
    published: boolean;
    order: number;
}

export default function PartnerManager() {
    const { currentSite } = useSite();
    const { confirm, alert: dialogAlert } = useDialog();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isSeeding, setIsSeeding] = useState(false);

    // Page Configuration for Partners (Hero, Video URL)
    const [pageConfig, setPageConfig] = useState<any>({
        hero: { heading: "Our Partners", content: "", videoUrl: "" }
    });
    const [savingConfig, setSavingConfig] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [currentPartnerId, setCurrentPartnerId] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState<Partial<Partner>>({
        name: "",
        type: "",
        description: "",
        website: "",
        logo: "",
        services: [],
        published: true,
        order: 0,
    });
    const [servicesInput, setServicesInput] = useState("");

    useEffect(() => {
        loadPartners();
        loadPageConfig();
    }, [currentSite.id]);

    const loadPageConfig = async () => {
        try {
            const data = await FirestoreService.getPageContent("partners", currentSite.id);
            if (data && data.sections) {
                setPageConfig({ ...pageConfig, ...data.sections });
            }
        } catch (error) {
            console.error("Error loading partners page config:", error);
        }
    };

    const savePageConfig = async () => {
        setSavingConfig(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.savePageContent("partners", { sections: pageConfig }, currentSite.id);
            setSuccessMsg("Page configuration saved successfully!");
        } catch (error) {
            console.error("Error saving config:", error);
            setError("Failed to save page configuration.");
        } finally {
            setSavingConfig(false);
        }
    };

    useEffect(() => {
        if (isModalOpen && formData.services) {
            setServicesInput(formData.services.join(", "));
        }
    }, [isModalOpen, formData.services]);

    const loadPartners = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getPartners(currentSite.id);
            // Sort by order ascending
            const sorted = data.sort((a: any, b: any) => a.order - b.order);
            setPartners(sorted as Partner[]);
        } catch (err) {
            console.error(err);
            setError("Failed to load partners.");
        } finally {
            setLoading(false);
        }
    };

    const seedPartners = async () => {
        setIsSeeding(true);
        try {
            const partnersToSeed = [
                { name: 'Family Service Ontario', link: 'https://familyserviceontario.org' },
                { name: 'Great Kitchener Waterloo Chamber of Commerce', link: '#' },
                { name: 'Black Health Alliance', link: 'https://blackhealthalliance.ca/about/' },
                { name: 'African Family Revival Organization (AFRO)', link: 'http://afrofamily.ca/' },
                { name: 'Sexual Assault Support Centre of Waterloo Region (SASCWR)', link: 'https://www.sascwr.org/' },
                { name: 'Canadian Aweil Youth Association (CAYA)', link: 'https://cyouthassociation.wixsite.com/canadianaweilyouth' },
                { name: 'Kinbridge Community Association', link: 'https://www.kinbridge.ca' },
                { name: 'Onyx Initiative', link: 'https://onyxinitiative.org' },
                { name: 'Conestoga College', link: 'https://www.conestogac.on.ca' },
                { name: 'Kitchener Public Library', link: 'https://www.kpl.org' },
                { name: 'African Women Alliance', link: 'https://afrowomen.ca/' },
                { name: 'Cambridge Food Bank', link: 'https://cambridgefoodbank.org/' },
                { name: 'Food Bank of Waterloo Region (FBWR)', link: 'https://www.thefoodbank.ca/about/' },
                { name: 'Greenway- Chaplin Community Centre', link: 'https://greenwaychaplin.com/' },
                { name: 'Camino Wellbeing + Mental Health', link: 'https://www.caminowellbeing.ca' },
                { name: 'Community Justice Initiatives', link: 'https://cjiwr.com' },
                { name: 'Muslim Social Services Waterloo Region (MSS)', link: 'https://www.muslimsocialserviceskw.org' }
            ];

            for (let i = 0; i < partnersToSeed.length; i++) {
                const partner = partnersToSeed[i];
                await FirestoreService.savePartner(currentSite.id, {
                    name: partner.name,
                    type: "Community Partner",
                    description: "",
                    website: partner.link,
                    logo: "",
                    services: [],
                    published: true,
                    order: i
                });
            }
            setSuccessMsg("Successfully seeded partners!");
            loadPartners();
        } catch (err) {
            console.error(err);
            setError("Failed to seed partners.");
        } finally {
            setIsSeeding(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            setError("Partner Name is required.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccessMsg("");

        try {
            // Process services input
            const servicesList = servicesInput
                .split(",")
                .map(s => s.trim())
                .filter(s => s.length > 0);

            await FirestoreService.savePartner(
                currentSite.id,
                {
                    ...formData,
                    services: servicesList,
                },
                currentPartnerId || undefined
            );

            setSuccessMsg(currentPartnerId ? "Partner updated successfully!" : "Partner created successfully!");
            setIsModalOpen(false);
            loadPartners();
            resetForm();
        } catch (err) {
            console.error(err);
            setError("Failed to save partner.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: "Delete Partner",
            message: "Are you sure you want to delete this partner? This action cannot be undone.",
            variant: "danger",
            confirmLabel: "Delete"
        });

        if (!isConfirmed) return;

        try {
            await FirestoreService.deletePartner(currentSite.id, id);
            loadPartners();
        } catch (err) {
            console.error(err);
            setError("Failed to delete partner.");
        }
    };

    const handleEdit = (partner: Partner) => {
        setFormData({ ...partner });
        setCurrentPartnerId(partner.id);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            type: "",
            description: "",
            website: "",
            logo: "",
            services: [],
            published: true,
            order: partners.length + 1,
        });
        setServicesInput("");
        setCurrentPartnerId(null);
    };

    const openModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <>
            <PageMeta
                title="Partner Manager"
                description="Manage partners and collaborators"
            />

            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-bold dark:text-white">Partner Manager</h1>
                <div className="flex gap-3">
                    <Button requireSuperAdmin variant="outline" onClick={seedPartners} disabled={isSeeding}>
                        {isSeeding ? "Seeding..." : "Seed Partners"}
                    </Button>
                    <Button onClick={openModal} className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" /> Add Partner
                    </Button>
                </div>
            </div>

            {error && <Alert variant="error" title="Error" message={error} />}
            {successMsg && <Alert variant="success" title="Success" message={successMsg} />}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">Page Configuration (Hero)</h2>
                    <Button onClick={savePageConfig} disabled={savingConfig} className="bg-blue-600 hover:bg-blue-700">
                        {savingConfig ? "Saving..." : "Save Page Config"}
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Hero Heading</Label>
                        <Input 
                            value={pageConfig.hero?.heading || ""}
                            onChange={(e) => setPageConfig({...pageConfig, hero: {...pageConfig.hero, heading: e.target.value}})}
                        />
                    </div>
                    <div>
                        <Label>Video Embed URL (YouTube/Vimeo)</Label>
                        <Input 
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={pageConfig.hero?.videoUrl || ""}
                            onChange={(e) => setPageConfig({...pageConfig, hero: {...pageConfig.hero, videoUrl: e.target.value}})}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label>Hero Description</Label>
                        <textarea 
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            rows={3}
                            value={pageConfig.hero?.content || ""}
                            onChange={(e) => setPageConfig({...pageConfig, hero: {...pageConfig.hero, content: e.target.value}})}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading partners...</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-medium">
                                    <th className="p-4">Logo</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Website</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Order</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {partners.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500">
                                            No partners found
                                        </td>
                                    </tr>
                                ) : (
                                    partners.map((partner) => (
                                        <tr key={partner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                            <td className="p-4">
                                                {partner.logo ? (
                                                    <img src={partner.logo} alt={partner.name} className="w-12 h-12 object-contain rounded bg-gray-50" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Logo</div>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium dark:text-white">{partner.name}</td>
                                            <td className="p-4 text-sm text-gray-500">{partner.type}</td>
                                            <td className="p-4 text-sm text-blue-500 truncate max-w-xs">{partner.website}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${partner.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                                    {partner.published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500">{partner.order}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleEdit(partner)}
                                                    className="text-gray-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(partner.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <TrashBinIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentPartnerId ? "Edit Partner" : "Add New Partner"}
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Partner Name</Label>
                            <Input
                                placeholder="Enter partner name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Partner Type</Label>
                            <Input
                                placeholder="e.g. Community Partner"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Website URL</Label>
                            <Input
                                placeholder="https://..."
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Partner Logo</Label>
                            <div className="flex gap-4 items-start">
                                {formData.logo ? (
                                    <div className="relative group w-20 flex-shrink-0">
                                        <img
                                            src={formData.logo}
                                            alt="Logo"
                                            className="w-full h-20 object-contain rounded-lg border dark:border-gray-600 bg-gray-50"
                                        />
                                        <button
                                            onClick={() => setFormData({ ...formData, logo: "" })}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                                        >
                                            <TrashBinIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setIsMediaLibraryOpen(true)}
                                        className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-colors"
                                    >
                                        <span className="text-xs">Logo</span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-2">
                                        Select partner logo (preferably transparent PNG).
                                    </p>
                                    <Input
                                        placeholder="Or paste image URL"
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label>Description</Label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                rows={3}
                                placeholder="Brief description of the partnership"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Services (Comma Separated)</Label>
                            <Input
                                placeholder="Consulting, Strategy, Dev..."
                                value={servicesInput}
                                onChange={(e) => setServicesInput(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Sort Order</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer mt-8">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium dark:text-gray-300">Published</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t dark:border-gray-700">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : currentPartnerId ? "Update Partner" : "Create Partner"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <MediaLibrary
                isOpen={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                onSelect={(url) => {
                    setFormData({ ...formData, logo: url });
                    setIsMediaLibraryOpen(false);
                }}
            />
        </>
    );
}
