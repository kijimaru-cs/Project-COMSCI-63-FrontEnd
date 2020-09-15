import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
