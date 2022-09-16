import { signInWithCustomToken, signOut } from "firebase/auth";
import { auth } from "./firebase";

// TODO the token is fetched from discord oauth flow
// which is run on firebase cloud function
const login = (token) => {
  // TODO sign token as jwt??? with google key?? as cloud founction???
  const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJ1aWQiOiJ0ZXN0MTIzIiwiZXhwIjoxNjYzMzQxODMxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay03ZGRwMUBkaXNjb3JkLWltYWdlcy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLTdkZHAxQGRpc2NvcmQtaW1hZ2VzLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eXRvb2xraXQuZ29vZ2xlYXBpcy5jb20vZ29vZ2xlLmlkZW50aXR5LmlkZW50aXR5dG9vbGtpdC52MS5JZGVudGl0eVRvb2xraXQiLCJpYXQiOiIxNjYzMzM4MTU3In0.rdnotRpynLzm07P2kocb5esm6kDE3qAOrCAtjYkxTgQ";
  signInWithCustomToken(auth, jwtToken)
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
