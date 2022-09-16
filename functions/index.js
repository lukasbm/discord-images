"use strict";

import functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp();
const firestore = getFirestore(app);
const auth = getAuth(app);

exports.addMessage = functions.https.onRequest(async (req, res) => {
  // get data from body
  const authToken = req.body;

  // TODO get user id and guild data from discord api
  // https://discord.com/api/v10/users/@me
  // https://discord.com/api/v10/users/@me/guilds

  const userId = "TODO";
  const additionalClaims = {
    guilds: "TODO",
  };
  const jwtToken = createJwtToken(userId, additionalClaims);
  if (jwtToken) {
    // answer with token as plain text?
    // res.write()
  } else {
    // answer with error http code (expressjs)
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
