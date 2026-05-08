import admin from 'firebase-admin';

const appDefault = admin.initializeApp({
    projectId: 'nspc-web'
}, 'list-app');

const dbDefault = admin.firestore(appDefault);

async function inspect() {
    console.log('Inspecting projects...');
    const projectsSnapshot = await dbDefault.collection('projects').get();
    projectsSnapshot.forEach(doc => {
        console.log(`Project ID: ${doc.id}`);
        console.log(`Data:`, JSON.stringify(doc.data()).substring(0, 100) + '...');
    });

    console.log('\nInspecting site_content...');
    const siteContentSnapshot = await dbDefault.collection('site_content').get();
    siteContentSnapshot.forEach(doc => {
        console.log(`Site Content ID: ${doc.id}`);
        console.log(`Data:`, JSON.stringify(doc.data()).substring(0, 100) + '...');
    });
    
    process.exit(0);
}

inspect();
