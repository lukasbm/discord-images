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
import { userData } from "./auth";

const images = ref(null);
const statistics = ref(null);

// get all statistics
const updateStatistics = () => {
  console.log("fetching statistics ...");
  getDoc(doc(firestore, "statistics", "labels"))
    .then((snapshot) => {
      statistics.value = snapshot.data();
      console.log("updateStatistics value:", statistics.value);
    })
    .catch((err) => console.error(err));
};

const updateImages = (queryLabels) => {
  console.log("fetching images with user:", userData.value.guilds);
  let q = undefined;
  if (!queryLabels || queryLabels.length == 0) {
    q = query(collection(firestore, "pictures"), orderBy("time", "desc"));
  } else {
    q = query(
      collection(firestore, "pictures"),
      where("labels", "array-contains-any", queryLabels),
      where("guild", "in", userData.value.guilds ?? []),
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
      console.log("udpateImages result:", docs);
    })
    .catch((err) => console.error(err));
};

export { updateStatistics, updateImages, images, statistics };
