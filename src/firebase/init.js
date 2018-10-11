import firebase from 'firebase/app'
import firestore from 'firebase/firestore'
import storage from 'firebase/storage'
import auth from 'firebase/auth'
// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAV-ekDaKyNvGqB9c9KMMPTbowYPgS7Xb4",
  authDomain: "ninja-smoothie-50bc9.firebaseapp.com",
  databaseURL: "https://ninja-smoothie-50bc9.firebaseio.com",
  projectId: "ninja-smoothie-50bc9",
  storageBucket: "ninja-smoothie-50bc9.appspot.com",
  messagingSenderId: "448643038543"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});
const storageService = firebase.storage();
const storageRef = storageService.ref();
const authi = firebase.auth()

export {storageService, storageRef, db, authi}