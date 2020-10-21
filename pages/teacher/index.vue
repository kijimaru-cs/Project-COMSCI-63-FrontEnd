  <template>
  <div class="container">
    <h1 class="headerStyle">Teacher Room : {{email}}</h1>
    <br />
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="400">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="green darken-1" dark v-bind="attrs" v-on="on"
            >CREATE ROOM<v-icon > mdi-plus-circle-outline</v-icon></v-btn
          >
        </template>
        <v-card>
          <v-card-title class="headline">CREATE ROOM</v-card-title>
          <v-row>
            <v-col cols="12" sm="10">
              <v-text-field
                class="pl-3"
                v-model="nameRoom"
                label="NameRoom"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
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
            <v-btn color="green darken-1" text @click="createRoom"
              >CREATE</v-btn
            >
            <v-btn color="green darken-1" text @click="cancel">CANCEL</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <br/><br/>
    <div class="card">
      <v-card
        v-for="data in dataRoom"
        v-bind:key="data.id"
        class="d-inline-block mx-auto"
        height="200"
        width="200"
      >
        <v-container>
          <v-row justify="space-between">
            <v-col cols="auto" class="text-center pl-0">
              <v-row class="flex-column ma-0 fill-height" justify="center">
                <v-card-text>{{ data.name }}</v-card-text>
                <p>Code:{{ data.code }}</p>
                <v-btn
                  class="center"
                  style="color: white"
                  large
                  color="#00695C"
                  @click="pushClassroom(data.code)"
                  ><v-icon > mdi-play</v-icon>OPEN</v-btn
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
import { db, auth } from "@/lib/firebase";
import * as firebase from "firebase/app";
export default {
  data: () => ({
    dialog: false,
    nameRoom: "",
    codeRoom: "",
    dataRoom: [],
    role: "",
    email:"",
  }),
  layout: "normal",
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
    });
    this.getRoom();
   
  },
  
  methods: {
    pushClassroom(id) {
      this.$router.push(`/teacher/${id}`);
      this.$store.dispatch("classroom/getClassRoom", id);
    },
    async createRoom() {
      const snapshot = await db
        .collection("room")
        .where("code", "==", this.codeRoom)
        .limit(1)
        .get();
      // console.log(this.codeRoom);
      if (!snapshot.empty) {
        alert("This CodeRoom has already been used");
        this.codeRoom = "";
        this.nameRoom = "";
      } else {
        await db.collection("room").add({
          name: this.nameRoom,
          code: this.codeRoom,
          idTeacher: this.getUser.id
        });
        // console.log("Create Success");
      }
      this.nameRoom = "";
      this.codeRoom = "";
      const _this = this;
      _this.getRoom();
      this.dialog = false;
    },
    cancel() {
      this.nameRoom = "";
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
          .where(this.role, "==", this.getUser.id)
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

          // console.log(this.dataRoom.idStudent);
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
.headerStyle{
  color:#E65100;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
}
</style>
