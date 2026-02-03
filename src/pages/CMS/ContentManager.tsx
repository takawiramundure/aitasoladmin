import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { FirestoreService, PageContent, SectionContent } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import RichTextEditor from "../../components/form/RichTextEditor";

import { Modal } from "../../components/ui/modal";
import Alert from "../../components/ui/alert/Alert";

export default function ContentManager() {
    const { pageId } = useParams();
    const { currentSite } = useSite();
    const [content, setContent] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSectionId, setNewSectionId] = useState("");

    // Map pageId to human readable title
    const pageTitles: Record<string, string> = {
        home: "Home Section",
        about: "About Section",
        understanding: "Understanding Suicide Section",
        coping: "Coping with Loss Section",
        programs: "Programs & Services Section",
        resources: "Resources Section",
        media: "Media Library",
        footer: "Footer Details"
    };

    const title = pageTitles[pageId || ""] || "Content Manager";

    useEffect(() => {
        if (pageId) {
            loadContent(pageId);
        }
    }, [pageId, currentSite]);

    const loadContent = async (id: string) => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getPageContent(id, currentSite.id);
            if (data) {
                setContent(data);
            } else {
                // Initialize with default structure if empty
                setContent({
                    title: pageTitles[id] || "",
                    sections: {}
                });
            }
        } catch (err: any) {
            console.error(err);
            setError("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!pageId || !content) return;
        setSaving(true);
        setSuccessMsg("");
        setError("");
        try {
            await FirestoreService.savePageContent(pageId, content, currentSite.id);
            setSuccessMsg("Content saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            console.error(err);
            setError("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    const handleSectionChange = (sectionId: string, field: keyof SectionContent, value: string) => {
        if (!content) return;
        setContent({
            ...content,
            sections: {
                ...(content.sections || {}),
                [sectionId]: {
                    ...(content.sections?.[sectionId] as SectionContent),
                    [field]: value
                }
            }
        });
    };

    const handleAddSection = () => {
        if (!content || !newSectionId.trim()) return;
        const id = newSectionId.trim().toLowerCase().replace(/\s+/g, "_");

        setContent({
            ...content,
            sections: {
                ...(content.sections || {}),
                [id]: {
                    heading: newSectionId, // Use the input as initial heading
                    content: ""
                }
            }
        });
        setNewSectionId("");
        setIsModalOpen(false);
    };

    const seedAboutUs = () => {
        setContent({
            title: "About Us",
            sections: {
                who_we_are: {
                    heading: "Who we are",
                    content: `
                        <div class="space-y-6 text-center">
                            <p>
                                Founded in 2003 in response to rising suicide rates in the Niagara Region,
                                the Niagara Suicide Prevention Coalition (NSPC) was established by a group of over
                                20 community agencies and concerned individuals.
                            </p>
                            <p>
                                The coalition’s purpose is to build strong, lasting partnerships across the community
                                to implement a coordinated suicide prevention strategy that addresses the needs of all
                                Niagara residents and reflects the values of a caring and compassionate community.
                            </p>
                            <p class="font-medium">
                                The NSPC is a non-funded, volunteer-driven coalition.
                            </p>
                        </div>
                    `
                },
                our_mandate: {
                    heading: "Our Mandate",
                    content: `
                        <div class="space-y-6 text-center">
                            <p>
                                Niagara Suicide Prevention Coalition exists to bring interested community organizations,
                                groups, individuals and volunteers together to make Niagara a suicide-safer community.
                            </p>
                            <p>
                                The work of the NSPC is carried out by working groups under the direction of the NSPC Reference committee.
                                Our focus is suicide prevention, intervention, and postvention.
                            </p>
                            <p>
                                Guided by our six key areas of strategic focus; public awareness, media education, access to services,
                                means safety, training, and evaluation/research, we continue to establish and build on our community partnerships,
                                with involvement to date totaling over 20 local agencies and members.
                            </p>
                        </div>
                    `
                },
                our_membership: {
                    heading: "Our Membership",
                    content: `
                        <div class="space-y-6 text-center">
                            <p>
                                Membership is open to community agencies, organizations, and individuals who live or work
                                in the Niagara Region and are committed to supporting the mandate of the Niagara Suicide Prevention Coalition.
                                Anyone with an interest in suicide prevention, intervention, and postvention is encouraged to get involved.
                            </p>
                            <p>
                                To become a member please reach out via our contact form.
                            </p>
                        </div>
                    `
                }
            }
        });
        setSuccessMsg("Seeded About Us data! Click Save to persist.");
    };

    const seedFooter = () => {
        setContent({
            title: "Footer Details",
            sections: {
                help_info: {
                    heading: "Help Text",
                    content: "Need help now?\nThere are crisis services available 24/7"
                },
                crisis_numbers: {
                    heading: "Crisis Numbers",
                    content: "9-8-8 Crisis Helpline: 988\nEmergency: 911"
                },
                copyright: {
                    heading: "Copyright Text",
                    content: "Niagara Suicide Prevention Coalition"
                },
                policy_links: {
                    heading: "Policy Links",
                    content: "Code of Conduct::/code-of-conduct\nWhistleblower Policy::/whistleblower"
                },
                donate_label: {
                    heading: "Donate Button Label",
                    content: "DONATE"
                },
                donate_url: {
                    heading: "Donate Button URL",
                    content: "https://example.com/donate"
                }
            }
        });
        setSuccessMsg("Seeded Footer data! Click Save to persist.");
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <PageMeta
                title={`CMS - ${title} | Admin Portal`}
                description={`Manage content for ${title}`}
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            {title}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Edit the content for this page.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {pageId === 'footer' && (
                            <Button variant="outline" onClick={seedFooter}>
                                Seed Footer Content
                            </Button>
                        )}
                        {pageId === 'about' && (
                            <Button variant="outline" onClick={seedAboutUs}>
                                Seed About Us Content
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                            + Add Section
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
                {successMsg && <div className="mb-4"><Alert variant="success" title="Success" message={successMsg} /></div>}

                {pageId === 'footer' && content && (
                    <div className="mb-10 space-y-6 p-6 border border-brand-200 rounded-2xl bg-brand-50/20 dark:border-gray-700 dark:bg-white/[0.01]">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90 mb-4">Footer Links & Actions</h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <Label>Policy Links (Format: Name::URL per line)</Label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-4 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                                    rows={4}
                                    value={(content.sections?.['policy_links']?.content || "").replace(/<[^>]*>/g, '')}
                                    onChange={(e) => handleSectionChange('policy_links', 'content', e.target.value)}
                                    placeholder="Code of Conduct::/code-of-conduct"
                                />
                            </div>
                            <div>
                                <Label>Donate Button Text</Label>
                                <Input
                                    type="text"
                                    value={(content.sections?.['donate_label']?.content || "").replace(/<[^>]*>/g, '')}
                                    onChange={(e) => handleSectionChange('donate_label', 'content', e.target.value)}
                                    placeholder="e.g. SUPPORT US"
                                />
                            </div>
                            <div>
                                <Label>Donate Button URL</Label>
                                <Input
                                    type="text"
                                    value={(content.sections?.['donate_url']?.content || "").replace(/<[^>]*>/g, '')}
                                    onChange={(e) => handleSectionChange('donate_url', 'content', e.target.value)}
                                    placeholder="https://donate-link.com"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {content && Object.entries(content.sections || {})
                        .filter(([key]) => pageId !== 'footer' || !['policy_links', 'donate_label', 'donate_url'].includes(key))
                        .map(([key, section]) => (
                            <div key={key} className="p-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-white/[0.02] dark:border-gray-700">
                                <div className="mb-3">
                                    <Label>Section ID: <span className="font-mono text-xs text-gray-400">{key}</span></Label>
                                </div>

                                <div className="grid gap-5">
                                    <div>
                                        <Label>Heading</Label>
                                        <Input
                                            type="text"
                                            value={section.heading || ""}
                                            onChange={(e) => handleSectionChange(key, "heading", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <RichTextEditor
                                            label="Body Content"
                                            value={section.content || ""}
                                            onChange={(newContent: string) => handleSectionChange(key, "content", newContent)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                    {content && Object.keys(content.sections || {}).length === 0 && (
                        <div className="py-12 text-center text-gray-500 italic">
                            No content sections found. Add one to get started.
                        </div>
                    )}
                </div>
            </div >

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md">
                <div className="p-6 bg-white rounded-xl dark:bg-gray-900">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Add New Section</h3>
                    <div className="mb-4">
                        <Label>New Section Title (ID will be generated automatically)</Label>
                        <Input
                            type="text"
                            placeholder="e.g. Hero Section"
                            value={newSectionId}
                            onChange={(e) => setNewSectionId(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddSection}>Create</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
