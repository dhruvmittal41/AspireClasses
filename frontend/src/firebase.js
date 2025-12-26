import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     appId: "YOUR_APP_ID",
// };

const firebaseConfig = {
    apiKey: "AIzaSyCtlAVvcZ7WSMGrIz8WUOFiCLJp333S9oI",
    authDomain: "aspireclasses-88355.firebaseapp.com",
    projectId: "aspireclasses-88355",
    storageBucket: "aspireclasses-88355.firebasestorage.app",
    messagingSenderId: "770270163226",
    appId: "1:770270163226:web:ecc3fe6b2d3d74d51bbca3",
    measurementId: "G-FSBCJ29M1B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => { },
            "expired-callback": () => { },
        });
    }
};
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
