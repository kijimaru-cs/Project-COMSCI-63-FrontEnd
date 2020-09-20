<template>
  <v-data-table
    :headers="headers"
    :items="dataUser"
    ort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-container fluid>
        <v-row align="center">
          <v-col class="d-flex" cols="2">
            <v-select
              v-model="userRole"
              :items="choice"
              label="roles"
              v-on:change="getRole"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

      <v-toolbar flat>
        <v-toolbar-title>ข้อมูลผู้ใช้</v-toolbar-title>
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
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
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
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
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
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
    dialog: false,
    headers: [],
    userRole: "",
    dataUser: [],
    dataUs: {},
    dataId: "",
    headerAll: [
      {
        text: "ชื่อ",
        align: "start",
        sortable: false,
        value: "username"
      },
      { text: "อีเมลล์", value: "email" },
      { text: "ตำเเหน่ง", value: "role" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    headerTeacher: [
      {
        text: "ชื่อ",
        align: "start",
        sortable: false,
        value: "username"
      },
      { text: "วิชา", value: "subject" },
      { text: "อีเมลล์", value: "email" },
      { text: "ตำเเหน่ง", value: "role" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    headerStudent: [
      {
        text: "รหัสนิสิต",
        align: "start",
        sortable: false,
        value: "code"
      },
      { text: "ชื่อ", value: "username" },
      { text: "อีเมลล์", value: "email" },
      { text: "ตำเเหน่ง", value: "role" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    headerClassRoom: [
      { text: "รหัสห้องเรียน", align: "start", sortable: false, value: "code" },
      { text: "ชื่อ", value: "name" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    choice: [
      {
        text: "ALLROLE",
        value: ""
      },
      {
        text: "TEACHER",
        value: "TEACHER"
      },

      {
        text: "STUDENT",
        value: "STUDENT"
      },
      { text: "CLASSROOM", value: "CLASSROOM" }
    ],
    editedIndex: -1,
    editedItemClassRoom: {
      name: "",
      code: ""
    },
    defaultItemClassRoom: {
      name: "",
      code: ""
    },
    editedItemTeacher: {
      username: "",

      role: "",
      subject: ""
    },
    defaultItemTeacher: {
      username: "",
      role: "",
      subject: ""
    },
    editedItemStudent: {
      username: "",
      role: "",
      code: ""
    },
    defaultItemStudent: {
      username: "",
      role: "",
      code: ""
    }
  }),
  mounted() {
    this.getRole();
  },
  computed: {},
  watch: {
    dialog(val) {
      val || this.close();
    }
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
        if (this.userRole === "CLASSROOM") {
          let snapshot = await db.collection("room");
          snapshot = await snapshot.where("role", "==", this.userRole);
          snapshot = await snapshot.get();
          const data = await Promise.all(
            snapshot.docs.map(async doc => {
              let item = {};
              item = await doc.data();
              item.id = doc.id;
              return item;
            })
          );
          this.dataUser = data;
        } else {
          let snapshot = await db.collection("user");
          if (this.userRole) {
            snapshot = await snapshot.where("role", "==", this.userRole);
          }
          snapshot = await snapshot.get();
          const data = await Promise.all(
            snapshot.docs.map(async doc => {
              let item = {};
              item = await doc.data();
              item.id = doc.id;
              return item;
            })
          );
          this.dataUser = data;
        }
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
      const index = this.dataUser.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.dataUser.splice(index, 1);
      console.log(this.dataUser);
      if (
        this.userRole === "TEACHER" ||
        this.userRole === "STUDENT" ||
        this.userRole === ""
      ) {
        await db
          .collection("user")
          .doc(item.id)
          .delete();
      } else if (this.userRole === "CLASSROOM") {
        await db
          .collection("room")
          .doc(item.id)
          .delete();
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
              ...this.editedItemTeacher
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
              ...this.editedItemStudent
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
              ...this.editedItemClassRoom
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
    }
  }
};
</script>

<style scoped></style>
