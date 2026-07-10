import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const app = admin.initializeApp({
    projectId: 'nspc-web'
}, 'havens-seeder');

const db = app.firestore('havens-web');

const SEED_DATA = {
    settings: {
        id: 'config',
        siteTitle: "Haven't Social Work Inc.",
        branding: {
            siteName: "Haven't Social Work",
            logo: '/logo.png',
            favicon: '/favicon.ico'
        },
        theme: {
            primary: '#0F2537',
            secondary: '#1B365D',
            accent: '#1E847F',
            textDark: '#1C2A38',
            textLight: '#FFFFFF'
        },
        navigation: [
            { id: 'nav1', name: 'HOME', path: '/' },
            { id: 'nav2', name: 'SERVICES', path: '/services' },
            { id: 'nav3', name: 'WHY US', path: '/why-us' },
            { id: 'nav4', name: 'CONTACT', path: '/contact' }
        ]
    },
    content: {
        id: 'home',
        title: "Haven't Social Work Inc.",
        slug: "home",
        template: "home",
        sections: {
            hero: {
                heading: "Professional psychosocial support, without the hiring overhead.",
                content: "The move into long-term care brings fear, grief, anxiety and loss for residents and families. Under the Fixing Long-Term Care Act, 2021, homes must address residents' psychosocial needs: services you may provide or arrange. We are the partner you arrange them through.",
                buttonText: "Book Your complimentary Review",
                buttonUrl: "#contact"
            },
            services: {
                heading: "WHAT WE DELIVER",
                items: [
                    {
                        title: "ONE-TO-ONE SUPPORT",
                        description: "Crisis support, counseling, psychotherapy and psychoeducation for residents"
                    },
                    {
                        title: "FAMILY & CAREGIVERS",
                        description: "Support through transition, grief, conflict and end of life"
                    },
                    {
                        title: "TAILORED PROGRAM",
                        description: "Scoped to your home's size, acuity and budget"
                    },
                    {
                        title: "DOCUMENTATION",
                        description: "Care-conference participation and scheduled program reviews"
                    }
                ]
            },
            why_us: {
                heading: "WHY HOMES CHOOSE US",
                items: [
                    {
                        title: "QUALIFIED",
                        description: "Registered Social Workers in good standing with the OCSWSSW, each carrying their own $5 million liability insurance"
                    },
                    {
                        title: "FLEXIBLE",
                        description: "From a few hours a week to multiple days, scaled to your beds, with no employment overhead"
                    },
                    {
                        title: "ACCOUNTABLE",
                        description: "Regular program reviews and clear monthly reporting so quality is met, not assumed"
                    }
                ]
            }
        }
    }
};

async function seed() {
    console.log("Seeding havens-web Firestore database...");
    try {
        // Seed settings collection
        await db.collection('settings').doc(SEED_DATA.settings.id).set(SEED_DATA.settings);
        console.log("✓ Seeded settings/config successfully.");

        // Seed content collection
        await db.collection('content').doc(SEED_DATA.content.id).set(SEED_DATA.content);
        console.log("✓ Seeded content/home successfully.");

        console.log("✅ Seeding completed successfully!");
    } catch (e) {
        console.error("❌ Seeding failed:", e);
    }
    process.exit(0);
}

seed();
