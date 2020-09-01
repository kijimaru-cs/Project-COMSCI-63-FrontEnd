<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>
    <br />
    <br />
    <br />
    <p style="font-size:20px;color:#78909C">เข้าสู่ระบบห้องเรียนของนิสิต</p>
    <v-text-field label="E-mail" :rules="rules" hide-details="auto" v-model="email"></v-text-field>
    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 8 characters"
      counter
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
        @click="login"
      >Login</v-btn>
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
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters",
    ],
  }),
  layout: "toolbar",
  methods: {
    doSave() {
      alert("Username = " + this.email + "Password = " + this.password);
    },
    async login() {
      try {
        const snapshot = await db
          .collection("user")
          .where("email", "==", this.email)
          .get();
        if (snapshot.empty) return null;
        const docs = await Promise.all(
          snapshot.docs.map(async (doc) => {
            let item = {};
            item = await doc.data();
            item.id = doc.id;
            return item;
          })
        );
        if (docs[0].role != "admin") {
          throw userError({ message: "Role is incorrect" });
        }
      } catch (error) {
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

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>
