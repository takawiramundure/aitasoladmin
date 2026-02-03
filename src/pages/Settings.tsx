import { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { FirestoreService } from "../services/firestore";
import { useSite } from "../context/SiteContext";
import { SiteSettings } from "../types/siteSettings";

export default function Settings() {
    const { currentSite } = useSite();
    const [settings, setSettings] = useState<Partial<SiteSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (currentSite) {
            fetchSettings();
        }
    }, [currentSite]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getSiteSettings(currentSite.id);
            if (data) {
                setSettings(data);
            } else {
                // Initialize with defaults if needed
                setSettings({ siteTitle: currentSite.name });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await FirestoreService.saveSiteSettings(currentSite.id, settings as SiteSettings);
            setMessage({ type: "success", text: "Settings saved successfully!" });
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage({ type: "error", text: "Failed to save settings." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-800 dark:text-white">Loading settings...</div>;

    return (
        <>
            <PageMeta
                title={`Settings - ${currentSite.name} | Digital Maples Labs CMS`}
                description="Manage your application settings"
            />
            <PageBreadcrumb pageTitle={`Settings - ${currentSite.name}`} />
            <div className="mx-auto max-w-270">
                <form onSubmit={handleSave}>
                    <div className="grid grid-cols-1 gap-8">
                        {/* General Settings */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Site Metadata & SEO
                                </h3>
                            </div>
                            <div className="p-7">
                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Site Title
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        value={settings.siteTitle || ""}
                                        onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                        placeholder={currentSite.name}
                                    />
                                </div>

                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Site Description
                                    </label>
                                    <textarea
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        rows={3}
                                        value={settings.siteDescription || ""}
                                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                        placeholder="Enter site description for SEO..."
                                    ></textarea>
                                </div>

                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Keywords (comma separated)
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        value={settings.siteKeywords || ""}
                                        onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>
                            </div>
                        </div>





                        {/* Advanced Settings */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Advanced: Custom Script Injection
                                </h3>
                            </div>
                            <div className="p-7">
                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Header Scripts (e.g., GTM, Chat Widget)
                                    </label>
                                    <textarea
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-mono text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        rows={5}
                                        placeholder="<script>...</script>"
                                        value={settings.headerScripts || ""}
                                        onChange={(e) => setSettings({ ...settings, headerScripts: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Body Scripts (End of body)
                                    </label>
                                    <textarea
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-mono text-sm text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        rows={5}
                                        placeholder="<script>...</script>"
                                        value={settings.bodyScripts || ""}
                                        onChange={(e) => setSettings({ ...settings, bodyScripts: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Support & Configuration */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Support & Configuration
                                </h3>
                            </div>
                            <div className="p-7">
                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Support Ticket Link (URL)
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="url"
                                        placeholder="https://support.example.com"
                                        value={settings.supportTicketLink || ""}
                                        onChange={(e) => setSettings({ ...settings, supportTicketLink: e.target.value })}
                                    />
                                </div>

                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Support Email
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="email"
                                        value={settings.supportEmail || ""}
                                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                        placeholder="contact@example.com"
                                    />
                                </div>

                                <div className="mb-5.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Maintenance Mode
                                    </label>
                                    <select
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        value={settings.maintenanceMode ? "true" : "false"}
                                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.value === "true" })}
                                    >
                                        <option value="false">Disabled</option>
                                        <option value="true">Enabled</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4.5">
                            {message.text && (
                                <div className={`flex items-center ${message.type === "success" ? "text-meta-3" : "text-meta-1"}`}>
                                    {message.text}
                                </div>
                            )}
                            <button
                                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-50"
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Settings"}
                            </button>
                        </div>
                    </div >
                </form >
            </div >
        </>
    );
}
