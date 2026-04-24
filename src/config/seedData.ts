export const SEED_DATA: any = {
    nspc: {
        hero_slider: {
            seo: {
                title: 'Niagara Suicide Prevention Coalition | From Hope to Action',
                description: 'We work together to prevent suicide in Niagara by providing resources, education, and community support.'
            },
            slides: [
                {
                    id: '1',
                    title: 'From Hope to Action',
                    subtitle: 'Working together to prevent suicide in Niagara',
                    cta: 'Learn More',
                    link: '/about',
                    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/nspc-web.firebasestorage.app/o/hero_slider%2F1769881575454_slide%201.jpg?alt=media',
                    isActive: true
                },
                {
                    id: '2',
                    title: 'Support is Available',
                    subtitle: 'You are not alone. Help is just a call away.',
                    cta: 'Find Support',
                    link: '/resources',
                    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/nspc-web.firebasestorage.app/o/hero_slider%2F1769881568581_slide2.png?alt=media',
                    isActive: true
                },
                {
                    id: '3',
                    title: 'Community Connection',
                    subtitle: 'Building a stronger, more supportive community together.',
                    cta: 'Get Involved',
                    link: '/take-action',
                    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/nspc-web.firebasestorage.app/o/hero_slider%2F1769881561432_slide3.png?alt=media',
                    isActive: true
                },
                {
                    id: '4',
                    title: 'Education & Training',
                    subtitle: 'Equipping our community with the knowledge to save lives.',
                    cta: 'Our Programs',
                    link: '/programs',
                    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/nspc-web.firebasestorage.app/o/hero_slider%2F1769881553113_slide4.png?alt=media',
                    isActive: true
                }
            ]
        },

        programs: {
            seo: {
                title: 'Programs & Training | NSPC',
                description: 'Suicide awareness training and life promotion programs available in the Niagara region.'
            },
            programs: [
                {
                    id: '1',
                    title: 'Suicide Awareness Training',
                    description: 'Distress Centre Niagara provides access to suicide prevention education through their team of LivingWorks-certified trainers. These trainers are qualified to deliver both ASIST (Applied Suicide Intervention Skills Training) and SafeTALK workshops, equipping participants with the skills and confidence to identify and support individuals at risk of suicide.',
                    link: 'https://distresscentreniagara.com',
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '2',
                    title: 'Leadership for Life Promotion',
                    description: 'Feather Carriers is an Indigenous non-profit life promotion training program based on Indigenous knowledge and clinical experience. Training is provided in year-long teaching circles (cohorts) where participants learn teachings related to life promotion and premature unnatural death.',
                    link: '#',
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '3',
                    title: 'Communicating safely online',
                    description: '#ChatSafe is an internationally renowned suicide prevention program that aims to empower and equip young people to communicate safely online about self-harm and suicide on social media and other digital platforms. It also empowers their parents or caregivers to support them in communicating safely.',
                    link: '#',
                    imageUrl: '',
                    isActive: true
                }
            ]
        },
        resources: {
            seo: {
                title: 'Helpful Resources | NSPC',
                description: 'Educational guides, toolkits, and resources for those struggling with suicide or impacted by loss.'
            },
            resources: [
                {
                    id: '1',
                    title: "A Guide for People and Families Struggling with Suicide",
                    description: "Developed by St. Joe’s experts and those with lived experience, this guide supports those experiencing thoughts of suicide and their loved ones.",
                    type: 'Guide',
                    link: "https://www.niagararegion.ca/living/health_wellness/mentalhealth/pdf/guide-struggling-with-suicide.pdf",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '2',
                    title: "A Toolkit for People Impacted by a Suicide Loss",
                    description: "Tools and strategies for coping, crisis planning, and safely sharing stories of suicide loss.",
                    type: 'Toolkit',
                    link: "https://www.mentalhealthcommission.ca/sites/default/files/2019-03/suicide_attempt_toolkit_eng.pdf",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '3',
                    title: "Hope and Healing After Suicide",
                    description: "Information on speaking about suicide loss, working through grief, funeral arrangements, and finding professional support.",
                    type: 'Guide',
                    link: "https://www.camh.ca/hopeandhealing",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '4',
                    title: "“When a Parent Dies by Suicide… What Kids Want to Know”",
                    description: "Addresses how to respond to common questions asked by children who have lost a parent/caregiver to suicide.",
                    type: 'Guide',
                    link: "https://www.camh.ca/en/health-info/guides-and-publications/when-a-parent-dies-by-suicide",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '5',
                    title: "A Proactive Planning Workbook for Communities",
                    description: "Checklists and resources to help communities develop, implement and monitor a suicide postvention strategy.",
                    type: 'Workbook',
                    link: "https://framerusercontent.com/assets/bKN7Usb2qM2Xr8NmiiFMOvmqg.pdf",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '6',
                    title: "School-based suicide prevention initiative",
                    description: "Enhance understanding of best practices in school-based prevention and postvention.",
                    type: 'Guide',
                    link: "https://smho-smso.ca/online-resources/school-based-suicide-prevention-life-promotion-initiatives-resources-for-community-based-providers/",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '7',
                    title: "Talking to Children About a Suicide",
                    description: "A guide for parents/caregivers of children under 12 on how to speak with them when a suicide occurs.",
                    type: 'Guide',
                    link: "https://suicideprevention.ca/resource/talking-to-children-about-a-suicide/",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '8',
                    title: "A Manager’s Guide to Suicide Postvention",
                    description: "Action steps for workplace leaders including immediate, short-term, and long-term responses.",
                    type: 'Guide',
                    link: "https://theactionalliance.org/resource/managers-guide-suicide-postvention-workplace-10-action-steps-dealing-aftermath-suicide",
                    imageUrl: '',
                    isActive: true
                },
                {
                    id: '9',
                    title: "Zero Suicide toolkit",
                    description: "Support for organizations outside the health care sector to expand suicide prevention potential.",
                    type: 'Toolkit',
                    link: "https://www.niagararegion.ca/living/health_wellness/mentalhealth/wellbeing/zero-suicide.aspx",
                    imageUrl: '',
                    isActive: true
                }
            ]
        },
        understanding: {
            cards: [
                {
                    id: '1',
                    title: "What are the warning signs?",
                    description: "People who die by suicide usually show some indication of warning before their deaths. Recognizing the warning signs for suicide can help us to intervene to save a life.",
                    items: [
                        { text: "Talking about wanting to die or to kill themselves", link: "" },
                        { text: "Looking for a way to kill themselves, such as searching online or buying a gun", link: "" },
                        { text: "Talking about feeling hopeless or having no reason to live", link: "" },
                        { text: "Talking about feeling trapped or in unbearable pain.", link: "" },
                        { text: "Talking about being a burden to others.", link: "" },
                        { text: "Increasing the use of alcohol or drugs.", link: "" },
                        { text: "Acting anxious or agitated; behaving recklessly.", link: "" },
                        { text: "Sleeping too little or too much.", link: "" },
                        { text: "Withdrawing or isolating themselves.", link: "" },
                        { text: "Showing rage or talking about seeking revenge.", link: "" },
                        { text: "Displaying extreme mood swings.", link: "" }
                    ],
                    imageUrl: '',
                    backgroundColor: '#46C3CC',
                    isActive: true
                },
                {
                    id: '2',
                    title: "What increases the risk of suicide?",
                    description: "Suicide is complex and rarely caused by a single event. Risk factors include mental illness, previous attempts, social isolation, and significant life changes.",
                    items: [
                        { text: "Prior suicide attempt", link: "" },
                        { text: "Mental illness, such as depression", link: "" },
                        { text: "Social isolation", link: "" },
                        { text: "Criminal problems", link: "" },
                        { text: "Financial or other stressful life events", link: "" },
                        { text: "Impulsive or aggressive tendencies", link: "" },
                        { text: "Job or financial loss", link: "" },
                        { text: "Loss of relationship", link: "" },
                        { text: "Easy access to lethal means", link: "" },
                        { text: "Local clusters of suicide", link: "" },
                        { text: "Lack of social support and sense of isolation", link: "" },
                        { text: "Stigma associated with help-seeking behavior", link: "" }
                    ],
                    imageUrl: '',
                    backgroundColor: '#DCE4EA',
                    isActive: true
                },
                {
                    id: '3',
                    title: "How can communities take action?",
                    description: "Communities play a vital role in prevention by creating supportive environments, reducing stigma, and connecting people to resources. Education and open conversation are key first steps.",
                    items: [
                        { text: "Bring the Zero Suicide Toolkit to your workplace", link: "" },
                        { text: "Join the Niagara Suicide Prevention Coalition", link: "" },
                        { text: "Share 9-8-8 posters, wallet cards and social media posts widely", link: "https://988.ca" },
                        { text: "Promote BeSafe app in your community", link: "" }
                    ],
                    imageUrl: '',
                    backgroundColor: '#AACD3A',
                    isActive: true
                }
            ]
        },
        coping: {
            resources: [
                {
                    id: '1',
                    title: "Hospice Niagara Grief Support",
                    subtitle: "",
                    content: "Hospice Niagara offers a variety of programs and workshops to help adults as well as programs that give children and youth a safe space to explore their feelings of grief and loss.\n\n(905) 984-8766\ninfo@hospiceniagara.ca",
                    icon: "heart-outline",
                    link: "",
                    isActive: true
                },
                {
                    id: '2',
                    title: "Bereaved Families of Ontario",
                    subtitle: "",
                    content: "An association of families for parents who have lost a child through death and for children up to 19 years who have lost parents, siblings, or other significant persons through death. One-to-one and telephone support is also available.\n\n905-318-0070",
                    icon: "people-outline",
                    link: "",
                    isActive: true
                },
                {
                    id: '3',
                    title: "Grief Share: Niagara Life Centre",
                    subtitle: "",
                    content: "Grief Share is a friendly support group of people who will walk alongside you through one of life’s most difficult experiences. Groups meet weekly to help you face these challenges and move toward rebuilding your life.\n\n905-934-0021",
                    icon: "cafe-outline",
                    link: "",
                    isActive: true
                },
                {
                    id: '4',
                    title: "CMHA Ontario Bereavement Program",
                    subtitle: "",
                    content: "Whether you need support for your own grief or you’re supporting someone in theirs, grief is unique and CMHA is available to support you on your journey in a safe and supportive environment.",
                    icon: "medkit-outline",
                    link: "",
                    isActive: true
                },
                {
                    id: '5',
                    title: "Hope for Wellness Helpline",
                    subtitle: "(for Indigenous Peoples)",
                    content: "Available to all Indigenous people across Canada. Experienced and culturally competent counsellors are reachable by telephone and online ‘chat’ 24/7.\n\n1-855-242-3310",
                    icon: "call-outline",
                    link: "",
                    isActive: true
                }
            ]
        },
        crisis_support: {
            resources: [
                { id: '1', name: 'Crisis Outreach (COAST)', color: '#00C2E0', link: 'https://niagara.cmha.ca/brochure/i-am-in-crisis/', isActive: true },
                { id: '2', name: 'Boots on the Ground', color: '#40C4AA', link: 'https://www.bootsontheground.ca/', isActive: true },
                { id: '3', name: 'Distress Centre Niagara', color: '#1B3B8C', link: 'http://www.distresscentreniagara.com/', isActive: true },
                { id: '4', name: 'Pathstone Mental Health', color: '#A5C93F', link: 'https://pathstonementalhealth.ca/', isActive: true },
                { id: '5', name: 'Hope for Wellness', color: '#EE3135', link: 'https://www.hopeforwellness.ca/', isActive: true },
                { id: '6', name: "Jeunesse J'ecoute", color: '#004A41', link: 'https://jeunessejecoute.ca/', isActive: true },
                { id: '7', name: '9-8-8 Suicide Crisis Helpline', color: '#00B5E2', link: 'https://988.ca/', isActive: true },
                { id: '8', name: 'Kids Help Phone', color: '#004F59', link: 'http://www.kidshelpphone.ca/', isActive: true },
                { id: '9', name: 'National Farmers Crisis Line', color: '#BF9B0B', link: 'https://ccaw.ca/national-farmer-wellness-network/', isActive: true }
            ]
        }
    },
    bweic: {
        hero_slider: {
            slides: [
                {
                    id: 'b1',
                    title: 'FROM SURVIVAL TO SOVEREIGNTY',
                    subtitle: 'A Black women–led initiative creating safe spaces for healing, empowerment, and community across Canada.',
                    cta: 'EXPLORE OUR WORK',
                    link: '/about',
                    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=1080&fit=crop&q=80',
                    isActive: true
                },
                {
                    id: 'b2',
                    title: 'HEALING IS POWER',
                    subtitle: 'Trauma-informed conversations and rest-centered practices designed for Black women.',
                    cta: 'JOIN A CIRCLE',
                    link: '/programs',
                    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop&q=80',
                    isActive: true
                },
                {
                    id: 'b3',
                    title: 'RECLAIM YOUR SOVEREIGNTY',
                    subtitle: 'Building meaningful, connected lives through leadership development and community support.',
                    cta: 'OUR MISSION',
                    link: '/about',
                    imageUrl: 'https://images.unsplash.com/photo-1544333323-4416198f1a1c?w=1920&h=1080&fit=crop&q=80',
                    isActive: true
                }
            ]
        },
        coping: {
            resources: [
                {
                    id: 'b1',
                    title: "Healing & Wellness",
                    subtitle: "Safety before visibility",
                    content: "Supporting emotional well-being through trauma-informed dialogue, rest-centered practices, and culturally responsive approaches. We prioritize safe, affirming spaces for recovery.",
                    icon: "heart-outline",
                    link: "",
                    isActive: true
                },
                {
                    id: 'b2',
                    title: "Empowerment & Capacity Building",
                    subtitle: "Healing is power",
                    content: "Building confidence, leadership, and practical skills for navigating work, education, finances, and advocacy spaces with clarity and dignity.",
                    icon: "rocket-outline",
                    link: "",
                    isActive: true
                },
                {
                    id: 'b3',
                    title: "Community & Belonging",
                    subtitle: "Community over competition",
                    content: "Reducing isolation through peer connection, storytelling, and collective care. We foster intergenerational dialogue that builds lasting bonds.",
                    icon: "people-outline",
                    link: "",
                    isActive: true
                },
                {
                    id: 'b4',
                    title: "The Sovereignty Circle",
                    subtitle: "Access over perfection",
                    content: "A support and access hub providing peer support, mentorship matching, and resource navigation for Black women across Canada.",
                    icon: "shield-checkmark-outline",
                    link: "",
                    isActive: true
                }
            ]
        },
        programs: {
            programs: [
                {
                    id: 'b1',
                    title: 'The Sovereignty Circle',
                    description: 'Our core support and access hub. Includes peer support spaces, experience-led mentorship matching, and a curated resource navigation hub linking women to trusted services.',
                    link: '#',
                    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
                    isActive: true
                },
                {
                    id: 'b2',
                    title: 'Healing & Wellness Circles',
                    description: 'Trauma-informed, culturally safe spaces designed for rest and emotional reclamation. Focused on survivors, caregivers, and women rebuilding their lives.',
                    link: '#',
                    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cb000b95?w=800&h=600&fit=crop',
                    isActive: true
                }
            ]
        },
        resources: {
            resources: [
                {
                    id: 'b1',
                    title: "Mentorship Matching Program",
                    description: "Experience-led matching for professional and life pathways, including healthcare, leadership, and entrepreneurship.",
                    type: 'Program',
                    link: "#",
                    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
                    isActive: true
                },
                {
                    id: 'b2',
                    title: "Resource Navigation Hub",
                    description: "A curated guide linking Black women in Canada to trusted mental health, financial, and legal services.",
                    type: 'Hub',
                    link: "#",
                    imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=600&fit=crop',
                    isActive: true
                }
            ]
        },
        understanding: {
            cards: [
                {
                    id: 'b1',
                    title: "Our Mission",
                    description: "To create safe, affirming spaces where Black women in Canada can heal, grow, and reclaim their power—emotionally, economically, and socially—through community, education, advocacy, and storytelling.",
                    items: [
                        { text: "Safety before visibility", link: "" },
                        { text: "Healing is power", link: "" },
                        { text: "Community over competition", link: "" }
                    ],
                    imageUrl: '',
                    backgroundColor: '#C5A059',
                    isActive: true
                },
                {
                    id: 'b2',
                    title: "Our Vision",
                    description: "A Canada where Black women are thriving, supported, and leading with confidence, dignity, and shared purpose.",
                    items: [
                        { text: "Access over perfection", link: "" },
                        { text: "Lived experience matters", link: "" }
                    ],
                    imageUrl: '',
                    backgroundColor: '#1A1A1A',
                    isActive: true
                }
            ]
        },
        "our-story": {
            sections: [
                { id: 's1', title: 'Background & Rationale', content: '<p>Black women in Canada face intersecting challenges related to race, gender, migration, economic inequity, and systemic barriers. BWEIC responds to this gap by offering community-centered, trauma-informed spaces.</p>' }
            ]
        },
        "leadership": {
            sections: [
                { id: 'l1', title: 'Founding Leadership', content: '<p>Our team is composed of dedicated leaders committed to Black women\'s empowerment.</p>' }
            ]
        },
        "board-members": {
            sections: [
                { id: 'bm1', title: 'The Board', content: '<p>Experience-led governance ensuring sustainable growth and safety.</p>' }
            ]
        },
        "partners": {
            sections: [
                { id: 'p1', title: 'Our Partners', content: '<p>Collaborating with organizations across Canada to bridge gaps in care.</p>' }
            ]
        },
        "careers": {
            sections: [
                { id: 'c1', title: 'Join Our Team', content: '<p>Current opportunities at BWEIC will be posted here.</p>' }
            ]
        },
        "healing-wellness": {
            sections: [
                { id: 'hw1', title: 'Healing & Wellness Circles', content: '<p>Trauma-informed conversations, mental health awareness, and rest-centered practices.</p>' }
            ]
        },
        "empowerment": {
            sections: [
                { id: 'e1', title: 'Empowerment & Capacity Building', content: '<p>Leadership development, career confidence, and financial literacy programs.</p>' }
            ]
        },
        "community-belonging": {
            sections: [
                { id: 'cb1', title: 'Community & Belonging', content: '<p>Reducing isolation through peer connection and storytelling.</p>' }
            ]
        },
        "sovereignty-circle": {
            sections: [
                { id: 'sc1', title: 'The Sovereignty Circle Hub', content: '<p>Our core support and access hub for Black women across Canada.</p>' }
            ]
        },
        "videos": {
            sections: [
                { id: 'v1', title: 'Media Highlights', content: '<p>Video recordings of our circles and events.</p>' }
            ]
        },
        "upcoming-events": {
            sections: [
                { id: 'ue1', title: 'Calendar', content: '<p>Join us for our upcoming workshops and healing circles.</p>' }
            ]
        },
        "media-partners": {
            sections: [
                { id: 'mp1', title: 'Press & Media', content: '<p>Partners helping us amplify the voices of Black women.</p>' }
            ]
        },
        "take-action": {
            sections: [
                { id: 'ta1', title: 'How to Get Involved', content: '<p>Attend an event, volunteer, or support our work through donations.</p>' }
            ]
        },
        "blog": {
            sections: [
                { id: 'b1', title: 'BWEIC Insights', content: '<p>Stories and perspectives from our community.</p>' }
            ]
        },
        "shop": {
            sections: [
                { id: 'sh1', title: 'BWEIC Shop', content: '<p>Support our initiative through curated merchandise.</p>' }
            ]
        },
        footer: {
            contact: {
                email: 'contact@bweic-canada.com',
                phone: '+1 (378) 389 0922',
                location: 'Canada'
            }
        }
    },
    elwg: {
        "elwg-home": {
            sections: {
                hero: {
                    heading: "Compassion. Safety. Hope.",
                    content: "Providing safe shelter and support for women and children in Elliot Lake and surrounding areas since 1982.",
                    buttonText: "Get Help Now",
                    buttonUrl: "/contact",
                    images: [{ url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1000", alt: "Support" }],
                    order: 0,
                    enabled: true
                },
                about_teaser: {
                    heading: "Who We Are",
                    content: "The Elliot Lake Women's Group (ELWG) is a non-profit organization that provides emergency shelter, outreach, and transitional support for women and children fleeing domestic violence.",
                    buttonText: "Learn More",
                    buttonUrl: "/about",
                    order: 10,
                    enabled: true
                },
                key_causes: {
                    heading: "Our Key Causes",
                    items: [
                        { title: 'Emergency Shelter', description: 'Safe haven for women and children escaping domestic violence since 1982.', imageUrl: 'https://framerusercontent.com/images/S2szyDjZl6HVsTUqdEE52wFCY0.jpg' },
                        { title: 'Crisis Counselling', description: '24/7 trauma-informed support and advocacy for those in need of immediate healing.', imageUrl: 'https://framerusercontent.com/images/S2szyDjZl6HVsTUqdEE52wFCY0.jpg' },
                        { title: 'Transitional Housing', description: 'Helping survivors rebuild their lives with stable housing and empowerment.', imageUrl: 'https://framerusercontent.com/images/aMqMcWFD0W5muPkbDwu647to5o.jpg' },
                        { title: 'Outreach Services', description: 'Engaging the community with education and hands-on support.', imageUrl: 'https://framerusercontent.com/images/8h67STcNSFwG8XPsCPbjmxeAy6o.jpg' }
                    ],
                    order: 20,
                    enabled: true
                },
                volunteer_section: {
                    heading: "Become a Volunteer",
                    content: "Your time and skills can change lives. Join our network of passionate volunteers and be the force behind positive change.",
                    buttonText: "Join us Today",
                    buttonUrl: "/volunteers",
                    videoUrl: "https://framerusercontent.com/images/NYkc1gtzZFisuhG1zuMYyeFHkmw.jpg", // Using as placeholder for background
                    items: [
                        { title: 'Program Assistants', description: 'Support our community programs by assisting with activities like gardening, baking, arts and crafts.' },
                        { title: 'Fundraising Events', description: 'Play a vital role in organizing and running charity events, galas, and community fundraisers.' },
                        { title: 'In-house Staff', description: 'Support daily operations by helping with administrative tasks, reception duties, and communications.' }
                    ],
                    order: 30,
                    enabled: true
                },
                why_choose_us: {
                    heading: "Why Choose Us?",
                    items: [
                        { number: '01', title: 'Making a real impact', description: 'Our services have helped transform thousands of lives with our programs & advocacy in our community.', icon: 'https://framerusercontent.com/images/Wkt9ioY1cbT5ELBbZBdTV81PTQ.png' },
                        { number: '02', title: 'Transparency you can trust', description: 'Every donation is allocated directly to meaningful causes with complete accountability.', icon: 'https://framerusercontent.com/images/Tx1M0uBJjX9bhV0w1uVRkRxpU.png' },
                        { number: '03', title: 'Strong community support', description: 'Our dedicated volunteers, donors, and partners work together to create change.', icon: 'https://framerusercontent.com/images/c15gn4GpZtSwREp39Mv6ZgNwo.png' }
                    ],
                    order: 40,
                    enabled: true
                },
                impact_quote: {
                    heading: "Our Commitment",
                    content: "Elliot Lake Women's Group empowers women, men & children escaping abuse or crisis with shelter, support and hope 24/7",
                    quote: "Every woman deserves a safe place to call home.",
                    author_name: "Rhea Alert",
                    author_role: "Program Supervisor",
                    buttonText: "Donate Now",
                    buttonUrl: "/donate",
                    order: 50,
                    enabled: true
                }
            }
        },
        "elwg-about": {
            sections: {
                hero: {
                    heading: "Elliot Lake Women's Group",
                    subtitle: "Our Story & Mission",
                    content: "Dedicated to providing safe shelter, supporting healing, and breaking cycles of abuse in the Algoma District since 1982.",
                    images: [{ url: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=1000", alt: "About" }],
                    order: 0,
                    enabled: true
                },
                stats: {
                    heading: "Our Impact",
                    items: [
                        { label: "Women Supported", value: "500+" },
                        { label: "Years of Service", value: "40+" },
                        { label: "Safe Beds", value: "100%" }
                    ],
                    order: 10,
                    enabled: true
                },
                mission: {
                    heading: "Our Mission",
                    content: "Our Mission is to Provide safe shelter, support healing, and break cycles of abuse. We are committed to advocating for and supporting women, men and children in their right to live free from abuse, violence, and oppression.",
                    order: 20,
                    enabled: true
                },
                history: {
                    heading: "A Legacy of Care",
                    content: "The Women’s Crisis Centre (now Maplegate House) was formed as a shelter for abused women in July of 1982. Prior to this, police would bring women and dependents to a volunteer’s home and drive them to the Sault Ste. Marie shelter.",
                    order: 30,
                    enabled: true
                }
            }
        },
        "elwg-programs": {
            sections: {
                hero: {
                    heading: "Our Programs",
                    content: "We offer a comprehensive range of services designed to provide safety, healing, and independence for everyone in our community.",
                    images: [{ url: "https://images.unsplash.com/photo-1509059852496-f3822ae057bf?auto=format&fit=crop&q=80&w=1000", alt: "Programs" }],
                    order: 0,
                    enabled: true
                },
                maplegate: {
                    heading: "MapleGate House",
                    subtitle: "Women's Crisis Centre",
                    content: "Providing secure, emergency shelter for women and their children fleeing domestic violence. A place of healing and new beginnings.",
                    order: 10,
                    enabled: true
                },
                larrys: {
                    heading: "Larry's Place",
                    subtitle: "Emergency Shelter for Men",
                    content: "A safe haven providing emergency shelter and support services specifically for men experiencing crisis or homelessness in the Algoma District.",
                    order: 20,
                    enabled: true
                }
            }
        },
        "elwg-volunteers": {
            sections: {
                hero: {
                    heading: "Our Volunteers",
                    subtitle: "The Heart of ELWG",
                    content: "Our dedicated volunteers are the lifeblood of our organization. From event support to administrative help, every contribution counts.",
                    images: [{ url: "https://images.unsplash.com/photo-1559027615-cd99713b8ac7?auto=format&fit=crop&q=80&w=1000", alt: "Volunteers" }],
                    order: 0,
                    enabled: true
                },
                why_join: {
                    heading: "Why Join Us?",
                    content: "Volunteering with the Elliot Lake Women's Group is more than just giving your time. It's about being part of a compassionate network that provides hope and safety to those who need it most.",
                    order: 10,
                    enabled: true
                }
            }
        },
        "elwg-contact": {
            sections: {
                hero: {
                    heading: "Get In Touch",
                    subtitle: "We Are Here For You",
                    content: "Whether you are in crisis, seeking information, or looking to support our mission, we welcome your connection.",
                    images: [{ url: "https://images.unsplash.com/photo-1577563906417-45a18e000cb0?auto=format&fit=crop&q=80&w=1000", alt: "Contact" }],
                    order: 0,
                    enabled: true
                },
                crisis: {
                    heading: "Crisis Support",
                    content: "Available 24 hours a day, 7 days a week. Call (833) 461-4623",
                    order: 10,
                    enabled: true
                }
            }
        },
        "elwg-donate": {
            sections: {
                hero: {
                    heading: "Support ELWG",
                    subtitle: "Your Gift Matters",
                    content: "Your generous donations directly support our mission of providing safe shelter and healing to those fleeing abuse. Every dollar makes a difference.",
                    images: [{ url: "https://images.unsplash.com/photo-1544027993-37dbfe43562e?auto=format&fit=crop&q=80&w=1000", alt: "Donate" }],
                    order: 0,
                    enabled: true
                },
                impact: {
                    heading: "How Your Gift Helps",
                    content: "Your contribution provides essential resources for women, children, and men in our community who are seeking a safer future.",
                    enabled: true
                }
            }
        }
    },

    noel: {
        home: {
            title: 'Home',
            sections: {
                hero: {
                    heading: 'Mastering the Art of Woodworking',
                    subtitle: 'Custom cabinetry and fine carpentry that transforms your home.',
                    cta: 'View Our Gallery',
                    link: '/portfolio',
                    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2940&auto=format&fit=crop',
                    enabled: true,
                    order: 1
                },
                services: {
                    heading: 'Our Specialized Services',
                    subtitle: 'WHAT WE DO',
                    items: [
                        { title: "High-End Woodworking", desc: "Custom cabinetry, built-in units, and fine finish carpentry that adds timeless value to your home.", image: "/service-woodworking.png" },
                        { title: "Decks & Patios", desc: "Expertly crafted outdoor living spaces designed for relaxation and longevity using premium materials.", image: "/service-decks.png" },
                        { title: "Full Renovations", desc: "Complete home transformations, modernization, and modifications tailored to your lifestyle.", image: "/service-renovations.png" }
                    ],
                    enabled: true,
                    order: 2
                },
                our_story: {
                    heading: 'A Legacy of Craftsmanship',
                    subtitle: 'OUR STORY',
                    content: `<p>Noel’s journey in woodworking began at the age of 15, mastering traditional hand tools in his home country of El Salvador. Twenty-two years ago, he brought that passion to the Kitchener-Waterloo region, establishing a reputation for excellence in the local construction industry.</p><p>With a deep foundation in cabinetmaking and general construction, Noel completed his formal apprenticeship at Conestoga College in 2008. Today, with over 35 years of experience, he combines old-world craftsmanship with modern building standards to deliver results that are both budget-friendly and uncompromising in quality.</p>`,
                    enabled: true,
                    order: 3
                },
                projects: {
                    heading: 'Featured Craftsmanship',
                    subtitle: 'RECENT PROJECTS',
                    enabled: true,
                    order: 4
                },
                reviews: {
                    heading: 'What Our Clients Say',
                    subtitle: 'TESTIMONIALS',
                    enabled: true,
                    order: 5
                }
            }
        },
        services: {
            services: [
                {
                    id: 'svc-exterior',
                    category: 'Exterior Work',
                    title: 'Precision Exterior Solutions',
                    description: 'Protect and beautify your home with premium siding, windows, and structural enhancements.',
                    fullDescription: 'Beyond mere aesthetics, our exterior solutions focus on building a resilient envelope for your home. We specialize in high-performance siding installations, energy-efficient window replacements, and structural enhancements that protect against the harsh Canadian seasons. Our approach combines modern materials with architectural integrity, ensure your home stays maintenance-free for decades while significantly boosting its curb appeal.',
                    image: '/project-exterior.png',
                    beforeImage: 'https://images.unsplash.com/photo-1590060419632-68c37ed55f26?q=80&w=800&auto=format&fit=crop', // Dated exterior
                    afterImage: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?q=80&w=800&auto=format&fit=crop', // Modern exterior
                    order: 1,
                    isActive: true
                },
                {
                    id: 'svc-gardens',
                    category: 'Sustainability',
                    title: 'Food Security & Gardens',
                    description: 'Specialized vegetable gardens and custom yard setups for fresh seasonal produce.',
                    fullDescription: 'Embrace self-sufficiency with a custom-designed edible landscape. We build high-yield cedar garden beds, integrated irrigation systems, and optimized greenhouse structures. Our designs consider soil health, sun orientation, and ease of maintenance, allowing you to harvest fresh, organic produce right in your backyard. We bridge the gap between traditional gardening and expert construction to help you achieve true food sovereignty.',
                    image: '/service-gardens.png',
                    beforeImage: 'https://images.unsplash.com/photo-1558905619-172542012737?q=80&w=800&auto=format&fit=crop', // Empty yard
                    afterImage: 'https://images.unsplash.com/photo-1592150621344-22d7688860bc?q=80&w=800&fit=crop', // Garden beds
                    order: 2,
                    isActive: true
                },
                {
                    id: 'svc-decks',
                    category: 'Decks & Patios',
                    title: 'Outdoor Luxury Living',
                    description: 'Custom-designed decks using the finest materials, built to withstand the elements.',
                    fullDescription: 'A Noel Construction deck is an extension of your primary living space. We use premium cedar and sustainable composite materials to craft multi-level outdoor oasis spaces. Our signature includes hidden fastenting systems, custom-built stairs, and integrated ambient lighting. Every joint is precision-cut to ensure your outdoor sanctuary remains structural and stunning through generations of seasonal changes.',
                    image: '/service-decks.png',
                    beforeImage: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=800&auto=format&fit=crop', // Old deck
                    afterImage: 'https://images.unsplash.com/photo-1590060419632-68c37ed55f26?q=80&w=800&fit=crop', // New deck
                    order: 3,
                    isActive: true
                },
                {
                    id: 'svc-stairs',
                    category: 'Stairs & Railings',
                    title: 'Architectural Staircases',
                    description: 'Custom-built stairs and railings that blend structural integrity with artistic design.',
                    fullDescription: 'Bespoke staircases are the centerpieces of any high-end interior. We specialize in grand architectural stairs and precision railings that combine solid hardwood with modern glass or steel elements. Our process involves detailed structural engineering and traditional joinery techniques, resulting in a safe, silent, and visually arresting transition between the levels of your home.',
                    image: '/project-stairs.png',
                    beforeImage: 'https://images.unsplash.com/photo-1581850518616-bcb81881443e?q=80&w=800&auto=format&fit=crop', // Carpeted stairs
                    afterImage: 'https://images.unsplash.com/photo-1506974210746-9b43936660dc?q=80&w=800&auto=format&fit=crop', // Modern oak stairs
                    order: 4,
                    isActive: true
                },
                {
                    id: 'svc-reno',
                    category: 'Renovations',
                    title: 'Whole-Home Modernization',
                    description: 'Comprehensive renovation services including basement upgrades and interior remodels.',
                    fullDescription: 'Our full-home renovations are holistic transformations. We manage the entire lifecycle from structural modifications to fine interior finishes. Whether it\'s expanding a basement into a luxury executive suite or modernizing a heritage home, we maintain the integrity of the original structure while introducing contemporary efficiencies, high-end materials, and premium aesthetics tailored to your lifestyle.',
                    image: '/service-renovations.png',
                    beforeImage: 'https://images.unsplash.com/photo-1581850518616-bcb81881443e?q=80&w=800&auto=format&fit=crop', // Gutted room
                    afterImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop', // Finished kitchen
                    order: 5,
                    isActive: true
                },
                {
                    id: 'svc-woodworking',
                    category: 'Sustainability',
                    title: 'Traditional Woodworking',
                    description: 'Custom cabinetry and built-in units that add timeless value to your home.',
                    fullDescription: 'True custom cabinetry is about more than just storage; it\'s about defining the soul of a residence. We specialize in traditional dovetail joinery, hand-turned details, and bespoke finishes that highlight the natural grain of premium timbers. From heirloom-quality libraries to modern minimalist kitchens, our woodwork is tailored to the exact dimensions of your life and home.',
                    image: '/service-woodworking.png',
                    beforeImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop', // Raw lumber
                    afterImage: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=800&auto=format&fit=crop', // Finished library
                    order: 6,
                    isActive: true
                }
            ]
        },
        projects: {
            projects: [
                {
                    title: 'Modern Lakeside Deck',
                    category: 'Decks & Patios',
                    description: 'A multi-level cedar deck with integrated lighting and architectural glass railings.',
                    coverImage: '/service-decks.png',
                    client: 'Private Residence',
                    year: '2023',
                    location: 'Kitchener, ON',
                    featured: true,
                    order: 1
                },
                {
                    title: 'Custom Walnut Kitchen',
                    category: 'Woodworking',
                    description: 'Solid walnut cabinetry with dovetail joinery and handmade hardware.',
                    coverImage: '/service-woodworking.png',
                    client: 'Gourmet Chef',
                    year: '2024',
                    location: 'Waterloo, ON',
                    featured: true,
                    order: 2
                }
            ]
        },
        reviews: {
            items: [
                {
                    clientName: 'James Wilson',
                    projectType: 'Full Renovation',
                    rating: 5,
                    quote: 'Noel and his team transformed our outdated kitchen into a modern masterpiece. Their attention to detail is unmatched.',
                    date: '2023-11-15'
                },
                {
                    clientName: 'Sarah Miller',
                    projectType: 'Custom Decking',
                    rating: 5,
                    quote: 'Professional, punctual, and highly skilled. The new deck is exactly what we wanted for our summer hosting.',
                    date: '2024-02-10'
                }
            ]
        },
        about: {
            sections: {
                hero: {
                    heading: 'Over 35 Years of Woodworking Excellence',
                    content: 'Noel Construction specializes in high-end renovation, custom cabinetry, and fine carpentry across the Kitchener-Waterloo region.',
                    enabled: true,
                    order: 1
                },
                our_story: {
                    heading: 'A Journey of Craftsmanship',
                    content: '<p>Our founder, Noel, began his woodworking journey at age 15. For over three decades, he has been dedicated to delivering quality that lasts.</p>',
                    enabled: true,
                    order: 2
                },
                mission: {
                    heading: 'Our Mission',
                    content: 'To provide high-end, budget-friendly construction solutions without compromising on old-world quality or modern standards.',
                    enabled: true,
                    order: 3
                }
            }
        }
    },

    dmlabs: {
        // v1.0.1 - Force Sync
        home: {
            title: 'Home',
            seo: {
                title: 'Digital Maples Labs | Empowering Nonprofits through Tech & AI',
                description: 'We help nonprofits amplify their impact with custom web development, digital marketing, and responsible AI governance.'
            },
            sections: {
                hero: {
                    heading: 'Home',
                    title: 'Empowering You Through Digital Innovation.',
                    subtitle: 'We help small businesses and nonprofits grow online with custom websites, strategic marketing, and powerful software solutions—while also making sure their AI plays nice. From crafting ethical AI policies and auditing for hidden biases to aligning AI with your mission and training teams on responsible AI use, we ensure technology works for you, not against you.',
                    content: '',
                    enabled: true,
                    order: 1
                },
                ticker: {
                    items: [
                        { text: "Websites" },
                        { text: "AI Safety" },
                        { text: "Graphics" },
                        { text: "Cyber Sec" }
                    ],
                    enabled: true,
                    order: 2
                },
                trusted_by: {
                    items: [
                        { name: "Global Health" },
                        { name: "Tech For Good" },
                        { name: "Algoma Foundation" },
                        { name: "Savannah Ridge" },
                        { name: "ONLINE" },
                        { name: "Harboring Greatness" },
                        { name: "Niagara Hope" },
                        { name: "Impact Canada" },
                        { name: "Community First" },
                        { name: "Vision 2030" },
                        { name: "Unity Network" },
                        { name: "Green Earth" }
                    ],
                    enabled: true,
                    order: 3
                },
                who_we_are: {
                    heading: 'Whether you\'re a Startup or budget-driven Non-Profit, we\'re here to help you reach new heights online.',
                    subtitle: '[ WHO WE ARE ]',
                    content: 'At Digital Maples Labs Inc., we specialize in helping nonprofits amplify their impact through modern web development, powerful digital marketing, and smart software solutions. We believe even the smallest organizations can create big change with the right digital tools. With our background in AI Governance, AI Auditing, and AI Alignment, we will be a great partner to companies and non-profits that need to use AI responsibly.',
                    images: [{ url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop', alt: 'Team collaboration' }],
                    missionHeading: 'Our Mission',
                    missionContent: 'At Digital Maples Labs Inc, we believe every nonprofit deserves the right technology to thrive—tech that\'s not only smart but also ethical. Our mission is to bridge the gap between social impact and digital innovation by empowering organizations with custom websites, strategic tools, and responsible AI solutions.',
                    approachHeading: 'Our Approach',
                    approachContent: 'We help nonprofits grow online with custom websites, smart marketing strategies, and powerful software solutions that make an impact. But we don\'t stop there—we also make sure your AI behaves responsibly. Whether it\'s building ethical systems, auditing algorithms for bias, or training your team to use AI wisely.',
                    moreAboutLink: '/about',
                    enabled: true,
                    order: 4
                },
                pricing: {
                    heading: 'Transparent Pricing for Nonprofits',
                    subtitle: 'PRICING PLANS',
                    items: [
                        { name: 'Foundation', price: { monthly: 99, yearly: 79 }, features: ['5-Page Professional Website', 'Trauma-Informed Design', 'Monthly SEO Audit', 'Basic AI Consultation'], cta: 'Get Started', link: '/contact' },
                        { name: 'Acceleration', price: { monthly: 249, yearly: 199 }, isPopular: true, features: ['12-Page Dynamic Website', 'Full AI Governance Audit', 'Algorithm Bias Testing', 'Social Impact Marketing'], cta: 'Most Popular', link: '/contact' },
                        { name: 'Innovation', price: { monthly: 499, yearly: 399 }, features: ['Unlimited Pages', 'Custom AI Software', '24/7 Priority Support', 'Dedicated Success Manager'], cta: 'Contact Us', link: '/contact' }
                    ],
                    enabled: true,
                    order: 5
                },
                final_cta: {
                    heading: 'Get in touch with us to start your nonprofit\'s digital transformation today.',
                    buttonText: 'GET IN TOUCH ↗',
                    buttonLink: '/contact',
                    secondaryText: 'SEE MORE PROJECTS →',
                    secondaryLink: '/portfolio',
                    content: '',
                    enabled: true,
                    order: 6
                }
            }
        },
        about: {
            title: 'About Us',
            seo: {
                title: 'About | Digital Maples Labs Inc.',
                description: 'Learn about our mission to bridge the gap between social impact and digital innovation through ethical tech.'
            },
            sections: {
                hero: {
                    heading: 'About Us',
                    content: 'At Digital Maples Labs, we specialize in helping nonprofits amplify their impact through modern web development, powerful digital marketing, and smart software solutions. We believe even the smallest organizations can create big change with the right digital tools.',
                    enabled: true,
                    order: 1
                },
                mission: {
                    heading: 'Our Mission',
                    content: 'At Digital Maples Labs Inc, we believe every nonprofit deserves the right technology to thrive—tech that\'s not only smart but also ethical. Our mission is to bridge the gap between social impact and digital innovation by empowering organizations with custom websites, strategic tools, and responsible AI solutions.',
                    enabled: true,
                    order: 2
                },
                approach: {
                    heading: 'Our Approach',
                    content: 'We help nonprofits grow online with custom websites, smart marketing strategies, and powerful software solutions that make an impact. But we don\'t stop there—we also make sure your AI behaves responsibly.',
                    enabled: true,
                    order: 3
                },
                stats: {
                    heading: 'By the Numbers',
                    content: '',
                    list: [
                        { label: 'PROJECTS COMPLETED', value: '24+' },
                        { label: 'YEARS OF EXPERIENCE', value: '05+' },
                        { label: 'CLIENT SATISFACTION', value: '99%' }
                    ],
                    enabled: true,
                    order: 4
                },
                values: {
                    heading: 'The principles that drive every pixel we build.',
                    subtitle: 'Our Core Values',
                    items: [
                        { title: 'Impact First', desc: 'We measure our success by the success of your mission. Every line of code is written to amplify your social footprint.', icon: '🎯' },
                        { title: 'Radical Excellence', desc: 'Nonprofits shouldn\'t settle for "good enough". We bring enterprise-grade quality to every budget-driven project.', icon: '💎' },
                        { title: 'Ethical Partnership', desc: 'We don\'t just build for you; we build with you. Transparency and mission-alignment are at the heart of our work.', icon: '🤝' }
                    ],
                    enabled: true,
                    order: 5
                },
                ai_for_good: {
                    heading: 'Responsible AI for Nonprofit Success',
                    subtitle: '[ AI FOR GOOD ]',
                    content: 'AI is changing the world, but it must be handled with care. We help nonprofits implement AI responsibly—auditing for bias, ensuring mission alignment, and training teams to use these powerful tools ethically.',
                    enabled: true,
                    order: 6
                }
            }
        },
        blog: {
            title: 'Just Opinions | Digital Maples Labs Inc.',
            seo: {
                title: 'Just Opinions | Blog | Digital Maples Labs',
                description: 'Expert insights on technology, innovation, and the future of social impact from Digital Maples Labs.'
            },
            sections: {
                hero: {
                    heading: 'Just <span class="text-brand-accent italic">Opinions</span>',
                    content: 'Our expert insights on technology, innovation, and the future of social impact.',
                    enabled: true,
                    order: 1
                }
            }
        },
        services: {
            title: 'What We Do | Digital Maples Labs Inc.',
            seo: {
                title: 'Services | What We Do | Digital Maples Labs',
                description: 'Custom web design, AI governance, and software solutions tailored for nonprofit success.'
            },
            sections: {
                hero: {
                    heading: 'We amplify impact through <span class="text-brand-accent italic">smart tech</span> & ethical innovation.',
                    enabled: true,
                    order: 1
                },
                stats: {
                    list: [
                        { label: 'PROJECTS COMPLETED', value: '24+' },
                        { label: 'YEARS OF EXPERIENCE', value: '05+' },
                        { label: 'CLIENT SATISFACTION', value: '99%' }
                    ],
                    enabled: true,
                    order: 2
                },
                awards: {
                    heading: 'Committed to industry protocols & excellence.',
                    subtitle: '[ RECOGNITIONS ]',
                    items: [
                        { year: "2024", title: "Top AI Safety Partner", body: "Nonprofit Innovation Awards" },
                        { year: "2023", title: "Best Web development Agency", body: "Digital Excellence Awards" },
                        { year: "2023", title: "Social Impact Champion", body: "Community Tech Summit" },
                        { year: "2022", title: "Excellence in UI/UX", body: "Design Forward Awards" }
                    ],
                    enabled: true,
                    order: 3
                }
            },
            services: [
                {
                    id: 'web-design',
                    title: 'Strategic Web Design',
                    description: 'We create professional, accessible, and high-performing websites tailored to your mission\'s specific needs.',
                    features: ['Trauma-Informed UI/UX', 'Accessibility (WCAG 2.1)', 'Enterprise Performance'],
                    imageUrl: 'https://images.unsplash.com/photo-1581291518655-05204481358b?q=80&w=2940&auto=format&fit=crop',
                    icon: '🌐',
                    isFeatured: true,
                    isActive: true,
                    order: 1
                },
                {
                    id: 'ai-governance',
                    title: 'Responsible AI Governance',
                    description: 'Ensure your AI behaves responsibly—auditing for bias, mission alignment, and ethical algorithm design.',
                    features: ['Algorithmic Auditing', 'AI Policy Development', 'Bias Mitigation'],
                    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop',
                    icon: '🤖',
                    isFeatured: true,
                    isActive: true,
                    order: 2
                },
                {
                    id: 'social-impact',
                    title: 'Social Impact Marketing',
                    description: 'Powerful digital marketing strategies designed to amplify your organization\'s voice and reach.',
                    features: ['Campaign Strategy', 'Audience Engagement', 'Data Analytics'],
                    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2978&auto=format&fit=crop',
                    icon: '📣',
                    isFeatured: true,
                    isActive: true,
                    order: 3
                },
                {
                    id: 'software-solutions',
                    title: 'Custom Software Solutions',
                    description: 'Intelligent software built from the ground up to solve your nonprofit\'s most complex operational challenges.',
                    features: ['Scalable Architecture', 'API Integration', 'Secure Data Hubs'],
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?q=80&w=2940&auto=format&fit=crop',
                    icon: '💻',
                    isFeatured: true,
                    isActive: true,
                    order: 4
                }
            ],
            awards: [
                { year: '2024', title: 'Top AI Safety Partner', body: 'Nonprofit Innovation Awards' },
                { year: '2023', title: 'Best Web Development Agency', body: 'Digital Excellence Awards' },
                { year: '2023', title: 'Social Impact Champion', body: 'Community Tech Summit' },
                { year: '2022', title: 'Excellence in UI/UX', body: 'Design Forward Awards' }
            ],
            stats: [
                { label: 'PROJECTS COMPLETED', value: '24+' },
                { label: 'YEARS OF EXPERIENCE', value: '05+' },
                { label: 'CLIENT SATISFACTION', value: '99%' }
            ]
        },

        projects: {
            projects: [
                {
                    id: 'eliot-lake',
                    title: "Elliot Lake Women's Group",
                    category: 'Web Dev',
                    description: 'A secure, accessible platform empowering women through digital resources and community support.',
                    fullDescription: 'The Elliot Lake Women\'s Group required a visual and structural overhaul that prioritized both psychological safety and functional efficiency. We built a platform that enables survivors and advocates to connect securely while navigating high-stakes resources with ease.',
                    objectives: '• Create a trauma-informed UI/UX experience\n• Implement enterprise-grade security for sensitive data\n• Streamline donation and resource management',
                    results: '• 45% increase in resource engagement\n• 2x faster access to emergency contact tools\n• Fully accessible WCAG 2.1 compliant interface',
                    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop',
                    liveUrl: 'https://elwg.ca',
                    isFeatured: true,
                    isActive: true,
                    order: 1
                },
                {
                    id: 'nuvra',
                    title: 'Nuvra',
                    category: 'Web Dev',
                    description: 'A minimal, SEO-friendly Framer template built for furniture studios, interior brands, and design-driven shops.',
                    fullDescription: 'Nuvra is a bespoke e-commerce experience designed for curated furniture brands. We focused on high-fidelity visual storytelling and a frictionless checkout flow.',
                    objectives: '• High-fidelity 3D product previews\n• Performance-first architecture\n• Custom checkout experience',
                    results: '• 30% reduction in cart abandonment\n• 99.9 Lighthouse performance score\n• 2x increase in mobile sales',
                    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2940&auto=format&fit=crop',
                    isFeatured: true,
                    isActive: true,
                    order: 2
                },
                {
                    id: 'savannah',
                    title: 'Savannah',
                    category: 'Digital Strategy',
                    description: 'Harboring Greatness is an author\'s promotional website designed to showcase published works.',
                    fullDescription: 'Savannah Ridge hospitality group needed a digital transformation that reflected their luxury positioning. We redefined their brand identity and booking journey.',
                    objectives: '• Modernize brand visual identity\n• Integrate real-time booking systems\n• Mobile-first customer portal',
                    results: '• 40% growth in direct bookings\n• Revitalized brand perception\n• 50%+ mobile traffic increase',
                    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
                    isFeatured: false,
                    isActive: true,
                    order: 3
                },
                {
                    id: 'ultraview',
                    title: 'UltraView',
                    category: 'AI Solutions',
                    description: 'A high-performance dashboard for data visualization specialists. Designed to handle large datasets.',
                    fullDescription: 'UltraView is the next generation of data ergonomics. We built a platform that translates raw enterprise data into actionable, visual stories using mission-aligned algorithms.',
                    objectives: '• Lower cognitive load for analysts\n• Real-time data synchronization\n• Ethical AI bias auditing',
                    results: '• 60% faster insight generation\n• Reduced operational overhead\n• Zero detected algorithmic bias',
                    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?q=80&w=2940&auto=format&fit=crop',
                    isFeatured: true,
                    isActive: true,
                    order: 4
                },
                {
                    id: 'jekesa',
                    title: 'Jekesa Pfungwa',
                    category: 'Digital Strategy',
                    description: 'Empowering grassroots organizations with networking tools and educational resources.',
                    fullDescription: 'Jekesa Pfungwa Vulingqondo needed a way to coordinate nationwide community efforts. We built a scalable platform rooted in accessibility and community-first design.',
                    objectives: '• Coordinate 50+ local chapters\n• Language-inclusive resource hubs\n• Offline-first data capabilities',
                    results: '• 10k+ active community members\n• Streamlined chapter reporting\n• Significant increase in grassroots funding',
                    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140ec2b?q=80&w=2940&auto=format&fit=crop',
                    isFeatured: false,
                    isActive: true,
                    order: 5
                },
                {
                    id: 'cibc',
                    title: 'CIBC / Vista Travels',
                    category: 'AI Solutions',
                    description: 'An enterprise-grade mobility application for corporate travel management.',
                    fullDescription: 'We partnered with CIBC to redefine corporate mobility. This solution integrates AI travel planning with fintech-grade security for the modern business traveler.',
                    objectives: '• Seamless multi-currency accounting\n• Predictive travel optimization\n• SOC2 compliant security layer',
                    results: '• 25% average travel cost saving\n• 95% user satisfaction rate\n• Reduced expense processing time',
                    imageUrl: 'https://images.unsplash.com/photo-1512428559083-a4979b2b51ff?q=80&w=2940&auto=format&fit=crop',
                    isFeatured: false,
                    isActive: true,
                    order: 6
                },
                {
                    id: 'gourmet',
                    title: 'Gourmet Bites',
                    category: 'E-commerce',
                    description: 'A premium food delivery experience for curated culinary brands.',
                    fullDescription: 'Gourmet Bites is where food-tech meets luxury. We built a bespoke e-commerce platform that handles high-volume orders while maintaining a white-glove aesthetic.',
                    objectives: '• Dynamic real-time order tracking\n• Curated culinary catalog system\n• High-conversion checkout flow',
                    results: '• 3x increase in recurring customers\n• 4.9 average customer rating\n• Efficient multi-vendor logistics',
                    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940&auto=format&fit=crop',
                    isFeatured: false,
                    isActive: true,
                    order: 7
                }
            ]
        },
        articles: {
            articles: [
                {
                    id: 'future-of-ai',
                    title: 'The Future of AI: Opportunities and Challenges',
                    slug: 'the-future-of-ai-opportunities-and-challenges',
                    category: 'Inspiration',
                    date: '2024-04-01',
                    imageUrl: 'https://images.unsplash.com/photo-1677442135703-3ee67f47e3e5?q=80&w=2940&auto=format&fit=crop',
                    excerpt: 'Exploring the transformative potential of artificial intelligence and the ethical considerations that come with it.',
                    content: '<h2>The AI Revolution</h2><p>Artificial intelligence is no longer a futuristic concept; it is reshaping every industry at an unprecedented pace. From healthcare diagnostics to personalized education, the opportunities for innovation are vast. However, with great power comes the substantial responsibility of ethical deployment.</p><h3>Defining Human-Centric AI</h3><p>At Digital Maples Labs, we believe that technology should serve humanity. Human-centric AI focuses on systems that amplify human capabilities rather than replace them. This involves designing interfaces that are intuitive and ensuring that the underlying algorithms prioritized transparency and fairness.</p><h3>The Ethical Imperative</h3><p>The key is not to fear AI, but to understand it deeply enough to deploy it responsibly. This means auditing for algorithmic bias, ensuring data privacy, and maintaining clear accountability for AI-driven decisions. As we move forward, the most successful organizations will be those that align their technological advancement with core human values.</p><p>Ultimately, the future of AI depends on our collective ability to foster trust through transparency and to use these tools to solve the world\'s most pressing challenges.</p>',
                    published: true,
                    order: 1
                },
                {
                    id: 'resilient-business',
                    title: 'Strategies for Building a Resilient Business',
                    slug: 'strategies-for-building-a-resilient-business',
                    category: 'Creative',
                    date: '2024-03-15',
                    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop',
                    excerpt: 'How to navigate uncertainty and build a business that can withstand and thrive in changing times.',
                    content: '<h2>Building for Tomorrow</h2><p>Business resilience is more than just surviving hard times—it\'s about architecting your organization to adapt, pivot, and thrive regardless of external shocks. In an era of constant change, the ability to respond to disruption is a critical competitive advantage.</p><h3>Digital Agility as a Foundation</h3><p>The most resilient companies we\'ve worked with share one common trait: they invested in digital infrastructure before they actually needed it. Digital agility allows for rapid shifts in operational models, enabling businesses to reach customers through new channels almost overnight. This involves cloud-based collaboration tools, robust data analytics, and scalable e-commerce platforms.</p><h3>The Human Element</h3><p>Resilience is not just about technology; it\'s about culture. A resilient business fosters an environment where employees feel empowered to innovate and take calculated risks. Strategic communication and transparent leadership are essential for maintaining morale during uncertain periods.</p><p>By combining technological maturity with a flexible, supportive internal culture, businesses can transform challenges into opportunities for growth and long-term sustainability.</p>',
                    published: true,
                    order: 2
                },
                {
                    id: 'effective-communication',
                    title: 'The Art of Effective Communication in the Workplace',
                    slug: 'the-art-of-effective-communication-in-the-workplace',
                    category: 'Innovation',
                    date: '2024-02-28',
                    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop',
                    excerpt: 'Mastering the interpersonal skills necessary for clear, impactful, and collaborative professional environments.',
                    content: '<h2>Communication as a Core Competency</h2><p>In the digital age, how we communicate defines how we succeed. Clear, empathetic, and intentional communication is no longer a soft skill—it\'s a strategic capability that separates high-performing teams from the rest. As workplaces become increasingly distributed, the quality of our interactions becomes even more paramount.</p><h3>Active Listening and Empathy</h3><p>True communication is a two-way street. It begins with active listening—the practice of fully concentrating, understanding, and responding to what is being said. Empathy allows leaders and team members to navigate conflicting perspectives and build a foundation of mutual respect and trust.</p><h3>Digital Literacy in Communication</h3><p>Mastering the art of workplace communication also means understanding the nuances of different digital platforms. Knowing when to send a quick message versus scheduling a video call can significantly impact team efficiency and relationship building. Clarity in written communication is particularly crucial in preventing misunderstandings.</p><p>By prioritizing intentionality and empathy in every interaction, organizations can foster a collaborative culture that drives innovation and employee satisfaction.</p>',
                    published: true,
                    order: 3
                },
                {
                    id: 'digital-transformation',
                    title: 'Digital Transformation: Navigating the New Normal',
                    slug: 'digital-transformation-navigating-the-new-normal',
                    category: 'Innovation',
                    date: '2024-02-01',
                    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop',
                    excerpt: 'Adapting to the digital age requires more than just new tech—it requires a fundamental shift in strategy.',
                    content: '<h2>Beyond the Tech Stack</h2><p>Digital transformation is often misunderstood as a simple technology project. In reality, it\'s a fundamental cultural shift that technology merely enables. Organizations that succeed don\'t just adopt new software—they rethink how they create value for the people they serve in a digital-first world.</p><h3>Strategic Alignment</h3><p>The journey begins with strategic alignment. Every technological investment should directly support the organization\'s core mission and goals. This requires a deep understanding of customer journeys and operational bottlenecks that can be solved through innovation. It\'s about being "digital-ready" at every level of the organization.</p><h3>Overcoming Resistance to Change</h3><p>Transformation is often met with resistance. Successful leaders prioritize change management, ensuring that every team member understands the "why" behind the shift and receives the necessary training to thrive in the new environment. Continuous learning and adaptation are the hallmarks of a digitally mature organization.</p><p>Ultimately, digital transformation is a continuous process of evolution that allows organizations to remain relevant and impactful in an ever-changing landscape.</p>',
                    published: true,
                    order: 4
                },
                {
                    id: 'remote-teams',
                    title: 'Unlocking the Secrets of Successful Remote Teams',
                    slug: 'unlocking-the-secrets-of-successful-remote-teams',
                    category: 'Inspiration',
                    date: '2024-01-15',
                    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop',
                    excerpt: 'Key principles for managing distributed teams effectively in a globalized workforce.',
                    content: '<h2>The Remote-First Mindset</h2><p>Remote work is not a compromise—it\'s a massive competitive advantage when executed correctly. The teams we\'ve seen succeed in distributed environments share common practices: asynchronous-first communication, radical documentation, and deep trust in process over presence.</p><h3>Trust and Accountability</h3><p>In a remote setting, visibility into "hours worked" is replaced by visibility into "outcomes achieved." This transition requires a high level of trust and clear accountability frameworks. Managers must shift from monitoring tasks to supporting the growth and productivity of their team members.</p><h3>Building Culture Across Distances</h3><p>Creating a sense of belonging in a remote team requires intentionality. Regular virtual huddles, informal digital social spaces, and clear shared values help maintain a cohesive culture. Using the right collaboration tools—from project management platforms to instant messaging—is essential for keeping everyone aligned and engaged.</p><p>When done right, remote work allows organizations to tap into global talent and offers employees the flexibility to build lives and careers that truly integrate.</p>',
                    published: true,
                    order: 5
                },
                {
                    id: 'emotional-intelligence',
                    title: 'The Power of Emotional Intelligence in Leadership',
                    slug: 'the-power-of-emotional-intelligence-in-leadership',
                    category: 'Creative',
                    date: '2024-01-02',
                    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop',
                    excerpt: 'Why EQ is becoming the most critical asset for leaders in today\'s high-pressure environments.',
                    content: '<h2>Leading with Empathy</h2><p>Technical skills might get you hired, but emotional intelligence (EQ) is what gets you promoted—and keeps your team truly engaged. In an era of increasing automation, the uniquely human capacity to understand, motivate, and connect with others is becoming the ultimate leadership differentiator.</p><h3>The Components of EQ</h3><p>Emotional intelligence consists of self-awareness, self-regulation, motivation, empathy, and social skills. A leader who can recognize their own emotional triggers and understand those of their team members is far better equipped to navigate high-pressure situations and resolve conflicts effectively.</p><h3>Fostering Psychological Safety</h3><p>Leaders with high EQ prioritize psychological safety—the belief that one will not be punished for making a mistake or speaking up. This environment encourages innovation, as team members feel safe to share diverse ideas and challenge the status quo. It leads to higher levels of collaboration and a more resilient, committed workforce.</p><p>By investing in the emotional growth of their leaders, organizations can create a culture of empathy and excellence that drives long-term success.</p>',
                    published: true,
                    order: 6
                }
            ]
        }
    },
    phcg: {
        home: {
            title: 'Private Home Care Guru',
            sections: {
                hero: {
                    badge: "Professional Care at Home",
                    title: "Compassionate Home Care for Your Loved Ones",
                    subtitle: "Providing expert nursing and PSW services in the comfort of your home. Your health and dignity are our top priority.",
                    primaryButton: "Our Services",
                    secondaryButton: "Book Consultation",
                    imageUrl: "https://images.unsplash.com/photo-1576765608870-67b5e2ef2db0?q=80&w=1920&h=1080&fit=crop",
                    enabled: true
                }
            }
        },
        hero_slider: {
            slides: [
                {
                    id: 'ph1',
                    title: 'Compassionate Home Care for Your Loved Ones',
                    subtitle: 'Professional PSW and nursing services tailored to your needs in the comfort of home.',
                    cta: 'View Services',
                    link: '/services',
                    imageUrl: 'https://images.unsplash.com/photo-1576765608870-67b5e2ef2db0?q=80&w=1920&h=1080&fit=crop',
                    isActive: true
                },
                {
                    id: 'ph2',
                    title: 'Your Health, Our Priority',
                    subtitle: 'Our team of RNs and RPNs provide expert medical care right at your doorstep.',
                    cta: 'Book Consultation',
                    link: '/#appointment',
                    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1920&h=1080&fit=crop',
                    isActive: true
                }
            ]
        }
    },
    aitasol: {
        home: {
            title: 'Home',
            sections: {
                hero: {
                    badge: "Trusted by 5,000+ Students",
                    title: "Your Journey to Global Education Starts Here",
                    subtitle: "Unlock world-class opportunities with expert guidance. We help you navigate applications, visas, and scholarships for the world's top universities.",
                    primaryButton: "Free Consultation",
                    secondaryButton: "Explore Destinations",
                    primaryLink: "/contact",
                    secondaryLink: "/destinations",
                    imageUrl: "/hero-bg.png",
                    enabled: true
                },
                stats: {
                    heading: "Our Impact",
                    items: [
                        { label: "Students Placed", value: "5,000+", color: "text-blue-600", bg: "bg-blue-50", icon: "Users" },
                        { label: "Partner Universities", value: "500+", color: "text-amber-600", bg: "bg-amber-50", icon: "Landmark" },
                        { label: "Destinations", value: "15+", color: "text-emerald-600", bg: "bg-emerald-50", icon: "Globe" },
                        { label: "Visa Success Rate", value: "98%", color: "text-rose-600", bg: "bg-rose-50", icon: "CheckCircle2" }
                    ],
                    enabled: true
                },
                process: {
                    heading: "How We Help You Succeed",
                    subtitle: "A simplified, transparent four-step process to take you from your initial inquiry to your dream university.",
                    items: [
                        { title: "Free Inquiry", desc: "Submit your details and get an initial free consultation from our experts.", color: "bg-blue-600", icon: "MessageSquare" },
                        { title: "Counseling", desc: "One-on-one sessions to finalize your course, university, and destination.", color: "bg-amber-600", icon: "ClipboardCheck" },
                        { title: "Application", desc: "We manage your entire application process and documentation with precision.", color: "bg-emerald-600", icon: "GraduationCap" },
                        { title: "Visa & Departure", desc: "Secure your student visa and prepare for your exciting new journey.", color: "bg-primary", icon: "Plane" }
                    ],
                    enabled: true
                },
                testimonials: {
                    heading: "What Our Students Say",
                    subtitle: "Join thousands of successful students who have started their international education journey with Aitasol.",
                    items: [
                        { name: "Sarah Johnson", university: "University of Toronto", country: "Canada", program: "Master of Computer Science", quote: "Aitasol made my dream of studying in Canada a reality. Their expert guidance on documentation and visa was flawless.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
                        { name: "Ahmed Raza", university: "Imperial College London", country: "UK", program: "MSc in Data Science", quote: "The personalized counseling sessions helped me choose the right program that aligned perfectly with my career goals.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" }
                    ],
                    enabled: true
                },
                cta: {
                    heading: "Ready to Start Your Global Success Story?",
                    subtitle: "Don't navigate the complex world of international education alone. Let our experts guide you every step of the way.",
                    primaryButton: "Book Free Consultation",
                    secondaryButton: "WhatsApp Us",
                    primaryLink: "/contact",
                    whatsappNumber: "1234567890",
                    enabled: true
                }
            }
        },
        about: {
            sections: {
                hero: {
                    heading: "About ASEC",
                    subtitle: "Aitah Solutions Education Consultancy(ASEC) is dedicated to helping students achieve their dreams of studying internationally.",
                    content: `<h3>Who We Are</h3><p>Aitah Solutions Educational Consultancy was founded in 2019 with a clear purpose: to provide ethical, realistic, and student-focused education guidance in an industry often driven by volume rather than outcomes.</p><p>We recognized that many students make costly education decisions based on incomplete information, unrealistic expectations, or pressure to apply quickly. ASEC was created to slow that process down, replacing guesswork with structured advising and transparency.</p>`,
                    enabled: true,
                    images: [{ url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&fit=crop", alt: "About ASEC" }],
                    order: 0
                },
                who_we_are: {
                    heading: "Who We Are",
                    subtitle: "OUR FOUNDATION",
                    content: `<p>Aitah Solutions Educational Consultancy was founded in 2019 with a clear purpose: to provide ethical, realistic, and student-focused education guidance in an industry often driven by volume rather than outcomes.</p><p>We recognized that many students make costly education decisions based on incomplete information, unrealistic expectations, or pressure to apply quickly. ASEC was created to slow that process down, replacing guesswork with structured advising and transparency.</p>`,
                    enabled: true,
                    images: [{ url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&fit=crop", alt: "Who We Are" }],
                    order: 5
                },
                mission_statement: {
                    heading: "Mission Statement",
                    subtitle: "OUR STORY",
                    content: `<p>Aitah Solutions Educational Consultancy exists to provide ethical, informed, and student-centered guidance for individuals pursuing international education pathways. Our mission is to support students in making academically sound, financially realistic, and career-aligned study decisions through transparent advising and evidence-based recommendations.</p>`,
                    enabled: true,
                    images: [{ url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&fit=crop", alt: "Mission Statement" }],
                    order: 10
                },
                philosophy: {
                    heading: "Our Philosophy",
                    subtitle: "OUR APPROACH",
                    content: `<p>We believe that:</p><ul><li>Not every student should apply immediately</li><li>Not every program is the right fit</li><li>Not every opportunity leads to long-term success</li></ul><p>Our advisors focus on student readiness, not just eligibility. This means discussing risks, limitations, alternative pathways, and timing, even when those conversations are uncomfortable.</p>`,
                    enabled: true,
                    images: [{ url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&fit=crop", alt: "Our Philosophy" }],
                    order: 20
                },
                how_we_work: {
                    heading: "How We Work",
                    subtitle: "OUR PROCESS",
                    content: `<p>We guide students through:</p><ul><li>Evaluating academic and career goals</li><li>Understanding institutional and program requirements</li><li>Navigating application and documentation processes</li><li>Exploring scholarships and funding responsibly</li><li>Preparing for arrival and transition</li></ul><p>Where immigration advice is required, we refer students to licensed immigration professionals, maintaining clear professional boundaries.</p>`,
                    enabled: true,
                    images: [{ url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&fit=crop", alt: "How We Work" }],
                    order: 30
                },
                commitment: {
                    heading: "Our Commitment",
                    subtitle: "OUR PROMISE",
                    content: `<p>We are committed to the success and well-being of every student we serve. Our focus is on long-term educational outcomes and career success, not just short-term placements.</p><ul><li>Transparency over promises</li><li>Guidance over guarantees</li><li>Long-term outcomes over short-term placements</li></ul>`,
                    enabled: true,
                    images: [{ url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&fit=crop", alt: "Our Commitment" }],
                    order: 40
                },
                values: {
                    heading: "Core Values",
                    subtitle: "What Drives Us",
                    enabled: true,
                    order: 50,
                    items: [
                        { title: "Ethical Practice", desc: "We operate within clearly defined professional boundaries. We do not guarantee admissions, visas, or funding outcomes, and we avoid misrepresentation at all stages.", icon: "ShieldCheck" },
                        { title: "Student-Centered", desc: "Our recommendations are based on student readiness, academic history, financial capacity, and long-term goals—not institutional pressure or commission incentives.", icon: "Users" },
                        { title: "Transparency", desc: "We communicate risks, limitations, timelines, and alternatives openly, even when that means advising a student to delay or reconsider applying.", icon: "Eye" },
                        { title: "Evidence-Informed", desc: "Our advising reflects current admission standards, institutional requirements, and employability trends rather than assumptions or outdated practices.", icon: "Search" },
                        { title: "Collaboration", desc: "We collaborate with accredited institutions, education platforms, and licensed immigration professionals while maintaining independence in academic advising.", icon: "Globe" }
                    ]
                },
                cta: {
                    heading: "Ready to Begin Your Journey?",
                    content: "Let us help you navigate the path to your dream university.",
                    buttonText: "Start Application",
                    buttonUrl: "/apply",
                    secondaryButtonText: "Contact Us",
                    secondaryButtonUrl: "/contact",
                    enabled: true,
                    order: 60
                }
            }
        },
        contact: {
            hero: {
                title: "Contact Us",
                subtitle: "GET IN TOUCH",
                description: "Whether you have questions about programs, institutions, or our guidance process, our team is ready to support your journey."
            },
            info: {
                address: "Aitah Solutions Educational Consultancy\nBased in Kitchener, ON\nServing Students Globally",
                hours: [
                    { label: "Monday - Friday", value: "9:00 AM - 5:00 PM", note: "EST" },
                    { label: "Saturday", value: "10:00 AM - 2:00 PM", note: "By Appointment" }
                ],
                appointment_only: true,
                disclaimer: "Please note that we provide educational consultancy. For immigration-specific advice, we will refer you to our licensed partners."
            },
            form_fields: [
                { id: "name", label: "Full Name", type: "text", required: true },
                { id: "email", label: "Email Address", type: "email", required: true },
                { id: "phone", label: "Phone Number", type: "tel", required: false },
                { id: "interest", label: "Interested Destination", type: "select", options: ["Canada", "USA", "UK", "Australia", "Europe", "Other"], required: true },
                { id: "message", label: "How can we help?", type: "textarea", required: true }
            ],
            enabled: true
        },
        hero_slider: {
            slides: [
                {
                    id: 'a1',
                    title: 'Your Journey to Global Education Starts Here',
                    subtitle: 'Expert guidance for study abroad opportunities in the world\'s top destinations.',
                    cta: 'Free Consultation',
                    link: '/contact',
                    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&h=1080&fit=crop',
                    isActive: true
                },
                {
                    id: 'a2',
                    title: 'Unlock Your Potential at World-Class Universities',
                    subtitle: 'From application to visa, we support you every step of the way.',
                    cta: 'Explore Destinations',
                    link: '/destinations',
                    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?q=80&w=1920&h=1080&fit=crop',
                    isActive: true
                }
            ]
        },
        services: [
            { 
                id: 's1', 
                slug: 'program-institution-selection', 
                title: 'Program & Institution Selection', 
                shortDescription: 'Comprehensive guidance to identify academic options aligning with your goals.', 
                longDescription: 'Aitasol Educational Consultancy provides structured program and institution selection services designed to support students in identifying academic options that align with their educational background, career objectives, financial capacity, and long-term plans. Our process begins with a comprehensive student assessment, which includes academic history, prior qualifications, language proficiency, professional experience, financial preparedness, and post-study goals. We assist students in understanding the differences between universities, colleges, pathway programs, and graduate certificates, clarifying how each option may impact employability and further education opportunities.',
                icon: 'GraduationCap', 
                imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&fit=crop',
                benefits: [
                    "Comprehensive analysis of your options",
                    "Personalized roadmap for success",
                    "Expert guidance on documentation",
                    "Ongoing support until arrival",
                ],
                process: [
                    { title: "Strategy", desc: "We build a personalized roadmap aligned with your long-term goals." },
                    { title: "Verification", desc: "Thorough review of all documents to ensure 100% compliance." },
                    { title: "Support", desc: "Ongoing assistance from application to arrival and settlement." },
                ],
                order: 1, 
                isActive: true 
            },
            { 
                id: 's2', 
                slug: 'application-process-support', 
                title: 'Application Process Support', 
                shortDescription: 'Seamless navigation through administrative requirements and deadlines.', 
                longDescription: 'Aitasol Educational Consultancy provides application process support to assist students in navigating the administrative and procedural requirements of applying to international education institutions. Our role includes explaining institutional application procedures, intake timelines, documentation requirements, and submission processes. We assist students in organizing required materials, understanding conditional offers, and tracking application progress. We emphasize accuracy and consistency, as discrepancies can lead to complications. This service prioritizes clarity, organization, and compliance.',
                icon: 'FileText', 
                imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&fit=crop',
                benefits: [
                    "Comprehensive analysis of your options",
                    "Personalized roadmap for success",
                    "Expert guidance on documentation",
                    "Ongoing support until arrival",
                ],
                process: [
                    { title: "Strategy", desc: "We build a personalized roadmap aligned with your long-term goals." },
                    { title: "Verification", desc: "Thorough review of all documents to ensure 100% compliance." },
                    { title: "Support", desc: "Ongoing assistance from application to arrival and settlement." },
                ],
                order: 2, 
                isActive: true 
            },
            { 
                id: 's3', 
                slug: 'admissions-documentation', 
                title: 'Admissions Documentation', 
                shortDescription: 'Expert assistance in crafting High-quality SOPs, CVs, and transcripts.', 
                longDescription: 'Admissions documentation is a critical component of successful applications. We assist students in understanding the purpose and structure of key documents such as Statements of Purpose, letters of intent, CVs/resumés, and academic transcripts. Our approach focuses on clarity, honesty, and relevance rather than exaggerated claims. We also provide document review services to identify issues related to formatting, clarity, tone, and completeness, ensuring your profile stands out to admissions officers.',
                icon: 'FileCheck', 
                imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1200&fit=crop',
                benefits: [
                    "Comprehensive analysis of your options",
                    "Personalized roadmap for success",
                    "Expert guidance on documentation",
                    "Ongoing support until arrival",
                ],
                process: [
                    { title: "Strategy", desc: "We build a personalized roadmap aligned with your long-term goals." },
                    { title: "Verification", desc: "Thorough review of all documents to ensure 100% compliance." },
                    { title: "Support", desc: "Ongoing assistance from application to arrival and settlement." },
                ],
                order: 3, 
                isActive: true 
            },
            { 
                id: 's4', 
                slug: 'scholarships-funding', 
                title: 'Scholarships & Funding', 
                shortDescription: 'Financial planning guidance to make your education affordable.', 
                longDescription: 'Aitasol Educational Consultancy provides guidance on scholarships, institutional funding options, and education-related financial planning. We assist students in identifying scholarships offered by institutions and recognized organizations, explaining eligibility criteria and application timelines. For students exploring education financing options, we provide general information on eligibility considerations and repayment awareness. This service emphasizes realistic financial planning and understanding the full cost of study.',
                icon: 'DollarSign', 
                imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200&fit=crop',
                benefits: [
                    "Comprehensive analysis of your options",
                    "Personalized roadmap for success",
                    "Expert guidance on documentation",
                    "Ongoing support until arrival",
                ],
                process: [
                    { title: "Strategy", desc: "We build a personalized roadmap aligned with your long-term goals." },
                    { title: "Verification", desc: "Thorough review of all documents to ensure 100% compliance." },
                    { title: "Support", desc: "Ongoing assistance from application to arrival and settlement." },
                ],
                order: 4, 
                isActive: true 
            },
            { 
                id: 's5', 
                slug: 'career-counselling', 
                title: 'Career Counselling', 
                shortDescription: 'Aligning your education choices with long-term employability.', 
                longDescription: 'Career counselling at Aitasol focuses on aligning education choices with long-term employability and personal capacity. Students are guided through structured discussions about career interests, market trends, transferable skills, and realistic outcomes of chosen programs. We assist students in understanding how different qualifications may impact employment opportunities and further study pathways, ensuring your educational investment yields the best possible career returns.',
                icon: 'Briefcase', 
                imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea86c1e?q=80&w=1200&fit=crop',
                benefits: [
                    "Comprehensive analysis of your options",
                    "Personalized roadmap for success",
                    "Expert guidance on documentation",
                    "Ongoing support until arrival",
                ],
                process: [
                    { title: "Strategy", desc: "We build a personalized roadmap aligned with your long-term goals." },
                    { title: "Verification", desc: "Thorough review of all documents to ensure 100% compliance." },
                    { title: "Support", desc: "Ongoing assistance from application to arrival and settlement." },
                ],
                order: 5, 
                isActive: true 
            },
            { 
                id: 's6', 
                slug: 'immigration-pre-arrival', 
                title: 'Immigration & Pre-Arrival', 
                shortDescription: 'Trusted referrals and support for a smooth transition to Canada.', 
                longDescription: 'We connect students with trusted, licensed immigration consultants for immigration-related matters and provide pre-arrival guidance such as travel preparation and arrival coordination. From housing tips to understanding initial settlement needs, we guide you through the logistics of moving to a new country so you can focus on your studies from day one. Our pre-arrival support ensures you are prepared for landing and smooth integration.',
                icon: 'Plane', 
                imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=1200&fit=crop',
                benefits: [
                    "Comprehensive analysis of your options",
                    "Personalized roadmap for success",
                    "Expert guidance on documentation",
                    "Ongoing support until arrival",
                ],
                process: [
                    { title: "Strategy", desc: "We build a personalized roadmap aligned with your long-term goals." },
                    { title: "Verification", desc: "Thorough review of all documents to ensure 100% compliance." },
                    { title: "Support", desc: "Ongoing assistance from application to arrival and settlement." },
                ],
                order: 6, 
                isActive: true 
            }
        ],
        destinations: [
            { 
                id: 'd1', 
                country: 'Canada', 
                slug: 'canada', 
                flagEmoji: '🇨🇦', 
                heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&fit=crop', 
                description: 'Canada is one of the most popular destinations for international students, offering high-quality education, a welcoming culture, and excellent post-study work opportunities.', 
                highlights: [
                    "Top-ranked universities globally",
                    "Affordable tuition compared to USA/UK",
                    "Post-Graduation Work Permit (PGWP) eligibility",
                    "Safe and multicultural environment",
                ],
                stats: {
                    universities: "90+",
                    avgCost: "$15,000 - $30,000 / year",
                    livingExp: "$10,000 - $15,000 / year",
                    visaSuccess: "95%+",
                },
                popularCities: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
                requirements: [
                    "Academic Transcripts",
                    "IELTS/TOEFL Scores",
                    "Statement of Purpose (SOP)",
                    "Proof of Funds",
                ],
                isActive: true, 
                order: 1 
            },
            { 
                id: 'd2', 
                country: 'United Kingdom', 
                slug: 'uk', 
                flagEmoji: '🇬🇧', 
                heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&fit=crop', 
                description: 'The UK is home to some of the world\'s oldest and most prestigious universities. A degree from the UK is recognized globally and offers a unique cultural experience.', 
                highlights: [
                    "Global academic reputation",
                    "Shorter degree durations (3-yr UG, 1-yr PG)",
                    "Graduate Route visa (2 years post-study)",
                    "Rich history and culture",
                ],
                stats: {
                    universities: "160+",
                    avgCost: "£12,000 - £25,000 / year",
                    livingExp: "£9,000 - £12,000 / year",
                    visaSuccess: "98%+",
                },
                popularCities: ["London", "Manchester", "Edinburgh", "Birmingham"],
                requirements: [
                    "CAS Letter",
                    "Academic Reference",
                    "IELTS Academic",
                    "Bank Statements",
                ],
                isActive: true,
                order: 2
            },
            {
                id: 'd3',
                country: 'USA',
                slug: 'usa',
                flagEmoji: '🇺🇸',
                heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&fit=crop',
                description: 'The United States boasts many of the world\'s top-ranked universities and offers unparalleled opportunities for research and career growth across all fields.',
                highlights: [
                    "World-renowned Ivy League institutions",
                    "Flexible curriculum and research focus",
                    "OPT (Optional Practical Training) for graduates",
                    "Global hub for tech and innovation",
                ],
                stats: {
                    universities: "4000+",
                    avgCost: "$25,000 - $50,000 / year",
                    livingExp: "$12,000 - $18,000 / year",
                    visaSuccess: "92%+",
                },
                popularCities: ["New York", "Los Angeles", "Chicago", "Boston"],
                requirements: [
                    "SAT/ACT Scores",
                    "TOEFL/IELTS",
                    "Letters of Recommendation",
                    "Financial Verification",
                ],
                isActive: true,
                order: 3
            },
            {
                id: 'd4',
                country: 'Australia',
                slug: 'australia',
                flagEmoji: '🇦🇺',
                heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&fit=crop',
                description: 'Australia offers a high quality of life and world-class education. Its research-led institutions and beautiful environment make it a top choice for students.',
                highlights: [
                    "High standards of living",
                    "Strong focus on research and innovation",
                    "Post-study work rights",
                    "Stunning natural landscapes",
                ],
                stats: {
                    universities: "43",
                    avgCost: "A$20,000 - A$45,000 / year",
                    livingExp: "A$21,041 / year",
                    visaSuccess: "96%+",
                },
                popularCities: ["Sydney", "Melbourne", "Brisbane", "Perth"],
                requirements: [
                    "GTE Requirement",
                    "English Proficiency",
                    "Health Insurance (OSHC)",
                    "Educational Certificates",
                ],
                isActive: true,
                order: 4
            },
            {
                id: 'd5',
                country: 'Germany',
                slug: 'germany',
                flagEmoji: '🇩🇪',
                heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&fit=crop',
                description: 'Germany is a global leader in engineering and technology. Many public universities offer tuition-free education for international students.',
                highlights: [
                    "No or low tuition fees at public universities",
                    "World-class engineering programs",
                    "Strong economy and job prospects",
                    "Central European location",
                ],
                stats: {
                    universities: "380+",
                    avgCost: "€0 - €10,000 / year",
                    livingExp: "€10,000 - €11,000 / year",
                    visaSuccess: "94%+",
                },
                popularCities: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
                requirements: [
                    "University Entrance Qualification",
                    "TestDaF/DSH (for German taught)",
                    "Blocked Account",
                    "Transcript Verification",
                ],
                isActive: true,
                order: 5
            },
            {
                id: 'd6',
                country: 'New Zealand',
                slug: 'new-zealand',
                flagEmoji: '🇳🇿',
                heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&fit=crop',
                description: 'New Zealand is known for its safe environment, friendly people, and globally recognized education system focused on practical learning.',
                highlights: [
                    "Safe and peaceful country",
                    "High-quality educational standards",
                    "Personalized learning environments",
                    "Amazing outdoor activities",
                ],
                stats: {
                    universities: "8",
                    avgCost: "NZ$22,000 - NZ$35,000 / year",
                    livingExp: "NZ$15,000 - NZ$20,000 / year",
                    visaSuccess: "97%+",
                },
                popularCities: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
                requirements: [
                    "Offer of Place",
                    "English Competency",
                    "Medical Certificates",
                    "Character Proof",
                ],
                isActive: true,
                order: 6
            },
            {
                id: 'd7',
                country: 'Ireland',
                slug: 'ireland',
                flagEmoji: '🇮🇪',
                heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=800&fit=crop',
                description: 'Ireland is a hub for multinational companies and offers a rich academic tradition. It is one of the few English-speaking countries in Europe.',
                highlights: [
                    "English-speaking environment",
                    "European hub for tech and pharma",
                    "Friendly and vibrant culture",
                    "Stay-back option (1-2 years)",
                ],
                stats: {
                    universities: "8",
                    avgCost: "€10,000 - €25,000 / year",
                    livingExp: "€10,000 - €12,000 / year",
                    visaSuccess: "95%+",
                },
                popularCities: ["Dublin", "Cork", "Galway", "Limerick"],
                requirements: [
                    "Proof of Enrollment",
                    "English Language Proficiency",
                    "Private Medical Insurance",
                    "Evidence of Funds",
                ],
                isActive: true,
                order: 7
            },
            { 
                id: 'd8', 
                country: 'Malaysia', 
                slug: 'malaysia', 
                flagEmoji: '🇲🇾', 
                heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=800&fit=crop', 
                description: 'Malaysia offers affordable education with international standards. It is a multicultural country with branch campuses of many global universities.', 
                highlights: [
                    "Low cost of living and tuition",
                    "Multicultural and diverse society",
                    "Branch campuses of top universities",
                    "Safe and politically stable",
                ],
                stats: {
                    universities: "20+",
                    avgCost: "$4,000 - $10,000 / year",
                    livingExp: "$3,000 - $5,000 / year",
                    visaSuccess: "98%+",
                },
                popularCities: ["Kuala Lumpur", "Penang", "Johor Bahru", "Selangor"],
                requirements: [
                    "Valid Passport",
                    "Academic Certificates",
                    "Health Declaration",
                    "English Proficiency (optional for some)",
                ],
                isActive: true,
                order: 8
            }
        ],
        universities: [
            { id: 'u1', name: 'University of Toronto', country: 'Canada', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Utoronto_logo.svg/1200px-Utoronto_logo.svg.png', description: 'One of the world\'s top research-intensive universities.', programs: ['Computer Science', 'Engineering', 'Business'], isActive: true },
            { id: 'u2', name: 'University of Melbourne', country: 'Australia', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png', description: 'Australia\'s leading university with a global reputation.', programs: ['Medicine', 'Arts', 'Law'], isActive: true },
            { id: 'u3', name: 'Imperial College London', country: 'UK', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Imperial_College_London_logo.svg/1200px-Imperial_College_London_logo.svg.png', description: 'A world-class university focusing on science, engineering, and medicine.', programs: ['Data Science', 'Physics', 'Mathematics'], isActive: true }
        ]
    }
};

export const SETTINGS_SEED = {
    nspc: {
        siteId: 'nspc',
        branding: {
            logo: '/nspc-logo.png',
            siteName: 'Niagara Suicide Prevention Coalition',
            favicon: '/favicon.ico'
        },
        topBar: {
            enabled: false,
            message: '',
            phone: '',
            email: ''
        },
        theme: {
            primary: '#00A8B4',
            accent: '#A5C93F',
            secondary: '#2C3E50',
            textDark: '#1A1A1A',
            textLight: '#FFFFFF',
            brandColor: '#00A8B4',
            brandColorDark: '#008C96',
            brandColorLight: '#A5C93F',
            topBarBg: '#2C3E50',
            headerBg: '#FFFFFF'
        },
        navigation: [
            { id: 'n1', name: 'Home', path: '/', order: 1 },
            { id: 'n2', name: 'Understanding', path: '/#understanding', order: 2 },
            { id: 'n3', name: 'Coping', path: '/#coping', order: 3 },
            { id: 'n4', name: 'Programs', path: '/#programs', order: 4 },
            { id: 'n5', name: 'Resources', path: '/#resources', order: 5 },
            { id: 'n6', name: 'About Us', path: '/#about', order: 6 }
        ],
        metadata: {
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system'
        }
    },
    bweic: {
        siteId: 'bweic',
        branding: {
            logo: '/logo.png',
            siteName: 'Black Women\'s Empowerment Initiative - Canada',
            favicon: '/favicon.ico'
        },
        topBar: {
            enabled: true,
            message: 'Welcome To BWEIC',
            phone: '+1 (378) 389 0922',
            email: 'contactinfo@gmail.com'
        },
        theme: {
            primary: '#C5A059',
            secondary: '#1A1A1A',
            accent: '#8B7355',
            textDark: '#1B1B1B',
            textLight: '#FFFFFF',
            brandColor: '#C5A059',
            brandColorDark: '#A68746',
            brandColorLight: '#D4B272',
            topBarBg: '#7C2529',
            headerBg: '#FFFFFF'
        },
        navigation: [
            {
                id: 'w1',
                name: 'WHO WE ARE',
                path: '/who-we-are',
                order: 1,
                subItems: [
                    { id: 'w1-1', name: 'Our Story', path: '/our-story', order: 1 },
                    { id: 'w1-2', name: 'Leadership', path: '/leadership', order: 2 },
                    { id: 'w1-3', name: 'Board Members', path: '/board-members', order: 3 },
                    { id: 'w1-4', name: 'Partners', path: '/partners', order: 4 },
                    { id: 'w1-5', name: 'Careers', path: '/careers', order: 5 }
                ]
            },
            {
                id: 'o1',
                name: 'OUR WORK',
                path: '/our-work',
                order: 2,
                subItems: [
                    { id: 'o1-1', name: 'Healing & Wellness', path: '/signature-programs', order: 1 },
                    { id: 'o1-2', name: 'Empowerment & Capacity Building', path: '/special-initiatives', order: 2 },
                    { id: 'o1-3', name: 'Community & Belonging', path: '/policy-research', order: 3 },
                    { id: 'o1-4', name: 'The Sovereignty Circle', path: '/publications', order: 4 }
                ]
            },
            { id: 't1', name: 'TAKE ACTION', path: '/take-action', order: 3 },
            {
                id: 'm1',
                name: 'MEDIA CENTER',
                path: '/media-center',
                order: 4,
                subItems: [
                    { id: 'm1-1', name: 'Videos', path: '/videos', order: 1 },
                    { id: 'm1-2', name: 'Upcoming Events', path: '/upcoming-events', order: 2 },
                    { id: 'm1-3', name: 'Partners', path: '/partners', order: 3 }
                ]
            },
            { id: 'b1', name: 'BLOG', path: '/blogs', order: 5 },
            { id: 's1', name: 'SHOP', path: '/shop', order: 6 }
        ],
        metadata: {
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system'
        }
    },
    noel: {
        siteId: 'noel',
        branding: {
            logo: '/logo.png',
            siteName: 'Noel Construction',
            favicon: '/favicon.ico'
        },
        topBar: {
            enabled: true,
            message: 'Custom Cabinetry & High-End Renovation',
            phone: '+1 (519) 123 4567',
            email: 'noel@construction.ca'
        },
        theme: {
            primary: '#2C3E50',
            secondary: '#E67E22',
            accent: '#BDC3C7',
            textDark: '#1A1A1A',
            textLight: '#FFFFFF',
            brandColor: '#2C3E50',
            brandColorDark: '#1A252F',
            brandColorLight: '#E67E22',
            topBarBg: '#2C3E50',
            headerBg: '#FFFFFF'
        },
        navigation: [
            { id: 'n1', name: 'Home', path: '/', order: 1 },
            { id: 'n2', name: 'Services', path: '/services', order: 2 },
            { id: 'n3', name: 'Portfolio', path: '/portfolio', order: 3 },
            { id: 'n4', name: 'Testimonials', path: '/reviews', order: 4 },
            { id: 'n5', name: 'About', path: '/about', order: 5 },
            { id: 'n6', name: 'Contact', path: '/contact', order: 6 }
        ],
        metadata: {
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system'
        }
    },
    phcg: {
        siteId: 'phcg',
        branding: {
            logo: '/logo.png',
            siteName: 'Private Home Care Guru',
            favicon: '/favicon.ico'
        },
        footer: {
            contact: {
                email: 'info@privatehomecareguru.ca',
                phone: '+1 (123) 456-7890',
                address: 'Serving Ontario, Canada',
                socials: []
            }
        },
        navigation: [
            { id: 'n1', name: 'Home', path: '/', order: 1 },
            { id: 'n2', name: 'Services', path: '/services', order: 2 },
            { id: 'n3', name: 'Contact', path: '/contact', order: 3 }
        ]
    },
    aitasol: {
        siteId: 'aitasol',
        branding: {
            logo: '/logo.svg',
            siteName: 'Aitasol',
            favicon: '/favicon.ico'
        },
        footer: {
            contact: {
                email: 'info@aitasol.com',
                phone: '+1 (123) 456-7890',
                address: '123 Global Way, Education City',
                socials: [
                    { platform: 'Facebook', url: '#' },
                    { platform: 'Instagram', url: '#' },
                    { platform: 'LinkedIn', url: '#' }
                ]
            }
        },
        navigation: [
            { id: 'n1', name: 'Home', path: '/', order: 1 },
            { id: 'n2', name: 'About', path: '/about', order: 2 },
            { id: 'n3', name: 'Destinations', path: '/destinations', order: 3 },
            { id: 'n4', name: 'Services', path: '/services', order: 4 },
            { id: 'n5', name: 'Contact', path: '/contact', order: 5 }
        ]
    }
};
