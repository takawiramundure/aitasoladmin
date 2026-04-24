"use client";

import React, { useState, useEffect } from 'react';
import { Save, Globe, Search, Share2, RefreshCw, Zap } from 'lucide-react';
import { FirestoreService } from "@/services/firestore";
import { useSite } from "@/context/SiteContext";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";

interface PageDef {
    path: string;
    label: string;
    key: string;
}

interface PageSEO {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
    noIndex: boolean;
}

type SEOData = Record<string, PageSEO>;

// All KMFW routes
const KMFW_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/about', label: 'About Us', key: 'about' },
    { path: '/our-story', label: 'Our Story', key: 'our-story' },
    { path: '/meet-our-team', label: 'Meet Our Team', key: 'meet-our-team' },
    { path: '/strategic-plan', label: 'Strategic Plan', key: 'strategic-plan' },
    { path: '/services', label: 'Services (Overview)', key: 'services' },
    { path: '/services/grounded-counseling', label: 'Grounded Counseling', key: 'grounded-counseling' },
    { path: '/services/educational-programs', label: 'Educational Programs', key: 'educational-programs' },
    { path: '/services/advocacy-education', label: 'Advocacy & Education', key: 'advocacy-education' },
    { path: '/services/community-support', label: 'Community Support', key: 'community-support' },
    { path: '/services/system-navigation', label: 'System Navigation', key: 'system-navigation' },
    { path: '/events', label: 'Community Events', key: 'events' },
    { path: '/impact', label: 'Impact (Overview)', key: 'impact' },
    { path: '/impact/newsletters', label: 'Newsletters', key: 'newsletters' },
    { path: '/impact/success-stories', label: 'Success Stories', key: 'success-stories' },
    { path: '/join-us', label: 'Join Us (Overview)', key: 'join-us' },
    { path: '/join-us/careers', label: 'Careers', key: 'careers' },
    { path: '/join-us/volunteer', label: 'Volunteer', key: 'volunteer' },
    { path: '/join-us/funders', label: 'Our Funders', key: 'funders' },
    { path: '/join-us/partners', label: 'Our Partners', key: 'partners' },
    { path: '/research', label: 'Research & Consultancy', key: 'research' },
    { path: '/research/neuro-divergent', label: 'Neuro-Divergent Project', key: 'neuro-divergent' },
    { path: '/black-excellence-gala', label: 'Black Excellence Gala', key: 'gala' },
    { path: '/blog', label: 'Blog', key: 'blog' },
    { path: '/contact', label: 'Contact Us', key: 'contact' },
    { path: '/donate', label: 'Donate', key: 'donate' },
];

// Noel Construction Pages
const NOEL_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/services', label: 'Services (Overview)', key: 'services' },
    { path: '/services/exterior-work', label: 'Exterior Work', key: 'exterior' },
    { path: '/services/sustainability', label: 'Sustainability', key: 'sustainability' },
    { path: '/services/decks-patios', label: 'Decks & Patios', key: 'decks' },
    { path: '/services/stairs-railings', label: 'Stairs & Railings', key: 'stairs' },
    { path: '/services/renovations', label: 'Renovations', key: 'renovations' },
    { path: '/services/eco-solutions', label: 'Eco-Solutions', key: 'eco' },
    { path: '/get-quote', label: 'Get Quote', key: 'quote' },
    { path: '/portfolio', label: 'Portfolio', key: 'portfolio' },
    { path: '/before-after', label: 'Before & After', key: 'before-after' },
    { path: '/reviews', label: 'Reviews', key: 'reviews' },
    { path: '/contact', label: 'Contact', key: 'contact' },
];

// Digital Maples Labs Pages
const DMLABS_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/about', label: 'Who We Are', key: 'about' },
    { path: '/services', label: 'What We Do', key: 'services' },
    { path: '/portfolio', label: 'Our Work', key: 'portfolio' },
    { path: '/blog', label: 'Just Opinions (Blog)', key: 'blog' },
    { path: '/contact', label: 'Get in Touch', key: 'contact' },
];

// Aitasol Pages
const AITASOL_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/about', label: 'About Us', key: 'about' },
    { path: '/services', label: 'Our Services', key: 'services' },
    { path: '/services/university-application', label: 'University Admission', key: 'admission' },
    { path: '/services/visa-assistance', label: 'Visa Assistance', key: 'visa' },
    { path: '/services/scholarship-guidance', label: 'Scholarship Guidance', key: 'scholarship' },
    { path: '/services/sop-cv-review', label: 'SOP & CV Review', key: 'sop' },
    { path: '/services/pre-departure-briefing', label: 'Pre-Departure Briefing', key: 'briefing' },
    { path: '/universities', label: 'Partner Universities', key: 'universities' },
    { path: '/destinations', label: 'Destinations', key: 'destinations' },
    { path: '/destinations/canada', label: 'Study in Canada', key: 'canada' },
    { path: '/destinations/uk', label: 'Study in UK', key: 'uk' },
    { path: '/destinations/usa', label: 'Study in USA', key: 'usa' },
    { path: '/destinations/australia', label: 'Study in Australia', key: 'australia' },
    { path: '/destinations/germany', label: 'Study in Germany', key: 'germany' },
    { path: '/blog', label: 'Blog', key: 'blog' },
    { path: '/careers', label: 'Careers', key: 'careers' },
    { path: '/contact', label: 'Contact Us', key: 'contact' },
    { path: '/apply', label: 'Apply Now', key: 'apply' },
];

// Private Home Care Guru Pages
const PHCG_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/about', label: 'About Us', key: 'about' },
    { path: '/services', label: 'Care Services', key: 'services' },
    { path: '/career', label: 'Join Our Team', key: 'career' },
    { path: '/contact', label: 'Contact', key: 'contact' },
];

// Niagara Suicide Prevention Coalition Pages
const NSPC_PAGES: PageDef[] = [
    { path: '/', label: 'Home', key: 'home' },
    { path: '/about', label: 'Our Mission', key: 'about' },
    { path: '/resources', label: 'Crisis Resources', key: 'resources' },
    { path: '/events', label: 'Community Events', key: 'events' },
    { path: '/contact', label: 'Get in Touch', key: 'contact' },
];

const SITE_PAGES: Record<string, PageDef[]> = {
    kmfw: KMFW_PAGES,
    noel: NOEL_PAGES,
    dmlabs: DMLABS_PAGES,
    aitasol: AITASOL_PAGES,
    phcg: PHCG_PAGES,
    nspc: NSPC_PAGES,
    elwg: [
        { path: '/', label: 'Home', key: 'home' },
        { path: '/about', label: 'About Us', key: 'about' },
        { path: '/programs', label: 'Programs', key: 'programs' },
        { path: '/volunteers', label: 'Volunteers', key: 'volunteers' },
        { path: '/contact', label: 'Contact', key: 'contact' },
        { path: '/donate', label: 'Donate', key: 'donate' },
    ]
};

const NOEL_SEO_SEED: SEOData = {
    'home': {
        title: 'Master Craftsmanship | Noel Construction KW',
        description: 'Noel Construction specializes in luxury renovations, custom woodworking, and sustainable garden solutions in the Kitchener-Waterloo region. 35+ years of experience.',
        keywords: 'Noel Construction, KW renovations, luxury woodworking Kitchener, custom decks Waterloo, sustainable gardening, home additions KW',
        ogTitle: 'Noel Construction – High-End Renovation & Woodworking',
        ogDescription: 'From ground-up builds to intricate residential renovations, we bring your vision to life with precision and safety.',
        ogImage: '',
        twitterTitle: 'Noel Construction | Legacy of Craftsmanship',
        twitterDescription: 'Professional construction services specializing in custom woodworking and premium home transformations.',
        noIndex: false,
    },
    'services': {
        title: 'Our Specialized Services | Custom Renovations & Woodworking',
        description: 'Explore our range of high-end services: from fine finish carpentry and architectural staircases to vegetable garden setups and water management.',
        keywords: 'construction services KW, garden beds installation, basement upgrades Waterloo, master woodworking, food security gardens',
        ogTitle: 'Specialized Construction Services by Noel',
        ogDescription: 'Quality over quantity. We deliver specialized construction services tailored to your lifestyle and needs.',
        ogImage: '',
        twitterTitle: 'Specialized Services | Noel Construction',
        twitterDescription: 'Explore our master-crafted woodworking and modern renovation services.',
        noIndex: false,
    },
    'exterior': {
        title: 'Exterior Construction & Curb Appeal | Noel Construction',
        description: 'Professional exterior renovations, siding, and structural improvements designed to enhance your home’s character and longevity.',
        keywords: 'exterior renovations KW, home siding Waterloo, curb appeal improvements, structural construction',
        ogTitle: 'Exterior Construction Excellence',
        ogDescription: 'Enhance your home’s exterior with our expert craftsmanship and durable solutions.',
        ogImage: '',
        twitterTitle: 'Exterior Work | Noel Construction',
        twitterDescription: 'Premium exterior renovations for modern homes.',
        noIndex: false,
    },
    'sustainability': {
        title: 'Sustainable Building & Green Solutions | Noel Construction',
        description: 'Eco-conscious construction practices focusing on energy efficiency, sustainable materials, and long-term environmental value.',
        keywords: 'sustainable building KW, green construction Waterloo, eco-friendly renovations, energy efficient home',
        ogTitle: 'Sustainable Construction Solutions',
        ogDescription: 'Building for the future with eco-friendly materials and sustainable building practices.',
        ogImage: '',
        twitterTitle: 'Sustainability | Noel Construction',
        twitterDescription: 'Building a greener future through sustainable construction.',
        noIndex: false,
    },
    'decks': {
        title: 'Custom Decks & Premium Patios | Noel Construction',
        description: 'High-end outdoor living spaces, custom cedar decks, and perfectly leveled stone patios in Kitchener-Waterloo.',
        keywords: 'custom decks KW, patio installation Waterloo, cedar decks, outdoor living spaces',
        ogTitle: 'Luxury Decks & Patios',
        ogDescription: 'Master-crafted outdoor spaces designed for relaxation and longevity.',
        ogImage: '',
        twitterTitle: 'Custom Decks | Noel Construction',
        twitterDescription: 'Premium outdoor spaces for your home.',
        noIndex: false,
    },
    'stairs': {
        title: 'Architectural Stairs & Custom Railings | Noel Construction',
        description: 'Specialized finish carpentry for custom staircases, modern railings, and architectural wood details.',
        keywords: 'custom stairs KW, modern railings Waterloo, architectural woodworking, finish carpentry stairs',
        ogTitle: 'Architectural Stairs & Railings',
        ogDescription: 'Transform your interior with custom staircases and precision railing installations.',
        ogImage: '',
        twitterTitle: 'Stairs & Railings | Noel Construction',
        twitterDescription: 'Precision finish carpentry for high-end staircases.',
        noIndex: false,
    },
    'renovations': {
        title: 'High-End Home Renovations | Noel Construction',
        description: 'Complete home transformations, basement finishing, and master-suite renovations with a focus on quality and building code compliance.',
        keywords: 'home renovations KW, basement finishing Waterloo, luxury home updates, construction master',
        ogTitle: 'High-End Renovations & Extensions',
        ogDescription: 'Ground-up renovations that redefine your living space.',
        ogImage: '',
        twitterTitle: 'Premium Renovations | Noel Construction',
        twitterDescription: 'Expert home transformations with 35+ years of experience.',
        noIndex: false,
    },
    'eco': {
        title: 'Eco-Solutions & Food Security Gardens | Noel Construction',
        description: 'Specialized garden setups, raised beds, and local food security solutions designed for urban and residential spaces.',
        keywords: 'food security gardens KW, raised beds Waterloo, eco-solutions gardening, vegetable gardens',
        ogTitle: 'Eco-Solutions & Garden Systems',
        ogDescription: 'Secure your food future with our custom garden setups and eco-friendly outdoor solutions.',
        ogImage: '',
        twitterTitle: 'Eco-Solutions | Noel Construction',
        twitterDescription: 'Building sustainable food systems in your own backyard.',
        noIndex: false,
    },
    'quote': {
        title: 'Get a Professional Quote | Noel Construction KW',
        description: 'Start your high-end renovation project today. Request a professional estimate for custom woodworking, decks, or structural renovations.',
        keywords: 'construction quote KW, renovation estimate Waterloo, request construction services',
        ogTitle: 'Contact Noel Construction for a Quote',
        ogDescription: 'Let’s bring your vision to life. Request a professional consultation and quote.',
        ogImage: '',
        twitterTitle: 'Request a Quote | Noel Construction',
        twitterDescription: 'Start your next project with a master builder.',
        noIndex: false,
    }
};

const DMLABS_SEO_SEED: SEOData = {
    'home': {
        title: 'Digital Maples Labs | Innovating Tech for Social Impact',
        description: 'Digital Maples Labs empowers nonprofits with human-centric AI governance, responsible tech design, and strategic web innovation to scale social impact.',
        keywords: 'Digital Maples Labs, Nonprofit Tech, AI Governance, Responsible AI, Social Impact Marketing, Ethical Web Development, Trauma-Informed Design',
        ogTitle: 'Digital Maples Labs – Innovating Tech for Social Impact',
        ogDescription: 'We build digital solutions that prioritize ethics and accessibility. Discover how we help mission-driven organizations thrive in the age of AI.',
        ogImage: '/images/og-home.jpg',
        twitterTitle: 'Digital Maples Labs | Responsible Tech Innovation',
        twitterDescription: 'From AI audits to high-performance web platforms, we make technology work for social good.',
        noIndex: false,
    },
    'about': {
        title: 'Who We Are | Our Mission & Values | Digital Maples Labs',
        description: 'Meet the team behind DMLabs. We are dedicated to bridging the gap between cutting-edge technology and social responsibility.',
        keywords: 'DMLabs Team, About Digital Maples, Tech for Good, Nonprofit Consultants, AI Ethics Experts',
        ogTitle: 'Our Mission: Responsible Innovation',
        ogDescription: 'Learn about our journey, our values, and why we believe technology must be human-centric.',
        ogImage: '',
        twitterTitle: 'Who We Are | Digital Maples Labs',
        twitterDescription: 'Dedicated to ethical innovation and social impact.',
        noIndex: false,
    },
    'services': {
        title: 'Our Services | AI Governance, Design & Development',
        description: 'Explore our specialized services including AI alignment audits, responsible tech strategy, and custom web development for nonprofits.',
        keywords: 'AI Alignment Audit, Nonprofit Web Design, Strategy for Social Impact, Responsible AI Consulting',
        ogTitle: 'Specialized Services for Mission-Driven Teams',
        ogDescription: 'Empower your organization with technology that aligns with your values.',
        ogImage: '',
        twitterTitle: 'DMLabs Services | AI & Web Innovation',
        twitterDescription: 'Custom solutions for the nonprofit sector.',
        noIndex: false,
    },
    'portfolio': {
        title: 'Our Work | Impact-Driven Portfolio | Digital Maples Labs',
        description: 'See how we have helped nonprofits and mission-driven organizations reach their goals through strategic technology and design.',
        keywords: 'Nonprofit Case Studies, Social Impact Projects, DMLabs Portfolio, Web Development Success',
        ogTitle: 'Case Studies: Technology for Social Good',
        ogDescription: 'Browse our latest projects and see the impact of responsible technology.',
        ogImage: '',
        twitterTitle: 'Our Work | Digital Maples Labs Portfolio',
        twitterDescription: 'Transforming mission into impact through technology.',
        noIndex: false,
    },
    'blog': {
        title: 'Just Opinions | Insights on AI & Social Impact | DMLabs Blog',
        description: 'Thought leadership and latest opinions on the intersection of artificial intelligence, ethics, and social change.',
        keywords: 'AI Ethics Blog, Social Impact Insights, Responsible Tech News, DMLabs Opinions',
        ogTitle: 'Just Opinions: The DMLabs Blog',
        ogDescription: 'Join the conversation on ethics, tech, and the future of social impact.',
        ogImage: '',
        twitterTitle: 'Just Opinions | The DMLabs Blog',
        twitterDescription: 'Insights on AI, ethics, and social change.',
        noIndex: false,
    },
    'contact': {
        title: 'Get in Touch | Contact Digital Maples Labs',
        description: 'Ready to innovate responsibly? Contact Digital Maples Labs today to discuss your next project or AI audit.',
        keywords: 'Contact DMLabs, Reach Out, Project Inquiry, AI Audit Request',
        ogTitle: 'Contact Us – Let’s Build Something Meaningful',
        ogDescription: 'Get in touch to start your journey toward responsible digital transformation.',
        ogImage: '',
        twitterTitle: 'Contact Digital Maples Labs',
        twitterDescription: 'Starting the conversation on responsible innovation.',
        noIndex: false,
    }
};

const AITASOL_SEO_SEED: SEOData = {
    'home': {
        title: 'Aitasol Education Consultancy | Your Gateway to Global Learning',
        description: 'Empowering students to achieve their dreams of studying abroad. Expert guidance for university admissions in Canada, UK, USA, Australia, and Germany.',
        keywords: 'study abroad, education consultancy, international students, study in canada, study in uk, university admission',
        ogTitle: 'Aitasol – Expert International Education Consultancy',
        ogDescription: 'Unlock world-class academic opportunities. From visa assistance to scholarship guidance, we support your journey every step of the way.',
        ogImage: '',
        twitterTitle: 'Aitasol | Gateway to Global Learning',
        twitterDescription: 'Professional consultancy for international students seeking admission in top global universities.',
        noIndex: false,
    },
    'about': {
        title: 'About Aitasol | Leading Education Consultants',
        description: 'Learn about Aitasol’s mission to provide transparent and expert guidance for students seeking international education.',
        keywords: 'about aitasol, education consultants mission, study abroad experts',
        ogTitle: 'About Us | Aitasol Education Consultancy',
        ogDescription: 'Our story and commitment to empowering the next generation of global scholars.',
        ogImage: '',
        twitterTitle: 'About Aitasol | Our Mission',
        twitterDescription: 'Transparency and expertise in international education consultancy.',
        noIndex: false,
    },
    'services': {
        title: 'Our Services | Full Support for International Students',
        description: 'Discover how Aitasol helps with university applications, visa processing, scholarships, and pre-departure briefings.',
        keywords: 'study abroad services, visa assistance, scholarship help, SOP review',
        ogTitle: 'Comprehensive Student Services | Aitasol',
        ogDescription: 'End-to-end support for your study abroad journey. We handle the complexity so you can focus on your studies.',
        ogImage: '',
        twitterTitle: 'Aitasol Services | Global Education Support',
        twitterDescription: 'From application to arrival, we guide you through every step of studying abroad.',
        noIndex: false,
    },
    'admission': {
        title: 'University Admission Assistance | Aitasol Education',
        description: 'Get expert help with your university applications. We ensure your SOP and documentation meet the highest standards.',
        keywords: 'university application help, SOP writing, admission consultancy',
        ogTitle: 'Expert University Admission Support',
        ogDescription: 'Boost your chances of admission to top global universities with our expert review and guidance.',
        ogImage: '',
        twitterTitle: 'Admission Support | Aitasol',
        twitterDescription: 'Professional guidance for successful university applications.',
        noIndex: false,
    },
    'visa': {
        title: 'Visa Assistance & Guidance | Aitasol',
        description: 'Navigate the complex student visa process with confidence. High success rates for Canada, UK, and USA student visas.',
        keywords: 'student visa help, visa consultancy, study permit assistance',
        ogTitle: 'Student Visa Guidance | Aitasol',
        ogDescription: 'Expert support for your study permit application. We help you navigate the requirements and documentation.',
        ogImage: '',
        twitterTitle: 'Visa Assistance | Aitasol',
        twitterDescription: 'Professional guidance for your student visa application.',
        noIndex: false,
    },
    'destinations': {
        title: 'Study Destinations | Top Universities Worldwide',
        description: 'Explore your study options in Canada, UK, USA, Australia, and Germany. Compare education systems and opportunities.',
        keywords: 'study destinations, study in canada, study in uk, study in usa',
        ogTitle: 'Top Study Destinations | Aitasol',
        ogDescription: 'Choose the best country for your academic and career goals. Detailed guides for major study destinations.',
        ogImage: '',
        twitterTitle: 'Study Destinations | Aitasol',
        twitterDescription: 'Your guide to top international study destinations.',
        noIndex: false,
    },
    'contact': {
        title: 'Contact Aitasol | Start Your Global Education Journey',
        description: 'Get in touch with our expert counselors today. Book a free consultation to discuss your study abroad plans.',
        keywords: 'contact aitasol, education consultancy contact, study abroad consultation',
        ogTitle: 'Contact Us | Aitasol Education Consultancy',
        ogDescription: 'We’re here to help you navigate your international education path. Reach out today.',
        ogImage: '',
        twitterTitle: 'Contact Aitasol | Free Consultation',
        twitterDescription: 'Start your international education journey with a free consultation.',
        noIndex: false,
    },
    'apply': {
        title: 'Apply Now | Begin Your Application with Aitasol',
        description: 'Take the first step toward your international education. Fill out our application form to get started.',
        keywords: 'apply study abroad, international student application, aitasol application',
        ogTitle: 'Apply Now | Start Your Journey with Aitasol',
        ogDescription: 'Ready to study abroad? Begin your application process today with our expert support.',
        ogImage: '',
        twitterTitle: 'Apply Now | Aitasol',
        twitterDescription: 'The first step to your global academic future starts here.',
        noIndex: false,
    },
    'scholarship': {
        title: 'Scholarship Guidance | Fund Your International Education',
        description: 'Discover scholarship opportunities and get expert help with your applications. We help you find funding for your studies abroad.',
        keywords: 'study abroad scholarships, international student funding, scholarship application help',
        ogTitle: 'Scholarship Guidance for International Students',
        ogDescription: 'Don’t let finances hold you back. Our experts help you identify and apply for scholarships globally.',
        ogImage: '',
        twitterTitle: 'Scholarship Help | Aitasol',
        twitterDescription: 'Expert guidance on finding and winning scholarships for international study.',
        noIndex: false,
    },
    'sop': {
        title: 'SOP & CV Review Services | Aitasol Education',
        description: 'Make your application stand out. Professional review of your Statement of Purpose and CV for university admissions.',
        keywords: 'SOP review, CV for university, admission essay help, statement of purpose editing',
        ogTitle: 'Professional SOP & CV Review | Aitasol',
        ogDescription: 'Improve your chances of admission with a professionally reviewed SOP and CV tailored for global universities.',
        ogImage: '',
        twitterTitle: 'SOP & CV Review | Aitasol',
        twitterDescription: 'Expert editing and review for your university application documents.',
        noIndex: false,
    },
    'briefing': {
        title: 'Pre-Departure Briefing | Preparing for Your Journey',
        description: 'Everything you need to know before you fly. Guidance on culture, accommodation, and arrival in your new study destination.',
        keywords: 'pre-departure briefing, student travel guide, studying abroad preparation',
        ogTitle: 'Essential Pre-Departure Briefing | Aitasol',
        ogDescription: 'Transition smoothly to your new life abroad with our comprehensive pre-departure guidance.',
        ogImage: '',
        twitterTitle: 'Pre-Departure Guide | Aitasol',
        twitterDescription: 'Preparing you for a successful start to your international education journey.',
        noIndex: false,
    },
    'universities': {
        title: 'Partner Universities | Top Global Institutions',
        description: 'Explore our network of partner universities across the globe. Find the perfect institution for your academic goals.',
        keywords: 'partner universities, global institutions, university network, study abroad options',
        ogTitle: 'Aitasol Partner University Network',
        ogDescription: 'Connect with world-class universities through Aitasol’s extensive global partnership network.',
        ogImage: '',
        twitterTitle: 'Partner Universities | Aitasol',
        twitterDescription: 'Direct access to top-tier universities for international students.',
        noIndex: false,
    },
    'canada': {
        title: 'Study in Canada | Expert Guidance & Visa Support',
        description: 'Your complete guide to studying in Canada. Information on top Canadian universities, work permits, and living in Canada.',
        keywords: 'study in canada, canadian universities, canada student visa, study permit canada',
        ogTitle: 'Study in Canada with Aitasol',
        ogDescription: 'Experience world-class education in Canada. We provide full support for admissions and visas.',
        ogImage: '',
        twitterTitle: 'Study in Canada | Aitasol',
        twitterDescription: 'Start your academic journey in Canada with expert consultancy support.',
        noIndex: false,
    },
    'uk': {
        title: 'Study in the UK | Admission to Top British Universities',
        description: 'Achieve your dream of studying in the United Kingdom. Expert help with UCAS, university selection, and Tier 4 student visas.',
        keywords: 'study in uk, british universities, uk student visa, study in london',
        ogTitle: 'Study in the UK | Aitasol Education',
        ogDescription: 'Unlock prestigious academic opportunities in the UK. Full support for your British education journey.',
        ogImage: '',
        twitterTitle: 'Study in the UK | Aitasol',
        twitterDescription: 'Direct pathway to top UK universities and expert visa guidance.',
        noIndex: false,
    },
    'usa': {
        title: 'Study in the USA | Admission to Top American Colleges',
        description: 'Your guide to studying in the United States. Help with F-1 visas, college applications, and finding the right US university.',
        keywords: 'study in usa, american universities, us student visa, f-1 visa help',
        ogTitle: 'Study in the USA with Aitasol Support',
        ogDescription: 'Navigate the complex US admissions process with ease. We help you find the right fit among thousands of colleges.',
        ogImage: '',
        twitterTitle: 'Study in the USA | Aitasol',
        twitterDescription: 'Expert guidance for students seeking to study in the United States.',
        noIndex: false,
    },
    'australia': {
        title: 'Study in Australia | Universities & Student Visa Guide',
        description: 'Discover world-class education in Australia. Help with GTE requirements, university admissions, and Australian student visas.',
        keywords: 'study in australia, australian universities, australia student visa, gte requirements',
        ogTitle: 'Study in Australia | Aitasol Education',
        ogDescription: 'Experience the Australian lifestyle and education. We provide comprehensive support for your journey down under.',
        ogImage: '',
        twitterTitle: 'Study in Australia | Aitasol',
        twitterDescription: 'Your pathway to top-ranked Australian universities and visa success.',
        noIndex: false,
    },
    'germany': {
        title: 'Study in Germany | Free Education & Career Opportunities',
        description: 'Learn about studying in Germany. Guidance on public universities, English-taught programs, and student visas for Germany.',
        keywords: 'study in germany, germany student visa, study in europe, english programs germany',
        ogTitle: 'Study in Germany | Aitasol Consultancy',
        ogDescription: 'Explore the high-quality, often tuition-free education system in Germany. Full support for your European studies.',
        ogImage: '',
        twitterTitle: 'Study in Germany | Aitasol',
        twitterDescription: 'Expert support for international students choosing Germany as their study destination.',
        noIndex: false,
    },
    'blog': {
        title: 'Global Education Blog | News & Tips for Students',
        description: 'Stay updated with the latest news in international education. Tips on applications, visas, and life as an international student.',
        keywords: 'education blog, study abroad tips, international student news',
        ogTitle: 'Aitasol Global Education Blog',
        ogDescription: 'Insights, tips, and updates for students planning to study abroad. Your resource for international education news.',
        ogImage: '',
        twitterTitle: 'Education Blog | Aitasol',
        twitterDescription: 'Latest insights and advice for your study abroad journey.',
        noIndex: false,
    },
    'careers': {
        title: 'Careers at Aitasol | Join Our Expert Team',
        description: 'Passionate about international education? Explore career opportunities at Aitasol and help students achieve their global dreams.',
        keywords: 'aitasol careers, education consultancy jobs, join our team',
        ogTitle: 'Careers | Join the Aitasol Team',
        ogDescription: 'Build a meaningful career in education consultancy. Help shape the future of global education.',
        ogImage: '',
        twitterTitle: 'Careers | Aitasol',
        twitterDescription: 'We’re hiring! Join our team of expert education consultants.',
        noIndex: false,
    }
};



const PHCG_SEO_SEED: SEOData = {
    'home': {
        title: 'Private Home Care Guru | Compassionate Senior Care in Ontario',
        description: 'Providing premium, personalized home care services for seniors across Ontario. We specialize in companion care, nursing, and specialized aging-in-place support.',
        keywords: 'private home care ontario, senior care guru, home nursing ontario, aging in place support',
        ogTitle: 'Private Home Care Guru – Premium Senior Care',
        ogDescription: 'Experience compassionate and professional care in the comfort of your own home. Our experts provide tailored support for your loved ones.',
        ogImage: '',
        twitterTitle: 'Private Home Care Guru | Ontario Senior Support',
        twitterDescription: 'Dedicated home care services prioritizing dignity, comfort, and personalized health management.',
        noIndex: false,
    },
    'about': {
        title: 'About Us | Our Commitment to Senior Wellness | PHCG',
        description: 'Learn about the Private Home Care Guru team and our mission to redefine home care through compassion and clinical excellence.',
        keywords: 'about phcg, senior care experts ontario, home care mission',
        ogTitle: 'Our Mission: Compassionate Home Care',
        ogDescription: 'Discover the heart behind PHCG and our dedication to supporting Ontario’s senior community.',
        ogImage: '',
        twitterTitle: 'About PHCG | Home Care Excellence',
        twitterDescription: 'Redefining what it means to care for seniors at home.',
        noIndex: false,
    },
    'services': {
        title: 'Care Services | Tailored Support for Seniors | PHCG',
        description: 'Explore our range of services: from daily companion care and medication management to specialized post-operative support.',
        keywords: 'home care services ontario, senior companion care, private nursing services',
        ogTitle: 'Tailored Home Care Services by PHCG',
        ogDescription: 'From medical support to daily living assistance, find the right care plan for your family.',
        ogImage: '',
        twitterTitle: 'PHCG Services | Senior Care Solutions',
        twitterDescription: 'Comprehensive and professional home care services for every stage of aging.',
        noIndex: false,
    }
};

const NSPC_SEO_SEED: SEOData = {
    'home': {
        title: 'Niagara Suicide Prevention Coalition | Community Support & Resources',
        description: 'NSPC is dedicated to suicide prevention through community collaboration, education, and providing essential resources in the Niagara Region.',
        keywords: 'suicide prevention niagara, crisis support niagara, nspc resources, mental health awareness niagara',
        ogTitle: 'Niagara Suicide Prevention Coalition – Hope & Healing',
        ogDescription: 'Providing vital support and resources for suicide prevention in the Niagara community. You are not alone.',
        ogImage: '',
        twitterTitle: 'Niagara Suicide Prevention Coalition | Support & Resources',
        twitterDescription: 'Working together to prevent suicide and build a stronger, more resilient Niagara.',
        noIndex: false,
    },
    'resources': {
        title: 'Crisis Resources & Support | NSPC Niagara',
        description: 'Find immediate help and crisis support resources in the Niagara Region. Access helplines, support groups, and mental health tools.',
        keywords: 'crisis helplines niagara, mental health resources, suicide prevention tools',
        ogTitle: 'Essential Crisis Resources | NSPC',
        ogDescription: 'Quick access to local and national support resources for anyone in need of help.',
        ogImage: '',
        twitterTitle: 'NSPC Resources | Find Support Today',
        twitterDescription: 'Comprehensive resources for suicide prevention and mental health support in Niagara.',
        noIndex: false,
    }
};

const ELWG_SEO_SEED: SEOData = {
    'home': {
        title: 'Elliot Lake Women’s Group | Supporting Women in Our Community',
        description: 'ELWG provides a safe space, resources, and community programs for women in Elliot Lake and surrounding areas.',
        keywords: 'elliot lake women’s group, elwg, women’s support niagara, community programs for women',
        ogTitle: 'Elliot Lake Women’s Group – Empowerment & Support',
        ogDescription: 'Join a community dedicated to supporting and empowering women in Elliot Lake. Programs, events, and resources available.',
        ogImage: '',
        twitterTitle: 'ELWG | Supporting Elliot Lake Women',
        twitterDescription: 'Providing essential support and building community for women in Elliot Lake.',
        noIndex: false,
    }
};

const SITE_SEED_DATA: Record<string, SEOData> = {
    noel: NOEL_SEO_SEED,
    dmlabs: DMLABS_SEO_SEED,
    aitasol: AITASOL_SEO_SEED,
    phcg: PHCG_SEO_SEED,
    nspc: NSPC_SEO_SEED,
    elwg: ELWG_SEO_SEED,
    kmfw: {
        'home': {
            title: 'Kind Minds Family Wellness | Black Mental Health & Wellness in Waterloo Region',
            description: 'Kind Minds Family Wellness (KMFW) is a Black-led organization providing culturally grounded mental health, counseling, and wellness programs to the Black community in Waterloo Region, Ontario.',
            keywords: 'Black mental health, KMFW, Kind Minds Family Wellness, Black wellness Waterloo, Black community support Ontario, culturally grounded counseling, Black family wellness',
            ogTitle: 'Kind Minds Family Wellness – Healing, Growth & Community',
            ogDescription: 'Culturally grounded mental health and wellness programs for the Black community in Waterloo Region. Join us in building a healthier, more empowered community.',
            ogImage: '',
            twitterTitle: 'Kind Minds Family Wellness | Black-Led Wellness in Ontario',
            twitterDescription: 'Mental health, counseling, and community support for the Black community in Waterloo Region. Certified, compassionate, and culturally grounded.',
            noIndex: false,
        }
    }
};

const defaultPageSEO = (label: string): PageSEO => ({
    title: label,
    description: '',
    keywords: '',
    ogTitle: label,
    ogDescription: '',
    ogImage: '',
    twitterTitle: label,
    twitterDescription: '',
    noIndex: false,
});

export default function SEOManager() {
    const { currentSite } = useSite();
    const siteId = currentSite?.id || 'kmfw';
    
    // Get pages for the current site
    const pages = SITE_PAGES[siteId] || [{ path: '/', label: 'Home', key: 'home' }];
    
    const [seoData, setSeoData] = useState<SEOData>({});
    const [selectedPage, setSelectedPage] = useState<string>(pages[0].key);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    // Reset selection when site changes
    useEffect(() => {
        if (pages.length > 0) {
            setSelectedPage(pages[0].key);
        }
        loadSEO();
    }, [currentSite]);

    const loadSEO = async () => {
        setLoading(true);
        try {
            const data = await FirestoreService.getSEOData(siteId);
            if (data) {
                setSeoData(data);
            } else {
                const defaults: SEOData = {};
                pages.forEach(p => { defaults[p.key] = defaultPageSEO(p.label); });
                setSeoData(defaults);
            }
        } catch (e) {
            console.error('Error loading SEO:', e);
            setStatus({ type: 'error', msg: 'Failed to load SEO settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            await FirestoreService.saveSEOData(siteId, seoData);
            setStatus({ type: 'success', msg: 'SEO settings saved successfully!' });
        } catch (e) {
            console.error('Error saving SEO:', e);
            setStatus({ type: 'error', msg: 'Failed to save. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleSeedAll = async () => {
        const seedData = SITE_SEED_DATA[siteId];
        if (!seedData) {
            setStatus({ type: 'error', msg: `No professional seed data available yet for ${currentSite?.name || siteId}.` });
            return;
        }

        setSeeding(true);
        setStatus(null);
        try {
            await FirestoreService.saveSEOData(siteId, seedData);
            setSeoData(seedData);
            setStatus({ type: 'success', msg: `Seeded with professional metadata for ${siteId}!` });
        } catch (e) {
            console.error('Error seeding SEO:', e);
            setStatus({ type: 'error', msg: 'Failed to seed SEO data. Please try again.' });
        } finally {
            setSeeding(false);
        }
    };

    const currentPage = pages.find(p => p.key === selectedPage) || pages[0];
    const pageSEO: PageSEO = seoData[selectedPage] || defaultPageSEO(currentPage.label);

    const update = (field: keyof PageSEO, value: string | boolean) => {
        setSeoData(prev => ({
            ...prev,
            [selectedPage]: { ...pageSEO, [field]: value }
        }));
    };

    const syncFromTitle = () => {
        update('ogTitle', pageSEO.title);
        update('twitterTitle', pageSEO.title);
    };

    const syncFromDescription = () => {
        update('ogDescription', pageSEO.description);
        update('twitterDescription', pageSEO.description);
    };

    const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white";
    const textareaClass = `${inputClass} resize-none`;
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

    const seededCount = Object.values(seoData).filter(p => p.description?.length > 0).length;

    if (loading) {
        return <div className="flex items-center justify-center h-64 text-gray-500">Loading SEO settings...</div>;
    }

    return (
        <>
            <PageMeta
                title={`SEO Manager | ${currentSite?.name || 'Admin'}`}
                description="Manage per-page SEO metadata and Open Graph tags"
            />
            <PageBreadcrumb pageTitle="SEO Manager" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Search className="w-6 h-6 text-blue-600" />
                            SEO & Metadata Manager
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {seededCount}/{pages.length} pages have SEO configured for {currentSite?.name}.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSeedAll}
                            disabled={seeding || !SITE_SEED_DATA[siteId]}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            <Zap className="w-4 h-4" />
                            {seeding ? 'Seeding...' : 'Seed All Pages (AI)'}
                        </button>
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {status && (
                    <Alert
                        variant={status.type}
                        title={status.type === 'success' ? 'Saved!' : 'Notice'}
                        message={status.msg}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Page Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                {currentSite?.name} Pages
                            </h2>
                            <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                                {pages.map(page => {
                                    const hasSEO = seoData[page.key]?.description?.length > 0;
                                    return (
                                        <button
                                            key={page.key}
                                            onClick={() => setSelectedPage(page.key)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
                                                selectedPage === page.key
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <span className="truncate">{page.label}</span>
                                            {hasSEO && (
                                                <span className={`flex-shrink-0 w-2 h-2 rounded-full ${selectedPage === page.key ? 'bg-green-300' : 'bg-green-500'}`} title="Has SEO" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* SEO Editor */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Page URL Preview */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center gap-3">
                            <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div>
                                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Editing</div>
                                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    {currentPage.label} — <code className="text-xs">{currentPage.path}</code>
                                </div>
                            </div>
                        </div>

                        {/* Basic SEO */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <Search className="w-5 h-5 text-gray-500" />
                                Basic SEO
                            </h2>

                            <div>
                                <label className={labelClass}>
                                    Page Title <span className="text-gray-400 font-normal">(shown in browser tab & search results)</span>
                                </label>
                                <input
                                    type="text"
                                    value={pageSEO.title}
                                    onChange={e => update('title', e.target.value)}
                                    placeholder={`${currentPage.label} | ${currentSite?.name}`}
                                    className={inputClass}
                                    maxLength={70}
                                />
                                <p className={`text-xs mt-1 ${pageSEO.title.length > 60 ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {pageSEO.title.length}/70 characters (recommended: under 60)
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Meta Description <span className="text-gray-400 font-normal">(shown in Google search results)</span>
                                </label>
                                <textarea
                                    value={pageSEO.description}
                                    onChange={e => update('description', e.target.value)}
                                    placeholder="Briefly describe this page for search engines..."
                                    className={textareaClass}
                                    rows={3}
                                    maxLength={160}
                                />
                                <p className={`text-xs mt-1 ${pageSEO.description.length > 155 ? 'text-amber-500' : 'text-gray-400'}`}>
                                    {pageSEO.description.length}/160 characters (recommended: 120–160)
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Keywords <span className="text-gray-400 font-normal">(comma-separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={pageSEO.keywords}
                                    onChange={e => update('keywords', e.target.value)}
                                    placeholder="e.g. Construction, Renovation, Woodworking"
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <input
                                    id={`noindex-${selectedPage}`}
                                    type="checkbox"
                                    checked={pageSEO.noIndex}
                                    onChange={e => update('noIndex', e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600"
                                />
                                <label htmlFor={`noindex-${selectedPage}`} className="text-sm text-gray-700 dark:text-gray-300">
                                    Hide this page from search engines (noindex)
                                </label>
                            </div>
                        </div>

                        {/* Open Graph / Social */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-gray-500" />
                                    Social Sharing (Open Graph & Twitter)
                                </h2>
                                <button
                                    onClick={() => { syncFromTitle(); syncFromDescription(); }}
                                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Sync from Basic SEO
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                These fields control how the page appears when shared on social media platforms.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>OG Title (Facebook / LinkedIn)</label>
                                    <input type="text" value={pageSEO.ogTitle} onChange={e => update('ogTitle', e.target.value)} placeholder={pageSEO.title} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Twitter Title</label>
                                    <input type="text" value={pageSEO.twitterTitle} onChange={e => update('twitterTitle', e.target.value)} placeholder={pageSEO.title} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>OG Description</label>
                                    <textarea value={pageSEO.ogDescription} onChange={e => update('ogDescription', e.target.value)} placeholder={pageSEO.description} className={textareaClass} rows={3} />
                                </div>
                                <div>
                                    <label className={labelClass}>Twitter Description</label>
                                    <textarea value={pageSEO.twitterDescription} onChange={e => update('twitterDescription', e.target.value)} placeholder={pageSEO.description} className={textareaClass} rows={3} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Social Sharing Image URL <span className="text-gray-400 font-normal">(1200×630px recommended)</span>
                                </label>
                                <input type="url" value={pageSEO.ogImage} onChange={e => update('ogImage', e.target.value)} placeholder="https://..." className={inputClass} />
                                {pageSEO.ogImage && (
                                    <img src={pageSEO.ogImage} alt="OG Preview" className="mt-2 h-24 w-auto rounded border object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save All Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Re-add KMFW seed data at the end for reference or move to constants file
const KMFW_SEO_SEED: SEOData = {
    'home': {
        title: 'Kind Minds Family Wellness | Black Mental Health & Wellness in Waterloo Region',
        description: 'Kind Minds Family Wellness (KMFW) is a Black-led organization providing culturally grounded mental health, counseling, and wellness programs to the Black community in Waterloo Region, Ontario.',
        keywords: 'Black mental health, KMFW, Kind Minds Family Wellness, Black wellness Waterloo, Black community support Ontario, culturally grounded counseling, Black family wellness',
        ogTitle: 'Kind Minds Family Wellness – Healing, Growth & Community',
        ogDescription: 'Culturally grounded mental health and wellness programs for the Black community in Waterloo Region. Join us in building a healthier, more empowered community.',
        ogImage: '',
        twitterTitle: 'Kind Minds Family Wellness | Black-Led Wellness in Ontario',
        twitterDescription: 'Mental health, counseling, and community support for the Black community in Waterloo Region. Certified, compassionate, and culturally grounded.',
        noIndex: false,
    }
};

SITE_SEED_DATA.kmfw = KMFW_SEO_SEED;
