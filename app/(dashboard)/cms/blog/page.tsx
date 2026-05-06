"use client";

import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Alert from "@/components/ui/alert/Alert";
import { Modal } from "@/components/ui/modal";
import { FirestoreService, PageContent } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import MediaLibrary from "@/components/common/MediaLibrary";
import RichTextEditor from "@/components/form/RichTextEditor";
import { Search } from 'lucide-react';
import SEOEditor from "@/components/form/SEOEditor";
import { SEED_DATA } from "@/config/seedData";
import {
    UserIcon,
    CalenderIcon,
    PencilIcon,
    TrashBinIcon,
    FolderIcon,
    PlusIcon,
} from "@/icons";

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
    seo?: {
        title?: string;
        description?: string;
        image?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

interface BlogPageContent extends PageContent {
    seo?: {
        title?: string;
        description?: string;
        image?: string;
    };
    sections?: {
        hero?: {
            heading: string;
            content: string;
            enabled?: boolean;
            order?: number;
        };
    };
}

export default function BlogManager() {
    const { currentSite } = useSite();
    const [articles, setArticles] = useState<Article[]>([]);
    const [pageContent, setPageContent] = useState<BlogPageContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageSaving, setPageSaving] = useState(false);
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
        seo: {
            title: "",
            description: "",
            image: ""
        }
    });

    useEffect(() => {
        loadArticles();
        loadPageContent();
    }, [currentSite.id]);

    const loadPageContent = async () => {
        try {
            const data: any = await FirestoreService.getPageContent("blog", currentSite.id);
            if (data) {
                setPageContent(data);
            } else {
                const siteSeed = SEED_DATA[currentSite.id as keyof typeof SEED_DATA];
                setPageContent({
                    seo: siteSeed?.blog?.seo || {},
                    sections: siteSeed?.blog?.sections || {
                        hero: { heading: "Blog", content: "Latest updates and insights." }
                    }
                } as any);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadArticles = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getArticles(currentSite.id);
            // Sort by date descending
            const sorted = data.sort((a: any, b: any) => {
                const getTime = (d: any) => {
                    if (!d) return 0;
                    if (d.seconds) return d.seconds * 1000;
                    if (d instanceof Date) return d.getTime();
                    const parsed = new Date(d);
                    return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
                };
                return getTime(b.date) - getTime(a.date);
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

    const handlePageSave = async () => {
        setPageSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.savePageContent("blog", pageContent!, currentSite.id);
            setSuccessMsg("Blog page settings saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to save blog page settings.");
        } finally {
            setPageSaving(false);
        }
    };

    const handlePageSEOChange = (field: string, value: string) => {
        setPageContent((prev: any) => ({
            ...prev,
            seo: { ...prev?.seo, [field]: value }
        }));
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

    const formatDateForInput = (date: any) => {
        if (!date) return "";
        const d = date.toDate ? date.toDate() : new Date(date);
        if (isNaN(d.getTime())) return "";
        
        const pad = (num: number) => num.toString().padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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

    const handleArticleSEOChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            seo: { ...prev.seo, [field]: value }
        }));
    };

    const handleSeedArticles = async () => {
        const isAitasol = currentSite.id === 'aitasol';
        const siteName = isAitasol ? "Aitasol" : "DMLabs";
        if (!confirm(`Seed default ${siteName} blog articles into Firestore for "${currentSite.name}"? Existing articles will not be deleted.`)) return;
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            const aitasolArticles = [
                { 
                    id: 'study-in-canada-2024', 
                    title: 'Ultimate Guide to Studying in Canada for 2024', 
                    slug: 'ultimate-guide-to-studying-in-canada-2024', 
                    author: 'Aitasol Admissions', 
                    category: 'Canada', 
                    date: new Date('2024-04-10'), 
                    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&fit=crop', 
                    excerpt: 'Everything you need to know about the latest visa changes, university rankings, and post-study work permits in Canada.', 
                    content: '<h2>Why Canada?</h2><p>Canada remains a top choice for international students due to its high-quality education and welcoming policies. In 2024, the government has introduced several updates that every student should know...</p><h3>New Visa Regulations</h3><p>The IRCC has implemented a new attestation letter system to ensure sustainable growth in the international student sector. While this adds a step, it also ensures that students who receive visas are coming to reputable institutions with guaranteed support.</p>', 
                    published: true 
                },
                { 
                    id: 'scholarship-success-tips', 
                    title: 'Top 5 Tips for a Successful Scholarship Application', 
                    slug: 'top-5-tips-for-a-successful-scholarship-application', 
                    author: 'Aitasol Counselors', 
                    category: 'Scholarships', 
                    date: new Date('2024-03-25'), 
                    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&fit=crop', 
                    excerpt: 'Securing financial aid is a competitive process. Learn how to craft a compelling essay and build a profile that stands out to scholarship committees.', 
                    content: '<h2>Winning the Scholarship Game</h2><p>Financial barriers shouldn\'t stop you from global education. Many universities offer fully-funded or partial scholarships based on merit and need. Here is how you can maximize your chances...</p>', 
                    published: true 
                }
            ];

            const dmlabsArticles = [
                { 
                    id: 'future-of-ai', 
                    title: 'The Future of AI: Opportunities and Challenges', 
                    slug: 'the-future-of-ai-opportunities-and-challenges', 
                    author: 'Digital Maples Labs', 
                    category: 'Inspiration', 
                    date: new Date('2024-04-01'), 
                    imageUrl: 'https://images.unsplash.com/photo-1677442135703-3ee67f47e3e5?q=80&w=2940&auto=format&fit=crop', 
                    excerpt: 'Exploring the transformative potential of artificial intelligence and the ethical considerations that come with it.', 
                    content: '<h2>The AI Revolution</h2><p>Artificial intelligence is no longer a futuristic concept; it is reshaping every industry at an unprecedented pace. From healthcare diagnostics to personalized education, the opportunities for innovation are vast. However, with great power comes the substantial responsibility of ethical deployment.</p><h3>Defining Human-Centric AI</h3><p>At Digital Maples Labs, we believe that technology should serve humanity. Human-centric AI focuses on systems that amplify human capabilities rather than replace them. This involves designing interfaces that are intuitive and ensuring that the underlying algorithms prioritized transparency and fairness.</p><h3>The Ethical Imperative</h3><p>The key is not to fear AI, but to understand it deeply enough to deploy it responsibly. This means auditing for algorithmic bias, ensuring data privacy, and maintaining clear accountability for AI-driven decisions. As we move forward, the most successful organizations will be those that align their technological advancement with core human values.</p><p>Ultimately, the future of AI depends on our collective ability to foster trust through transparency and to use these tools to solve the world\'s most pressing challenges.</p>', 
                    published: true 
                },
                { 
                    id: 'resilient-business', 
                    title: 'Strategies for Building a Resilient Business', 
                    slug: 'strategies-for-building-a-resilient-business', 
                    author: 'Digital Maples Labs', 
                    category: 'Creative', 
                    date: new Date('2024-03-15'), 
                    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop', 
                    excerpt: 'How to navigate uncertainty and build a business that can withstand and thrive in changing times.', 
                    content: '<h2>Building for Tomorrow</h2><p>Business resilience is more than just surviving hard times—it\'s about architecting your organization to adapt, pivot, and thrive regardless of external shocks. In an era of constant change, the ability to respond to disruption is a critical competitive advantage.</p><h3>Digital Agility as a Foundation</h3><p>The most resilient companies we\'ve worked with share one common trait: they invested in digital infrastructure before they actually needed it. Digital agility allows for rapid shifts in operational models, enabling businesses to reach customers through new channels almost overnight. This involves cloud-based collaboration tools, robust data analytics, and scalable e-commerce platforms.</p><h3>The Human Element</h3><p>Resilience is not just about technology; it\'s about culture. A resilient business fosters an environment where employees feel empowered to innovate and take calculated risks. Strategic communication and transparent leadership are essential for maintaining morale during uncertain periods.</p><p>By combining technological maturity with a flexible, supportive internal culture, businesses can transform challenges into opportunities for growth and long-term sustainability.</p>', 
                    published: true 
                },
                { 
                    id: 'effective-communication', 
                    title: 'The Art of Effective Communication in the Workplace', 
                    slug: 'the-art-of-effective-communication-in-the-workplace', 
                    author: 'Digital Maples Labs', 
                    category: 'Innovation', 
                    date: new Date('2024-02-28'), 
                    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop', 
                    excerpt: 'Mastering the interpersonal skills necessary for clear, impactful, and collaborative professional environments.', 
                    content: '<h2>Communication as a Core Competency</h2><p>In the digital age, how we communicate defines how we succeed. Clear, empathetic, and intentional communication is no longer a soft skill—it\'s a strategic capability that separates high-performing teams from the rest. As workplaces become increasingly distributed, the quality of our interactions becomes even more paramount.</p><h3>Active Listening and Empathy</h3><p>True communication is a two-way street. It begins with active listening—the practice of fully concentrating, understanding, and responding to what is being said. Empathy allows leaders and team members to navigate conflicting perspectives and build a foundation of mutual respect and trust.</p><h3>Digital Literacy in Communication</h3><p>Mastering the art of workplace communication also means understanding the nuances of different digital platforms. Knowing when to send a quick message versus scheduling a video call can significantly impact team efficiency and relationship building. Clarity in written communication is particularly crucial in preventing misunderstandings.</p><p>By prioritizing intentionality and empathy in every interaction, organizations can foster a collaborative culture that drives innovation and employee satisfaction.</p>', 
                    published: true 
                },
                { 
                    id: 'digital-transformation', 
                    title: 'Digital Transformation: Navigating the New Normal', 
                    slug: 'digital-transformation-navigating-the-new-normal', 
                    author: 'Digital Maples Labs', 
                    category: 'Innovation', 
                    date: new Date('2024-02-01'), 
                    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop', 
                    excerpt: 'Adapting to the digital age requires more than just new tech—it requires a fundamental shift in strategy.', 
                    content: '<h2>Beyond the Tech Stack</h2><p>Digital transformation is often misunderstood as a simple technology project. In reality, it\'s a fundamental cultural shift that technology merely enables. Organizations that succeed don\'t just adopt new software—they rethink how they create value for the people they serve in a digital-first world.</p><h3>Strategic Alignment</h3><p>The journey begins with strategic alignment. Every technological investment should directly support the organization\'s core mission and goals. This requires a deep understanding of customer journeys and operational bottlenecks that can be solved through innovation. It\'s about being "digital-ready" at every level of the organization.</p><h3>Overcoming Resistance to Change</h3><p>Transformation is often met with resistance. Successful leaders prioritize change management, ensuring that every team member understands the "why" behind the shift and receives the necessary training to thrive in the new environment. Continuous learning and adaptation are the hallmarks of a digitally mature organization.</p><p>Ultimately, digital transformation is a continuous process of evolution that allows organizations to remain relevant and impactful in an ever-changing landscape.</p>', 
                    published: true 
                },
                { 
                    id: 'remote-teams', 
                    title: 'Unlocking the Secrets of Successful Remote Teams', 
                    slug: 'unlocking-the-secrets-of-successful-remote-teams', 
                    author: 'Digital Maples Labs', 
                    category: 'Inspiration', 
                    date: new Date('2024-01-15'), 
                    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop', 
                    excerpt: 'Key principles for managing distributed teams effectively in a globalized workforce.', 
                    content: '<h2>The Remote-First Mindset</h2><p>Remote work is not a compromise—it\'s a massive competitive advantage when executed correctly. The teams we\'ve seen succeed in distributed environments share common practices: asynchronous-first communication, radical documentation, and deep trust in process over presence.</p><h3>Trust and Accountability</h3><p>In a remote setting, visibility into "hours worked" is replaced by visibility into "outcomes achieved." This transition requires a high level of trust and clear accountability frameworks. Managers must shift from monitoring tasks to supporting the growth and productivity of their team members.</p><h3>Building Culture Across Distances</h3><p>Creating a sense of belonging in a remote team requires intentionality. Regular virtual huddles, informal digital social spaces, and clear shared values help maintain a cohesive culture. Using the right collaboration tools—from project management platforms to instant messaging—is essential for keeping everyone aligned and engaged.</p><p>When done right, remote work allows organizations to tap into global talent and offers employees the flexibility to build lives and careers that truly integrate.</p>', 
                    published: true 
                },
                { 
                    id: 'emotional-intelligence', 
                    title: 'The Power of Emotional Intelligence in Leadership', 
                    slug: 'the-power-of-emotional-intelligence-in-leadership', 
                    author: 'Digital Maples Labs', 
                    category: 'Creative', 
                    date: new Date('2024-01-02'), 
                    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop', 
                    excerpt: 'Why EQ is becoming the most critical asset for leaders in today\'s high-pressure environments.', 
                    content: '<h2>Leading with Empathy</h2><p>Technical skills might get you hired, but emotional intelligence (EQ) is what gets you promoted—and keeps your team truly engaged. In an era of increasing automation, the uniquely human capacity to understand, motivate, and connect with others is becoming the ultimate leadership differentiator.</p><h3>The Components of EQ</h3><p>Emotional intelligence consists of self-awareness, self-regulation, motivation, empathy, and social skills. A leader who can recognize their own emotional triggers and understand those of their team members is far better equipped to navigate high-pressure situations and resolve conflicts effectively.</p><h3>Fostering Psychological Safety</h3><p>Leaders with high EQ prioritize psychological safety—the belief that one will not be punished for making a mistake or speaking up. This environment encourages innovation, as team members feel safe to share diverse ideas and challenge the status quo. It leads to higher levels of collaboration and a more resilient, committed workforce.</p><p>By investing in the emotional growth of their leaders, organizations can create a culture of empathy and excellence that drives long-term success.</p>', 
                    published: true 
                },
            ];

            const articlesToSeed = isAitasol ? aitasolArticles : dmlabsArticles;

            for (const article of articlesToSeed) {
                await FirestoreService.saveArticle(currentSite.id, article, article.id);
            }
            setSuccessMsg(`✅ Seeded ${articlesToSeed.length} articles successfully! Refreshing...`);
            await loadArticles();
        } catch (err) {
            console.error(err);
            setError('Failed to seed articles: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <PageMeta title="Blog Manager | CMS" description="Manage blog articles" />

            <div className="p-6">
                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                     {/* SEO Settings */}
                    <div className="p-6 border border-indigo-500/20 bg-indigo-500/5 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Search size={20} className="text-indigo-500" />
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Blog Search SEO</h3>
                            </div>
                            <Button size="sm" onClick={handlePageSave} loading={pageSaving}>Save SEO</Button>
                        </div>
                        <SEOEditor 
                            data={pageContent?.seo || {}} 
                            onChange={handlePageSEOChange}
                        />
                    </div>

                    {/* Blog Hero Settings */}
                    <div className="p-6 border border-gray-200 bg-white dark:bg-gray-800/50 dark:border-gray-700 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Blog Hero Section</h3>
                            <Button size="sm" onClick={handlePageSave} loading={pageSaving}>Save Hero</Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label>Hero Heading (Supports HTML)</Label>
                                <Input 
                                    value={pageContent?.sections?.hero?.heading || ""} 
                                    onChange={(e) => setPageContent({
                                        ...pageContent!,
                                        sections: {
                                            ...pageContent?.sections,
                                            hero: { ...pageContent?.sections?.hero!, heading: e.target.value }
                                        }
                                    })}
                                />
                            </div>
                            <div>
                                <Label>Hero Content</Label>
                                <textarea 
                                    className="w-full bg-[#1e1e2d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm min-h-[100px]"
                                    value={pageContent?.sections?.hero?.content || ""}
                                    onChange={(e) => setPageContent({
                                        ...pageContent!,
                                        sections: {
                                            ...pageContent?.sections,
                                            hero: { ...pageContent?.sections?.hero!, content: e.target.value }
                                        }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between pt-8 border-t border-gray-100 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Articles</h2>
                        <p className="text-gray-500 mt-1">Manage individual blog posts below.</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Button variant="outline" onClick={handleSeedArticles} disabled={saving} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                            🌱 Seed Default Articles
                        </Button>
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
                        <p className="text-gray-500 mb-4">No articles found. Click "New Article" to create one, or seed the default articles.</p>
                        <Button variant="outline" onClick={handleSeedArticles} disabled={saving} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                            🌱 Seed Default Articles
                        </Button>
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
                                        {article.date ? (
                                            article.date.seconds 
                                                ? new Date(article.date.seconds * 1000).toLocaleDateString() 
                                                : new Date(article.date).toLocaleDateString()
                                        ) : 'No Date'}
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
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="7xl" className="h-[95vh] flex flex-col">
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

                        {/* Article SEO Section */}
                        <div className="col-span-1 md:col-span-2 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Search size={20} className="text-indigo-500" />
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Article SEO Metadata</h3>
                            </div>
                            <SEOEditor 
                                data={formData.seo || {}} 
                                onChange={handleArticleSEOChange}
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
