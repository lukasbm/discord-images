<script setup>
import { ref } from "vue";
import { getImages } from "../services/data.js";

console.log("fetching images ...");

const images = ref();

getImages()
  .then((data) => {
    images.value = data;
    console.log(data);
  })
  .catch((err) => console.error(err));
</script>

<template>
  <div class="row" data-masonry='{"percentPosition": true }'>
    <div
      v-for="img of images"
      :key="img.messageId"
      class="col-sm-6 col-lg-4 mb-4"
    >
      <div class="card">
        <img :src="img.url" />

        <div class="card-body">
          <h5 class="card-title">{{ img.filename }} - {{ img.content }}</h5>
          <p v-if="img.labels" class="card-text">
            <span
              v-for="label of img.labels"
              :key="label.concept"
              class="badge rounded-pill text-bg-primary"
              >{{ label.concept }}</span
            >
          </p>
          <p v-if="img.altText" class="card-text">
            <small class="text-muted">{{ img.altText }}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
