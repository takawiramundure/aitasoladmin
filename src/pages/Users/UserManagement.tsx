import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { FirestoreService } from "../../services/firestore";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useAuth } from "../../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseConfig } from "../../firebaseConfig"; // Import config
import { initializeApp, deleteApp } from "firebase/app"; // For secondary app
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

interface User {
    id: string;
    email: string;
    role: 'super_admin' | 'editor';
    displayName?: string;
}

// Permissions Data
const permissions = [
    { name: "View Content", editor: true, super_admin: true },
    { name: "Edit Content", editor: true, super_admin: true },
    { name: "Manage Media", editor: true, super_admin: true },
    { name: "Manage Users", editor: false, super_admin: true },
    { name: "Delete Users", editor: false, super_admin: true },
    { name: "System Settings", editor: false, super_admin: true },
];

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    // Add User State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState(""); // Password state
    const [newUserRole, setNewUserRole] = useState<'editor' | 'super_admin'>('editor');
    const [creating, setCreating] = useState(false);

    // Permissions Modal State
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        // Ensure current user exists and has EMAIL synced
        if (currentUser) {
            // Update email/name if missing or changed
            await setDoc(doc(db, 'users', currentUser.uid), {
                email: currentUser.email,
                displayName: currentUser.displayName,
                role: 'super_admin' // Force admin for current
            }, { merge: true });
        }
        const data = await FirestoreService.getUsers();
        setUsers(data);
        setLoading(false);
    };

    const handleAddUser = async () => {
        if (!newUserEmail || !newUserPassword) {
            alert("Email and Password are required.");
            return;
        }

        setCreating(true);
        let secondaryApp;
        try {
            // 1. Create Auth User using Secondary App
            // We use a secondary app so we don't log out the current admin
            secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
            const secondaryAuth = getAuth(secondaryApp);

            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUserEmail, newUserPassword);
            const newUid = userCredential.user.uid;

            // Sign out the secondary immediately
            await signOut(secondaryAuth);

            // 2. Create Firestore Doc
            await setDoc(doc(db, 'users', newUid), {
                email: newUserEmail,
                role: newUserRole,
                createdAt: new Date().toISOString(),
                pending: false // Created successfully
            });

            alert(`User ${newUserEmail} created! Password: ${newUserPassword}`);

            // Reset form
            setNewUserEmail("");
            setNewUserPassword("");
            setIsModalOpen(false);

            // Reload list
            loadUsers();

        } catch (e: any) {
            console.error(e);
            if (e.code === 'auth/email-already-in-use') {
                alert("This email is already registered.");
            } else {
                alert("Failed to create user: " + e.message);
            }
        } finally {
            if (secondaryApp) {
                try { await deleteApp(secondaryApp); } catch { }
            }
            setCreating(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        // Optimistic update or reload
        try {
            // @ts-ignore
            await FirestoreService.updateUserRole(userId, newRole);
            const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole as any } : u);
            setUsers(updatedUsers);
            // Optional: Toast "Role updated"
        } catch (error) {
            console.error(error);
            alert("Failed to update role");
        }
    };

    const handleDeleteUser = async (userId: string, email: string) => {
        if (confirm(`Are you sure you want to delete user ${email}? This will revoke their access.`)) {
            try {
                // Delete from Firestore
                const { deleteDoc, doc } = await import("firebase/firestore");
                await deleteDoc(doc(db, "users", userId));
                loadUsers(); // Refresh list
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

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        User Management
                    </h3>
                    <div className="flex gap-3">
                        <Button size="sm" variant="outline" onClick={() => setIsPermissionsOpen(true)}>
                            Roles & Permissions
                        </Button>
                        <Button size="sm" onClick={() => setIsModalOpen(true)}>+ Add User</Button>
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
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                                            {user.email || user.displayName || user.id}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <select
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500"
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            >
                                                <option value="editor">Editor</option>
                                                <option value="super_admin">Super Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right">
                                            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDeleteUser(user.id, user.email)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && <div className="p-4 text-center text-gray-500">No users found in Firestore. Ensures users have signed in at least once.</div>}
                    </div>
                )}

                {/* Add User Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New User</h3>
                    <div className="space-y-4">
                        <div>
                            <Label>User Email</Label>
                            <Input
                                type="email"
                                placeholder="user@example.com"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                            />
                        </div>
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
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={creating}>Cancel</Button>
                            <Button onClick={handleAddUser} disabled={!newUserEmail || !newUserPassword || creating}>
                                {creating ? "Creating..." : "Create User"}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Permissions Modal */}
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
