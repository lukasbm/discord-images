<script setup>
import { images } from "../services/data";
</script>

<template>
  <div v-if="images && images.length > 0">
    <div class="row" data-masonry='{"percentPosition": true }'>
      <div
        v-for="img of images"
        :key="img.messageId"
        class="col-sm-6 col-lg-4 mb-4"
      >
        <div class="card">
          <img :src="img.url" />

          <div class="card-body">
            <h5
              v-if="
                (img.filename && img.filename != 'unknown.png') ||
                (img.content && img.content != '')
              "
              class="card-title"
            >
              <span v-if="img.filename != 'unknown.png'">
                {{ img.filename }} -
              </span>
              {{ img.content }}
            </h5>
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
  </div>
  <div v-else class="alert alert-primary">No images found!</div>
</template>
