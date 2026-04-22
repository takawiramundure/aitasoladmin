"use client";

import React, { useEffect, useState } from 'react';
import PageMeta from "@/components/common/PageMeta";
import { FirestoreService } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Alert from "@/components/ui/alert/Alert";
import { Eye, EyeOff, Save, Clock, MapPin, Trash2, Plus, Mail, Search } from 'lucide-react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SEOEditor from "@/components/form/SEOEditor";

const DEFAULT_DATA = {
    enabled: true,
    hero: {
        title: "Contact Us",
        subtitle: "Get in Touch",
        description: "We're here to listen, support, and collaborate. Reach out to us today."
    },
    info: {
        address: "2 King Street West, Suite 100\nKitchener, Ontario N2G 1A3",
        appointment_only: true,
        hours: [
            { label: "Monday to Friday", value: "9 am to 3:30 pm", note: "(By Appointment Only)" },
            { label: "Saturday", value: "10 am to 2 pm", note: "(By Appointment Only)" }
        ],
        disclaimer: "Please note: Scheduled programs, consultations, training, counseling and outreach support may happen outside these office hours and at a different location. If you have any questions, please email or call us."
    },
    form_fields: [
        { id: 'name', label: 'Name', type: 'text', required: true },
        { id: 'email', label: 'Email', type: 'email', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: false },
        { id: 'message', label: 'Message', type: 'textarea', required: true }
    ]
};

const DMLABS_CONTACT_DEFAULT = {
    enabled: true,
    hero: {
        title: "Contact Digital Maples Labs",
        subtitle: "Let’s Build Something Meaningful",
        description: "Whether you have a question about our services, AI governance, or want to discuss a new project, we'd love to hear from you."
    },
    info: {
        address: "Ontario, Canada (Remote-First Agency)",
        appointment_only: false,
        hours: [
            { label: "Monday to Friday", value: "9 am to 5 pm", note: "(EST)" }
        ],
        disclaimer: "Our team operates remotely and across various time zones to support our global mission-driven partners."
    },
    form_fields: [
        { id: 'name', label: 'Full Name', type: 'text', required: true },
        { id: 'email', label: 'Work Email', type: 'email', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: false },
        { 
            id: 'projectType', 
            label: 'Project/Service Type', 
            type: 'select', 
            required: true,
            options: ['AI Automations', 'Web Development', 'SEO & Performance', 'Digital Strategy', 'App Maintenance']
        },
        {
            id: 'timeline',
            label: 'When do you need this by?',
            type: 'select',
            required: true,
            options: ['1 - 3 Weeks', '1 Month', '3 Months', 'Flexible']
        },
        { id: 'website', label: 'Current Website (if any)', type: 'text', required: false },
        { id: 'company', label: 'Company/Organization Name', type: 'text', required: false },
        { id: 'message', label: 'Any Additional information', type: 'textarea', required: true },
        {
            id: 'subject',
            label: 'Subject',
            type: 'radio',
            required: true,
            options: ['feedback', 'complaint', 'inquiry']
        }
    ]
};

export default function ContactPageManager() {
    const { currentSite } = useSite();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("info@kindmindsfamilywellness.org");
    const [sendgridApiKey, setSendgridApiKey] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => { loadContent(); }, [currentSite.id]);

    const loadContent = async () => {
        setLoading(true);
        try {
            // Fetch notification settings
            const settings = await FirestoreService.getSettings(currentSite.id, 'notifications');
            if (settings) {
                if (settings.recipient_email) setRecipientEmail(settings.recipient_email);
                if (settings.sendgrid_api_key) setSendgridApiKey(settings.sendgrid_api_key);
            }

            const siteDefaults = currentSite.id === 'dmlabs' ? DMLABS_CONTACT_DEFAULT : DEFAULT_DATA;
            const data = await FirestoreService.getPageContent('contact', currentSite.id);

            setContent(data ? {
                ...siteDefaults,
                ...data,
                hero: { ...siteDefaults.hero, ...(data.hero || {}) },
                info: {
                    ...siteDefaults.info,
                    ...(data.info || {}),
                    hours: data.info?.hours ?? siteDefaults.info.hours,
                }
            } : siteDefaults);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load content.");
            setContent(DEFAULT_DATA);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        setSuccessMsg(""); setError("");
        try {
            await FirestoreService.savePageContent('contact', content, currentSite.id);
            await FirestoreService.saveSettings(currentSite.id, 'notifications', { 
                recipient_email: recipientEmail,
                sendgrid_api_key: sendgridApiKey
            });
            setSuccessMsg("Contact page and notification settings saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const setHero = (field: string, value: string) => {
        setContent((prev: any) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
    };

    const setInfo = (field: string, value: any) => {
        setContent((prev: any) => ({ ...prev, info: { ...prev.info, [field]: value } }));
    };

    const updateHour = (index: number, field: string, value: string) => {
        const newHours = [...content.info.hours];
        newHours[index] = { ...newHours[index], [field]: value };
        setInfo('hours', newHours);
    };

    const addHour = () => {
        setInfo('hours', [...content.info.hours, { label: '', value: '', note: '' }]);
    };

    const removeHour = (index: number) => {
        setInfo('hours', content.info.hours.filter((_: any, i: number) => i !== index));
    };

    const handleSEOChange = (seoData: any) => {
        if (!content) return;
        setContent((prev: any) => ({ ...prev, seo: seoData }));
    };

    const addField = () => {
        const newField = { 
            id: `field_${Date.now()}`, 
            label: 'New Field', 
            type: 'text', 
            required: false,
            options: [] 
        };
        setContent((prev: any) => ({ ...prev, form_fields: [...(prev.form_fields || []), newField] }));
    };

    const updateField = (id: string, updates: any) => {
        setContent((prev: any) => ({
            ...prev,
            form_fields: prev.form_fields.map((f: any) => f.id === id ? { ...f, ...updates } : f)
        }));
    };

    const removeField = (id: string) => {
        setContent((prev: any) => ({
            ...prev,
            form_fields: prev.form_fields.filter((f: any) => f.id !== id)
        }));
    };

    if (loading) return <div className="p-6 text-gray-500">Loading contact settings...</div>;

    return (
        <>
            <PageMeta title="Contact Page Manager | Admin Portal" description="Manage the contact us page content" />
            <PageBreadcrumb pageTitle="Contact Page Manager" />

            <div className="p-6 max-w-4xl space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Contact Page Manager</h2>
                        <p className="text-sm text-gray-500">Update the address, hours, and hero section of the Contact Us page.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => { if (window.confirm("Reset to defaults?")) setContent(DEFAULT_DATA); }}>
                            Reset to Defaults
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "Saving..." : "Save Content"}
                        </Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Saved!" message={successMsg} /></div>}

                <div className="space-y-6">
                    {/* SEO Section */}
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <Search className="w-5 h-5 text-indigo-500" /> Search Engine Optimization
                        </h3>
                        <SEOEditor 
                            data={content?.seo || {}} 
                            onChange={handleSEOChange}
                        />
                    </div>
                    {/* Hero Section */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-500" /> Hero Section
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label>Tagline (Subtitle)</Label>
                                <Input value={content.hero.subtitle} onChange={e => setHero('subtitle', e.target.value)} />
                            </div>
                            <div>
                                <Label>Main Title</Label>
                                <Input value={content.hero.title} onChange={e => setHero('title', e.target.value)} />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm"
                                    rows={3}
                                    value={content.hero.description}
                                    onChange={e => setHero('description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address & Hours */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-red-500" /> Office Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <Label>Physical Address</Label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm font-mono"
                                    rows={3}
                                    value={content.info.address}
                                    onChange={e => setInfo('address', e.target.value)}
                                    placeholder="2 King Street West..."
                                />
                            </div>
                            
                            <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
                                <input
                                    type="checkbox"
                                    id="appointment-only"
                                    checked={content.info.appointment_only}
                                    onChange={e => setInfo('appointment_only', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <Label htmlFor="appointment-only" className="mb-0 cursor-pointer">Show "By Appointment Only" Badge</Label>
                            </div>

                            <div className="space-y-4 pt-2">
                                <Label className="flex items-center justify-between">
                                    <span>Office Hours</span>
                                    <Button size="sm" variant="outline" onClick={addHour}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Entry
                                    </Button>
                                </Label>
                                
                                {content.info.hours.map((hour: any, i: number) => (
                                    <div key={i} className="flex gap-3 items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 relative group">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                                            <div>
                                                <Label className="text-[10px] uppercase text-gray-400">Days</Label>
                                                <Input value={hour.label} onChange={e => updateHour(i, 'label', e.target.value)} placeholder="Mon-Fri" />
                                            </div>
                                            <div>
                                                <Label className="text-[10px] uppercase text-gray-400">Time Range</Label>
                                                <Input value={hour.value} onChange={e => updateHour(i, 'value', e.target.value)} placeholder="9 am - 5 pm" />
                                            </div>
                                            <div>
                                                <Label className="text-[10px] uppercase text-gray-400">Note (optional)</Label>
                                                <Input value={hour.note} onChange={e => updateHour(i, 'note', e.target.value)} placeholder="(Appointment Only)" />
                                            </div>
                                        </div>
                                        <button onClick={() => removeHour(i)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                             <div className="pt-4">
                                <Label>Hours Disclaimer / Footer Note</Label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm italic"
                                    rows={3}
                                    value={content.info.disclaimer}
                                    onChange={e => setInfo('disclaimer', e.target.value)}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">This note appears below the office hours.</p>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Form Builder */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5 text-green-500" /> Contact Form Builder
                            </div>
                            <Button size="sm" variant="outline" onClick={addField}>
                                <Plus className="w-4 h-4 mr-1" /> Add Field
                            </Button>
                        </h3>
                        <div className="space-y-4">
                            {content.form_fields?.map((field: any, index: number) => (
                                <div key={field.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                            <div>
                                                <Label className="text-[10px] uppercase">Label / Placeholder</Label>
                                                <Input value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} />
                                            </div>
                                            <div>
                                                <Label className="text-[10px] uppercase">Field Type</Label>
                                                <select 
                                                    value={field.type} 
                                                    onChange={e => updateField(field.id, { type: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm"
                                                >
                                                    <option value="text">Short Text</option>
                                                    <option value="email">Email Address</option>
                                                    <option value="tel">Phone Number</option>
                                                    <option value="textarea">Large Textarea</option>
                                                    <option value="select">Dropdown Select</option>
                                                    <option value="radio">Radio Options</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-4 h-full pt-6">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={field.required} 
                                                        onChange={e => updateField(field.id, { required: e.target.checked })}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-xs font-bold text-gray-500 uppercase">Required</span>
                                                </label>
                                                <button onClick={() => removeField(field.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {(field.type === 'select' || field.type === 'radio') && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <Label className="text-[10px] uppercase">Options (Comma separated)</Label>
                                            <Input 
                                                value={field.options?.join(', ') || ''} 
                                                onChange={e => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                                placeholder="Option 1, Option 2, Option 3"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Notification Settings */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" /> Notification Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Recipient Email Address</label>
                                <Input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="e.g. info@kindmindsfamilywellness.org"
                                />
                                <p className="text-xs text-gray-400">Where website contact form submissions are tracked.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">SendGrid API Key (Optional)</label>
                                <Input
                                    type="password"
                                    value={sendgridApiKey}
                                    onChange={(e) => setSendgridApiKey(e.target.value)}
                                    placeholder="SG.xxx..."
                                />
                                <p className="text-xs text-gray-400">Required to enable automated email notifications. Keep this secure.</p>
                            </div>
                        </div>
                    </div>

                    {/* Page Settings */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${content.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {content.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white">Page Online</h3>
                                    <p className="text-xs text-gray-500">Toggle whether the Contact page is publicly accessible.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setContent({ ...content, enabled: !content.enabled })}
                                className={`w-12 h-6 rounded-full relative transition-colors ${content.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${content.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={saving} className="px-10">
                        {saving ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>
            </div>
        </>
    );
}
