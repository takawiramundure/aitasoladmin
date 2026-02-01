import { useState, useEffect } from "react";
import { storage } from "../../firebaseConfig";
import { ref, listAll, uploadBytes, getDownloadURL, deleteObject, StorageReference } from "firebase/storage";
import Alert from "../ui/alert/Alert";
import { FolderIcon, TrashBinIcon, ArrowUpIcon, PlusIcon } from "../../icons";

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    basePath?: string;
    onClose?: () => void;
}

interface FileItem {
    type: 'file' | 'folder';
    name: string;
    ref: StorageReference;
    url?: string;
}

export default function MediaLibrary({ onSelect, basePath = "/", onClose }: MediaLibraryProps) {
    const [currentPath, setCurrentPath] = useState(basePath === "/" ? "" : basePath);
    const [items, setItems] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        loadMedia(currentPath);
    }, [currentPath]);

    const loadMedia = async (path: string) => {
        setLoading(true);
        setError("");
        try {
            // Ensure path doesn't start with / if it's not root, but firebase refs are relative to bucket root
            // If path is empty, it's root.
            const listRef = ref(storage, path);
            const res = await listAll(listRef);

            const folders: FileItem[] = res.prefixes.map((folderRef) => ({
                type: 'folder',
                name: folderRef.name,
                ref: folderRef
            }));

            const filesPromise = res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    type: 'file',
                    name: itemRef.name,
                    ref: itemRef,
                    url
                } as FileItem;
            });

            const files = await Promise.all(filesPromise);
            setItems([...folders, ...files]);
        } catch (err) {
            console.error(err);
            setError("Failed to load media.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            // Upload to current path
            const storageRef = ref(storage, `${currentPath}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            setSuccessMsg("Image uploaded successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
            loadMedia(currentPath);
        } catch (err) {
            console.error(err);
            setError("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileItem: FileItem) => {
        if (!confirm(`Are you sure you want to delete ${fileItem.name}?`)) return;

        try {
            await deleteObject(fileItem.ref);
            setItems(items.filter(i => i.name !== fileItem.name));
            setSuccessMsg("Deleted successfully.");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to delete item.");
        }
    };

    const navigateToFolder = (folderName: string) => {
        // If currentPath is empty, it becomes folderName. Else currentPath/folderName
        const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        setCurrentPath(newPath);
    };

    const navigateUp = () => {
        if (!currentPath) return; // Already at root
        const parts = currentPath.split('/');
        parts.pop();
        setCurrentPath(parts.join('/'));
    };

    const isRoot = !currentPath;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg">
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 ${onClose ? 'pr-24' : ''}`}>
                <div className="flex items-center gap-2">
                    {!isRoot && (
                        <button onClick={navigateUp} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800">
                            <ArrowUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                        {isRoot ? "Media Library" : currentPath.split('/').pop()}
                    </h3>
                </div>
                <div className="flex gap-2">
                    <label className={`cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${uploading ? 'opacity-50' : ''}`}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        {uploading ? "Uploading..." : "Upload"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            </div>

            {/* Messages */}
            <div className="px-4 mt-4">
                {error && <Alert variant="error" title="" message={error} />}
                {successMsg && <Alert variant="success" title="" message={successMsg} />}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-40">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Folder is empty</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {items.map((item) => (
                            <div key={item.name} className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800">
                                {item.type === 'folder' ? (
                                    <div
                                        onClick={() => navigateToFolder(item.name)}
                                        className="cursor-pointer flex flex-col items-center justify-center h-32 p-4"
                                    >
                                        <FolderIcon className="w-12 h-12 text-blue-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate w-full text-center">{item.name}</span>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div
                                            className="h-32 bg-gray-200 dark:bg-gray-700 cursor-pointer"
                                            onClick={() => onSelect ? onSelect(item.url!) : window.open(item.url, '_blank')}
                                        >
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="p-2 bg-white dark:bg-gray-900">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.name}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                                            className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete"
                                        >
                                            <TrashBinIcon className="w-4 h-4" />
                                        </button>
                                        {onSelect && (
                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
