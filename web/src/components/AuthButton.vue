<script setup>
import {
  buildDiscordRedirect,
  firebaseCreateToken,
  firebaseSignIn,
  firebaseSignOut,
} from "../services/auth";

const discordRedirect = buildDiscordRedirect();

// replace old state with new one
sessionStorage.setItem(
  "lastDiscordAuthState",
  sessionStorage.getItem("currentDiscordAuthState")
);
sessionStorage.setItem("currentDiscordAuthState", discordRedirect.state);

let authParams = new URLSearchParams(window.location.search);
let showAuthRedirect = false;

if (authParams.has("code") && authParams.has("state")) {
  console.log("params present, starting login process");
  if (
    sessionStorage.getItem("lastDiscordAuthState") != authParams.get("state")
  ) {
    console.error("states dont match");
    firebaseSignOut();
    localStorage.remove("firebaseJwt");
    showAuthRedirect = true;
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

  if (localStorage.getItem("firebaseJwt") == null) {
    showAuthRedirect = true;
  }
}
</script>

<template>
  <a
    v-if="showAuthRedirect"
    :href="discordRedirect.url"
    class="btn btn-outline-light me-2"
    >Sign In</a
  >
  <div v-else>
    signed in as: TODO
    <button @click="firebaseSignOut()" class="btn btn-outline-secondary">
      Sign Out
    </button>
  </div>
</template>
