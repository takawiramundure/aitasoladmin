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
    multiSelect?: boolean;
    onSelectMultiple?: (urls: string[]) => void;
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
    multiSelect?: boolean;
    onSelectMultiple?: (urls: string[]) => void;
}

export function MediaLibraryContent({ onSelect, basePath = "", onUploadFinish, multiSelect, onSelectMultiple }: MediaLibraryContentProps) {
    const { currentSite } = useSite();
    const siteRoot = currentSite.id;
    const [currentPath, setCurrentPath] = useState(basePath || siteRoot);
    const [items, setItems] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

    useEffect(() => {
        loadMedia(currentPath);
        if (isRoot) {
            ensureVideosFolder();
        }
    }, [currentPath]);

    const ensureVideosFolder = async () => {
        try {
            const videosRef = ref(storage, `${siteRoot}/videos`);
            const res = await listAll(videosRef);
            if (res.items.length === 0 && res.prefixes.length === 0) {
                // Create .keep file to 'create' the folder
                const keepRef = ref(storage, `${siteRoot}/videos/.keep`);
                await uploadBytes(keepRef, new Blob([""], { type: "text/plain" }));
                loadMedia(currentPath);
            }
        } catch (e) {
            console.error("Error ensuring videos folder:", e);
        }
    };

    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            video.onerror = () => resolve(0);
            video.src = URL.createObjectURL(file);
        });
    };

    const getTotalVideosDuration = async (): Promise<number> => {
        try {
            const videosRef = ref(storage, `${siteRoot}/videos`);
            const res = await listAll(videosRef);
            const durations = await Promise.all(res.items.map(async (item) => {
                if (item.name === '.keep') return 0;
                const url = await getDownloadURL(item);
                return new Promise<number>((resolve) => {
                    const video = document.createElement('video');
                    video.preload = 'metadata';
                    video.onloadedmetadata = () => resolve(video.duration);
                    video.onerror = () => resolve(0);
                    video.src = url;
                });
            }));
            return durations.reduce((acc, curr) => acc + curr, 0);
        } catch (e) {
            console.error("Error calculating total duration:", e);
            return 0;
        }
    };

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
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        if (files.length > 5) {
            setError("You can only upload a maximum of 5 files at a time.");
            event.target.value = "";
            return;
        }

        setUploading(true);
        setError("");
        try {
            await Promise.all(files.map(async (file) => {
                if (isVideo(file.name)) {
                    const duration = await getVideoDuration(file);
                    if (duration > 120) {
                        throw new Error(`Video ${file.name} exceeds max duration of 2 mins.`);
                    }
                    const totalDuration = await getTotalVideosDuration();
                    if (totalDuration + duration > 1800) {
                        throw new Error("Total videos duration would exceed 30 minutes limit.");
                    }
                }

                // Clean file name
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const storageRef = ref(storage, `${currentPath}/${Date.now()}_${cleanName}`);
                await uploadBytes(storageRef, file);
            }));

            setSuccessMsg(`Successfully uploaded ${files.length} file(s)!`);
            setTimeout(() => setSuccessMsg(""), 3000);
            loadMedia(currentPath);
            if (onUploadFinish) onUploadFinish();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to upload file(s).");
        } finally {
            setUploading(false);
            event.target.value = "";
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
                                    // Use a more robust way to get the relative path
                                    let relativePath = currentPath;
                                    if (currentPath.startsWith(siteRoot)) {
                                        relativePath = currentPath.substring(siteRoot.length).replace(/^\//, '');
                                    }
                                    
                                    if (!relativePath) return null;

                                    const parts = relativePath.split('/').filter(Boolean);
                                    let accumulatedPath = siteRoot;
                                    return parts.map((part, index) => {
                                        accumulatedPath += `/${part}`;
                                        const isLast = index === parts.length - 1;
                                        const thisPath = accumulatedPath;

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
                            {uploading ? "Uploading..." : "Upload Files (Max 5)"}
                            <input type="file" multiple accept="image/*,.webp,video/*,.pdf,.json,.csv,.zip" className="hidden" onChange={handleUpload} disabled={uploading} />
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
                {currentPath.endsWith('/videos') && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 text-blue-800 text-sm">
                        <VideoIcon className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <span className="font-bold">Video Folder Limits:</span> Max 2 mins per video. Max 30 mins total library duration.
                        </div>
                    </div>
                )}
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
                                            className={`h-32 bg-gray-200 dark:bg-gray-700 cursor-pointer flex items-center justify-center overflow-hidden transition-all ${multiSelect && selectedUrls.includes(item.url!) ? 'ring-4 ring-blue-500 scale-95 rounded' : ''}`}
                                            onClick={() => {
                                                if (multiSelect) {
                                                    if (!item.url) return;
                                                    if (selectedUrls.includes(item.url)) {
                                                        setSelectedUrls(selectedUrls.filter(u => u !== item.url));
                                                    } else {
                                                        if (selectedUrls.length >= 5) {
                                                            setError("You can only select up to 5 images at a time.");
                                                            setTimeout(() => setError(""), 3000);
                                                            return;
                                                        }
                                                        setSelectedUrls([...selectedUrls, item.url]);
                                                    }
                                                } else if (onSelect) {
                                                    onSelect(item.url!);
                                                } else {
                                                    window.open(item.url, '_blank');
                                                }
                                            }}
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

                                        {onSelect && !multiSelect && (
                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors pointer-events-none" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {multiSelect && selectedUrls.length > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                    <button 
                        onClick={() => {
                            if (onSelectMultiple) {
                                onSelectMultiple(selectedUrls);
                                setSelectedUrls([]);
                            }
                        }}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-2xl flex items-center gap-2 transform transition-transform hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Insert {selectedUrls.length} Image{selectedUrls.length > 1 ? 's' : ''}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function MediaLibrary({ isOpen, onSelect, basePath = "", onClose, multiSelect, onSelectMultiple }: MediaLibraryProps) {
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
            <div className="h-[70vh] relative">
                <MediaLibraryContent
                    onSelect={onSelect}
                    basePath={basePath}
                    multiSelect={multiSelect}
                    onSelectMultiple={(urls) => {
                        if (onSelectMultiple) onSelectMultiple(urls);
                        onClose();
                    }}
                />
            </div>
        </Modal>
    );
}
