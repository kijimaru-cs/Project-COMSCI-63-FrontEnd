import * as firebase from 'firebase/app'
import 'firebase/auth'
var firebaseConfig = {
    apiKey: "AIzaSyAEBxUYrHfBMknjFdDtx-UIenZ-jPsM89g",
    authDomain: "project-comsci-63-authen.firebaseapp.com",
    databaseURL: "https://project-comsci-63-authen.firebaseio.com",
    projectId: "project-comsci-63-authen",
    storageBucket: "project-comsci-63-authen.appspot.com",
    messagingSenderId: "902864554028",
    appId: "1:902864554028:web:4d6b824237220136662989",
    measurementId: "G-S5LQYKBJ24"
  }; 
  // Initialize Firebase
  let app = null;
  if(!firebase.apps.length){
      app = firebase.initializeApp(firebaseConfig);
  }

  export default firebase