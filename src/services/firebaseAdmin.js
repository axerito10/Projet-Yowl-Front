import { initializeApp, credential as _credential } from "firebase-admin";

import serviceAccount from "./firebase.json";

initializeApp({
  credential: _credential.cert(serviceAccount),
  databaseURL: "https://skills-6f7df-default-rtdb.europe-west1.firebasedatabase.app"
});
