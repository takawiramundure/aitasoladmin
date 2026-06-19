"use client";

import React, { useEffect, useState, useMemo } from 'react';
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FirestoreService } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import { useDialog } from "@/context/DialogContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { Modal } from "@/components/ui/modal";
import { History, Eye, RotateCcw, Filter, Calendar, User, Database, Globe, RefreshCw } from 'lucide-react';

function VisualDiff({ prev, next }: { prev: any; next: any }) {
    if (!prev && !next) return <div className="text-gray-500 italic py-4">No data to compare.</div>;

    // If document was created (no previous data)
    if (!prev) {
        return (
            <div className="space-y-3">
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Document Created (New content added):
                </div>
                <pre className="p-4 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-2xl text-xs overflow-auto max-h-96 border border-green-100 dark:border-green-900/30">
                    {JSON.stringify(next, null, 2)}
                </pre>
            </div>
        );
    }

    // If document was deleted (no new data)
    if (!next) {
        return (
            <div className="space-y-3">
                <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Document Deleted (Previous state below):
                </div>
                <pre className="p-4 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 rounded-2xl text-xs overflow-auto max-h-96 border border-red-100 dark:border-red-900/30">
                    {JSON.stringify(prev, null, 2)}
                </pre>
            </div>
        );
    }

    // Flatten keys to compare key-value pairs
    const allKeys = Array.from(new Set([...Object.keys(prev), ...Object.keys(next)]));

    const diffs = allKeys.map(key => {
        const valPrev = prev[key];
        const valNext = next[key];
        const isIdentical = JSON.stringify(valPrev) === JSON.stringify(valNext);

        let type: 'added' | 'deleted' | 'modified' | 'identical' = 'identical';
        if (!(key in prev)) type = 'added';
        else if (!(key in next)) type = 'deleted';
        else if (!isIdentical) type = 'modified';

        return { key, valPrev, valNext, type };
    });

    const changedDiffs = diffs.filter(d => d.type !== 'identical');
    const unchangedDiffs = diffs.filter(d => d.type === 'identical');

    const renderValue = (val: any) => {
        if (val === null || val === undefined) return <span className="italic text-gray-400">null</span>;
        if (typeof val === 'object') {
            return <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">{JSON.stringify(val, null, 2)}</pre>;
        }
        return <span>{String(val)}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {changedDiffs.map(({ key, valPrev, valNext, type }) => (
                    <div key={key} className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-150 dark:border-gray-800">
                            <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">{key}</span>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                type === 'added' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' :
                                type === 'deleted' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                            }`}>
                                {type.toUpperCase()}
                            </span>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-transparent">
                            {type !== 'added' && (
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Before:</div>
                                    <div className="p-3 bg-red-50/50 dark:bg-red-950/10 text-red-800 dark:text-red-400 rounded-xl text-sm border border-red-100/50 dark:border-red-950/20 overflow-auto max-h-60">
                                        {renderValue(valPrev)}
                                    </div>
                                </div>
                            )}
                            {type !== 'deleted' && (
                                <div className="space-y-1 md:col-start-2">
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">After:</div>
                                    <div className="p-3 bg-green-50/50 dark:bg-green-950/10 text-green-800 dark:text-green-400 rounded-xl text-sm border border-green-100/50 dark:border-green-950/20 overflow-auto max-h-60">
                                        {renderValue(valNext)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {changedDiffs.length === 0 && (
                    <div className="text-center py-8 text-gray-500 italic bg-gray-50 dark:bg-gray-800/10 rounded-2xl">
                        No field changes detected (identical values).
                    </div>
                )}
            </div>

            {unchangedDiffs.length > 0 && (
                <details className="group border border-gray-200 dark:border-gray-800 rounded-2xl">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-between select-none bg-gray-50/30 dark:bg-transparent">
                        <span>Show {unchangedDiffs.length} Unchanged Fields</span>
                        <span className="transition-transform group-open:rotate-180 text-xs">▼</span>
                    </summary>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/10 space-y-2 max-h-60 overflow-y-auto">
                        {unchangedDiffs.map(({ key, valPrev }) => (
                            <div key={key} className="flex justify-between text-xs font-mono py-1.5 border-b border-gray-150/40 dark:border-gray-800/50 last:border-b-0">
                                <span className="text-gray-500 font-semibold">{key}:</span>
                                <span className="text-gray-700 dark:text-gray-300 truncate max-w-md">
                                    {typeof valPrev === 'object' ? JSON.stringify(valPrev) : String(valPrev)}
                                </span>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
}

export default function RollbackManager() {
    const { sites, currentSite } = useSite();
    const { confirm } = useDialog();

    // Filters & States
    const [selectedSiteId, setSelectedSiteId] = useState(currentSite.id);
    const [selectedCollection, setSelectedCollection] = useState("all");
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [rollbackSaving, setRollbackSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Details Modal State
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<any>(null);

    // Sync state site ID with current site context
    useEffect(() => {
        setSelectedSiteId(currentSite.id);
    }, [currentSite]);

    // Fetch site history
    const loadHistory = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const data = await FirestoreService.getHistory(selectedSiteId);
            setHistory(data);
        } catch (err) {
            console.error("Error loading history logs:", err);
            setErrorMsg("Failed to load historical audit logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [selectedSiteId]);

    // Filtered logs list
    const filteredHistory = useMemo(() => {
        if (selectedCollection === "all") return history;
        return history.filter(item => item.collectionName === selectedCollection);
    }, [history, selectedCollection]);

    // Format display names for collections
    const getCollectionLabel = (name: string) => {
        const labels: Record<string, string> = {
            content: "Page Content",
            settings: "Settings",
            events: "Event",
            articles: "Article/Blog",
            videos: "Video",
            partners: "Partner",
            products: "Product/Shop",
            forms: "Form Configuration",
            reusable_sections: "Reusable Section"
        };
        return labels[name] || name;
    };

    // Execute the database rollback
    const handleRollback = async (item: any) => {
        // Find which state to restore:
        // Rolling back a CREATE = delete document (data = null)
        // Rolling back an UPDATE = restore previousData
        // Rolling back a DELETE = restore previousData (recreate)
        const targetData = item.action === 'create' ? null : item.previousData;
        
        let confirmMessage = "";
        let actionLabel = "";
        
        if (item.action === 'create') {
            confirmMessage = `This will DELETE the document "${item.documentId}" from "${getCollectionLabel(item.collectionName)}" because this history entry represents its creation. Do you want to continue?`;
            actionLabel = "Delete Document";
        } else if (item.action === 'delete') {
            confirmMessage = `This will RESTORE the deleted document "${item.documentId}" back to "${getCollectionLabel(item.collectionName)}". Do you want to continue?`;
            actionLabel = "Restore Document";
        } else {
            confirmMessage = `This will REVERT "${item.documentId}" in "${getCollectionLabel(item.collectionName)}" back to the state it was in before this edit. Do you want to continue?`;
            actionLabel = "Revert Document";
        }

        const isConfirmed = await confirm({
            title: `Confirm Rollback Action`,
            message: confirmMessage,
            variant: item.action === 'create' ? "danger" : "warning",
            confirmLabel: actionLabel
        });

        if (!isConfirmed) return;

        setRollbackSaving(true);
        setErrorMsg("");
        setSuccessMsg("");
        setIsDetailsOpen(false); // Close modal if open

        try {
            await FirestoreService.rollbackDocument(
                selectedSiteId,
                item.collectionName,
                item.documentId,
                targetData
            );
            setSuccessMsg(`Successfully rolled back "${item.documentId}" to its previous state!`);
            setTimeout(() => setSuccessMsg(""), 5000);
            await loadHistory();
        } catch (err: any) {
            console.error("Rollback failed:", err);
            setErrorMsg(`Rollback failed: ${err.message || 'Unknown error occurred.'}`);
        } finally {
            setRollbackSaving(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['super_admin']}>
            <PageMeta
                title="Rollback Manager | Admin Portal"
                description="Restore content, configurations, and elements to previous versions"
            />
            <PageBreadcrumb pageTitle="Rollback & Versioning Manager" />

            <div className="space-y-6 mx-auto max-w-7xl">
                {/* Dashboard Controls & Filters */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
                                <History className="text-brand-500" size={24} />
                                System Activity & Rollback Logs
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Filter logs by site or collection type. Inspect version differences, and roll back updates or deletions instantly.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Site Selection */}
                            <div className="flex items-center gap-2">
                                <Globe size={18} className="text-gray-400" />
                                <select
                                    value={selectedSiteId}
                                    onChange={(e) => setSelectedSiteId(e.target.value)}
                                    className="rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 focus:border-primary focus-visible:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                >
                                    {sites.map((site) => (
                                        <option key={site.id} value={site.id}>
                                            {site.name} ({site.id.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Collection Type Filter */}
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-400" />
                                <select
                                    value={selectedCollection}
                                    onChange={(e) => setSelectedCollection(e.target.value)}
                                    className="rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 focus:border-primary focus-visible:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                >
                                    <option value="all">All Content Types</option>
                                    <option value="content">Pages</option>
                                    <option value="settings">Settings</option>
                                    <option value="events">Events</option>
                                    <option value="articles">Articles / Blog</option>
                                    <option value="videos">Videos</option>
                                    <option value="partners">Partners</option>
                                    <option value="products">Products / Shop</option>
                                    <option value="forms">Forms</option>
                                    <option value="reusable_sections">Reusable Components</option>
                                </select>
                            </div>

                            {/* Refresh Button */}
                            <Button
                                variant="outline"
                                onClick={loadHistory}
                                disabled={loading}
                                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Feedback Alerts */}
                {errorMsg && <Alert variant="error" title="Error" message={errorMsg} />}
                {successMsg && <Alert variant="success" title="Success" message={successMsg} />}

                {/* Activity List Card */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                    {loading ? (
                        <div className="text-center py-20">
                            <RefreshCw className="animate-spin text-brand-500 mx-auto mb-4" size={32} />
                            <p className="text-gray-500 font-medium">Fetching historical event logs...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                                <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-b border-gray-150 dark:border-gray-800">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Timestamp</th>
                                        <th className="px-6 py-4 font-semibold">Content Type</th>
                                        <th className="px-6 py-4 font-semibold">Document ID</th>
                                        <th className="px-6 py-4 font-semibold">Action</th>
                                        <th className="px-6 py-4 font-semibold">Editor</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                                    {filteredHistory.map((item) => {
                                        const actionColors = {
                                            create: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30',
                                            update: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
                                            delete: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                                        };
                                        const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        });

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        {dateStr}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-850 dark:text-gray-300 text-xs font-semibold">
                                                        <Database size={12} className="text-gray-400" />
                                                        {getCollectionLabel(item.collectionName)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs max-w-[200px] truncate" title={item.documentId}>
                                                    {item.documentId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${actionColors[item.action as keyof typeof actionColors] || ''}`}>
                                                        {item.action ? item.action.toUpperCase() : 'UNKNOWN'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="flex items-center gap-1.5 text-gray-500">
                                                        <User size={14} className="text-gray-400" />
                                                        {item.updatedBy || 'system'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2.5">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-lg text-xs"
                                                            onClick={() => {
                                                                setActiveItem(item);
                                                                setIsDetailsOpen(true);
                                                            }}
                                                        >
                                                            <Eye size={14} className="mr-1" />
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="rounded-lg text-xs"
                                                            onClick={() => handleRollback(item)}
                                                            disabled={rollbackSaving}
                                                        >
                                                            <RotateCcw size={14} className="mr-1" />
                                                            Rollback
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredHistory.length === 0 && (
                                <div className="text-center py-16 text-gray-500">
                                    No historical logs matched your selection.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Visual Diff Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => {
                    setIsDetailsOpen(false);
                    setActiveItem(null);
                }}
                title="Historical Change Details & Visual Diff"
                size="xl"
            >
                {activeItem && (
                    <div className="space-y-6">
                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-150 dark:border-gray-800 text-sm">
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Content Type</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{getCollectionLabel(activeItem.collectionName)}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Document ID</span>
                                <span className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 truncate block max-w-xs">{activeItem.documentId}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Change Date</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date(activeItem.timestamp).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Edited By</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{activeItem.updatedBy || 'system'}</span>
                            </div>
                        </div>

                        {/* Diff Render */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Field Comparisons</h4>
                            <div className="border border-gray-150 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/10 max-h-[50vh] overflow-y-auto">
                                <VisualDiff prev={activeItem.previousData} next={activeItem.newData} />
                            </div>
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-150 dark:border-gray-800">
                            <span className="text-xs text-gray-400">
                                Action Log ID: <span className="font-mono">{activeItem.id}</span>
                            </span>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDetailsOpen(false);
                                        setActiveItem(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => handleRollback(activeItem)}
                                    disabled={rollbackSaving}
                                    className="flex items-center gap-1.5"
                                >
                                    <RotateCcw size={16} />
                                    {activeItem.action === 'create' ? 'Delete to Revert' : activeItem.action === 'delete' ? 'Restore Document' : 'Rollback to Prior State'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </ProtectedRoute>
    );
}
