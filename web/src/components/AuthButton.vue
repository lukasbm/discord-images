<script setup>
import { login } from "../services/auth";

const signIn = () => {
  login();
};
</script>

<template>
  <button @click="signIn" class="btn btn-outline-light me-2">Sign In</button>
</template>
