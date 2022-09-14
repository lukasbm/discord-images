import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase";

// get all statistics
const getStatistics = async () => {
  const snapshot = await getDoc(doc(firestore, "statistics", "labels"));
  return snapshot.data();
};

const getImages = async (queryLabels) => {
  let q = undefined;
  if (!queryLabels || queryLabels.length == 0) {
    q = query(collection(firestore, "pictures"));
  } else {
    q = query(
      collection(firestore, "pictures"),
      where("labels", "array-contains-any", queryLabels)
    );
  }
  const snapshot = await getDocs(q);
  let docs = [];
  snapshot.forEach((doc) => {
    docs.push(doc.data());
  });
  return docs;
};

export { getStatistics, getImages };
