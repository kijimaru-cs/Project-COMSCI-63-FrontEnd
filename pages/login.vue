<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>
    <br />
    <br />
    <br />
    <p style="font-size:20px;color:#78909C">เข้าสู่ระบบห้องเรียน</p>
    <v-text-field label="Username" :rules="rules" hide-details="auto" v-model="username"></v-text-field>
    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      @keyup.enter="login()"
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
import * as firebase from "firebase/app";
import "firebase/auth";
export default {
  data: () => ({
    show1: false,
    username: "",
    password: "",
    error: "",
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters",
    ],
  }),
  layout: "toolbar",
  methods: {
    doSave() {
      alert("Username = " + this.username + "Password = " + this.password);
    },
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then((data) => {
          console.log(data.user.email);
          //fake role teacher
          if (data.user.email == "suravut2539@hotmail.com") {
            this.$router.push("/teacher/classroom");
          } else {
            this.$router.push("/student/classroom");
          }
        })
        .catch((error) => (this.error = error));
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
