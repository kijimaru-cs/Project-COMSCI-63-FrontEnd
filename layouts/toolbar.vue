<template>
  <v-app light>
    <v-app-bar app class="pa-0 ma-0">
      <v-app-bar-nav-icon>
        <div>
          <a href="/">
            <img src="KU_Logo_PNG.png" style="width:60px;height:60px;" />
          </a>
        </div>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <h1>Classroom</h1>
      </v-toolbar-title>
      <br />

      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import { mapGetters } from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
export default {
  data: () => ({}),
  async created() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        // // _this.findByEmail();
        // console.log(user.displayName);
        // console.log(user.email);
        // console.log(user.emailVerified);
        // console.log(user.uid);
        self.userEmail = user.email;
        // this.$store.dispatch("user/getDataByEmail", { email: user.email });
        // console.log(this.getUser.email);
        // ...
      } else {
        // User is signed out.
        // ...
      }
    });
  },
  //   watch: {
  //     getUser() {
  //       if (this.getUser) {
  //         console.log(getuser.email, "LOGIN SUCCESS");
  //       } else {
  //         console.log("LOGIN FAILED");
  //       }
  //     }
  //   },
  //   computed: {
  //     ...mapGetters({
  //       getUser: "user/getUser"
  //     })
  //   }
};
</script>

<style scoped>
.con-center {
  text-align: center;
}

.toolbar {
  width: 100%;
}
</style>
