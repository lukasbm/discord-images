import { signInWithCustomToken, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase";

const firebaseSignIn = (jwt) => {
  signInWithCustomToken(auth, jwt)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((err) => {
      console.error(err);
    });
};

const firebaseSignOut = () => {
  signOut(auth)
    .then(() => console.log("sign out successful"))
    .catch((err) => console.error(err));
};

const buildDiscordRedirect = () => {
  const clientId = "1011648062915096627"; // TODO replace with vite env variable
  const redirectUri = window.location.origin;
  const redirectState = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 5);
  const authScope = "identify guilds";
  return {
    url:
      `https://discord.com/oauth2/authorize` +
      `?response_type=code&client_id=${encodeURIComponent(clientId)}` +
      `&scope=${encodeURIComponent(authScope)}` +
      `&state=${encodeURIComponent(redirectState)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&prompt=consent`,
    state: redirectState,
  };
};

const login = () => {
  // redirect to discord login
  const discordRedirect = buildDiscordRedirect();
  window.location.href = discordRedirect.url;
  // fetch token by parsing reponse params hash
  const hashParams = window.location.hash
    ?.substring(1)
    .split("&")
    .map((v) => v.split("="))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {});

  if (decodeURIComponent(hashParams["state"]) != discordRedirect.state) {
    throw new Error("states dont match.");
  }
  const authCode = hashParams["access_token"];

  // FIXME remove token from url
  window.location.hash = "";

  // use authCode to fetch jwt from firebase
  const discordAuth = httpsCallable(functions, "discordAuth");
  discordAuth({ authCode: authCode })
    .then((result) => {
      console.log("the firebase jtw token is", result);
      // attempt login
      firebaseSignIn(result.data.text);
    })
    .catch((err) => console.error(err));
};

export { firebaseSignIn, firebaseSignOut, login };
