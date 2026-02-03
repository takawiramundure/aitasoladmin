import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { SETTINGS_SEED } from '../src/config/seedData';

// Firebase configuration - should match your firebaseConfig.ts
const firebaseConfig = {
    apiKey: "AIzaSyDN8oix4JRr04KYF0gx_gCh5WE9gH2a_lU",
    authDomain: "digital-maples-agency.firebaseapp.com",
    projectId: "digital-maples-agency",
    storageBucket: "digital-maples-agency.firebasestorage.app",
    messagingSenderId: "251751498453",
    appId: "1:251751498453:web:c64b5dd8f02c3be99b3f8a",
    measurementId: "G-HDKPBXMFV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedSiteSettings() {
    console.log('🌱 Starting site settings seeding...\n');

    try {
        // Seed NSPC settings
        console.log('📝 Seeding NSPC settings...');
        const nspcDocRef = doc(db, 'nspc_settings', 'config');
        await setDoc(nspcDocRef, {
            ...SETTINGS_SEED.nspc,
            metadata: {
                lastUpdated: new Date().toISOString(),
                updatedBy: 'seeding-script'
            }
        }, { merge: true });
        console.log('✅ NSPC settings seeded successfully!\n');

        // Seed BWEIC settings
        console.log('📝 Seeding BWEIC settings...');
        const bweicDocRef = doc(db, 'bweic_settings', 'config');
        await setDoc(bweicDocRef, {
            ...SETTINGS_SEED.bweic,
            metadata: {
                lastUpdated: new Date().toISOString(),
                updatedBy: 'seeding-script'
            }
        }, { merge: true });
        console.log('✅ BWEIC settings seeded successfully!\n');

        console.log('🎉 All site settings seeded successfully!');
        console.log('\nSeeded collections:');
        console.log('  - nspc_settings/config');
        console.log('  - bweic_settings/config');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding site settings:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedSiteSettings();
