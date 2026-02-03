import React, { useState, useEffect } from 'react';
import { FirestoreService } from '../../services/firestore';
import { SiteSettings, NavigationItem } from '../../types/siteSettings';
import { useSite } from '../../context/SiteContext';
import Button from '../../components/ui/button/Button';
import Alert from '../../components/ui/alert/Alert';
import { Plus, Trash2, GripVertical, Save, Upload, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { availableRoutes } from '../../utils/routes';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function SiteSettingsManager() {
    const { currentSite } = useSite();
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    // ... (rest of the component state and callbacks)

    // Helper to render datalist options
    const renderRouteOptions = () => (
        <datalist id="route-options">
            {availableRoutes.map((route) => (
                <option key={route.path} value={route.path}>
                    {route.label}
                </option>
            ))}
        </datalist>
    );

    // ... (rendering logic)



    useEffect(() => {
        if (currentSite) {
            loadSettings();
        }
    }, [currentSite]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await FirestoreService.getSiteSettings(currentSite.id);
            if (data) {
                // Ensure emergencyBar exists
                if (!data.emergencyBar) {
                    data.emergencyBar = {
                        enabled: true,
                        content: 'National Suicide Helpline available 24/7. Please call or text <a href="tel:988" style="color: white; font-weight: bold; text-decoration: underline;">9-8-8</a>.',
                        bgColor: '#84cc16' // text-lime-500
                    };
                }
                // Ensure topBar exists even if not in DB yet
                if (!data.topBar) {
                    data.topBar = {
                        enabled: false,
                        message: '',
                        phone: '',
                        email: ''
                    };
                }
                if (!data.paymentGateways) {
                    data.paymentGateways = {
                        currency: 'CAD',
                        stripePublicKey: '',
                        squareAppId: '',
                        squareLocationId: ''
                    };
                }
                setSettings(data);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            setStatus({ type: 'error', msg: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;

        try {
            setSaving(true);
            setStatus(null);
            await FirestoreService.saveSiteSettings(currentSite.id, settings);
            setStatus({ type: 'success', msg: 'Settings saved successfully!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setStatus({ type: 'error', msg: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !settings) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `${currentSite.id}/branding/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            updateBranding('logo', downloadURL);
            setStatus({ type: 'success', msg: 'Logo uploaded successfully!' });
        } catch (error) {
            console.error('Logo upload error:', error);
            setStatus({ type: 'error', msg: 'Failed to upload logo. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    const updateTheme = (key: keyof import('../../types/siteSettings').SiteTheme, value: string) => {
        if (!settings) return;
        setSettings({
            ...settings!,
            theme: { ...settings!.theme, [key]: value }
        });
    };

    const updateBranding = (key: keyof import('../../types/siteSettings').SiteBranding, value: string) => {
        if (!settings) return;
        setSettings({
            ...settings!,
            branding: { ...settings!.branding, [key]: value }
        });
    };

    const addNavItem = () => {
        if (!settings) return;
        const newItem: NavigationItem = {
            id: `nav-${Date.now()}`,
            name: 'New Item',
            path: '/',
            order: settings.navigation.length + 1
        };
        setSettings({
            ...settings!,
            navigation: [...settings!.navigation, newItem]
        });
    };

    const updateNavItem = (id: string, updates: Partial<NavigationItem>) => {
        if (!settings) return;
        setSettings({
            ...settings!,
            navigation: settings!.navigation.map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        });
    };

    const deleteNavItem = (id: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            navigation: settings.navigation.filter(item => item.id !== id)
        });
    };

    const addSubItem = (parentId: string) => {
        if (!settings) return;
        const newSubItem: NavigationItem = {
            id: `nav-${Date.now()}`,
            name: 'New Sub Item',
            path: '/',
            order: 1
        };

        setSettings({
            ...settings!,
            navigation: settings!.navigation.map(item => {
                if (item.id === parentId) {
                    return {
                        ...item,
                        subItems: [...(item.subItems || []), newSubItem]
                    };
                }
                return item;
            })
        });
    };

    const updateSubItem = (parentId: string, subId: string, updates: Partial<NavigationItem>) => {
        if (!settings) return;
        setSettings({
            ...settings,
            navigation: settings.navigation.map(item => {
                if (item.id === parentId && item.subItems) {
                    return {
                        ...item,
                        subItems: item.subItems.map(sub =>
                            sub.id === subId ? { ...sub, ...updates } : sub
                        )
                    };
                }
                return item;
            })
        });
    };

    const deleteSubItem = (parentId: string, subId: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            navigation: settings.navigation.map(item => {
                if (item.id === parentId && item.subItems) {
                    return {
                        ...item,
                        subItems: item.subItems.filter(sub => sub.id !== subId)
                    };
                }
                return item;
            })
        });
    };


    const moveNavItem = (index: number, direction: 'up' | 'down') => {
        if (!settings) return;
        const newNavigation = [...settings.navigation];
        if (direction === 'up' && index > 0) {
            [newNavigation[index], newNavigation[index - 1]] = [newNavigation[index - 1], newNavigation[index]];
        } else if (direction === 'down' && index < newNavigation.length - 1) {
            [newNavigation[index], newNavigation[index + 1]] = [newNavigation[index + 1], newNavigation[index]];
        }

        // Update order property
        const updatedNavigation = newNavigation.map((item, idx) => ({ ...item, order: idx + 1 }));

        setSettings({
            ...settings,
            navigation: updatedNavigation
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading settings...</div>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="p-6">
                <Alert
                    variant="error"
                    title="No Settings Found"
                    message="Please seed the database first to initialize settings."
                />
            </div>
        );
    }

    return (
        <>
            <datalist id="route-options">
                {availableRoutes.map((route) => (
                    <option key={route.path} value={route.path}>{route.label}</option>
                ))}
            </datalist>

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Site Settings - {currentSite.name}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Configure navigation, branding, and theme for {currentSite.name}
                        </p>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                {status && (
                    <Alert
                        variant={status.type}
                        title={status.type === 'success' ? 'Success' : 'Error'}
                        message={status.msg}
                    />
                )}

                {/* Emergency Bar Configuration */}
                {settings.emergencyBar && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-lime-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Emergency / Alert Bar</h2>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={settings.emergencyBar.enabled}
                                        onChange={(e) => {
                                            if (!settings) return;
                                            setSettings({
                                                ...settings,
                                                emergencyBar: { ...settings.emergencyBar!, enabled: e.target.checked }
                                            });
                                        }}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.emergencyBar.enabled ? 'bg-lime-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.emergencyBar.enabled ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                                <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                                    {settings.emergencyBar.enabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </label>
                        </div>

                        <div className={`space-y-4 ${!settings.emergencyBar.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Content
                                </label>
                                <div className="bg-white text-black rounded-lg">
                                    <ReactQuill
                                        theme="snow"
                                        className="h-64 mb-12"
                                        value={settings.emergencyBar.content}
                                        onChange={(value) => {
                                            if (!settings) return;
                                            setSettings({
                                                ...settings,
                                                emergencyBar: { ...settings.emergencyBar!, content: value }
                                            });
                                        }}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline', 'strike'],
                                                ['link'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Use the toolbar to format text. Links and phone numbers (e.g., <code>tel:988</code>) are supported.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Background Color
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={settings.emergencyBar.bgColor}
                                        onChange={(e) => {
                                            if (!settings) return;
                                            setSettings({
                                                ...settings,
                                                emergencyBar: { ...settings.emergencyBar!, bgColor: e.target.value }
                                            });
                                        }}
                                        className="w-16 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.emergencyBar.bgColor}
                                        onChange={(e) => {
                                            if (!settings) return;
                                            setSettings({
                                                ...settings,
                                                emergencyBar: { ...settings.emergencyBar!, bgColor: e.target.value }
                                            });
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Bar Configuration */}
                {settings.topBar && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Top Bar Configuration</h2>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={settings.topBar.enabled}
                                        onChange={(e) => {
                                            if (!settings) return;
                                            setSettings({
                                                ...settings,
                                                topBar: { ...settings.topBar!, enabled: e.target.checked }
                                            });
                                        }}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.topBar.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.topBar.enabled ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                                <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                                    {settings.topBar.enabled ? 'Enabled' : 'Disabled'}
                                </div>
                            </label>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!settings.topBar.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message (Left)
                                </label>
                                <input
                                    type="text"
                                    value={settings.topBar.message}
                                    onChange={(e) => {
                                        if (!settings) return;
                                        setSettings({
                                            ...settings,
                                            topBar: { ...settings.topBar!, message: e.target.value }
                                        });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Welcome message..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Button Label
                                </label>
                                <input
                                    type="text"
                                    value={settings.topBar.buttonLabel || ''}
                                    onChange={(e) => {
                                        if (!settings) return;
                                        setSettings({
                                            ...settings,
                                            topBar: { ...settings.topBar!, buttonLabel: e.target.value }
                                        });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="FIND HELP"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Button Link
                                </label>
                                <input
                                    type="text"
                                    value={settings.topBar.buttonLink || ''}
                                    onChange={(e) => {
                                        if (!settings) return;
                                        setSettings({
                                            ...settings,
                                            topBar: { ...settings.topBar!, buttonLink: e.target.value }
                                        });
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="/#contact"
                                />
                            </div>
                            {/* Hidden Phone/Email for now unless needed, or keep for other sites? keeping enabled=false on topBar effectively hides this block anyway, effectively repurposed per site */}
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Branding</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.branding.siteName}
                                onChange={(e) => updateBranding('siteName', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Logo URL
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.branding.logo}
                                    onChange={(e) => updateBranding('logo', e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="/logo.png"
                                />
                                <label className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploading ? 'Uploading...' : 'Upload'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            {settings.branding.logo && (
                                <img
                                    src={settings.branding.logo}
                                    alt="Logo preview"
                                    className="mt-2 h-16 object-contain border rounded p-2"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Gateways */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Payment Gateways</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Stripe Public Key
                            </label>
                            <input
                                type="text"
                                value={settings.paymentGateways?.stripePublicKey || ''}
                                onChange={(e) => {
                                    if (!settings) return;
                                    setSettings({
                                        ...settings,
                                        paymentGateways: { ...settings.paymentGateways!, stripePublicKey: e.target.value }
                                    });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="pk_test_..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Currency
                            </label>
                            <input
                                type="text"
                                value={settings.paymentGateways?.currency || 'CAD'}
                                onChange={(e) => {
                                    if (!settings) return;
                                    setSettings({
                                        ...settings,
                                        paymentGateways: { ...settings.paymentGateways!, currency: e.target.value }
                                    });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="CAD"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Square App ID
                            </label>
                            <input
                                type="text"
                                value={settings.paymentGateways?.squareAppId || ''}
                                onChange={(e) => {
                                    if (!settings) return;
                                    setSettings({
                                        ...settings,
                                        paymentGateways: { ...settings.paymentGateways!, squareAppId: e.target.value }
                                    });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="sq0idp-..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Square Location ID
                            </label>
                            <input
                                type="text"
                                value={settings.paymentGateways?.squareLocationId || ''}
                                onChange={(e) => {
                                    if (!settings) return;
                                    setSettings({
                                        ...settings,
                                        paymentGateways: { ...settings.paymentGateways!, squareLocationId: e.target.value }
                                    });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="L..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skrill Merchant Email
                            </label>
                            <input
                                type="text"
                                value={settings.paymentGateways?.skrillMerchantEmail || ''}
                                onChange={(e) => {
                                    if (!settings) return;
                                    setSettings({
                                        ...settings,
                                        paymentGateways: { ...settings.paymentGateways!, skrillMerchantEmail: e.target.value }
                                    });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="merchant@skrill.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skrill Merchant Email
                            </label>
                            <input
                                type="text"
                                value={settings.paymentGateways?.skrillMerchantEmail || ''}
                                onChange={(e) => {
                                    if (!settings) return;
                                    setSettings({
                                        ...settings,
                                        paymentGateways: { ...settings.paymentGateways!, skrillMerchantEmail: e.target.value }
                                    });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="merchant@skrill.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Theme Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Theme Colors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(settings.theme).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={value}
                                        onChange={(e) => updateTheme(key as any, e.target.value)}
                                        className="w-16 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => updateTheme(key as any, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Navigation Menu</h2>
                        <Button onClick={addNavItem} variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {settings.navigation.map((item, index) => (
                            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col gap-1 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => moveNavItem(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-gray-700 dark:text-gray-300"
                                            title="Move Up"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveNavItem(index, 'down')}
                                            disabled={index === settings.navigation.length - 1}
                                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-gray-700 dark:text-gray-300"
                                            title="Move Down"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateNavItem(item.id, { name: e.target.value })}
                                                placeholder="Name"
                                                className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                value={item.path}
                                                onChange={(e) => updateNavItem(item.id, { path: e.target.value })}
                                                placeholder="/path"
                                                list="route-options"
                                                className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <div className="flex gap-2">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.isExternal || false}
                                                        onChange={(e) => updateNavItem(item.id, { isExternal: e.target.checked })}
                                                        className="rounded"
                                                    />
                                                    <ExternalLink className="w-4 h-4" />
                                                    External
                                                </label>
                                            </div>
                                        </div>

                                        {/* Sub Items */}
                                        {item.subItems && item.subItems.length > 0 && (
                                            <div className="ml-6 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                                {item.subItems.map((subItem) => (
                                                    <div key={subItem.id} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={subItem.name}
                                                            onChange={(e) => updateSubItem(item.id, subItem.id, { name: e.target.value })}
                                                            placeholder="Sub Item Name"
                                                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={subItem.path}
                                                            onChange={(e) => updateSubItem(item.id, subItem.id, { path: e.target.value })}
                                                            placeholder="/path"
                                                            list="route-options"
                                                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                        />
                                                        <button
                                                            onClick={() => deleteSubItem(item.id, subItem.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => addSubItem(item.id)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Plus className="w-3 h-3 mr-1" />
                                                Add Dropdown Item
                                            </Button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteNavItem(item.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
