import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../serviceAccount.json" assert { type: "json" };

const app = initializeApp(serviceAccount);
const firestore = getFirestore(app);

export { firestore };
