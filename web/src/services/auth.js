import { signInWithCustomToken, signOut } from "firebase/auth";
import { auth } from "./firebase";

// TODO the token is fetched from discord oauth flow
// which is run on firebase cloud function
const login = (token) => {
  signInWithCustomToken(auth, token)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((err) => {
      console.error(err);
    });
};

const logout = () => {
  signOut(auth)
    .then(() => console.log("sign out successful"))
    .catch((err) => console.error(err));
};

export { login, logout };
