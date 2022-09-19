import { signInWithCustomToken, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase";
import { ref } from "vue";

const firebaseSignIn = (jwt) => {
  console.log("firebase signing in with jwt:", jwt);
  signInWithCustomToken(auth, jwt)
    .then(() => {
      console.log("firebase user");
      authStatus.value = AuthenticationStatus.authenticated;
    })
    .catch((err) => {
      console.error(err);
    });
};

const firebaseSignOut = () => {
  console.log("firebase signing out");
  signOut(auth)
    .then(() => {
      console.log("sign out successful");
      authStatus.value = AuthenticationStatus.unauthenticated;
    })
    .catch((err) => console.error(err));
};

// TODO error handling
const firebaseCreateToken = async (authCode) => {
  console.log("calling firebase cloud function");
  const discordAuth = httpsCallable(functions, "discordAuth");
  const result = await discordAuth({
    authCode: authCode,
    redirectUri: window.location.origin,
  });
  console.log("the firebase jtw token is", result.data);
  localStorage.setItem("firebaseJwt", result.data);
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
  sessionStorage.setItem("lastDiscordAuthState", redirectState);
  return (
    `https://discord.com/oauth2/authorize` +
    `?response_type=code&client_id=${encodeURIComponent(clientId)}` +
    `&scope=${encodeURIComponent(authScope)}` +
    `&state=${encodeURIComponent(redirectState)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&prompt=consent`
  );
};

const AuthenticationStatus = {
  unauthenticated: 0,
  authenticated: 1,
  authenticating: 2,
};

const authStatus = ref(AuthenticationStatus.unauthenticated);

const activeFirebaseUser = ref(null);

const userData = ref(null);

const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

function startup() {
  // check jwt
  const jwt = localStorage.getItem("firebaseJwt");
  let jwtOk = true;
  if (jwt != null) {
    const payload = parseJwt(jwt);
    if (!("exp" in payload) || Date.now() > payload["exp"]) jwtOk = false;
    const uid = payload["uid"] ?? undefined;
    const guilds = payload["claims"]["guilds"] ?? undefined;
    if (!guilds || !uid) jwtOk = false;
    else
      userData.value = {
        uid: uid,
        guilds: guilds,
      };
  } else {
    jwtOk = false;
  }

  if (!jwtOk) {
    localStorage.removeItem("firebaseJwt");

    let authParams = new URLSearchParams(window.location.search);
    if (authParams.has("code") && authParams.has("state")) {
      console.log("params present, starting login process");
      if (
        sessionStorage.getItem("lastDiscordAuthState") !=
        authParams.get("state")
      ) {
        console.log("states dont match");
        firebaseSignOut();
      } else {
        console.log("states match");
        firebaseCreateToken(authParams.get("code"))
          .then((result) => {
            firebaseSignIn(result);
          })
          .catch((err) => console.error(err));
      }
    } else {
      console.log("params not present");
    }
  }
}

startup();

export {
  firebaseSignIn,
  firebaseSignOut,
  firebaseCreateToken,
  buildDiscordRedirect,
  authStatus,
  AuthenticationStatus,
  activeFirebaseUser,
  userData,
};
