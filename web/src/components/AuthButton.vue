<script setup>
import {
  buildDiscordRedirect,
  firebaseSignOut,
  authStatus,
  AuthenticationStatus,
} from "../services/auth";

const login = () => {
  const discordRedirect = buildDiscordRedirect();
  window.location.href = discordRedirect;
};
</script>

<template>
  <button
    v-if="authStatus == AuthenticationStatus.unauthenticated"
    @click="login()"
    class="btn btn-outline-light me-2"
  >
    Sign In
  </button>
  <button
    v-else-if="authStatus == AuthenticationStatus.authenticating"
    disabled
    class="btn btn-outline-light me-2"
  >
    Sign In
  </button>
  <button v-else @click="firebaseSignOut()" class="btn btn-outline-secondary">
    Sign Out
  </button>
</template>
