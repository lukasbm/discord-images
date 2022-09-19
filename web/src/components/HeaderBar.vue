<script setup>
import AuthButton from "./AuthButton.vue";
</script>

<template>
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
      >
        <h3>Discord Images</h3>

        <span class="me-lg-auto justify-content-center"></span>

        <div class="text-end">
          <AuthButton />
        </div>
      </div>
    </div>
  </header>
</template>
