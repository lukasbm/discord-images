"use strict";

import functions from "firebase-functions";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../serviceAccount.json" assert { type: "json" };

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = cert(serviceAccount);
const app = initializeApp(adminConfig);
const auth = getAuth(app);

const discordApiBase = "https://discord.com/api/v10/";

const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;

const discordCodeExchange = async (authCode, redirectUri) => {
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", "authorization_code");
  params.append("code", authCode);
  params.append("redirect_uri", redirectUri);

  let response = await fetch(`${discordApiBase}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  return response.json();
};

const discordApiCall = async (resource, discordAuthToken) => {
  let response = await fetch(`${discordApiBase}/${resource}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${discordAuthToken}`,
    },
  });
  return response.json();
};

const discordCodeRefresh = async (refreshToken) => {
  let response = await fetch(`${discordApiBase}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  return response.json();
};

export const discordAuth = functions.https.onCall(async (data, context) => {
  // discord access token exchange
  const discordToken = await discordCodeExchange(
    data.authCode,
    "http://localhost:5173"
  ); // TODO redirect uri
  console.log("discordToken:", discordToken);

  // gather relevant userinfo
  const userinfo = await discordApiCall(
    "/users/@me",
    discordToken["access_token"]
  );
  const guilds = await discordApiCall(
    "users/@me/guilds",
    discordToken["access_token"]
  );

  console.log("userinfo:", userinfo);
  console.log("guilds:", guilds);

  const userId = userinfo["id"];
  const additionalClaims = {
    guilds: guilds.map((x) => x["id"]),
  };
  // TODO can i use this token to directly authenticate the caller?
  const jwtToken = await createJwtToken(userId, additionalClaims);
  if (jwtToken) {
    return jwtToken;
  } else {
    throw new functions.https.HttpsError("permission-denied", "TODO");
  }
});

const createJwtToken = async (userId, additionalClaims) => {
  try {
    return auth.createCustomToken(userId, additionalClaims);
  } catch (error) {
    console.log("Error creating custom token:", error);
    return undefined;
  }
};

// not needed if i put the allowed servers in the additional claims of the createJwtToken
// const createFirebaseUser = () => {
//   auth
//     .createUser({
//       uid: "some-uid",
//       email: "user@example.com",
//       phoneNumber: "+11234567890",
//       providerToLink,
//     })
//     .then((userRecord) => {
//       console.log("Successfully created new user:", userRecord.uid);
//     })
//     .catch((error) => {
//       console.log("Error creating new user:", error);
//     });
// };
