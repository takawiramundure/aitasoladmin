import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { FirestoreService, PageContent } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Plus, Trash2, Download } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface FooterLink {
    label: string;
    url: string;
}

interface NewsletterSubscriber {
    id: string;
    email: string;
    subscribedAt: any;
}

export default function FooterManager() {
    const { currentSite } = useSite();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState<any>({});
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [loadingSubs, setLoadingSubs] = useState(false);

    useEffect(() => {
        loadContent();
        loadSubscribers();
    }, [currentSite.id]);

    const loadContent = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getPageContent('footer', currentSite.id);
            if (data) {
                // Flatten structure if needed or use as is. 
                // We'll store fields in the root of the 'footer' doc for simplicity, or in 'sections' if strictly following PageContent.
                // Let's use root for flexibility as we did in other managers.
                setContent(data);
            } else {
                setContent({
                    title: 'Footer',
                    sections: {}
                });
            }
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: 'Failed to load footer content.' });
        } finally {
            setLoading(false);
        }
    };

    const loadSubscribers = async () => {
        if (currentSite.id !== 'bweic') return; // Only BWEIC for now
        setLoadingSubs(true);
        try {
            const q = query(
                collection(db, 'bweic_newsletter_subscribers'),
                orderBy('subscribedAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const subs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as NewsletterSubscriber[];
            setSubscribers(subs);
        } catch (err) {
            console.error("Error loading subscribers:", err);
            // Don't error blocking the page
        } finally {
            setLoadingSubs(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            await FirestoreService.savePageContent('footer', content, currentSite.id);
            setStatus({ type: 'success', msg: 'Footer updated successfully!' });
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: 'Failed to save footer.' });
        } finally {
            setSaving(false);
        }
    };

    const handleLinkChange = (index: number, field: keyof FooterLink, value: string) => {
        const links = [...(content.policy_links || [])];
        links[index] = { ...links[index], [field]: value };
        setContent({ ...content, policy_links: links });
    };

    const addLink = () => {
        const links = [...(content.policy_links || []), { label: '', url: '' }];
        setContent({ ...content, policy_links: links });
    };

    const removeLink = (index: number) => {
        const links = [...(content.policy_links || [])];
        links.splice(index, 1);
        setContent({ ...content, policy_links: links });
    };

    const handleCrisisLineChange = (index: number, field: string, value: string) => {
        const lines = [...(content.crisis_lines || [])];
        lines[index] = { ...lines[index], [field]: value };
        setContent({ ...content, crisis_lines: lines });
    };

    const addCrisisLine = () => {
        const lines = [...(content.crisis_lines || []), { label: '', value: '' }];
        setContent({ ...content, crisis_lines: lines });
    };

    const removeCrisisLine = (index: number) => {
        const lines = [...(content.crisis_lines || [])];
        lines.splice(index, 1);
        setContent({ ...content, crisis_lines: lines });
    };

    const handleExtraLinkChange = (index: number, field: string, value: string) => {
        const links = [...(content.extra_links || [])];
        links[index] = { ...links[index], [field]: value };
        setContent({ ...content, extra_links: links });
    };

    const addExtraLink = () => {
        const links = [...(content.extra_links || []), { label: '', url: '' }];
        setContent({ ...content, extra_links: links });
    };

    const removeExtraLink = (index: number) => {
        const links = [...(content.extra_links || [])];
        links.splice(index, 1);
        setContent({ ...content, extra_links: links });
    };

    const exportSubscribers = () => {
        if (subscribers.length === 0) {
            alert("No subscribers to export.");
            return;
        }

        const headers = ["Email", "Date Subscribed"];
        const csvContent = [
            headers.join(","),
            ...subscribers.map(sub => {
                const date = sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleString() : new Date(sub.subscribedAt).toLocaleString();
                return `${sub.email},"${date}"`;
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <PageMeta title="Footer Manager" description="Manage footer content and settings" />
            <PageBreadcrumb pageTitle="Footer Manager" />

            <div className="grid grid-cols-1 gap-8">
                {/* CTA Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Call to Action (Top of Footer)</h2>
                    <div className="space-y-4">
                        <div>
                            <Label>Heading</Label>
                            <Input
                                value={content.donate_heading || ""}
                                onChange={e => setContent({ ...content, donate_heading: e.target.value })}
                                placeholder="Join The Movement"
                            />
                        </div>
                        <div>
                            <Label>Content</Label>
                            <textarea
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={3}
                                value={content.donate_content || ""}
                                onChange={e => setContent({ ...content, donate_content: e.target.value })}
                                placeholder="Take action today..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Button Text</Label>
                                <Input
                                    value={content.donate_label || ""}
                                    onChange={e => setContent({ ...content, donate_label: e.target.value })}
                                    placeholder="Partner With Us"
                                />
                            </div>
                            <div>
                                <Label>Button URL</Label>
                                <Input
                                    value={content.donate_url || ""}
                                    onChange={e => setContent({ ...content, donate_url: e.target.value })}
                                    placeholder="/take-action"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crisis Info Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold dark:text-white">Crisis Info (Left Helper)</h2>
                        <Button onClick={addCrisisLine} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Line
                        </Button>
                    </div>
                    <div className="space-y-4 mb-6">
                        <div>
                            <Label>Heading</Label>
                            <Input
                                value={content.help_heading || ""}
                                onChange={e => setContent({ ...content, help_heading: e.target.value })}
                                placeholder="Need help now?"
                            />
                        </div>
                        <div>
                            <Label>Subtext</Label>
                            <Input
                                value={content.help_subtext || ""}
                                onChange={e => setContent({ ...content, help_subtext: e.target.value })}
                                placeholder="There are crisis services available..."
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {content.crisis_lines && content.crisis_lines.length > 0 ? (
                            content.crisis_lines.map((line: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                    <div className="flex-1">
                                        <label className="text-xs mb-1 block text-gray-500">Label (e.g. 'Emergency:')</label>
                                        <Input
                                            value={line.label}
                                            onChange={e => handleCrisisLineChange(idx, 'label', e.target.value)}
                                            placeholder="9-8-8 Crisis Helpline:"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs mb-1 block text-gray-500">Value (e.g. '911')</label>
                                        <Input
                                            value={line.value}
                                            onChange={e => handleCrisisLineChange(idx, 'value', e.target.value)}
                                            placeholder="988"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeCrisisLine(idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No crisis lines added.</p>
                        )}
                    </div>
                </div>

                {/* Extra Links (Code of Conduct / Whistleblower) */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold dark:text-white">Extra Links (Top Right)</h2>
                        <Button onClick={addExtraLink} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Link
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {content.extra_links && content.extra_links.length > 0 ? (
                            content.extra_links.map((link: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                    <div className="flex-1">
                                        <label className="text-xs mb-1 block text-gray-500">Label</label>
                                        <Input
                                            value={link.label}
                                            onChange={e => handleExtraLinkChange(idx, 'label', e.target.value)}
                                            placeholder="Code of Conduct"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs mb-1 block text-gray-500">URL</label>
                                        <Input
                                            value={link.url}
                                            onChange={e => handleExtraLinkChange(idx, 'url', e.target.value)}
                                            placeholder="/code-of-conduct"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeExtraLink(idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No extra links added.</p>
                        )}
                    </div>
                </div>

                {/* Policy Links */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold dark:text-white">Footer Links</h2>
                        <Button onClick={addLink} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Link
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {content.policy_links && content.policy_links.length > 0 ? (
                            content.policy_links.map((link: FooterLink, idx: number) => (
                                <div key={idx} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                    <div className="flex-1">
                                        <label className="text-xs mb-1 block text-gray-500">Label</label>
                                        <Input
                                            value={link.label}
                                            onChange={e => handleLinkChange(idx, 'label', e.target.value)}
                                            placeholder="Privacy Policy"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs mb-1 block text-gray-500">URL</label>
                                        <Input
                                            value={link.url}
                                            onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                                            placeholder="/privacy"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeLink(idx)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No custom links added.</p>
                        )}
                    </div>
                </div>

                {status && (
                    <Alert variant={status.type} title={status.type === 'success' ? "Success" : "Error"} message={status.msg} />
                )}



                {/* Copyright Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Copyright Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <Label>Copyright Text</Label>
                            <Input
                                value={content.copyright_text || ""}
                                onChange={e => setContent({ ...content, copyright_text: e.target.value })}
                                placeholder="© 2026 Black Women Empowerment Initiative Canada. All rights reserved."
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty to use default auto-generated copyright.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Developer Text</Label>
                                <Input
                                    value={content.developer_text || ""}
                                    onChange={e => setContent({ ...content, developer_text: e.target.value })}
                                    placeholder="Developed by Digital Maples Labs Inc"
                                />
                            </div>
                            <div>
                                <Label>Developer URL</Label>
                                <Input
                                    value={content.developer_url || ""}
                                    onChange={e => setContent({ ...content, developer_url: e.target.value })}
                                    placeholder="http://digitalmaples.agency"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Instagram URL</Label>
                            <Input
                                value={content.social_instagram || ""}
                                onChange={e => setContent({ ...content, social_instagram: e.target.value })}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <Label>Twitter (X) URL</Label>
                            <Input
                                value={content.social_twitter || ""}
                                onChange={e => setContent({ ...content, social_twitter: e.target.value })}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div>
                            <Label>LinkedIn URL</Label>
                            <Input
                                value={content.social_linkedin || ""}
                                onChange={e => setContent({ ...content, social_linkedin: e.target.value })}
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                        <div>
                            <Label>Facebook URL</Label>
                            <Input
                                value={content.social_facebook || ""}
                                onChange={e => setContent({ ...content, social_facebook: e.target.value })}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Footer Settings"}
                    </Button>
                </div>

                {/* Newsletter Subscribers (Read-Only/Export) */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Newsletter Subscribers</h2>
                            <p className="text-sm text-gray-500">Export captured emails for use in MailChimp or other tools.</p>
                        </div>
                        <Button onClick={exportSubscribers} variant="outline" disabled={subscribers.length === 0}>
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b dark:border-gray-700 text-gray-500 text-sm">
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4 text-right">Date Subscribed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingSubs ? (
                                    <tr><td colSpan={2} className="p-4 text-center">Loading...</td></tr>
                                ) : subscribers.length > 0 ? (
                                    subscribers.map(sub => (
                                        <tr key={sub.id} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 dark:text-white">{sub.email}</td>
                                            <td className="py-3 px-4 text-right text-gray-500 text-sm">
                                                {sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={2} className="p-4 text-center text-gray-500">No subscribers yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}
