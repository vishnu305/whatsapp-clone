// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyA-Wvk8IpHsiCF7deDsUm5Fm7GD3h6AqFs",
  authDomain: "whatsapp-clone-vishnu.firebaseapp.com",
  projectId: "whatsapp-clone-vishnu",
  storageBucket: "whatsapp-clone-vishnu.appspot.com",
  messagingSenderId: "619396544950",
  appId: "1:619396544950:web:57f2bdc0dea9ca88ca2917",
  measurementId: "G-GPN5KF59V4"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export {db,auth,provider};
