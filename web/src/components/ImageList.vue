<script setup>
const props = defineProps(["images"]);
const emit = defineEmits(["updateImages"]);

// fetch images on startup
emit("updateImages");
</script>

<template>
  <div class="row" data-masonry='{"percentPosition": true }'>
    <div
      v-for="img of props.images"
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
              :key="label"
              class="badge rounded-pill text-bg-primary"
              >{{ label }}</span
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
