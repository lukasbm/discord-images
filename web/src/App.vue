<script setup>
import ImageList from "./components/ImageList.vue";
import SearchBox from "./components/SearchBox.vue";
import HeaderBar from "./components/HeaderBar.vue";
import { ref } from "vue";
import { getImages } from "./services/data";

const images = ref();

const updateImages = (queryLabels) => {
  console.log("fetching images with labels", queryLabels);
  getImages(queryLabels)
    .then((data) => {
      images.value = data;
      console.log(data);
    })
    .catch((err) => console.error(err));
};
</script>

<template>
  <HeaderBar />
  <main class="container py-4 px-3 mx-auto">
    <SearchBox class="mb-4" @update-images="updateImages" />
    <ImageList :images="images" @update-images="updateImages" />
  </main>
</template>
