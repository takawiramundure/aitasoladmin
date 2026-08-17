"use client";

import { useEffect, useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { FirestoreService } from "@/services/firestore";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, query, where, getDocs, collection } from "firebase/firestore";
import { db, getDb, firebaseConfig } from "@/firebaseConfig";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { EyeIcon, PencilIcon, XIcon, AlertTriangleIcon, KeyRoundIcon, Lock } from "lucide-react";
import { SITES } from "@/config/sites";
import { useDialog } from "@/context/DialogContext";
import { getFunctions, httpsCallable } from "firebase/functions";

interface User {
    id: string;
    email: string;
    role: 'super_admin' | 'tenant_admin' | 'editor';
    displayName?: string;
    phoneNumber?: string;
    allowedSites?: string[];
    deleted?: boolean;
}

const PERMISSION_KEYS = [
    { key: "view_content", label: "View Content" },
    { key: "edit_content", label: "Edit Content" },
    { key: "manage_media", label: "Manage Media" },
    { key: "site_settings", label: "Site Settings" },
    { key: "page_seo", label: "Page SEO" },
    { key: "manage_users", label: "Manage Users" },
    { key: "delete_users", label: "Delete Users" },
    { key: "system_settings", label: "System Settings" },
    { key: "view_leads", label: "View Leads / Submissions" },
    { key: "manage_forms", label: "Manage / Edit Forms" },
    { key: "impersonate_users", label: "Impersonate Users (View As)" },
];

export default function UserManagement() {
    const { confirm, alert: dialogAlert } = useDialog();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser, profile, impersonate, isImpersonating, stopImpersonation, hasPermission, permissionsConfig, savePermissionsConfig } = useAuth();
    const [showImpersonationModal, setShowImpersonationModal] = useState(false);

    // User Edit/Create State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserDisplayName, setNewUserDisplayName] = useState("");
    const [newUserPhone, setNewUserPhone] = useState("");
    const [newUserRole, setNewUserRole] = useState<'editor' | 'tenant_admin' | 'super_admin'>('editor');
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [creating, setCreating] = useState(false);

    // Permissions Modal State
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [tempPermissions, setTempPermissions] = useState<Record<string, Record<string, boolean>>>({});
    const [savingPermissions, setSavingPermissions] = useState(false);

    useEffect(() => {
        if (isPermissionsOpen) {
            setTempPermissions(JSON.parse(JSON.stringify(permissionsConfig)));
        }
    }, [isPermissionsOpen, permissionsConfig]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getUsers();
            setAllUsers(data as User[]);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on current user's role
    const filteredUsers = useMemo(() => {
        if (!profile) return [];
        if (profile.role === 'super_admin') return allUsers.filter(u => u.deleted !== true);

        // If Editor, filter out Super Admins and users from other sites
        return allUsers.filter(u => {
            if (u.deleted === true) return false; // Hide soft-deleted users
            if (u.role === 'super_admin') return false; // Hide Super Admins

            // Show if user is me
            if (u.id === profile.uid) return true;

            // Show if user shares at least one site with me
            const mySites = profile.allowedSites || [];
            const theirSites = u.allowedSites || [];
            return mySites.some(site => theirSites.includes(site));
        });
    }, [allUsers, profile]);

    // Available Sites for Assignment (Filtered for Editor)
    const availableSitesToAssign = useMemo(() => {
        if (!profile) return [];
        if (profile.role === 'super_admin') return SITES;
        return SITES.filter(site => profile.allowedSites?.includes(site.id));
    }, [profile]);

    const openCreateModal = () => {
        setEditUser(null);
        setNewUserEmail("");
        setNewUserDisplayName("");
        setNewUserPhone("");
        setNewUserRole("editor"); // Default to editor
        setSelectedSites([]);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        setNewUserEmail(user.email);
        setNewUserDisplayName(user.displayName || "");
        setNewUserPhone(user.phoneNumber || "");
        setNewUserRole(user.role);
        setSelectedSites(user.allowedSites || []);
        setIsModalOpen(true);
    };

    const handleImpersonate = async (userId: string) => {
        await impersonate(userId);
        setShowImpersonationModal(true);
    }

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleSendResetLink = async (email: string) => {
        const isConfirmed = await confirm({
            title: "Send Password Reset Link",
            message: `Are you sure you want to send a password reset link to ${email}?`,
            variant: "warning",
            confirmLabel: "Send Link"
        });

        if (isConfirmed) {
            try {
                await sendPasswordResetEmail(auth, email, {
                    url: window.location.origin + '/signin',
                });
                
                // Log action to audit logs collection in the centralized (default) database
                const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
                const { db } = await import("@/firebaseConfig");
                await addDoc(collection(db, 'audit_logs'), {
                    timestamp: serverTimestamp(),
                    userId: auth.currentUser?.uid || "unknown",
                    userEmail: auth.currentUser?.email || "unknown",
                    action: "admin_password_reset_trigger",
                    details: {
                        targetUserEmail: email,
                        triggeredFrom: "User Manager"
                    },
                    realRole: "admin",
                    activeRole: "admin"
                });

                await dialogAlert({
                    title: "Email Sent",
                    message: `A password reset email has been sent to ${email}.`,
                    variant: "success"
                });
            } catch (error: any) {
                console.error("Error sending reset email:", error);
                await dialogAlert({
                    title: "Failed to Send",
                    message: "Failed to send reset email: " + error.message,
                    variant: "danger"
                });
            }
        }
    };

    const handleAssignTempPassword = async (userId: string, email: string) => {
        const tempPassword = generatePassword();
        const isConfirmed = await confirm({
            title: "Assign Temporary Password",
            message: `Are you sure you want to generate a 12-hour temporary password for ${email}?`,
            variant: "warning",
            confirmLabel: "Generate Password"
        });

        if (isConfirmed) {
            setLoading(true);
            try {
                const functions = getFunctions();
                const setTempPasswordFn = httpsCallable(functions, "setTemporaryPassword");
                await setTempPasswordFn({ targetUid: userId, password: tempPassword });

                await dialogAlert({
                    title: "Temporary Password Assigned",
                    message: `Temporary password set successfully! Please copy and send this temporary password securely to the user: ${tempPassword} (expires in 12 hours).`,
                    variant: "success"
                });
            } catch (error: any) {
                console.error("Error setting temporary password:", error);
                await dialogAlert({
                    title: "Failed to Set Password",
                    message: error.message || "Failed to assign temporary password.",
                    variant: "danger"
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSaveUser = async () => {
        if (!editUser && !newUserEmail) {
            await dialogAlert({
                title: "Validation Error",
                message: "Email is required for new users.",
                variant: "warning"
            });
            return;
        }

        // Security check for Non-Super-Admins creating/editing users
        if (profile?.role !== 'super_admin') {
            if (newUserRole === 'super_admin') {
                await dialogAlert({
                    title: "Access Denied",
                    message: "You cannot create or manage Super Admins.",
                    variant: "danger"
                });
                return;
            }
            // Ensure they are not assigning sites they don't have access to
            const illegalSites = selectedSites.filter(siteId => !profile.allowedSites?.includes(siteId));
            if (illegalSites.length > 0) {
                await dialogAlert({
                    title: "Permission Error",
                    message: "You cannot assign access to sites you do not manage.",
                    variant: "warning"
                });
                return;
            }
        }

        setCreating(true);
        try {
            if (editUser) {
                // UPDATE existing across all tenant databases
                const userData = {
                    displayName: newUserDisplayName,
                    email: newUserEmail,
                    phoneNumber: newUserPhone,
                    role: newUserRole,
                    allowedSites: selectedSites
                };
                await Promise.all(
                    SITES.map(async (site) => {
                        try {
                            const siteDb = getDb(site.id);
                            await setDoc(doc(siteDb, 'users', editUser.id), userData, { merge: true });
                        } catch (err) {
                            console.warn(`Could not sync updated user to site database '${site.id}':`, err);
                        }
                    })
                );
                await dialogAlert({
                    title: "Success",
                    message: "User updated successfully across all tenant databases",
                    variant: "success"
                });
            } else {
                // CREATE new
                const randomPassword = generatePassword();
                const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
                const secondaryAuth = getAuth(secondaryApp);
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUserEmail, randomPassword);
                const newUid = userCredential.user.uid;
                await sendPasswordResetEmail(secondaryAuth, newUserEmail, {
                    url: window.location.origin + '/signin',
                });
                await signOut(secondaryAuth);
                await deleteApp(secondaryApp);

                const newUserData = {
                    displayName: newUserDisplayName,
                    email: newUserEmail,
                    phoneNumber: newUserPhone,
                    role: newUserRole,
                    allowedSites: selectedSites,
                    createdAt: new Date().toISOString(),
                    pending: false
                };
                await Promise.all(
                    SITES.map(async (site) => {
                        try {
                            const siteDb = getDb(site.id);
                            await setDoc(doc(siteDb, 'users', newUid), newUserData);
                        } catch (err) {
                            console.warn(`Could not sync new user to site database '${site.id}':`, err);
                        }
                    })
                );
                await dialogAlert({
                    title: "User Created",
                    message: `User created successfully! A password reset email has been sent to ${newUserEmail} so they can set their own password.`,
                    variant: "success"
                });
            }

            setIsModalOpen(false);
            loadUsers();
        } catch (e: any) {
            console.error(e);
            if (e.code === 'auth/email-already-in-use') {
                await dialogAlert({
                    title: "Registration Error",
                    message: "This email is already registered.",
                    variant: "danger"
                });
            } else {
                await dialogAlert({
                    title: "Operation Failed",
                    message: "Operation failed: " + e.message,
                    variant: "danger"
                });
            }
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        const isConfirmed = await confirm({
            title: "Delete User",
            message: `Are you sure you want to delete user ${email}? This will revoke their access permanently.`,
            variant: "danger",
            confirmLabel: "Delete User"
        });

        if (isConfirmed) {
            setLoading(true);
            try {
                const functions = getFunctions();
                const deleteUserFn = httpsCallable(functions, "deleteUserFromAuth");
                await deleteUserFn({ targetUid: userId });

                // Also log action locally for audit logs
                const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
                await addDoc(collection(db, 'audit_logs'), {
                    timestamp: serverTimestamp(),
                    userId: auth.currentUser?.uid || "unknown",
                    userEmail: auth.currentUser?.email || "unknown",
                    action: "admin_user_delete",
                    details: {
                        targetUserUid: userId,
                        targetUserEmail: email
                    },
                    realRole: "admin",
                    activeRole: "admin"
                });

                loadUsers();
                await dialogAlert({
                    title: "User Deleted",
                    message: "The user has been successfully removed from authentication, and their Firestore profile has been soft-deleted to preserve history.",
                    variant: "success"
                });
            } catch (error: any) {
                console.error("Error deleting user:", error);
                await dialogAlert({
                    title: "Delete Error",
                    message: error.message || "Failed to delete user. Please try again.",
                    variant: "danger"
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSavePermissions = async () => {
        setSavingPermissions(true);
        try {
            await savePermissionsConfig(tempPermissions);
            await dialogAlert({
                title: "Permissions Saved",
                message: "Roles and permissions updated successfully.",
                variant: "success"
            });
            setIsPermissionsOpen(false);
        } catch (error: any) {
            console.error("Failed to save permissions:", error);
            await dialogAlert({
                title: "Failed to Save",
                message: "Could not save permissions: " + error.message,
                variant: "danger"
            });
        } finally {
            setSavingPermissions(false);
        }
    };

    return (
        <>
            <PageMeta
                title="User Management | Digital Maples Labs CMS"
                description="Manage users and roles"
            />
            {/* Impersonation Banner - Always visible if impersonating */}
            {isImpersonating && (
                <div className="fixed top-0 left-0 right-0 z-[60] bg-blue-600 text-white px-4 py-3 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangleIcon className="text-yellow-300" size={20} />
                        <div>
                            <p className="font-bold text-sm">Viewing as {profile?.email}</p>
                            <p className="text-xs opacity-90">You are seeing the portal exactly as this user sees it.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white text-blue-700 hover:bg-blue-50 border-none"
                            onClick={() => window.location.href = '/'}
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600 border-none"
                            onClick={() => {
                                stopImpersonation();
                                setTimeout(() => window.location.reload(), 100);
                            }}
                        >
                            Exit View
                        </Button>
                    </div>
                </div>
            )}

            {/* Initial Pop-up Modal for Impersonation (Optional Confirmation) */}
            {showImpersonationModal && isImpersonating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm mx-4 transform transition-all scale-100">
                        <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <EyeIcon size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900">You are now {profile?.email}</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Any actions you take will be attributed to this user.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={() => window.location.href = '/'}>
                                Go to {profile?.role === 'super_admin' ? 'Super Admin' : 'Editor'} Dashboard
                            </Button>
                            <Button variant="outline" onClick={() => setShowImpersonationModal(false)}>
                                Stay on this page
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        User Management
                    </h3>
                    <div className="flex gap-3">
                        {profile?.role === 'super_admin' && (
                            <Button size="sm" variant="outline" onClick={() => setIsPermissionsOpen(true)}>
                                Roles & Permissions
                            </Button>
                        )}
                        <Button size="sm" onClick={openCreateModal}>+ Add User</Button>
                    </div>
                </div>

                {loading ? (
                    <div>Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {user.displayName || "No Name"}
                                                    {user.role === 'super_admin' && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-normal">Super Admin</span>}
                                                </span>
                                                <span className="text-xs text-gray-500">{user.email || user.id}</span>
                                                {user.phoneNumber && <span className="text-xs text-gray-400">Phone: {user.phoneNumber}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex flex-col gap-1">
                                                <span className="capitalize font-medium">{user.role.replace('_', ' ')}</span>
                                                {user.role === 'editor' && (
                                                    <span className="text-xs text-gray-400">
                                                        Access: {user.allowedSites?.join(', ') || 'None'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right flex justify-end gap-2 text-gray-500">
                                            <button
                                                title="View As"
                                                onClick={() => handleImpersonate(user.id)}
                                                className="p-1 hover:text-blue-600 transition-colors"
                                            >
                                                <EyeIcon size={18} />
                                            </button>
                                            {hasPermission('manage_users') && (
                                                <button
                                                    title="Send Password Reset Link"
                                                    onClick={() => handleSendResetLink(user.email)}
                                                    className="p-1 hover:text-yellow-600 transition-colors"
                                                >
                                                    <KeyRoundIcon size={18} />
                                                </button>
                                            )}
                                            {hasPermission('manage_users') && (
                                                <button
                                                    title="Assign Temporary Password"
                                                    onClick={() => handleAssignTempPassword(user.id, user.email)}
                                                    className="p-1 hover:text-teal-600 transition-colors"
                                                >
                                                    <Lock size={18} />
                                                </button>
                                            )}
                                            {hasPermission('manage_users') && (
                                                <button
                                                    title="Edit"
                                                    onClick={() => openEditModal(user)}
                                                    className="p-1 hover:text-gray-900 transition-colors"
                                                >
                                                    <PencilIcon size={18} />
                                                </button>
                                            )}
                                            {hasPermission('delete_users') && (
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDeleteUser(user.id, user.email)}
                                                    className="p-1 hover:text-red-600 transition-colors"
                                                >
                                                    <XIcon size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && <div className="p-4 text-center text-gray-500">No users found available for your role.</div>}
                    </div>
                )}



                {/* Add/Edit Modal (Unchanged) */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {editUser ? 'Edit User' : 'Add New User'}
                    </h3>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={newUserDisplayName}
                                onChange={(e) => setNewUserDisplayName(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="user@example.com"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                            {!editUser && (
                                <p className="text-xs text-gray-500 mt-1">
                                    An email will be sent immediately prompting the user to set their password.
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <Label>Phone Number (for MFA)</Label>
                            <Input
                                type="text"
                                placeholder="+12895550199"
                                value={newUserPhone}
                                onChange={(e) => setNewUserPhone(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Must include country code, e.g., +12895550199
                            </p>
                        </div>

                        {/* Role - Allowed options based on current user's role */}
                        {profile?.role === 'super_admin' ? (
                            <div>
                                <Label>Role</Label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as any)}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="tenant_admin">Tenant Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                        ) : hasPermission('manage_users') ? (
                            <div>
                                <Label>Role</Label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as any)}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="tenant_admin">Tenant Admin</option>
                                </select>
                            </div>
                        ) : (
                            <div>
                                <Label>Role</Label>
                                <div className="text-sm border p-3 rounded-lg bg-gray-100 text-gray-600">Editor</div>
                            </div>
                        )}

                        {/* Site Access - For Editors and Tenant Admins */}
                        {newUserRole !== 'super_admin' && (
                            <div>
                                <Label>Allowed Sites</Label>
                                <div className="space-y-2 mt-2 border p-3 rounded-lg bg-gray-50">
                                    {availableSitesToAssign.map(site => (
                                        <label key={site.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedSites.includes(site.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedSites([...selectedSites, site.id]);
                                                    else setSelectedSites(selectedSites.filter(id => id !== site.id));
                                                }}
                                                className="rounded text-brand-600 focus:ring-brand-500"
                                            />
                                            <span className="text-sm text-gray-700">{site.name}</span>
                                        </label>
                                    ))}
                                    {availableSitesToAssign.length === 0 && (
                                        <div className="text-xs text-gray-500">No sites available to assign.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={creating}>Cancel</Button>
                            <Button onClick={handleSaveUser} disabled={(!editUser && !newUserEmail) || creating}>
                                {creating ? "Saving..." : (editUser ? "Update User" : "Create User")}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Permissions Modal (Interactive) */}
                <Modal isOpen={isPermissionsOpen} onClose={() => setIsPermissionsOpen(false)} className="max-w-3xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Roles & Permissions</h3>
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b-2 border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Permission</th>
                                    <th scope="col" className="px-6 py-4 text-center text-blue-600">Editor</th>
                                    <th scope="col" className="px-6 py-4 text-center text-green-600">Tenant Admin</th>
                                    <th scope="col" className="px-6 py-4 text-center text-purple-600">Super Admin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {PERMISSION_KEYS.map((perm) => (
                                    <tr key={perm.key} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {perm.label}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!tempPermissions.editor?.[perm.key]}
                                                disabled={profile?.role !== 'super_admin'}
                                                onChange={(e) => {
                                                    const updated = { ...tempPermissions };
                                                    if (!updated.editor) updated.editor = {};
                                                    updated.editor[perm.key] = e.target.checked;
                                                    setTempPermissions(updated);
                                                }}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!tempPermissions.tenant_admin?.[perm.key]}
                                                disabled={profile?.role !== 'super_admin'}
                                                onChange={(e) => {
                                                    const updated = { ...tempPermissions };
                                                    if (!updated.tenant_admin) updated.tenant_admin = {};
                                                    updated.tenant_admin[perm.key] = e.target.checked;
                                                    setTempPermissions(updated);
                                                }}
                                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer disabled:opacity-50"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                disabled
                                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 opacity-50"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>Cancel</Button>
                        {profile?.role === 'super_admin' && (
                            <Button onClick={handleSavePermissions} disabled={savingPermissions}>
                                {savingPermissions ? "Saving..." : "Save Permissions"}
                            </Button>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
}
