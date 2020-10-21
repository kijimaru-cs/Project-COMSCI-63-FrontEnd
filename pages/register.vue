<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>

    <v-container fluid>
      <v-row align="center">
          <v-select
            v-model="userRole"
            :items="choice"
            label="เลือกตำแหน่ง"
            dense
            outlined
          ></v-select>
      </v-row>
    </v-container>
    <div v-if="userRole != ''">
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
    </div>

    <div class="my-2">
      <v-btn
        class="center"
        style="color: white"
        depressed
        large
        color="#00695C"
        @click="validate"
        >Register</v-btn
      >
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/lib/firebase.js";
import { toLower, isEmpty } from "lodash";
var isNumber = require("lodash.isnumber");
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
      (value) => !!value || "Required.",
      (value) => (value && value.length <= 10) || "Max 10 characters",
      (value) => Number(value) === parseInt(value) || "ต้องเป็นตัวเลขเท่านั้น",
    ],
    rules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters",
    ],
    choice: [
      {
        text: "",
        value: "",
      },
      {
        text: "TEACHER",
        value: "TEACHER",
      },

      {
        text: "STUDENT",
        value: "STUDENT",
      },
    ],
  }),
  layout: "toolbar",
  mounted() {},
  methods: {
    async validate() {
      if (this.userRole === "STUDENT") {
        if (
          !isEmpty(this.code) &&
          !isEmpty(this.username) &&
          !isEmpty(this.password) &&
          !isEmpty(this.email)
        )
          if (
            Number(this.code) === parseInt(this.code) &&
            this.code.length == 10
          ) {
            if (this.password.length >= 8) {
              try {
                const snapshot = await db.collection("user").where("code","==",this.code).get();
                if(!snapshot.empty){
                  alert("Code has been used")
                }else{
                  const snapshot = await db.collection("user").where("email","==",this.email).get();
                  if(!snapshot.empty){
                    alert("Email has been used")
                  }
                  else{
                    try {
                      await auth.createUserWithEmailAndPassword(
                      this.email,
                      this.password
                      );
                        try {
                            await db.collection("user").add({
                              code: this.code,
                              username: this.username,
                              password: this.password,
                              email: toLower(this.email),
                              role: this.userRole,
                            });
                            alert("สมัครเสร็จสิ้น");
                            this.$router.push("/login");
                        } catch (error) {
                          alert(error);
                        }
                    } catch (error) {
                       alert(error);
                    }
                  }
                }
              } catch (error) {
                alert(error)
              }
            } else {
              alert("กรุณากรอก password มากกว่า 7 ตัว");
            }
          } else {
            alert("กรุณากรอก code เป็นตัวเลขและให้ครบ10ตัว");
          }
      } else {
        if (
          !isEmpty(this.username) &&
          !isEmpty(this.password) &&
          !isEmpty(this.email) &&
          !isEmpty(this.subject)
        ) {
          if (this.username.length > 2 && this.password.length > 7) {
            try {
              const snapshot = await db.collection("user").where("email","==",this.email).get();
              if(!snapshot.empty){
                  alert("Email has been used")
              }
              else{
                  try {
                    await auth.createUserWithEmailAndPassword(
                      this.email,
                      this.password
                    );
                  try {
                    if (this.userRole === "TEACHER") {
                      await db.collection("user").add({
                        username: this.username,
                        password: this.password,
                        email: toLower(this.email),
                        role: this.userRole,
                        subject: this.subject,
                      });
                    } else if (this.userRole === "STUDENT") {
                        await db.collection("user").add({
                          code: this.code,
                          username: this.username,
                          password: this.password,
                          email: toLower(this.email),
                          role: this.userRole,
                        });
                    }
                      alert("สมัครเสร็จสิ้น");
                      this.$router.push("/login");
              } catch (error) {
                alert(error);
              }
            } catch (error) {
              alert(error);
            }
              }
            } catch (error) {
              alert(error)
            }
          } else {
            alert(
              "กรุณากรอก password มากกว่า 7 ตัว หรือ username มากกว่า 3 ตัว"
            );
          }
        } else {
          alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        }
      }
    },
    doSave() {
      alert("Username = " + this.username + "Password = " + this.password);
    },
    async register() {
      try {
        await auth.createUserWithEmailAndPassword(this.email, this.password);
        try {
          if (this.userRole === "TEACHER") {
            await db.collection("user").add({
              username: this.username,
              password: this.password,
              email: toLower(this.email),
              role: this.userRole,
              subject: this.subject,
            });
          } else if (this.userRole === "STUDENT") {
            await db.collection("user").add({
              code: this.code,
              username: this.username,
              password: this.password,
              email: toLower(this.email),
              role: this.userRole,
            });
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
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
