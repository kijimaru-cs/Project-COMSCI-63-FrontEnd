<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>
    <br />
    <br />
    <br />
    <p style="font-size:20px;color:#78909C">เข้าสู่ระบบ Administator</p>
    <v-text-field
      v-model="email"
      label="E-mail"
      :rules="rules"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 8 characters"
      counter
      @keyup.enter="login"
      @click:append="show1 = !show1"
    ></v-text-field>
    <p style="color: red">{{ error }}</p>
    <p></p>
    <div class="my-2">
      <v-btn
        class="center"
        style="color: white"
        depressed
        large
        color="#00695C"
        @keyup.enter="login"
        @click="login"
        >Login</v-btn
      >
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/lib/firebase.js";
import errorVue from "../../layouts/error.vue";
import { userError } from "@/lib/error.js";

export default {
  data: () => ({
    show1: false,
    email: "",
    password: "",
    error: "",
    dataCheck: {},
    rules: [
      value => !!value || "Required.",
      value => (value && value.length >= 3) || "Min 3 characters"
    ]
  }),
  layout: "toolbar",
  methods: {
    doSave() {
      alert("Username = " + this.email + "Password = " + this.password);
    },
    async login() {
      try {
        await auth.signInWithEmailAndPassword(this.email, this.password);
        const _this = this;
        auth.onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            _this.findByEmail();
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
      } catch (error) {
        console.error(error);
      }
    },
    async findByEmail() {
      const snapshot = await db
        .collection("user")
        .where("email", "==", this.email)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const docs = await Promise.all(
        snapshot.docs.map(async doc => {
          let item = {};
          item = await doc.data();
          item.id = doc.id;
          return item;
        })
      );
      if (docs != null) {
        this.$router.push("/admin/edit");
      } else {
        console.log("LOGIN FAILED");
      }
    }
  }
};
</script>

<style scoped>
.container {
  justify-items: center;
}
.font-style {
  text-align: center;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>
