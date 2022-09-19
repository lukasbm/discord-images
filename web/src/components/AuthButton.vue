<script setup>
import { onMounted } from "vue";
import {
  buildDiscordRedirect,
  firebaseCreateToken,
  firebaseSignIn,
  firebaseSignOut,
  authStatus,
  AuthenticationStatus,
} from "../services/auth";

const login = () => {
  const discordRedirect = buildDiscordRedirect();
  sessionStorage.setItem("lastDiscordAuthState", discordRedirect.state);
  // redirect
  window.location.href = discordRedirect.url;
};

onMounted(() => {
  let authParams = new URLSearchParams(window.location.search);

  if (authParams.has("code") && authParams.has("state")) {
    console.log("params present, starting login process");
    if (
      sessionStorage.getItem("lastDiscordAuthState") != authParams.get("state")
    ) {
      console.error("states dont match");
      firebaseSignOut();
      localStorage.removeItem("firebaseJwt");
    } else {
      firebaseCreateToken(authParams.get("code"))
        .then((result) => {
          localStorage.setItem("firebaseJwt", result);
          firebaseSignIn(result);
        })
        .catch((err) => console.error(err));
    }
  } else {
    console.log("params not present");
  }
});
</script>

<template>
  <button
    v-if="authStatus != AuthenticationStatus.authenticated"
    @click="login()"
    class="btn btn-outline-light me-2"
  >
    Sign In
  </button>
  <button v-else @click="firebaseSignOut()" class="btn btn-outline-secondary">
    Sign Out
  </button>
</template>
