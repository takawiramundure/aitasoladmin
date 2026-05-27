"use client";

import React, { useEffect, useState } from 'react';
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FirestoreService } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { Trash2, Component, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import { useDialog } from "@/context/DialogContext";

export default function ReusableComponentsManager() {
    const { currentSite } = useSite();
    const { confirm } = useDialog();
    const [components, setComponents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const loadComponents = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getReusableSections(currentSite.id);
            setComponents(data);
        } catch (err) {
            console.error("Error loading reusable components:", err);
            setError("Failed to load reusable components.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentSite?.id) {
            loadComponents();
        }
    }, [currentSite?.id]);

    const handleDelete = async (componentId: string, label: string) => {
        const isConfirmed = await confirm({
            title: "Delete Reusable Component?",
            message: `Are you sure you want to delete "${label}"? This will remove it from the reusable library, but will not delete it from pages where it has already been added.`,
            variant: "danger",
            confirmLabel: "Delete"
        });

        if (!isConfirmed) return;

        setDeletingId(componentId);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.deleteReusableSection(currentSite.id, componentId);
            setSuccessMsg("Reusable component deleted successfully.");
            setTimeout(() => setSuccessMsg(""), 3000);
            await loadComponents();
        } catch (err) {
            console.error("Error deleting reusable component:", err);
            setError("Failed to delete reusable component.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Loading components library...</div>;

    return (
        <>
            <PageMeta
                title={`Reusable Components - ${currentSite.name} | Admin Portal`}
                description="Manage global reusable sections and layout components"
            />
            <PageBreadcrumb pageTitle="Reusable Components" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Component className="w-6 h-6 text-blue-600" />
                            Reusable Components Library
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage sections tagged as reusable. You can add these to any page using the "+ Add Reusable Component" button in the page editor.
                        </p>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                {components.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {components.map((comp) => {
                            const hasImages = comp.images && comp.images.length > 0;
                            const imageCount = comp.images?.length || 0;
                            const isFolderMapping = comp.useFolderMapping;

                            return (
                                <div
                                    key={comp.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/40 shadow-sm flex flex-col justify-between"
                                >
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                                                    {comp.reusableLabel || comp.heading || comp.id}
                                                </h3>
                                                <span className="inline-block font-mono text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 mt-1">
                                                    Original ID: {comp.id}
                                                </span>
                                            </div>
                                            <span className="px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold uppercase">
                                                {comp.useFolderMapping || comp.id.startsWith('gallery') ? 'Gallery' : 'Section'}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                            {comp.heading && (
                                                <p className="line-clamp-1">
                                                    <strong>Heading:</strong> {comp.heading}
                                                </p>
                                            )}
                                            {comp.subtitle && (
                                                <p className="line-clamp-1">
                                                    <strong>Subtitle:</strong> {comp.subtitle}
                                                </p>
                                            )}
                                            <p className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <Calendar size={14} />
                                                Saved: {new Date(comp.lastUpdated).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Status badges */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {isFolderMapping ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30">
                                                    <ImageIcon size={12} />
                                                    Folder: {comp.folderPath || 'root'}
                                                </span>
                                            ) : hasImages ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                                                    <ImageIcon size={12} />
                                                    {imageCount} Manual Images
                                                </span>
                                            ) : null}
                                            {comp.content && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
                                                    <FileText size={12} />
                                                    Has Rich Text
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-150 dark:border-gray-700 flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 hover:border-red-300 gap-1.5"
                                            onClick={() => handleDelete(comp.id, comp.reusableLabel || comp.heading || comp.id)}
                                            disabled={deletingId === comp.id}
                                        >
                                            <Trash2 size={16} />
                                            Remove from Library
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 max-w-lg mx-auto">
                        <Component className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">No reusable components yet</h3>
                        <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                            Go to any page in the Content Manager and click the "Tag as Reusable" button next to a section to save it here.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
