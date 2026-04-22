"use client";

import { useEffect, useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { FirestoreService } from "@/services/firestore";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseConfig } from "@/firebaseConfig";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { EyeIcon, PencilIcon, XIcon, AlertTriangleIcon } from "lucide-react";
import { SITES } from "@/config/sites";

interface User {
    id: string;
    email: string;
    role: 'super_admin' | 'editor';
    displayName?: string;
    allowedSites?: string[];
}

const permissions = [
    { name: "View Content", editor: true, super_admin: true },
    { name: "Edit Content", editor: true, super_admin: true },
    { name: "Manage Media", editor: true, super_admin: true },
    { name: "Manage Users", editor: false, super_admin: true },
    { name: "Delete Users", editor: false, super_admin: true },
    { name: "System Settings", editor: false, super_admin: true },
];

export default function UserManagement() {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser, profile, impersonate, isImpersonating, stopImpersonation } = useAuth();
    const [showImpersonationModal, setShowImpersonationModal] = useState(false);

    // User Edit/Create State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserRole, setNewUserRole] = useState<'editor' | 'super_admin'>('editor');
    const [selectedSites, setSelectedSites] = useState<string[]>([]);
    const [creating, setCreating] = useState(false);

    // Permissions Modal State
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

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
        if (profile.role === 'super_admin') return allUsers;

        // If Editor, filter out Super Admins and users from other sites
        return allUsers.filter(u => {
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
        setNewUserPassword("");
        setNewUserRole("editor"); // Default to editor
        setSelectedSites([]);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        setNewUserEmail(user.email);
        setNewUserRole(user.role);
        setSelectedSites(user.allowedSites || []);
        setIsModalOpen(true);
    };

    const handleImpersonate = async (userId: string) => {
        await impersonate(userId);
        setShowImpersonationModal(true);
    }

    const handleSaveUser = async () => {
        if (!editUser && (!newUserEmail || !newUserPassword)) {
            alert("Email and Password are required for new users.");
            return;
        }

        // Security check for Editors creating users
        if (profile?.role === 'editor') {
            if (newUserRole === 'super_admin') {
                alert("Editors cannot create Super Admins.");
                return;
            }
            // Ensure they are not assigning sites they don't have access to
            const illegalSites = selectedSites.filter(siteId => !profile.allowedSites?.includes(siteId));
            if (illegalSites.length > 0) {
                alert("You cannot assign access to sites you do not manage.");
                return;
            }
        }

        setCreating(true);
        try {
            if (editUser) {
                // UPDATE existing
                await setDoc(doc(db, 'users', editUser.id), {
                    role: newUserRole,
                    allowedSites: selectedSites
                }, { merge: true });
                alert("User updated successfully");
            } else {
                // CREATE new
                const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
                const secondaryAuth = getAuth(secondaryApp);
                const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUserEmail, newUserPassword);
                const newUid = userCredential.user.uid;
                await signOut(secondaryAuth);
                await deleteApp(secondaryApp);

                await setDoc(doc(db, 'users', newUid), {
                    email: newUserEmail,
                    role: newUserRole,
                    allowedSites: selectedSites,
                    createdAt: new Date().toISOString(),
                    pending: false
                });
                alert(`User created! Password: ${newUserPassword}`);
            }

            setIsModalOpen(false);
            loadUsers();
        } catch (e: any) {
            console.error(e);
            if (e.code === 'auth/email-already-in-use') {
                alert("This email is already registered.");
            } else {
                alert("Operation failed: " + e.message);
            }
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        if (confirm(`Are you sure you want to delete user ${email}? This will revoke their access.`)) {
            try {
                const { deleteDoc, doc } = await import("firebase/firestore");
                await deleteDoc(doc(db, "users", userId));
                loadUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
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
                        <Button size="sm" variant="outline" onClick={() => setIsPermissionsOpen(true)}>
                            Roles & Permissions
                        </Button>
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
                                            {user.email || user.displayName || user.id}
                                            {user.role === 'super_admin' && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Super Admin</span>}
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
                                            <button
                                                title="Edit"
                                                onClick={() => openEditModal(user)}
                                                className="p-1 hover:text-gray-900 transition-colors"
                                            >
                                                <PencilIcon size={18} />
                                            </button>
                                            <button
                                                title="Delete"
                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                className="p-1 hover:text-red-600 transition-colors"
                                            >
                                                <XIcon size={18} />
                                            </button>
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
                        {/* Email */}
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="user@example.com"
                                disabled={!!editUser}
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                        </div>
                        {/* Password - Only for new users */}
                        {!editUser && (
                            <div>
                                <Label>Temporary Password</Label>
                                <Input
                                    type="text"
                                    placeholder="e.g. TempPass123!"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 6 characters. User can change this later.
                                </p>
                            </div>
                        )}

                        {/* Role - Locked for Editor */}
                        {profile?.role === 'super_admin' ? (
                            <div>
                                <Label>Role</Label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white"
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as any)}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                        ) : (
                            <div>
                                <Label>Role</Label>
                                <div className="text-sm border p-3 rounded-lg bg-gray-100 text-gray-600">Editor</div>
                            </div>
                        )}

                        {/* Site Access - Only for Editors */}
                        {newUserRole === 'editor' && (
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
                            <Button onClick={handleSaveUser} disabled={(!editUser && (!newUserEmail || !newUserPassword)) || creating}>
                                {creating ? "Saving..." : (editUser ? "Update User" : "Create User")}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Permissions Modal (Unchanged) */}
                <Modal isOpen={isPermissionsOpen} onClose={() => setIsPermissionsOpen(false)} className="max-w-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Roles & Permissions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b-2 border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Permission</th>
                                    <th scope="col" className="px-6 py-4 text-center text-blue-600">Editor</th>
                                    <th scope="col" className="px-6 py-4 text-center text-purple-600">Super Admin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {permissions.map((perm) => (
                                    <tr key={perm.name} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {perm.name}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input type="checkbox" checked={perm.editor} readOnly className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input type="checkbox" checked={perm.super_admin} readOnly className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>Close</Button>
                    </div>
                </Modal>
            </div>
        </>
    );
}
