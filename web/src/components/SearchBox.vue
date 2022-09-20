<script setup>
import { ref } from "vue";
import {
  updateImages,
  updateStatistics,
  statistics,
} from "../services/data.js";

const query = ref();

const suggested = () => {
  if (!statistics.value) return [];
  // create items array
  const items = Object.keys(statistics.value).map(function (key) {
    return [key, statistics.value[key]];
  });
  // Sort the array based on the second element
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  // return
  return items.slice(0, 5).map((x) => x[0]);
};

const search = () => {
  const queryLabels = query.value
    ? query.value.split(",").map((x) => x.trim())
    : [];
  updateImages(queryLabels);
};

updateStatistics();
updateImages();
</script>

<template>
  <div class="card">
    <div class="card-body">
      <!-- Search query -->
      <div class="mb-1">
        <label for="searchQuery" class="form-label">Search Query</label>
        <input
          v-model="query"
          class="form-control"
          id="searchQuery"
          aria-describedby="searchQueryHelp"
        />
        <div id="searchQueryHelp" class="form-text">
          You can search for multiple Terms, by dividing them with a comma (,)
        </div>
      </div>

      <!-- Suggested Tags -->
      <div class="mb-1">
        <span class="form-text mr-2">Suggested: </span>
        <span
          v-for="sugg of suggested()"
          :key="sugg"
          class="badge rounded-pill text-bg-secondary"
          >{{ sugg }}</span
        >
      </div>

      <button type="button" @click="search()" class="btn btn-primary">
        Go
      </button>
    </div>
  </div>
</template>
