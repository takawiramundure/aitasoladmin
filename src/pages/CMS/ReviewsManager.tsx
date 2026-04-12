import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Alert from "../../components/ui/alert/Alert";
import { FirestoreService } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SEED_DATA } from "../../config/seedData";

interface ReviewItem {
    id: string;
    author: string;
    role: string;
    text: string;
    rating: number;
    date: string;
    isActive: boolean;
}

function SortableReviewItem({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
            {children}
        </div>
    );
}

export default function ReviewsManager() {
    const { currentSite } = useSite();
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    useEffect(() => {
        loadReviews();
    }, [currentSite]);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data: any = await FirestoreService.getPageContent("reviews", currentSite.id);
            if (data && data.reviews) {
                setReviews(data.reviews);
            } else {
                const siteSeed = SEED_DATA[currentSite.id as keyof typeof SEED_DATA];
                // @ts-ignore
                if (siteSeed?.reviews) {
                    // @ts-ignore
                    setReviews(siteSeed.reviews);
                } else {
                    setReviews([]);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load reviews.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            await FirestoreService.savePageContent("reviews", { reviews } as any, currentSite.id);
            setSuccessMsg("Reviews updated successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to save reviews.");
        } finally {
            setSaving(false);
        }
    };

    const addReview = () => {
        const newReview: ReviewItem = {
            id: Date.now().toString(),
            author: "New Client",
            role: "Homeowner",
            text: "Share the feedback here...",
            rating: 5,
            date: new Date().toLocaleDateString(),
            isActive: true
        };
        setReviews([...reviews, newReview]);
    };

    const updateReview = (id: string, field: keyof ReviewItem, value: any) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const removeReview = (id: string) => {
        if (confirm("Delete this review?")) {
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setReviews((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (loading) return <div className="p-6">Loading Reviews...</div>;

    return (
        <>
            <PageMeta title="Reviews Manager | Noel Construction" description="Manage Client Testimonials" />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Client Reviews & Testimonials</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage the feedback displayed on your website.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={addReview}>+ Add Review</Button>
                        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                    <SortableContext items={reviews.map(r => r.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <SortableReviewItem key={review.id} id={review.id}>
                                    <div className="p-5 border border-gray-200 rounded-xl bg-gray-50 dark:bg-white/[0.02] dark:border-gray-700 relative group">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => updateReview(review.id, 'isActive', !review.isActive)} className={`text-xs px-2 py-1 rounded border ${review.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`} onPointerDown={(e) => e.stopPropagation()}>
                                                {review.isActive ? 'Visible' : 'Hidden'}
                                            </button>
                                            <button onClick={() => removeReview(review.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700" onPointerDown={(e) => e.stopPropagation()}>Delete</button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                                            <div className="lg:col-span-1 space-y-4" onPointerDown={(e) => e.stopPropagation()}>
                                                <div>
                                                    <Label>Client Name</Label>
                                                    <Input type="text" value={review.author} onChange={(e) => updateReview(review.id, 'author', e.target.value)} />
                                                </div>
                                                <div>
                                                    <Label>Role / Description</Label>
                                                    <Input type="text" value={review.role} onChange={(e) => updateReview(review.id, 'role', e.target.value)} />
                                                </div>
                                                <div>
                                                    <Label>Rating (1-5)</Label>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <button 
                                                                key={star} 
                                                                onClick={() => updateReview(review.id, 'rating', star)}
                                                                className={`text-2xl ${review.rating >= star ? 'text-brand-500' : 'text-gray-300'}`}
                                                            >
                                                                ★
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-3 space-y-4" onPointerDown={(e) => e.stopPropagation()}>
                                                <Label>Review Content</Label>
                                                <textarea className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-sm h-32 leading-relaxed" value={review.text} onChange={(e) => updateReview(review.id, 'text', e.target.value)} />
                                                <div className="flex justify-end">
                                                    <span className="text-xs text-gray-400 italic">Review Date: {review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SortableReviewItem>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </>
    );
}
