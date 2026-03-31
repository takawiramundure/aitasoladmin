import PageMeta from "../../components/common/PageMeta";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { FirestoreService, PageContent, SectionContent } from "../../services/firestore";
import { useSite } from "../../context/SiteContext";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import RichTextEditor from "../../components/form/RichTextEditor";
import ImagePicker from "../../components/form/ImagePicker";

import { Modal } from "../../components/ui/modal";
import Alert from "../../components/ui/alert/Alert";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import MediaLibrary from "../../components/common/MediaLibrary";

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
    const [multiSelectOpenForSection, setMultiSelectOpenForSection] = useState<string | null>(null);
    const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

    // Map pageId to human readable title
    const pageTitles: Record<string, string> = {
        home: "Home Section",
        about: "About Section",
        understanding: "Understanding Suicide Section",
        coping: "Coping with Loss Section",
        programs: "Programs & Services Section",
        resources: "Resources Section",
        media: "Media Library",
        footer: "Footer Details",
        // KMFW Pages
        "our-story": "Our Story",
        "meet-our-team": "Meet Our Team",
        "strategic-plan": "Strategic Plan",
        services: "Services Gateway",
        "grounded-counseling": "Grounded Counseling",
        "educational-programs": "Educational Programs & Workshops",
        "advocacy-education": "Advocacy & Education",
        "community-support": "Community Support",
        "system-navigation": "System Navigation",
        impact: "Impact Gateway",
        newsletters: "Newsletters",
        "success-stories": "Success Stories",
        "research-consultancy": "Research & Consultancy",
        "neurodivergent-project": "NeuroDivergent Project",
        "join-us": "Join Us Gateway",
        funders: "Our Funders & Sponsors",
        partners: "Our Partners",
        careers: "Careers",
        volunteer: "Volunteering"
    };

    const title = pageTitles[pageId || ""] || "Content Manager";

    useEffect(() => {
        if (pageId) {
            loadContent(pageId);
        }
    }, [pageId, currentSite?.id]);

    const loadContent = async (id: string) => {
        setLoading(true);
        setError("");
        try {
            const data = await FirestoreService.getPageContent(id, currentSite.id);
            if (data) {
                /*
                 * Special Handling: Services Gateway Logic
                 * -------------------------------------------------------------
                 * We ensure the 'navigator_cta' section always exists on the services page.
                 * If it's the first time visiting this page in the backend, or it was manually deleted,
                 * we seed it with smart defaults matching the original frontend design.
                 */
                if (id === 'services') {
                    const sections = data.sections || {};
                    if (!sections.navigator_cta) {
                        sections.navigator_cta = {
                            heading: "Need Personalized Guidance?",
                            content: "Our system navigation and advocacy team is here to help you find the specific resources and support your family needs.",
                            buttonText: "Talk to a Navigator",
                            buttonUrl: "/contact",
                            enabled: true,
                            order: 99
                        };
                    }
                    setContent({ ...data, sections });
                } else {
                    setContent(data);
                }
            } else {
                // Initialize with default structure if empty (new page)
                const initialSections: Record<string, any> = {};
                // Pre-seed services content if it's completely new
                if (id === 'services') {
                    initialSections.navigator_cta = {
                        heading: "Need Personalized Guidance?",
                        content: "Our system navigation and advocacy team is here to help you find the specific resources and support your family needs.",
                        buttonText: "Talk to a Navigator",
                        buttonUrl: "/contact",
                        enabled: true,
                        order: 99
                    };
                }
                setContent({
                    title: pageTitles[id] || "",
                    sections: initialSections
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

    const handleSectionChange = (sectionId: string, field: keyof SectionContent, value: any) => {
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

    const handleRemoveSection = (sectionId: string) => {
        setSectionToDelete(sectionId);
    };

    const confirmRemoveSection = () => {
        if (!content || !sectionToDelete) return;
        const newSections = { ...content.sections };
        delete newSections[sectionToDelete];
        setContent({ ...content, sections: newSections });
        setSectionToDelete(null);
    };

    const handleMoveSection = (keyToMove: string, direction: 'up' | 'down') => {
        if (!content || !content.sections) return;
        
        const sorted = Object.entries(content.sections).sort((a, b) => (a[1].order ?? 999) - (b[1].order ?? 999));
        const index = sorted.findIndex(([k]) => k === keyToMove);
        
        if (direction === 'up' && index > 0) {
            const temp = sorted[index];
            sorted[index] = sorted[index - 1];
            sorted[index - 1] = temp;
        } else if (direction === 'down' && index < sorted.length - 1) {
            const temp = sorted[index];
            sorted[index] = sorted[index + 1];
            sorted[index + 1] = temp;
        } else {
            return; // No change needed
        }

        const newSections = { ...content.sections };
        sorted.forEach((item, i) => {
            newSections[item[0]].order = i * 10;
        });

        setContent({ ...content, sections: newSections });
    };

    const handleAddSection = () => {
        if (!content || !newSectionId.trim()) return;
        const id = newSectionId.trim().toLowerCase().replace(/\s+/g, "_");
        const maxOrder = Math.max(0, ...Object.values(content.sections || {}).map(s => s.order ?? 0));

        setContent({
            ...content,
            sections: {
                ...(content.sections || {}),
                [id]: {
                    heading: newSectionId, // Use the input as initial heading
                    content: "",
                    order: maxOrder + 10
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

    const seedImpact = () => {
        setContent({
            title: "Impact Gateway",
            sections: {
                hero: {
                    heading: "Our Collective Impact",
                    content: "<p>Empowering the Black community through culturally-responsive support and Advocacy.</p>"
                },
                stats: {
                    heading: "2023 at a Glance",
                    content: "500+ Individuals Supported\n20+ Community Partners\n150+ Wellness Workshops"
                }
            }
        });
        setSuccessMsg("Seeded Impact data! Click Save to persist.");
    };

    const seedSuccessStories = () => {
        setContent({
            title: "Success Stories",
            sections: {
                intro: {
                    heading: "Voices of Resilience",
                    content: "<p>Real stories from individuals and families who have found strength and support through KMFW programs.</p>"
                },
                story_1: {
                    heading: "Finding a Path to Healing",
                    content: "<p>'KMFW didn't just provide counseling; they provided a community that understood my cultural context...' - Sarah J.</p>"
                }
            }
        });
        setSuccessMsg("Seeded Success Stories data! Click Save to persist.");
    };

    const seedServicesGateway = () => {
        setContent({
            title: "Services Gateway",
            sections: {
                header: {
                    heading: "Our Services",
                    content: "<div class='text-lg'>Culturally-attuned programs designed for the Black community.</div>"
                },
                intro: {
                    heading: "What We Offer",
                    content: "Holistic Support for *Every Member* of the Family"
                },
                counseling: {
                    heading: "Culturally Grounded Counseling",
                    content: "Faith-based and identity-affirming therapy that honors your unique lived experiences and cultural heritage."
                },
                family_support: {
                    heading: "Family & Youth Support",
                    content: "Empowering the next generation through mentorship, workshops, and specialized counseling for youth."
                },
                system_navigation: {
                    heading: "System Navigation",
                    content: "Expert guidance through complex health, education, and social systems to ensure your family gets the care it deserves."
                },
                community_integration: {
                    heading: "Community Integration",
                    content: "Building social networks and support groups that foster resilience and collective healing within the community."
                },
                crisis_support: {
                    heading: "Crisis Support Advocacy",
                    content: "Immediate advocacy and resource identification for families facing urgent mental health or social challenges."
                },
                research: {
                    heading: "Research & Insights",
                    content: "Evidence-based studies focusing on Black community wellness to drive systemic change and better policy."
                }
            }
        });
        setSuccessMsg("Seeded Services Gateway data!");
    };

    const seedGroundedCounseling = () => {
        setContent({
            title: "Grounded Counseling",
            sections: {
                hero: {
                    heading: "Culturally Grounded Counseling",
                    content: "Providing Afrocentric counseling and therapeutic support tailored for Black individuals, families, and couples to promote emotional well-being and resilience."
                },
                success_benefits: {
                    heading: "Success, Benefit, and Evaluation",
                    content: `
                        <p>At KMFW, we ensure that program and service needs are effectively addressed and that room for subsequent meetings is left open to our clients. We are very passionate about the services we provide and are committed to ensuring that service recipients observe and experience this commitment.</p>
                        <p>Our clients are offered tailored services and ongoing opportunities to evaluate and modify their personalized expected outcomes as needed. We are passionate about fostering services that are evidence-informed and targeted to clients' needs. Therefore, we encourage and appreciate clients' constructive feedback as it ensures that our services are exceptionally delivered.</p>
                    `
                },
                referral_process: {
                    heading: "Referral Process for Counseling",
                    content: `
                        <p>We accept self-referrals from prospective clients, their family/informal supports, or by a professional third party. Please complete the enclosed "counseling form" below.</p>
                        <p>Do you need assistance completing the referral/intake form? We are here to help! Feel free to reach out to us via phone at <strong>226-336-1988</strong> or send us an email at <strong>info@kindmindsfamilywellness.org</strong>.</p>
                        <div class="flex flex-wrap gap-4 mt-6">
                            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfM_1Gf-AXxz_QSdEvVM9iwc2san9x33Jk6_-D_fEagAxtt7A/viewform" target="_blank" class="btn-primary">Counseling Intake Form</a>
                        </div>
                    `
                }
            }
        });
        setSuccessMsg("Seeded Grounded Counseling data!");
    };

    const seedEducationalPrograms = () => {
        setContent({
            title: "Educational Programs & Groups",
            sections: {
                hero: {
                    heading: "Educational Programs & Groups",
                    content: "Culturally Informed Educational Programs and Support Groups designed for all stages of life."
                },
                wazee: {
                    heading: "Wazee (Seniors' Group)",
                    content: `
                        <p>(Means 'Elderly' in Swahili). A weekly virtual program designed to foster social connections, communication, and support among the elderly within the Black community. Integrates guest speakers and health/economic needs discussions.</p>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScW6YxRVuOfpZ2GDiEZe8GmxKYBZET2jlH1c79y_e8lbI5NFQ/viewform" target="_blank" class="text-primary font-bold">Register for Wazee →</a>
                    `
                },
                fambul_tok: {
                    heading: "Fambul Tok (Adult Groups)",
                    content: `
                        <p>(Means 'family meeting' in Krio). Adult conversation circles tackling parenting in Canada, Western expectations, and culturally-informed strategies promoting family wellness.</p>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSdZGd4N0D-hNAerSFr0iXFTjVI21jqw9cDXFg45seIOsyUs4w/viewform" target="_blank" class="text-highlight font-bold">Join Adult Circles →</a>
                    `
                },
                kungiyar_mata: {
                    heading: "Kungiyar Mata (Women's Circle)",
                    content: `
                        <p>(Means 'women's group' in Hausa). An 8-week support group for Black and racialized women identifying as survivors of gender-based violence. Fosters healing, resilience, and empowerment.</p>
                        <a href="#" class="text-accent font-bold">Register for Healing Horizon →</a>
                    `
                },
                isibaya_samadoda: {
                    heading: "Isibaya Samadoda (Men's Circle)",
                    content: `
                        <p>(Means 'Men's Circle' in Zulu). A space for African, Black, or Caribbean men in Waterloo Region to connect, build belonging, have fun, and face life's challenges together.</p>
                        <a href="#" class="text-charcoal font-bold">Register for Men's Circle →</a>
                    `
                }
            }
        });
        setSuccessMsg("Seeded Educational Programs data!");
    };

    const seedAdvocacyEducation = () => {
        setContent({
            title: "Advocacy & Education",
            sections: {
                hero: {
                    heading: "Advocacy, Training & Education",
                    content: "Education and Advocacy on Anti-Black Racism and Systemic Oppression, Cross-Cultural Leadership, Organizational Culture, and more."
                },
                workshops: {
                    heading: "Workshops & Training",
                    content: `
                        <p>We are committed to reaching out and providing culturally-informed educational workshops and training to service providers to marginalized (specifically Black-identifying) groups within the community. Through such cooperation, we foster a culturally safe and positive space that encourages and respects the perspectives of all Black and racialized service recipients.</p>
                        <p>Our standard workshop on inclusivity is an 8-hour (2 half-day) training. We have several two-hour workshops and workshop series on different aspects of Diversity, Equity, Inclusion, Belonging, and Access.</p>
                        <p>We offer opportunities for organizations to request specific and curated workshops, such as grant writing for grassroots organizations, cross-cultural leadership, and focus groups.</p>
                        <div class="mt-6">
                            <a href="https://docs.google.com/forms/d/1UfLrO2XSuHy-zZpGVy1YtCmC3CzlVXKYtpef3Tx3Z24/viewform" target="_blank" class="btn-primary">Request a Workshop</a>
                        </div>
                    `
                }
            }
        });
        setSuccessMsg("Seeded Advocacy & Education data!");
    };

    const seedCommunitySupport = () => {
        setContent({
            title: "Community Support",
            sections: {
                hero: {
                    heading: "Community Support & Engagement",
                    content: "We provide educational support groups, Newcomer to Canada support, sporting and extracurricular activities, and aid in navigating community resources."
                },
                navigating_resources: {
                    heading: "Navigating Resources",
                    content: "We assist in navigating community resources, including food access, housing, clothing, medical support, transportation, and other vital social services."
                },
                community_events: {
                    heading: "Community Events",
                    content: "We regularly host events like the Storytelling Festival, Bike Riding Festival, and Summer BBQs across the Waterloo Region to foster unity and joy in our community."
                }
            }
        });
        setSuccessMsg("Seeded Community Support data!");
    };

    const seedSystemNavigation = () => {
        setContent({
            title: "System Navigation",
            sections: {
                hero: {
                    heading: "System Navigation",
                    content: "How we can support and work with you to bridge gaps and facilitate access to essential systems and services."
                },
                assessments: {
                    heading: "Client-Centered Assessment",
                    content: "Thorough assessments to identify individual needs and barriers within desired systems, ensuring a personalized approach to navigation."
                },
                guidance: {
                    heading: "Guidance and Support",
                    content: "Our team provides tailored guidance throughout the navigation process, connecting clients with relevant services and resources aligned with their goals."
                },
                navigation: {
                    heading: "Expert Navigation",
                    content: "Leveraging our in-depth knowledge of diverse systems, we bridge gaps and facilitate access to essential services."
                },
                advocacy: {
                    heading: "Advocacy and Education",
                    content: "We empower clients by educating them about their rights, options, and responsibilities within systems, while advocating on their behalf to overcome obstacles."
                },
                collaboration: {
                    heading: "Stakeholder Collaboration",
                    content: "We build robust networks with stakeholders to expand access to resources and support for our community, fostering collaboration and synergy."
                },
                learning: {
                    heading: "Data Management and Continuous Learning",
                    content: "We maintain accurate records to evaluate navigation effectiveness, while staying informed about policy changes and emerging trends to enhance our skills."
                },
                quote: {
                    heading: "Our Commitment",
                    content: `
                        <p class="italic font-bold">"At KMFW, our System Navigation Support embodies more than mere assistance – it's a testament to our commitment to equity, empowerment, and community well-being. Together, we navigate towards a brighter, more inclusive future."</p>
                    `
                }
            }
        });
        setSuccessMsg("Seeded System Navigation data!");
    };

    const seedFundersSponsors = () => {
        setContent({
            title: "Our Funders",
            enabled: true,
            sections: {
                hero: {
                    heading: "Our Funders",
                    content: "Kind Minds Family Wellness is profoundly grateful for the support of our funders—they make the difference for us and allow us to accomplish our mission, vision, and to continue working towards our strategic plans!"
                },
                thank_you: {
                    heading: "Thank You",
                    content: "The generous contributions from our regional sponsors, municipal partners, and community foundations allow us to sustain Afrocentric counseling, youth mentorship programs, and crucial system navigation services for Black families across the Waterloo Region.",
                    order: 10
                }
            }
        });
        setSuccessMsg("Seeded Funders data!");
    };

    const seedPartners = () => {
        setContent({
            title: "Our Partners",
            enabled: true,
            sections: {
                hero: {
                    heading: "Our Partners",
                    content: "We collaborate with a vast network of organizations dedicated to expanding equity, access, and culturally safe care across the region."
                },
                network: {
                    heading: "Community Network",
                    content: "<ul><li><a href='https://familyserviceontario.org'>Family Service Ontario</a></li><li><a href='#'>Great Kitchener Waterloo Chamber of Commerce</a></li><li><a href='https://blackhealthalliance.ca/about/'>Black Health Alliance</a></li><li><a href='http://afrofamily.ca/'>African Family Revival Organization (AFRO)</a></li><li><a href='https://www.sascwr.org/'>Sexual Assault Support Centre of Waterloo Region (SASCWR)</a></li><li><a href='https://cyouthassociation.wixsite.com/canadianaweilyouth'>Canadian Aweil Youth Association (CAYA)</a></li><li><a href='https://www.kinbridge.ca'>Kinbridge Community Association</a></li><li><a href='https://onyxinitiative.org'>Onyx Initiative</a></li><li><a href='https://www.conestogac.on.ca'>Conestoga College</a></li><li><a href='https://www.kpl.org'>Kitchener Public Library</a></li><li><a href='https://afrowomen.ca/'>African Women Alliance</a></li><li><a href='https://cambridgefoodbank.org/'>Cambridge Food Bank</a></li><li><a href='https://www.thefoodbank.ca/about/'>Food Bank of Waterloo Region (FBWR)</a></li><li><a href='https://greenwaychaplin.com/'>Greenway- Chaplin Community Centre</a></li><li><a href='https://www.caminowellbeing.ca'>Camino Wellbeing + Mental Health</a></li><li><a href='https://cjiwr.com'>Community Justice Initiatives</a></li><li><a href='https://www.muslimsocialserviceskw.org'>Muslim Social Services Waterloo Region (MSS)</a></li></ul>",
                    order: 10
                }
            }
        });
        setSuccessMsg("Seeded Partners data!");
    };

    const seedMeetOurTeam = () => {
        setContent({
            title: "Meet Our Team",
            enabled: true,
            sections: {
                hero: {
                    heading: "Meet Our Team",
                    content: "A passionate collective of Black professionals, advocates, and community members dedicated to culturally grounded wellness."
                },
                teams: {
                    heading: "Our People",
                    content: "Every person at Kind Minds Family Wellness brings a unique perspective and an unwavering commitment to our community.",
                    items: [
                        { id: "board", title: "Board Of Directors", description: "KMFW Board of Directors comprise individuals from various professional backgrounds who oversee the legal and financial obligations of the coalition and meet quarterly.", icon: "Shield", color: "bg-blue-50 text-blue-600" },
                        { id: "advisory", title: "Advisory Committee", description: "The Advisory committee comprises professionals from clinical and nonclinical backgrounds who provide expert insight and practical knowledge into various subject areas that inform KMFW operations and strategic directions.", icon: "Star", color: "bg-purple-50 text-purple-600" },
                        { id: "ed", title: "Executive Director", description: "Leads the organization's strategic vision and operations.", icon: "Briefcase", color: "bg-amber-50 text-amber-600" },
                        { id: "coordinators", title: "Project Coordinators", description: "Manage specific community programs and initiatives.", icon: "Users", color: "bg-green-50 text-green-600" },
                        { id: "consultants", title: "Clinical Consultants", description: "Provide culturally responsive clinical support and guidance.", icon: "Heart", color: "bg-rose-50 text-rose-600" }
                    ]
                },
                mentors: {
                    heading: "Black Youth Impact",
                    subtitle: "Community Program",
                    content: "Hover over each card to meet our mentors — passionate leaders dedicated to empowering the next generation.",
                    enabled: true,
                    list: [
                        { name: "Placeholder Mentor 1", role: "Role Description", bio: "Bio information...", image: "" },
                        { name: "Placeholder Mentor 2", role: "Role Description", bio: "Bio information...", image: "" }
                    ]
                }
            }
        });
        setSuccessMsg("Seeded Meet Our Team data!");
    };

    const seedJoinUs = () => {
        setContent({
            title: "Join Us Gateway",
            enabled: true,
            sections: {
                hero: {
                    heading: "Join Us",
                    content: "Get involved with KMFW through volunteering, partnering, or career opportunities. Together we can empower the Black community.",
                    order: 0,
                    enabled: true
                },
                ways_to_give: {
                    heading: "Ways to Give",
                    content: "Support our programs and services directly through a one-time or recurring contribution. Lend your skills and time to our events, workshops, and community outreach efforts. Join our network of organizations working to improve system navigation and advocacy.",
                    order: 10,
                    enabled: true
                },
                careers_cta: {
                    heading: "Join Our Professional Team",
                    content: "We are always looking for passionate researchers, counselors, and community advocates who share our commitment to culturally grounded care.",
                    buttonText: "View Careers",
                    buttonUrl: "/join/careers",
                    order: 20,
                    enabled: true
                }
            }
        });
        setSuccessMsg("Seeded Join Us Gateway data! Click Save to persist.");
    };

    const seedCareers = () => {
        setContent({
            title: "Careers",
            enabled: true,
            sections: {
                hero: {
                    heading: "Career Services & Employment Support",
                    content: "Empowering professionals through employment support, and opening our doors to those who want to join our team.",
                    order: 0,
                    enabled: true
                },
                quote: {
                    heading: "If you want to go Fast, go Alone. If you want to go Far, go Together",
                    subtitle: "- African Proverb",
                    content: "We look forward to having you join our team, because we believe that we are stronger together as we move the much needed work forward!",
                    order: 10,
                    enabled: true
                },
                employment_support: {
                    heading: "Employment Support",
                    content: "We provide resources, resume building workshops, interview preparation, and vocational guidance tailored to help members of the Black community thrive in their careers and navigate workplace challenges.",
                    buttonText: "Access Support Services",
                    buttonUrl: "#",
                    order: 20,
                    enabled: true
                },
                join_our_team: {
                    heading: "Join Our Team",
                    content: "Looking to make an impact? We are always seeking passionate researchers, culturally-informed counselors, and community advocates. Check out our open roles below!",
                    buttonText: "View Open Roles",
                    buttonUrl: "#current-opportunities",
                    order: 30,
                    enabled: true
                },
                job_counselor: {
                    heading: "OUR COUNSELING TEAM IS GROWING!",
                    subtitle: "Mental Health Counsellor",
                    content: "<p>We seek counsellors who self-identify as African Canadian (African, Caribbean, Black identifying) to join our counselling team.</p><br/><p>Our counselling is provided by trauma-informed professionals who are racially, culturally, and spiritually aligned in their work with Black persons. Well-attuned to African cultural resiliency, our culturally grounded counsellors are outstanding at ensuring that their chosen modalities are customized to address needs and foster well-being effectively.</p><br/><p><strong>**We currently seek candidates with early afternoon, evening, and weekend availabilities.</strong></p>",
                    buttonText: "Apply via Email",
                    buttonUrl: "mailto:services@kindmindsfamilywellness.org",
                    order: 40,
                    enabled: true
                },
                job_operations: {
                    heading: "OPERATIONS SPECIALIST",
                    subtitle: "Non-Profit Operations",
                    content: "<ul><li>Have you worked with underserved or marginalized communities in the past?</li><li>Do you have a background in leadership, operations, or nonprofit work that aligns with this role?</li><li>Are you currently located in or willing to commute to the Cambridge, Kitchener, Waterloo region or surrounding Townships?</li></ul><br/><p>If you answered yes to all of these, then we'd love to hear from you!</p>",
                    buttonText: "View Full Job Description",
                    buttonUrl: "/pdfs/OPERATIONS-SPECIALIST-KMFW-Job-Description.pdf",
                    order: 50,
                    enabled: true
                }
            }
        });
        setSuccessMsg("Seeded Careers data! Click Save to persist.");
    };

    const seedVolunteer = () => {
        setContent({
            title: "Volunteering",
            enabled: true,
            sections: {
                hero: {
                    heading: "Call for Volunteers 2025/2026",
                    content: "We seek individuals and organizations that are committed to the work relating to Black identifying persons, aspire and embrace opportunities to give back to their community. We strive for individuals and organizations that will contribute to our needs within the organization and in the community.",
                    order: 0,
                    enabled: true
                },
                application_cta: {
                    heading: "Volunteer Application",
                    content: "Join our roster of dedicated volunteers making a difference across the Waterloo Region.",
                    buttonText: "Open Application Form",
                    buttonUrl: "https://forms.gle/y4qdiEKUWVkYnhT26",
                    order: 10,
                    enabled: true
                },
                quote_kalinda: {
                    heading: "Wonderful Experience",
                    subtitle: "Kalinda Yan-Tong Siu",
                    content: "KMFW has welcomed me with open arms from Day 1 and has allowed me to learn while giving back to the community. I feel privileged to be a part of this wonderful organization!",
                    order: 20,
                    enabled: true
                },
                quote_cat: {
                    heading: "Advice for New Volunteers",
                    subtitle: "Cat",
                    content: "Keep an open mind and listen to feedback. Not everything you try at first may be what your community needs- it is important to listen and adjust to provide the best service possible.",
                    order: 30,
                    enabled: true
                },
                quote_muskan: {
                    heading: "Meaningful Impact",
                    subtitle: "Muskan Arif",
                    content: "You (supervisor) and the rest of the KMFW team have had a huge meaningful impact on me. You have taught me so so much and I hope to continue to be able to have the opportunity to keep learning from you (supervisor). Thank you",
                    order: 40,
                    enabled: true
                },
                volunteer_needs: {
                    heading: "Current Volunteer Needs",
                    content: "1. Youth Mentor (Min. 6month commitment)\n\n2. Employment Support\n\n3. Driver\n\n4. Cultural Group Support (Min. 6-Months commitment)\n\n5. Community Engagement Support (Min. 6-Months commitment)\n\n6. Administrative Assistant (Min. 12-Months commitment)\n\n7. Tutors and Tutoring Assistant/Support (Virtual)\n\n8. Cooking Class Instructors (Fall 2022 or Winter 2023)\n\n9. Research Coordinators\n\n10. Board of Directors",
                    order: 50,
                    enabled: true
                },
                board_call: {
                    heading: "Call for Board Membership",
                    content: "If you’re looking for opportunities to give back to your local community and are committed to working with Black-identifying individuals, we invite you to join the KMFW team as a Board Member. gain meaningful experience while also contributing to the needs of our organization and the greater community.",
                    buttonText: "View Board PDF",
                    buttonUrl: "/pdfs/Call-for-Board-Members-2024.pdf",
                    order: 60,
                    enabled: true
                },
                footer_quote: {
                    heading: "Building a Better World",
                    subtitle: "Kofi Annan - Former UN Secretary General",
                    content: "If our hopes of building a better and safer world are to become more than wishful thinking, we will need the engagement of volunteers more than ever",
                    order: 70,
                    enabled: true
                },
                contact_info: {
                    heading: "Get in Touch",
                    content: "Don’t see where you can contribute listed? Not a problem; please send us an email at info@kindmindsfamilywellness.org OR complete the contact form below, as there is always room for you and what you bring to the table.",
                    order: 80,
                    enabled: true
                }
            }
        });
        setSuccessMsg("Seeded Volunteer data! Click Save to persist.");
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
                                Seed Footer
                            </Button>
                        )}
                        {pageId === 'about' && (
                            <Button variant="outline" onClick={seedAboutUs}>
                                Seed About Us
                            </Button>
                        )}
                        {pageId === 'impact' && (
                            <Button variant="outline" onClick={seedImpact}>
                                Seed Impact
                            </Button>
                        )}
                        {pageId === 'success-stories' && (
                            <Button variant="outline" onClick={seedSuccessStories}>
                                Seed Success Stories
                            </Button>
                        )}
                        
                        {/* Services Seeding */}
                        {pageId === 'services' && (
                            <Button variant="outline" onClick={seedServicesGateway}>
                                Seed Services Gateway
                            </Button>
                        )}
                        {pageId === 'grounded-counseling' && (
                            <Button variant="outline" onClick={seedGroundedCounseling}>
                                Seed Counseling
                            </Button>
                        )}
                        {pageId === 'educational-programs' && (
                            <Button variant="outline" onClick={seedEducationalPrograms}>
                                Seed Educational Programs
                            </Button>
                        )}
                        {pageId === 'advocacy-education' && (
                            <Button variant="outline" onClick={seedAdvocacyEducation}>
                                Seed Advocacy & Education
                            </Button>
                        )}
                        {pageId === 'community-support' && (
                            <Button variant="outline" onClick={seedCommunitySupport}>
                                Seed Community Support
                            </Button>
                        )}
                        {pageId === 'system-navigation' && (
                            <Button variant="outline" onClick={seedSystemNavigation}>
                                Seed System Navigation
                            </Button>
                        )}
                        {pageId === 'meet-our-team' && (
                            <Button variant="outline" onClick={seedMeetOurTeam}>
                                Seed Meet Our Team
                            </Button>
                        )}
                        {pageId === 'funders' && (
                            <Button variant="outline" onClick={seedFundersSponsors}>
                                Seed Funders & Sponsors
                            </Button>
                        )}
                        {pageId === 'partners' && (
                            <Button variant="outline" onClick={seedPartners}>
                                Seed Partners
                            </Button>
                        )}
                        {pageId === 'join-us' && (
                            <Button variant="outline" onClick={seedJoinUs}>
                                Seed Join Us
                            </Button>
                        )}
                        {pageId === 'careers' && (
                            <Button variant="outline" onClick={seedCareers}>
                                Seed Careers
                            </Button>
                        )}
                        {pageId === 'volunteer' && (
                            <Button variant="outline" onClick={seedVolunteer}>
                                Seed Volunteering
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
                        .sort((a, b) => (a[1].order ?? 999) - (b[1].order ?? 999))
                        .map(([key, section]) => (
                            <div key={key} className="p-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-white/[0.02] dark:border-gray-700">
                                <div className="mb-3 flex items-center justify-between">
                                    <Label>Section ID: <span className="font-mono text-xs text-gray-400">{key}</span></Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-gray-500 uppercase">Visible</span>
                                            <input 
                                                type="checkbox"
                                                checked={section.enabled !== false}
                                                onChange={(e) => handleSectionChange(key, "enabled", e.target.checked)}
                                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 border-l pl-4 border-gray-300 dark:border-gray-600">
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); handleMoveSection(key, 'up'); }}
                                                className="p-1 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors"
                                                title="Move Up"
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); handleMoveSection(key, 'down'); }}
                                                className="p-1 text-gray-500 hover:text-primary hover:bg-gray-200 rounded transition-colors"
                                                title="Move Down"
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); handleRemoveSection(key); }}
                                                className="p-1 ml-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                title="Remove Section"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
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
                                        <Label>Video Embed URL (Optional YouTube / Vimeo link)</Label>
                                        <Input
                                            type="text"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={section.videoUrl || ""}
                                            onChange={(e) => handleSectionChange(key, "videoUrl", e.target.value)}
                                        />
                                    </div>

                                    {key !== 'hero' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Subtitle / Badge (Optional)</Label>
                                                <Input
                                                    type="text"
                                                    value={section.subtitle || ""}
                                                    onChange={(e) => handleSectionChange(key, "subtitle", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Button Text (Optional)</Label>
                                                <Input
                                                    type="text"
                                                    value={section.buttonText || ""}
                                                    onChange={(e) => handleSectionChange(key, "buttonText", e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label>Button Action/URL (Optional Mailto, /pdfs/..., https://...)</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="mailto:services@... OR /pdfs/... OR https://..."
                                                    value={section.buttonUrl || ""}
                                                    onChange={(e) => handleSectionChange(key, "buttonUrl", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {key !== 'hero' && (
                                        <div className="flex flex-col gap-4 p-4 border rounded-xl bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Section Images (Supports single Focal Image or Gallery block Arrays)</Label>
                                            </div>

                                            {/* List all existing images */}
                                            {(section.images || []).map((img, imgIdx) => (
                                                <div key={imgIdx} className="flex gap-4 items-start border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                                    <div className="flex-grow">
                                                        <ImagePicker
                                                            label={imgIdx === 0 ? "Focal Image (Primary)" : `Gallery Image ${imgIdx + 1}`}
                                                            value={img.url || ""}
                                                            onChange={(url) => {
                                                                const newImages = [...(section.images || [])];
                                                                newImages[imgIdx] = { url, alt: section.heading || "Image" };
                                                                handleSectionChange(key, "images", newImages);
                                                            }}
                                                            placeholder="Select or upload an image..."
                                                        />
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const newImages = [...(section.images || [])];
                                                            newImages.splice(imgIdx, 1);
                                                            handleSectionChange(key, "images", newImages);
                                                        }}
                                                        className="mt-8 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove Image"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="pt-2 flex gap-3 flex-wrap items-center">
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => {
                                                        const newImages = [...(section.images || []), { url: "", alt: "" }];
                                                        handleSectionChange(key, "images", newImages);
                                                    }}
                                                >
                                                    + Add Image Input (Manual)
                                                </Button>
                                                <Button 
                                                    onClick={() => setMultiSelectOpenForSection(key)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md border-0"
                                                >
                                                    + Bulk Add Images from Library (Max 5)
                                                </Button>
                                            </div>

                                            {/* Image Alignment settings only appear if there is at least one established image */}
                                            {((section.images || []).length > 0 && section.images?.[0]?.url) && (
                                                <div className="flex gap-4 items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <Label className="flex-shrink-0">Image Alignment (Applies to First Image)</Label>
                                                    <select 
                                                        value={section.imageAlignment || 'top'} 
                                                        onChange={(e) => handleSectionChange(key, "imageAlignment", e.target.value)}
                                                        className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 w-full sm:w-auto text-sm"
                                                    >
                                                        <option value="top">Top (Stacked)</option>
                                                        <option value="left">Image on Left (Side-by-Side)</option>
                                                        <option value="right">Image on Right (Side-by-Side)</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    )}

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

            {/* Media Library Bulk Picker */}
            <MediaLibrary 
                isOpen={!!multiSelectOpenForSection}
                onClose={() => setMultiSelectOpenForSection(null)}
                multiSelect={true}
                onSelectMultiple={(urls) => {
                    if (!multiSelectOpenForSection || !content) return;
                    const currentSection = content.sections?.[multiSelectOpenForSection];
                    if (!currentSection) return;
                    
                    const newImages = [...(currentSection.images || [])];
                    urls.forEach(url => {
                        newImages.push({ url, alt: currentSection.heading || "Gallery Image" });
                    });
                    
                    handleSectionChange(multiSelectOpenForSection, "images", newImages);
                    setMultiSelectOpenForSection(null);
                }}
            />

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!sectionToDelete} onClose={() => setSectionToDelete(null)} className="max-w-sm">
                <div className="p-6 bg-white rounded-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Section?</h3>
                    <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete the <strong className="text-gray-700 dark:text-gray-300">"{sectionToDelete}"</strong> section?</p>
                    <div className="flex justify-center gap-3 w-full">
                        <Button variant="outline" className="flex-1" onClick={() => setSectionToDelete(null)}>Cancel</Button>
                        <Button onClick={confirmRemoveSection} className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none">Delete</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
