import { initializeApp } from 'firebase-admin/app';
import serviceAccount from "./firebase.json";

initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://skills-6f7df-default-rtdb.europe-west1.firebasedatabase.app"
});