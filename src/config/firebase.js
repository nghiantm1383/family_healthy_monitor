import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAHYzAcbKolNTUSLfNvreHNgESh39a1Dic",
    authDomain: "family-health-f54b5.firebaseapp.com",
    projectId: "family-health-f54b5",
    storageBucket: "family-health-f54b5.firebasestorage.app",
    messagingSenderId: "869065846367",
    appId: "1:869065846367:web:47bac97a3a8c4a6286f5ea",
    measurementId: "G-98QWQYB93Z"
};

// Khởi tạo và thiết lập cổng giao tiếp Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
