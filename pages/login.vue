<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>
    <br />
    <br />
    <br />
    <p class="input" style="font-size: 30px; color: #78909c">เข้าสู่ระบบห้องเรียน</p>
    <div class="input">
    <v-text-field
      label="E-mail"
      :rules="rules"
      hide-details="auto"
      v-model="email"
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
    </div>
    <p class="input" style="color: red">{{ error }}</p>
    <p></p>
    <div class="my-2">
      <v-btn
        class="center"
        style="color: white"
        depressed
        large
        color="#00695C"
        @click="login"
        >Login<v-icon > mdi-login</v-icon></v-btn
      >
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/lib/firebase.js";
import { toLower } from "lodash";

export default {
  data: () => ({
    show1: false,
    localData: {},
    email: "",
    password: "",
    error: "",
    dataCheck: {},
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters",
    ],
  }),
  layout: "toolbar",
  mounted() {
    this.Signout();
  },
  methods: {
    Signout() {
      auth
        .signOut()
        .then(function () {})
        .catch(function (error) {
          // An error happened.
        });
    },

    async login() {
      try {
        await auth.signInWithEmailAndPassword(this.email, this.password);
        const data = await new Promise((resolve, reject) =>
          auth.onAuthStateChanged(async (user) => {
            resolve(user);
          })
        );
        if (data) {
          const snapshot = await db
            .collection("user")
            .where("email", "==", toLower(data.email))
            .limit(1)
            .get();
          if (!snapshot.empty) {
            const [docs] = await Promise.all(
              snapshot.docs.map(async (doc) => {
                let item = {};
                item = await doc.data();
                item.id = doc.id;
                return item;
              })
            );
            this.$store.dispatch("user/getDataByEmail", docs);
            if (docs) {
              if (docs.role === "STUDENT") {
                this.$router.push("/student");
              } else if (docs.role === "TEACHER") {
                this.$router.push("/teacher");
              }
              console.log("LOGIN SUCCESS");
            } else {
              auth
                .signOut()
                .then(function () {
                  // Sign-out successful.
                })
                .catch(function (error) {
                  // An error happened.
                });
              console.log("LOGIN FAILED");
            }
          }
          // console.log("data", data);
        }
      } catch (error) {
        this.error = error
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  justify-items: center;
}
.font-style {
  text-align: center;
}

.input{
  width: 50%;
  margin-left: auto;
  margin-right: auto;

}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>
