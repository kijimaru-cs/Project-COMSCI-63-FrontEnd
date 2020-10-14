<template>
  <v-data-table
    :headers="headers"
    :items="dataUser"
    ort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>

      <v-toolbar flat>
        <v-toolbar-title>ข้อมูลนักเรียนที่ลงทะเบียนในห้องเรียน{{idRoom}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <div v-if="dataUs.role === 'TEACHER'">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemTeacher.username"
                          label="UserName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemTeacher.role"
                          label="Role"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemTeacher.subject"
                          label="subject"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </div>

              <div v-else-if="dataUs.role === 'STUDENT'">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemStudent.code"
                          label="Code"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemStudent.username"
                          label="UserName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemStudent.role"
                          label="Role"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </div>

              <div v-else-if="dataUs.role === 'CLASSROOM'">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemClassRoom.code"
                          label="CodeRoom"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItemClassRoom.name"
                          label="NameRoom"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-dialog>
        </v-toolbar
      >
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="updateData(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getRole">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { db } from "@/lib/firebase.js";
export default {
  data: () => ({
    idRoom: "",
    idStudentinRoom: "",
    dialog: false,
    headers: [],
    userRole: "",
    dataUser: [],
    dataUs: {},
    dataId: "",
    headerAll: [
      {
        text: "รหัสนิสิต",
        align: "start",
        sortable: false,
        value: "code",
      },
      { text: "ชื่อ", value: "username" },
      { text: "อีเมลล์", value: "email" },
      { text: "ตำเเหน่ง", value: "role" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    editedIndex: -1,
    editedItemClassRoom: {
      name: "",
      code: "",
    },
    defaultItemClassRoom: {
      name: "",
      code: "",
    },
    editedItemTeacher: {
      username: "",

      role: "",
      subject: "",
    },
    defaultItemTeacher: {
      username: "",
      role: "",
      subject: "",
    },
    editedItemStudent: {
      username: "",
      role: "",
      code: "",
    },
    defaultItemStudent: {
      username: "",
      role: "",
      code: "",
    },
  }),
  layout: "toolbar",
  mounted() {
    this.idRoom = this.$route.params.id;
    this.getRole();
  },
  computed: {},
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    async getRole() {
      try {
        if (this.userRole === "TEACHER") {
          this.headers = this.headerTeacher;
        } else if (this.userRole === "STUDENT") {
          this.headers = this.headerStudent;
        } else if (this.userRole === "CLASSROOM") {
          this.headers = this.headerClassRoom;
        } else {
          this.headers = this.headerAll;
        }
        console.log(this.userRole);
        // get id student in this room
        let snap = await db
          .collection("room")
          .where("code", "==", this.idRoom)
          .limit(1)
          .get();
        if (!snap.empty) {
          snap.forEach((doc) => {
            this.idStudentinRoom = doc.data().idStudent;
          });
        } else {
          alert("can't get any id student in this room");
        }
        this.idStudentinRoom.forEach((currentValue) => {
          let snapshot = db
            .collection("user")
            .doc(currentValue)
            .get()
            .then((doc) => {
              console.log(doc.data());
              this.dataUser.push(doc.data());
            })
            .catch((err) => {
              console.log(error);
            });
        });
      } catch (error) {
        console.log(error);
      }
    },

    updateData(item) {
      this.editedIndex = this.dataUser.indexOf(item);
      if (item.role === "TEACHER") {
        this.editedItemTeacher = Object.assign({}, item);
        delete this.editedItemTeacher.id;
      } else if (item.role === "STUDENT") {
        this.editedItemStudent = Object.assign({}, item);
        delete this.editedItemStudent.id;
      } else if (item.role === "CLASSROOM") {
        this.editedItemClassRoom = Object.assign({}, item);
        delete this.editedItemClassRoom.id;
      }
      console.log(item);
      this.dataUs = item;
      this.dialog = true;
      this.dataId = item.id;
    },

    async deleteItem(item) {
      //get id room and get idstudent in this room
      let idstudent = [];
      let docIdRoom = await db
        .collection("room")
        .where("code", "==", this.idRoom)
        .limit(1)
        .get();
      docIdRoom.forEach((doc) => {
        docIdRoom = doc.id;
        idstudent = doc.data().idStudent;
      });
      // get id student maybe delete
      let idStudentDelete = await db
        .collection("user")
        .where("email", "==", item.email)
        .limit(1)
        .get();
      idStudentDelete.forEach((doc) => {
        idStudentDelete = doc.id;
      });
      let indexItemDelete = idstudent.indexOf(idStudentDelete);
      let r = confirm("Delete " + item.username + " in this room ?");
      if (r == true) {
        idstudent.splice(indexItemDelete, 1);
        await db.collection("room").doc(docIdRoom).update({
          idStudent: idstudent,
        });
        window.location.reload();
        console.log("Complete");
      } else {
        console.log("press cancel");
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        if (this.dataUs.role === "TEACHER") {
          this.editedItemTeacher = Object.assign({}, this.defaultItemTeacher);
        } else if (this.dataUs.role === "STUDENT") {
          this.editedItemStudent = Object.assign({}, this.defaultItemStudent);
        } else if (this.dataUs.role === "CLASSROOM") {
          this.editedItemClassRoom = Object.assign(
            {},
            this.defaultItemClassRoom
          );
        }
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        if (this.dataUs.role === "TEACHER") {
          Object.assign(
            this.dataUser[this.editedIndex],
            this.editedItemTeacher
          );
          await db
            .collection("user")
            .doc(this.dataId)
            .update({
              ...this.editedItemTeacher,
            });
        } else if (this.dataUs.role === "STUDENT") {
          Object.assign(
            this.dataUser[this.editedIndex],
            this.editedItemStudent
          );
          await db
            .collection("user")
            .doc(this.dataId)
            .update({
              ...this.editedItemStudent,
            });
        } else if (this.dataUs.role === "CLASSROOM") {
          Object.assign(
            this.dataUser[this.editedIndex],
            this.editedItemClassRoom
          );
          await db
            .collection("room")
            .doc(this.dataId)
            .update({
              ...this.editedItemClassRoom,
            });
        }
      } else {
        if (this.dataUs.role === "TEACHER") {
          this.dataUser.push(this.editedItemTeacher);
        } else if (this.dataUs.role === "STUDENT") {
          this.dataUser.push(this.editedItemStudent);
        } else if (this.dataUs.role === "CLASSROOM") {
          this.dataUser.push(this.editedItemClassRoom);
        }
      }
      this.close();
    },
  },
};
</script>

<style scoped></style>
