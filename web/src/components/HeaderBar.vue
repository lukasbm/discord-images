<script setup>
import AuthButton from "./AuthButton.vue";
</script>

<template>
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
      >
        <!-- <svg
          class="bi me-2"
          width="40"
          height="32"
          src="../assets/Discord_Canary_2021.svg"
        ></svg> -->

        <h3>Discord Images</h3>

        <span class="me-lg-auto justify-content-center"> </span>

        <!-- <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input
            type="search"
            class="form-control form-control-dark text-bg-dark"
            placeholder="Search..."
            aria-label="Search"
          />
        </form> -->

        <div class="text-end">
          <AuthButton />
        </div>
      </div>
    </div>
  </header>
</template>
