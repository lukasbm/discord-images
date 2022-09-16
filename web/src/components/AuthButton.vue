<script setup>
import { login } from "../services/auth";

// build authUrl
const clientId = encodeURIComponent("1011648062915096627"); // TODO replace with vite env variable
const redirectUri = encodeURIComponent(window.location.origin);
const redirectState = encodeURIComponent(
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5)
);
const authScope = encodeURIComponent("identify guilds");
const authUrl = `https://discord.com/api/oauth2/authorize?response_type=token&client_id=${clientId}&scope=${authScope}&state=${redirectState}&redirect_uri=${redirectUri}`;

// parse reponse params
const authParams = window.location.hash
  ?.substring(1)
  .split("&")
  .map((v) => v.split("="))
  .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {});

// attempt login
const token = authParams["access_token"] ?? undefined;
if (token) {
  login(token);
}
window.location.hash = "";
</script>

<template>
  <a :href="authUrl" class="btn btn-outline-light me-2">Sign In</a>

  <p>access token: {{ authParams["access_token"] }}</p>
</template>
