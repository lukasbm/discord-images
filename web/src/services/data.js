import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";

// get all statistics
const getStatistics = async () => {
  const snapshot = await firestore.collection("statistics").get();
  return snapshot.docs.map((doc) => doc.data());
};

const getImages = async () => {
  const querySnapshot = await getDocs(collection(firestore, "pictures"));
  let docs = [];
  querySnapshot.forEach((doc) => {
    docs.push(doc.data());
  });
  return docs;
};

export { getStatistics, getImages };
