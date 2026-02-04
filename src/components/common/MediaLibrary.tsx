import { useState, useEffect } from "react";
import { storage } from "../../firebaseConfig";
import { ref, listAll, uploadBytes, getDownloadURL, deleteObject, StorageReference } from "firebase/storage";
import Alert from "../ui/alert/Alert";
import { FolderIcon, TrashBinIcon, ArrowUpIcon, PlusIcon, VideoIcon, CopyIcon, PageIcon, HomeIcon } from "../../icons";
import { useSite } from "../../context/SiteContext";
import { Modal } from "../ui/modal";

interface MediaLibraryProps {
    isOpen: boolean;
    onSelect?: (url: string) => void;
    basePath?: string;
    onClose: () => void;
}

interface FileItem {
    type: 'file' | 'folder';
    name: string;
    ref: StorageReference;
    url?: string;
}

interface MediaLibraryContentProps {
    onSelect?: (url: string) => void;
    basePath?: string;
    onUploadFinish?: () => void;
}

export function MediaLibraryContent({ onSelect, basePath = "", onUploadFinish }: MediaLibraryContentProps) {
    const { currentSite } = useSite();
    const siteRoot = currentSite.id;
    const [currentPath, setCurrentPath] = useState(basePath || siteRoot);
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
            const listRef = ref(storage, path);
            const res = await listAll(listRef);

            const folders: FileItem[] = res.prefixes.map((folderRef) => ({
                type: 'folder',
                name: folderRef.name,
                ref: folderRef
            }));

            const filesPromise = res.items
                .filter(item => item.name !== '.keep') // Filter out hidden keep files
                .map(async (itemRef) => {
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
            const storageRef = ref(storage, `${currentPath}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            setSuccessMsg("File uploaded successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
            loadMedia(currentPath);
            if (onUploadFinish) onUploadFinish();
        } catch (err) {
            console.error(err);
            setError("Failed to upload file.");
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

    const handleCopyLink = (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        setSuccessMsg("Link copied to clipboard!");
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const navigateToFolder = (folderName: string) => {
        const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        setCurrentPath(newPath);
    };

    const navigateUp = () => {
        if (isRoot) return;
        const parts = currentPath.split('/');
        parts.pop();
        setCurrentPath(parts.join('/'));
    };

    const isRoot = currentPath === siteRoot;
    const isVideo = (name: string) => /\.(mp4|webm|ogg|mov)$/i.test(name);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg">
            {/* Header with Controls */}
            <div className="flex flex-col gap-4 p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="flex items-center justify-between">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        <button
                            onClick={() => setCurrentPath(siteRoot)}
                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 dark:text-gray-300 transition-colors"
                            title="Go to Root"
                        >
                            <HomeIcon className="w-4 h-4" />
                        </button>

                        {currentPath !== siteRoot && (
                            <>
                                <span className="text-gray-400">/</span>
                                {(() => {
                                    const parts = currentPath.substring(siteRoot.length + 1).split('/');
                                    let accumulatedPath = siteRoot;
                                    return parts.map((part, index) => {
                                        accumulatedPath += `/${part}`;
                                        const isLast = index === parts.length - 1;
                                        const thisPath = accumulatedPath; // capture for closure

                                        return (
                                            <div key={index} className="flex items-center gap-1">
                                                <button
                                                    onClick={() => !isLast && setCurrentPath(thisPath)}
                                                    className={`px-2 py-1 rounded text-sm font-medium transition-colors ${isLast
                                                        ? "text-gray-900 dark:text-white cursor-default"
                                                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
                                                        }`}
                                                >
                                                    {part}
                                                </button>
                                                {!isLast && <span className="text-gray-400">/</span>}
                                            </div>
                                        );
                                    });
                                })()}
                            </>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                const folderName = prompt("Enter folder name:");
                                if (folderName) {
                                    const cleanName = folderName.replace(/[^a-zA-Z0-9-_]/g, '');
                                    if (!cleanName) return alert("Invalid folder name.");

                                    // Create a dummy file to 'create' the folder
                                    setUploading(true);
                                    try {
                                        const dummyRef = ref(storage, `${currentPath}/${cleanName}/.keep`);
                                        const blob = new Blob([""], { type: "text/plain" });
                                        await uploadBytes(dummyRef, blob);
                                        setSuccessMsg("Folder created!");
                                        setTimeout(() => setSuccessMsg(""), 3000);
                                        loadMedia(currentPath);
                                    } catch (e) {
                                        console.error(e);
                                        setError("Failed to create folder");
                                    } finally {
                                        setUploading(false);
                                    }
                                }
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <FolderIcon className="w-4 h-4 mr-2 text-yellow-500" />
                            New Folder
                        </button>

                        <label className={`cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${uploading ? 'opacity-50' : ''}`}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            {uploading ? "Uploading..." : "Upload File"}
                            <input type="file" accept="image/*,video/*,.pdf,.json,.csv,.zip" className="hidden" onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="relative">
                {error && <div className="bg-red-100 text-red-700 px-4 py-2 text-sm">{error}</div>}
                {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 text-sm">{successMsg}</div>}
            </div>

            {/* File Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-40">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Folder is empty</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                                            className="h-32 bg-gray-200 dark:bg-gray-700 cursor-pointer flex items-center justify-center overflow-hidden"
                                            onClick={() => onSelect ? onSelect(item.url!) : window.open(item.url, '_blank')}
                                        >
                                            {isVideo(item.name) ? (
                                                <VideoIcon className="w-12 h-12 text-gray-500" />
                                            ) : /\.(pdf|json|csv|zip)$/i.test(item.name) ? (
                                                <PageIcon className="w-12 h-12 text-gray-400" />
                                            ) : (
                                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="p-2 bg-white dark:bg-gray-900">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate w-full" title={item.name}>{item.name}</p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => handleCopyLink(e, item.url!)}
                                                className="p-1 bg-white dark:bg-gray-800 shadow text-gray-600 dark:text-gray-300 rounded hover:text-blue-500"
                                                title="Copy Link"
                                            >
                                                <CopyIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                                                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                title="Delete"
                                            >
                                                <TrashBinIcon className="w-4 h-4" />
                                            </button>
                                        </div>

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

export default function MediaLibrary({ isOpen, onSelect, basePath = "", onClose }: MediaLibraryProps) {
    const { currentSite } = useSite();

    // Only load/render if open to save resources
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Media Library - ${currentSite.name}`}
            size="2xl"
        >
            <div className="h-[70vh]">
                <MediaLibraryContent
                    onSelect={onSelect}
                    basePath={basePath}
                />
            </div>
        </Modal>
    );
}
