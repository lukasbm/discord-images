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
const statistics = ref(null);

// get all statistics
const updateStatistics = () => {
  console.log("fetching statistics ...");
  getDoc(doc(firestore, "statistics", "labels"))
    .then((snapshot) => {
      statistics.value = snapshot.data();
    })
    .catch((err) => console.error(err));
};

// TODO filter by tags of authenticated user
const updateImages = (queryLabels) => {
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

export { updateStatistics, updateImages, images, statistics };
