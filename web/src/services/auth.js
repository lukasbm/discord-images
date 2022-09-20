import { signInWithCustomToken, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase";
import { ref } from "vue";

const AuthenticationStatus = {
  unauthenticated: 0,
  authenticated: 1,
  authenticating: 2,
};

const authStatus = ref(AuthenticationStatus.unauthenticated);

const activeFirebaseUser = ref(null);

const userData = ref(null);

const cleanUp = () => {
  authStatus.value = AuthenticationStatus.unauthenticated;
  activeFirebaseUser.value = null;
  userData.value = null;
  localStorage.removeItem("firebaseJwt");
  sessionStorage.removeItem("lastDiscordAuthState");
};

const firebaseSignIn = async (jwt) => {
  console.log("firebase signing in with jwt:", jwt);
  authStatus.value = AuthenticationStatus.authenticating;
  try {
    const userCredential = await signInWithCustomToken(auth, jwt);
    activeFirebaseUser.value = userCredential.user;
    authStatus.value = AuthenticationStatus.authenticated;
    return true;
  } catch (err) {
    console.error(err);
    cleanUp();
    return false;
  }
};

const firebaseSignOut = () => {
  console.log("firebase signing out");
  signOut(auth)
    .then(() => {
      console.log("sign out successful");
    })
    .catch((err) => console.error(err))
    .finally(() => {
      cleanUp();
    });
};

const firebaseCreateToken = async (authCode) => {
  console.log("calling firebase cloud function");
  authStatus.value = AuthenticationStatus.authenticating;
  try {
    const discordAuth = httpsCallable(functions, "discordAuth");
    const result = await discordAuth({
      authCode: authCode,
      redirectUri: window.location.origin,
    });
    const jwt = result.data;
    console.log("the firebase jtw token is", jwt);
    localStorage.setItem("firebaseJwt", jwt);

    const payload = parseJwt(jwt);
    userData.value = {
      uid: payload["uid"],
      guilds: payload["claims"]["guilds"],
    };
    return jwt;
  } catch (err) {
    cleanUp();
    return null;
  }
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

async function startup() {
  // check jwt
  const checkJwt = async () => {
    console.log("checking for stored firebase jwt token");

    const jwt = localStorage.getItem("firebaseJwt");
    if (!jwt) return false;

    const payload = parseJwt(jwt);
    if (!payload) return false;

    console.log("jwt in local storage:", payload);

    if (
      !("exp" in payload) ||
      Date.now() > new Date(new Number(payload["exp"]) * 1000).getTime()
    )
      return false;

    const uid = payload["uid"] ?? undefined;
    const guilds = payload["claims"]["guilds"] ?? undefined;
    if (!guilds || !uid) return false;

    console.log("attempting sign in with stored jwt");
    userData.value = {
      uid: uid,
      guilds: guilds,
    };
    return await firebaseSignIn(jwt);
  };

  const checkAuthParams = () => {
    console.log("checking for parameters in url");

    let authParams = new URLSearchParams(window.location.search);
    if (!authParams.has("code") || !authParams.has("state")) {
      console.log("params not present");
      return false;
    }

    console.log("params present");
    if (
      sessionStorage.getItem("lastDiscordAuthState") != authParams.get("state")
    ) {
      console.log("states dont match");
      firebaseSignOut();
      return false;
    } else {
      console.log("states match");
      firebaseCreateToken(authParams.get("code"))
        .then((jwt) => {
          firebaseSignIn(jwt);
        })
        .catch((err) => console.error(err));
    }
  };

  const jwtOk = await checkJwt();

  if (!jwtOk) {
    console.log("jwt in localStorage broken");
    localStorage.removeItem("firebaseJwt");
    checkAuthParams();
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
