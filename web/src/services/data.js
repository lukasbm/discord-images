import { firestore } from "./firebase";

// get all statistics
const getStatistics = async () => {
  const snapshot = await firestore.collection("statistics").get();
  return snapshot.docs.map((doc) => doc.data());
};

export { getStatistics };
