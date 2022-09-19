<script setup>
import ImageList from "./components/ImageList.vue";
import SearchBox from "./components/SearchBox.vue";
import HeaderBar from "./components/HeaderBar.vue";
import { authStatus, AuthenticationStatus } from "./services/auth";
</script>

<template>
  <HeaderBar />
  <main class="container py-4 px-3 mx-auto">
    <div v-if="authStatus == AuthenticationStatus.authenticated">
      <SearchBox class="mb-4" />
      <ImageList :images="images" />
    </div>
    <div v-else-if="authStatus == AuthenticationStatus.authenticating">
      Signing in ...
      <div class="spinner-grow text-primary mx-auto" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="alert alert-danger" role="alert">
      Please sign in before you continue!
    </div>
  </main>
</template>
