<template>
  <div class="container">
    <p>This is teacher Screen</p>
    <button @click="logout">Logout</button>
    <p>{{ userEmail }}</p>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      userEmail: ""
    };
  },
  mounted() {
    this.setupFirebase();
  },
  layout: "toolbar",
  methods: {
    async setupFirebase() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log(user.displayName);
          console.log(user.email);
          console.log(user.emailVerified);
          console.log(user.uid);
          self.userEmail = user.email;
          // ...
        } else {
          // User is signed out.
          // ...
        }
      });
    },
    logout() {}
  }
};

Cookies.set("user-email", "userEmail", { expires: 1 });
</script>

<style>
.container {
  justify-items: center;
  align-items: center;
}
</style>
