import { signInWithCustomToken, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase";

const firebaseSignIn = (jwt) => {
  console.log("firebase signing in with jwt:", jwt);
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
  console.log("firebase signing out");
  signOut(auth)
    .then(() => console.log("sign out successful"))
    .catch((err) => console.error(err));
};

const firebaseCreateToken = async (authCode) => {
  console.log("calling firebase cloud function");
  const discordAuth = httpsCallable(functions, "discordAuth");
  const result = await discordAuth({
    authCode: authCode,
    redirectUri: window.location.origin,
  });
  console.log("the firebase jtw token is", result.data);
  return result.data;
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

export {
  firebaseSignIn,
  firebaseSignOut,
  firebaseCreateToken,
  buildDiscordRedirect,
};
