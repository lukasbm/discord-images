import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccount.json" assert { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});
const firestore = getFirestore(app);

export { firestore };
