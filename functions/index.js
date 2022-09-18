"use strict";

import functions from "firebase-functions";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };

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

  try {
    let response = await fetch(`${discordApiBase}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    if (!response.ok) return undefined;
    else return response.json();
  } catch (err) {
    return undefined;
  }
};

const discordApiCall = async (resource, discordAuthToken) => {
  try {
    let response = await fetch(`${discordApiBase}/${resource}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${discordAuthToken}`,
      },
    });
    if (!response.ok) return undefined;
    else return response.json();
  } catch (err) {
    return undefined;
  }
};

export const discordAuth = functions.https.onCall(async (data, context) => {
  // parameter validation
  if (!data.authCode)
    throw new functions.https.HttpsError(
      "invalid-argument",
      "authCode not provided"
    );
  if (!data.redirectUri)
    throw new functions.https.HttpsError(
      "invalid-argument",
      "redirectUri not provided"
    );

  // discord access token exchange
  const discordToken = await discordCodeExchange(
    data.authCode,
    data.redirectUri
  );
  if (!discordToken)
    throw new functions.https.HttpsError(
      "permission-denied",
      "could not sign in to discord with the auth token"
    );

  // gather relevant userinfo
  const userinfo = await discordApiCall(
    "/users/@me",
    discordToken["access_token"]
  );
  if (!userinfo)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "could not request userinfo from the discord api"
    );

  // gather guilds a user is member of
  const guilds = await discordApiCall(
    "users/@me/guilds",
    discordToken["access_token"]
  );
  if (!guilds)
    throw new functions.https.HttpsError(
      "unauthenticated",
      "could not request guilds from the discord api"
    );

  const userId = userinfo["id"];
  const additionalClaims = {
    guilds: guilds.map((x) => x["id"]),
  };
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
    console.error("Error creating custom token:", error);
    return undefined;
  }
};
