"use client";

import React, { useEffect, useState } from 'react';
import PageMeta from "@/components/common/PageMeta";
import { FirestoreService, PageContent } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { Copy, Edit2, Eye, EyeOff, LayoutTemplate } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function PagesManager() {
    const { currentSite } = useSite();
    const router = useRouter();
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Modal state
    const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
    const [pageToClone, setPageToClone] = useState<any>(null);
    const [cloneSlug, setCloneSlug] = useState("");
    const [cloneTitle, setCloneTitle] = useState("");

    const loadPages = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getPages(currentSite.id);
            setPages(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load pages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, [currentSite]);

    const handleCloneClick = (page: any) => {
        setPageToClone(page);
        setCloneSlug(`${page.id}-copy`);
        setCloneTitle(`${page.title || page.id} (Copy)`);
        setIsCloneModalOpen(true);
    };

    const submitClone = async () => {
        if (!cloneSlug || !cloneTitle || !pageToClone) return;

        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.clonePage(currentSite.id, pageToClone.id, cloneSlug, cloneTitle);
            setSuccessMsg(`Successfully cloned to ${cloneSlug}`);
            setIsCloneModalOpen(false);
            setTimeout(() => setSuccessMsg(""), 3000);
            await loadPages();
        } catch (err) {
            console.error(err);
            setError("Failed to clone page. It may already exist.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleVisibility = async (page: any) => {
        const newStatus = page.status === 'published' ? 'draft' : 'published';
        setSaving(true);
        setError("");
        try {
            await FirestoreService.updatePageVisibility(currentSite.id, page.id, newStatus);
            setSuccessMsg(`${page.id} is now ${newStatus}`);
            setTimeout(() => setSuccessMsg(""), 3000);
            await loadPages();
        } catch (err) {
            console.error(err);
            setError("Failed to update visibility.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (page: any) => {
        const template = page.template || page.id;
        const genericPages = [
            'our-story', 'meet-our-team', 'services', 'grounded-counseling', 'educational-programs',
            'advocacy-education', 'community-support', 'system-navigation', 'research',
            'project-black-wellness', 'project-phac-child-welfare', 'project-umoja-neurodivergent',
            'impact', 'success-stories', 'join-us', 'funders', 'volunteer', 'careers'
        ];
        
        if (currentSite.id === 'kmfw' && genericPages.includes(template)) {
            router.push(`/cms/content-manager?pageId=${template}&slug=${page.id}`);
        } else {
            router.push(`/cms/${template}?slug=${page.id}`);
        }
    };

    if (loading) return <div className="p-6">Loading pages...</div>;

    return (
        <>
            <PageMeta
                title={`All Pages - ${currentSite.name} | Admin Portal`}
                description="Manage all pages, clone, and toggle visibility"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            Pages Manager
                        </h2>
                        <p className="text-sm text-gray-500">
                            Clone existing pages, toggle their visibility, and manage draft content.
                        </p>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <tr>
                                <th className="px-4 py-3 font-semibold rounded-tl-lg">Page Title</th>
                                <th className="px-4 py-3 font-semibold">Slug (URL)</th>
                                <th className="px-4 py-3 font-semibold">Template</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {pages.map((page) => {
                                const isPublished = page.status !== 'draft';
                                return (
                                    <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                                            {page.title || page.id}
                                        </td>
                                        <td className="px-4 py-4 text-gray-500">
                                            /{page.slug || page.id}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs font-medium">
                                                <LayoutTemplate size={14} />
                                                {page.template || page.id}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                isPublished 
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                                                {isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleToggleVisibility(page)}
                                                    disabled={saving}
                                                    title={isPublished ? "Set to Draft" : "Publish"}
                                                >
                                                    {isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleCloneClick(page)}
                                                    disabled={saving}
                                                    title="Clone Page"
                                                >
                                                    <Copy size={16} />
                                                </Button>
                                                <Button 
                                                    variant="primary" 
                                                    size="sm" 
                                                    onClick={() => handleEdit(page)}
                                                    disabled={saving}
                                                    title="Edit Page"
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {pages.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No pages found for this site.
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isCloneModalOpen}
                onClose={() => setIsCloneModalOpen(false)}
                title="Clone Page"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        You are cloning the <strong>{pageToClone?.title || pageToClone?.id}</strong> page.
                    </p>
                    
                    <div>
                        <Label>New Page Title</Label>
                        <Input 
                            value={cloneTitle} 
                            onChange={(e) => setCloneTitle(e.target.value)}
                            placeholder="e.g. About (Copy)"
                        />
                    </div>

                    <div>
                        <Label>New Slug (URL)</Label>
                        <Input 
                            value={cloneSlug} 
                            onChange={(e) => setCloneSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                            placeholder="e.g. about-copy"
                        />
                        <p className="text-xs text-gray-400 mt-1">This will be the URL of the new page.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button variant="outline" onClick={() => setIsCloneModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={submitClone} disabled={saving || !cloneSlug || !cloneTitle}>
                            {saving ? "Cloning..." : "Clone Page"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
