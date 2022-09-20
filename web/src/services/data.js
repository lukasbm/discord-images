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
  let guilds = [];
  if (userData.value.guilds)
    userData.value.guilds.forEach((x) => guilds.push(x));
  console.log("fetching images with labels:", queryLabels);

  getDocs(
    query(
      collection(firestore, "pictures"),
      where("guildId", "in", guilds),
      orderBy("time", "desc")
    )
  )
    .then((snapshot) => {
      let docs = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        let ok = true;
        if (queryLabels && queryLabels.length > 0) {
          for (let x of queryLabels) {
            if (!data.labels.includes(x)) {
              ok = false;
              break;
            }
          }
        }

        if (ok) {
          docs.push(data);
        }
      });
      images.value = docs;
      console.log("udpateImages value:", docs);
    })
    .catch((err) => console.error(err));
};

export { updateStatistics, updateImages, images, statistics };
