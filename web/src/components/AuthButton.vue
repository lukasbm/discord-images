<script setup>
import {
  buildDiscordRedirect,
  firebaseCreateToken,
  firebaseSignIn,
  firebaseSignOut,
} from "../services/auth";

// TODO check for state
// if (authParams.get("state") !== discordRedirect.state) {
//   // TODO clean up auth process and start again since states dont match
//   console.error("states dont match");
//   showAuthRedirect = true;
// } else {
//   console.log("startin sign in, since states match");
// }

const discordRedirect = buildDiscordRedirect();
let authParams = new URLSearchParams(window.location.search);
let showAuthRedirect = false;

if (authParams.has("code") && authParams.has("state")) {
  console.log("params present, starting login process");
  // TODO check for matching states
  firebaseCreateToken(authParams.get("code"))
    .then((result) => {
      firebaseSignIn(result);
    })
    .catch((err) => console.error(err));
} else {
  console.log("params not present");
  showAuthRedirect = true;
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
