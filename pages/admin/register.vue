<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>

    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="userRole"
            :items="choice"
            label="role"
            dense
            outlined
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <v-text-field
      v-if="userRole === 'STUDENT'"
      label="StudentCode"
      :rules="rulesCode"
      hide-details="auto"
      v-model="code"
    ></v-text-field>

    <v-text-field
      label="Username"
      :rules="rules"
      hide-details="auto"
      v-model="username"
    ></v-text-field>

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

    <v-text-field
      v-model="email"
      :type="show1 ? 'text' : 'email'"
      name="input-10-1"
      label="E-mail"
    ></v-text-field>

    <v-text-field
      v-if="userRole === 'TEACHER'"
      v-model="subject"
      :type="show1 ? 'text' : 'subject'"
      label="Subject"
    ></v-text-field>

    <div class="my-2">
      <v-btn
        class="center"
        style="color:white"
        depressed
        large
        color="#00695C"
        @click="register"
        >Register</v-btn
      >
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/lib/firebase.js";

export default {
  data: () => ({
    show1: false,
    subject: "",
    code: "",
    username: "",
    password: "",
    userRole: "",
    email: "",
    role: "",
    pass: false,
    rulesCode: [
      value => !!value || "Required.",
      value => (value && value.length <= 10) || "Max 10 characters"
    ],
    rules: [
      value => !!value || "Required.",
      value => (value && value.length >= 3) || "Min 3 characters"
    ],
    choice: [
      {
        text: "",
        value: ""
      },
      {
        text: "TEACHER",
        value: "TEACHER"
      },

      {
        text: "STUDENT",
        value: "STUDENT"
      }
    ]
  }),
  layout: "toolbar",
  mounted() {},
  methods: {
    doSave() {
      alert("Username = " + this.username + "Password = " + this.password);
    },
    async register() {
      try {
        await auth.createUserWithEmailAndPassword(this.email, this.password);
        this.pass = true;
      } catch (error) {
        console.log(error);
      }
      if (this.pass === true) {
        try {
          await auth.signInWithEmailAndPassword(this.email, this.password);
        } catch (error) {
          console.log(error);
        }

        try {
          await db.collection("user").add({
            username: this.username,
            password: this.password,
            email: this.email,
            role: this.userRole
          });
        } catch (error) {
          console.log(error);
        }
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
