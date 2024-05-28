// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDqwPfg0CBf2P_EABzpAWEchIqDZJhEko",
  authDomain: "tarif-sepeti-o.firebaseapp.com",
  projectId: "tarif-sepeti-o",
  storageBucket: "tarif-sepeti-o.appspot.com",
  messagingSenderId: "1072785350982",
  appId: "1:1072785350982:web:3b781299bd40f83c794547"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const storage = firebase.storage();

export { firebase, auth, storage };