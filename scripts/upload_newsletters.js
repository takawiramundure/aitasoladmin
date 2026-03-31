
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mocking some process.env for the config
const firebaseConfig = {
    apiKey: "AIzaSyBf1CBPOW3UrqfEledkEOSjUCoH31a0tTE",
    authDomain: "nspc-web.firebaseapp.com",
    projectId: "nspc-web",
    storageBucket: "nspc-web.firebasestorage.app",
    messagingSenderId: "272421073172",
    appId: "1:272421073172:web:7250912c8b371828ff1201"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, '../../kmfw-web/public/newsletters');
const files = ['Summer-2024.pdf', 'Fall-2024.pdf', 'Inaugural-Newsletter.pdf'];

async function uploadFiles() {
    console.log("Starting newsletter upload to Firebase Storage...");
    
    for (const fileName of files) {
        const filePath = path.join(publicPath, fileName);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        const storageRef = ref(storage, `kmfw/newsletters/${fileName}`);

        try {
            console.log(`Uploading ${fileName}...`);
            await uploadBytes(storageRef, fileBuffer, { contentType: 'application/pdf' });
            console.log(`✅ Success: ${fileName} uploaded to kmfw/newsletters/`);
        } catch (error) {
            console.error(`❌ Error uploading ${fileName}:`, error.message);
        }
    }
}

uploadFiles().then(() => {
    console.log("Upload process complete.");
    process.exit(0);
}).catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
