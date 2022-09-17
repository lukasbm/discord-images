"use strict";

import functions from "firebase-functions";
import { initializeApp, refreshToken } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp();
const auth = getAuth(app);

const discordApiBase = "https://discord.com/api/v10/";

const discordCodeExchange = async (authCode, redirectUri) => {
  let response = await fetch(`${discordApiBase}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: redirectUri,
    }),
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

exports.discordAuth = functions.https.onCall(async (data, context) => {
  // fetch token for authCode

  // discord access token exchange
  discordCodeExchange(data.authCode)

  // TODO move this to client front end
  // TODO get user id and guild data from discord api
  // https://discord.com/api/v10/users/@me
  // https://discord.com/api/v10/users/@me/guilds
  fetch();

  // TODO check if discord token is still valid before signin jwt token on it
  const userId = "TODO"; // TODO get from
  const additionalClaims = {
    guilds: "TODO",
  };
  const jwtToken = createJwtToken(userId, additionalClaims);
  // TODO can i use this token to directly authenticate caller?
  if (jwtToken) {
    return;
  } else {
    throw new functions.https.HttpsError(
      "permission-denied",
      "discord-token invalid"
    );
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
