import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import { Modal } from "../../components/ui/modal";
import { FirestoreService } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import MediaLibrary from "../../components/common/MediaLibrary";
import RichTextEditor from "../../components/form/RichTextEditor";
import {
    PencilIcon,
    TrashBinIcon,
    PlusIcon,
    CalenderIcon,
    FolderIcon,
    UserIcon,
} from "../../icons";

interface Article {
    id: string;
    title: string;
    slug: string;
    author: string;
    date: any; // Timestamp or Date
    category: string;
    imageUrl: string;
    excerpt: string;
    content: string;
    published: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function BlogManager() {
    const { currentSite } = useSite();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState<Partial<Article>>({
        title: "",
        slug: "",
        author: "",
        category: "",
        imageUrl: "",
        excerpt: "",
        content: "",
        published: false,
        date: new Date(),
    });

    useEffect(() => {
        loadArticles();
    }, [currentSite.id]);

    const loadArticles = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getArticles(currentSite.id);
            // Sort by date descending
            const sorted = data.sort((a: any, b: any) => {
                const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date);
                const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date);
                return dateB.getTime() - dateA.getTime();
            });
            setArticles(sorted as Article[]);
        } catch (err) {
            console.error(err);
            setError("Failed to load articles.");
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleSave = async () => {
        if (!formData.title || !formData.author) {
            setError("Title and Author are required.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccessMsg("");

        try {
            // Auto-generate slug if empty
            const slug = formData.slug || generateSlug(formData.title);

            const articleData = {
                ...formData,
                slug,
                date: typeof formData.date === 'string' ? new Date(formData.date) : formData.date
            };

            await FirestoreService.saveArticle(currentSite.id, articleData, currentArticleId || undefined);

            setSuccessMsg(currentArticleId ? "Article updated successfully!" : "Article created successfully!");
            setIsModalOpen(false);
            loadArticles();

            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to save article.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;

        try {
            await FirestoreService.deleteArticle(currentSite.id, id);
            setArticles(articles.filter(a => a.id !== id));
            setSuccessMsg("Article deleted successfully.");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to delete article.");
        }
    };

    const openNewArticleModal = () => {
        setCurrentArticleId(null);
        setFormData({
            title: "",
            slug: "",
            author: "",
            category: "",
            imageUrl: "",
            excerpt: "",
            content: "",
            published: false,
            date: new Date(),
        });
        setIsModalOpen(true);
    };

    const openEditModal = (article: Article) => {
        setCurrentArticleId(article.id);
        const dateObj = article.date?.toDate ? article.date.toDate() : new Date(article.date);

        setFormData({
            ...article,
            date: dateObj
        });
        setIsModalOpen(true);
    };

    const handleImageSelect = (url: string) => {
        setFormData({ ...formData, imageUrl: url });
        setIsMediaLibraryOpen(false);
    };

    const formatDateForInput = (date: any) => {
        if (!date) return "";
        try {
            const d = date.toDate ? date.toDate() : new Date(date);
            const offset = d.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
            return localISOTime;
        } catch (e) {
            return "";
        }
    };

    return (
        <>
            <PageMeta title="Blog Manager | CMS" description="Manage blog articles" />

            <div className="p-6">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Blog Manager</h1>
                        <p className="text-gray-500 mt-1">Create and manage blog articles and news posts.</p>
                    </div>
                    <div>
                        <Button onClick={openNewArticleModal} startIcon={<PlusIcon className="w-5 h-5" />}>
                            New Article
                        </Button>
                    </div>
                </div>

                <div className="mb-6 p-4 border rounded-lg bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-1">Image Upload Guidelines:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><strong>Standard Images (Articles):</strong> Recommended 800x600 px (4:3) or 800x800 px (1:1).</li>
                        <li><strong>Format:</strong> JPG or WebP. Max size: 2MB.</li>
                    </ul>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No articles found. Click "New Article" to create one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 bg-gray-200 relative">
                                    {article.imageUrl ? (
                                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <CalenderIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {article.published ? (
                                            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                                Published
                                            </div>
                                        ) : (
                                            <div className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                                Draft
                                            </div>
                                        )}
                                    </div>
                                    {article.category && (
                                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-xs font-semibold">
                                            {article.category}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2">{article.title}</h3>

                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        {article.author}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <CalenderIcon className="w-4 h-4 mr-2" />
                                        {new Date(article.date?.seconds ? article.date.seconds * 1000 : article.date).toLocaleDateString()}
                                    </div>

                                    {article.excerpt && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{article.excerpt}</p>
                                    )}

                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <Button variant="outline" size="sm" onClick={() => openEditModal(article)} className="flex-1">
                                            <PencilIcon className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                            <TrashBinIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit/Create Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-4xl h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-3xl">
                    <h2 className="text-xl font-bold">{currentArticleId ? "Edit Article" : "Create New Article"}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="col-span-1 md:col-span-2">
                            <Label>Article Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Healing Circles: Creating Safe Spaces"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <Label>URL Slug (auto-generated if empty)</Label>
                            <Input
                                value={formData.slug || ""}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="e.g. healing-circles-creating-safe-spaces"
                            />
                        </div>

                        <div>
                            <Label>Author</Label>
                            <Input
                                value={formData.author || ""}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                placeholder="e.g. Jane Doe"
                            />
                        </div>

                        <div>
                            <Label>Publish Date</Label>
                            <Input
                                type="datetime-local"
                                value={formatDateForInput(formData.date)}
                                onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                            />
                        </div>

                        <div>
                            <Label>Category</Label>
                            <Input
                                value={formData.category || ""}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="e.g. Wellness, Empowerment"
                            />
                        </div>

                        <div>
                            <Label>Published Status</Label>
                            <div className="flex items-center gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.published === true}
                                        onChange={() => setFormData({ ...formData, published: true })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Published</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={formData.published === false}
                                        onChange={() => setFormData({ ...formData, published: false })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Draft</span>
                                </label>
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <Label>Featured Image</Label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.imageUrl || ""}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="https://..."
                                            className="flex-1"
                                        />
                                        <Button variant="outline" onClick={() => setIsMediaLibraryOpen(true)}>
                                            <FolderIcon className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                {formData.imageUrl && (
                                    <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <Label>Excerpt (Short Description)</Label>
                            <textarea
                                value={formData.excerpt || ""}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="Brief summary of the article..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <Label>Article Content</Label>
                            <RichTextEditor
                                label=""
                                value={formData.content || ""}
                                onChange={(val) => setFormData({ ...formData, content: val })}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-3xl flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : (currentArticleId ? "Update Article" : "Create Article")}
                    </Button>
                </div>
            </Modal>

            {/* Media Library Modal */}
            <MediaLibrary
                isOpen={isMediaLibraryOpen}
                onSelect={handleImageSelect}
                basePath={currentSite.id}
                onClose={() => setIsMediaLibraryOpen(false)}
            />
        </>
    );
}
