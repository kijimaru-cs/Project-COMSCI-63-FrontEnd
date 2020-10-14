<template>
  <div class="container">
    <p>This is Student Screen</p>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">JOIN ROOM</v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">JOIN ROOM</v-card-title>

          <v-row>
            <v-col cols="12" sm="10">
              <v-text-field
                class="pl-3"
                v-model="codeRoom"
                label="Code"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="createRoom">JOIN</v-btn>
            <v-btn color="green darken-1" text @click="cancel">CANCEL</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <div class="card">
      <v-card
        v-for="data in dataRoom"
        v-bind:key="data.id"
        class="d-inline-block mx-auto"
        height="300"
        width="300"
      >
        <v-container>
          <v-row justify="space-between">
            <v-col cols="auto" class="text-center pl-0">
              <v-row class="flex-column ma-0 fill-height" justify="center">
                <v-card-text>{{ data.name }}</v-card-text>
                <v-btn
                  class="center"
                  style="color: white"
                  large
                  color="#00695C"
                  @click="pushClassroom(data.code)"
                  >OPEN</v-btn
                >
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/lib/firebase";
import * as firebase from "firebase/app";
export default {
  data: () => ({
    dialog: false,
    codeRoom: "",
    dataRoom: [],
    role: "",
    userIdStudent: "",
    idStudent: "",
    userEmail: "",
    idRoom: ""
  }),
  layout: "normal",
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userEmail = user.email;
      } else {
        this.$router.push("/");
      }
    });

    this.getRoom();
  },
  methods: {
    pushClassroom(id) {
      this.$router.push(`/student/${id}`);
      this.$store.dispatch("classroom/getClassRoom", id);
    },
    async createRoom() {
      //get room id and get idStudent all
      const snapshot = await db
        .collection("room")
        .where("code", "==", this.codeRoom)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          this.idRoom = doc.id;
          if (!doc.data().idStudent) {
            this.idStudent = ["DummyCode101"];
          } else {
            this.idStudent = doc.data().idStudent;
          }
        });
      } else {
        console.log("JOIN Success");
      }
      //get userIdStudent
      const snapshot2 = await db
        .collection("user")
        .where("email", "==", this.userEmail)
        .limit(1)
        .get();
      if (!snapshot2.empty) {
        snapshot2.forEach(doc => {
          this.userIdStudent = doc.id;
        });
      } else {
      }
      this.idStudent.push(this.userIdStudent);
      let unique = [...new Set(this.idStudent)];
      //Add room
      await db
        .collection("room")
        .doc(this.idRoom)
        .update({
          idStudent: unique
        });
      this.codeRoom = "";
      const _this = this;
      _this.getRoom();
      this.dialog = false;
    },
    cancel() {
      this.codeRoom = "";
      this.dialog = false;
    },
    async getRoom() {
      try {
        if (this.getUser.role === "TEACHER") {
          this.role = "idTeacher";
        } else if (this.getUser.role === "STUDENT") {
          this.role = "idStudent";
        }
        const snapshot = await db
          .collection("room")
          .where(this.role, "array-contains", this.getUser.id)
          .get();
        if (!snapshot.empty) {
          this.dataRoom = await Promise.all(
            snapshot.docs.map(async doc => {
              let item = {};
              item = await doc.data();
              item.id = doc.id;
              return item;
            })
          );
        }
      } catch (error) {
        console.log(this.getUser.id);
        console.log(error);
      }
    }
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser"
    })
  }
};
</script>

<style>
.container {
  justify-items: center;
  align-items: center;
}
.card {
  padding: 5;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>
