import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGWSb_d4qzzerPguZ17OFIGh7yvModns",
    authDomain: "cantina-tech.firebaseapp.com",
    projectId: "cantina-tech",
    storageBucket: "cantina-tech.firebasestorage.app",
    messagingSenderId: "146160328281",
    appId: "1:146160328281:web:47b6cbdd8ac01be4f31b48"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);