import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// will automatically read the firebase-adminsdk.json file using the path set in `GOOGLE_APPLICATION_CREDENTIALS`.
const app = initializeApp();
const firestore = getFirestore(app);

export { firestore };
