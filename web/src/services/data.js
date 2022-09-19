import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ref } from "vue";
import { firestore } from "./firebase";

const images = ref(null);

// get all statistics
const getStatistics = async () => {
  console.log("fetching statistics ...");
  const snapshot = await getDoc(doc(firestore, "statistics", "labels"));
  return snapshot.data();
};

// TODO filter by tags of authenticated user
const getImages = (queryLabels) => {
  console.log("fetching images...");
  let q = undefined;
  if (!queryLabels || queryLabels.length == 0) {
    q = query(collection(firestore, "pictures"), orderBy("time", "desc"));
  } else {
    q = query(
      collection(firestore, "pictures"),
      where("labels", "array-contains-any", queryLabels),
      orderBy("time", "desc")
    );
  }
  getDocs(q)
    .then((snapshot) => {
      let docs = [];
      snapshot.forEach((doc) => {
        docs.push(doc.data());
      });
      images.value = docs;
    })
    .catch((err) => console.error(err));
};

export { getStatistics, getImages, images };
