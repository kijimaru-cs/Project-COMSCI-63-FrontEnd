<template>
  <div class="container">
    <div class="statusRoom">
      <h1>Online</h1>
      <p v-for="data in this.onlineUsername" :key="data.index">
        {{ data }}
        <br />
      </p>
    </div>
    <div class="screenRoom">
      <center>
        <video
          width="80%"
          max-width="400px"
          :srcObject.prop="videoElem"
          autoplay="autoplay"
          controls
        ></video>
        <audio :srcObject.prop="audioElem" controls></audio>
        <br />
        <v-btn
          style="color: white"
          color="#00695C"
          @click="startCapture"
          :disabled="buttonStart"
          >Start Share Screen</v-btn
        >
        <v-btn
          style="color: white"
          color="#00695C"
          @click="stopCapture"
          :disabled="buttonStop"
          >Stop Share Screen</v-btn
        >
        <br />
      </center>

      <v-row justify="center">
        <v-dialog v-model="dialog" scrollable max-width="1000px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-3" color="#00695C" dark v-bind="attrs" v-on="on"
              >Create Quiz And Test</v-btn
            >
            <v-btn
              class="mt-3 ml-1"
              style="color: white"
              color="#00695C"
              @click="goto"
              >Show Quiz And Test</v-btn
            >
          </template>
          <v-date-picker v-model="date" :min="dateMin"></v-date-picker>
          <v-card>
            <v-card-title>สร้างเเบบฝึกหัดหรือข้อสอบ</v-card-title>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="11" sm="5">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="textStart"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="textStart"
                      label="TimeStart"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu1"
                    v-model="timerStart"
                    full-width
                    @click:minute="$refs.menu1.save(timerStart)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="11" sm="5">
                <v-menu
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="textEnd"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="textEnd"
                      label="TimeEnd"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menu2"
                    v-model="timerEnd"
                    full-width
                    @click:minute="$refs.menu2.save(timerEnd)"
                  ></v-time-picker>
                </v-menu>
                <v-spacer></v-spacer>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="11" sm="5">
                <v-select
                  v-model="Example"
                  :items="choice"
                  label="type"
                ></v-select>
              </v-col>
            </v-row>

            <v-col cols="10" sm="6" md="3">
              <v-text-field
                v-model="nameTitle"
                label="FileName"
                outlined
              ></v-text-field>
            </v-col>

            <v-card-subtitle v-if="Example === 'CHOICE'" class="pt-3"
              >ข้อที่ {{ countChoice + 1 }}</v-card-subtitle
            >
            <v-card-subtitle v-else-if="Example === 'WRITING'" class="pt-3"
              >ข้อที่ {{ countWriting + 1 }}</v-card-subtitle
            >
            <v-col cols="10" sm="6" md="3">
              <v-text-field
                v-model="Quizetion"
                label="Quetion"
                outlined
              ></v-text-field>
              <a v-if="Example === 'CHOICE'">
                <v-text-field
                  v-model="choice1"
                  label="Choice1"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="choice2"
                  label="Choice2"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="choice3"
                  label="Choice3"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="choice4"
                  label="Choice4"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="answer"
                  label="Answer"
                  outlined
                ></v-text-field>
              </a>
            </v-col>

            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="blue darken-1" text @click="close">Close</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              <v-btn color="blue datken-1" text @click="next">Next</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <template>
          <div class="text-center">
            <v-dialog v-model="displayCard" width="500">
              <v-card>
                <v-card-title class="headline grey lighten-2"> </v-card-title>
                ชื่อซ้ำ
                <v-card-text>
                  ชื่อข้อสอบหรือชื่อเเบบฝึกหัดที่คุณตั้งนั้นมีอยู่เเล้ว
                  กรุณาเปลี่ยนชื่อข้อสอบหรือเเบบฝึกหัดใหม่
                </v-card-text>
                <v-divider></v-divider>
                <v-btn elevation="2" @click="closeDisplayCard">Ok</v-btn>
              </v-card>
            </v-dialog>
          </div>
        </template>
        <template>
          <div class="text-center">
            <v-dialog v-model="displayTime" width="500">
              <v-card>
                <v-card-title class="headline grey lighten-2"> </v-card-title>
                ช่วงเวลาไม่ตรงตามเงี่ยนไข
                <v-card-text>
                  ช่วงเวลาที่ท่านเลือกนั้นได้เลยมาเเล้ว
                </v-card-text>
                <v-divider></v-divider>
                <v-btn elevation="2" @click="closeDisplayTime">Ok</v-btn>
              </v-card>
            </v-dialog>
          </div>
        </template>
        <template>
          <div class="text-center">
            <v-dialog v-model="checkText" width="500">
              <v-card>
                <v-card-title class="headline grey lighten-2"> </v-card-title>
                กรอกข้อมูลไม่ครบ
                <v-card-text>
                  กรุณากรอกข้อมูลให้ครบทุกช่อง
                </v-card-text>
                <v-divider></v-divider>
                <v-btn elevation="2" @click="closeCheckText">Ok</v-btn>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-row>
    </div>
    <div class="chatRoom">
      <v-row justify="center" align="start"></v-row>
      <v-container
        id="scroll-target"
        style="max-height: 500px"
        class="overflow-y-auto"
      >
        <v-row
          class="p"
          v-scroll:#scroll-target="onScroll"
          align="start"
          justify="start"
          style="max-height: 600px"
          >{{ comment }}</v-row
        >
      </v-container>
      <v-text-field
        label="Comment!!"
        v-model="messageComment"
        @keyup.enter="sendMessage(messageComment)"
      ></v-text-field>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import * as firebase from "firebase/app";
import { mapGetters } from "vuex";
import { db } from "@/lib/firebase.js";
import "firebase/auth";
import Cookies from "js-cookie";
import { isEmpty } from "lodash";
import moment from "moment";
const io = require("socket.io-client");
// const socket = io("http://35.197.137.197:3001/");
const socket = io("http://localhost:3001/");
const peerConnectionsVideo = {};
const peerConnectionsAudio = {};
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};
var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};
export default {
  data() {
    return {
      displayCard: false,
      displayTime: false,
      checkText: false,
      checkTextNull: false,
      countChoice: 0,
      date: moment().format("YYYY-MM-DD"),
      dateString: "",
      dateMin: moment().format("YYYY-MM-DD"),
      countWriting: 0,
      Example: "",
      Quizetion: "",
      choice1: "",
      choice2: "",
      choice3: "",
      choice4: "",
      answer: "",
      type: "",
      time: null,
      nameTitle: "",
      timerStart: null,
      timerEnd: null,
      menu1: false,
      menu2: false,
      dataChoice: [
        // {
        //   // question: "",
        //   // choiceOne: "",
        //   // choiceTwo: "",
        //   // choiceThree: "",
        //   // choiceFour: "",
        //   // Answer: ""
        // }
      ],
      dataWriting: [
        // { question: "" }
      ],
      dialogm1: "",
      dialog: false,
      buttonStart: false,
      buttonStop: true,
      offsetTop: 0,
      user: "",
      userEmail: "",
      comment: "",
      messageComment: "",
      video: null,
      videoElem: null,
      audioElem: null,
      textStart: "",
      textEnd: "",
      choice: [
        {
          text: "choice",
          value: "CHOICE"
        },
        {
          text: "writing",
          value: "WRITING"
        }
      ]
    };
  },
  mounted() {
    this.dateString = this.date.toString("YYYY-MM-DD");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        // console.log(user.displayName);
        // console.log(user.email);
        // console.log(user.emailVerified);
        // console.log(user.uid);
        this.userEmail = user.email;
        // ...
      } else {
        // User is signed out.
        // ...
      }
    });
    socket.on("sendMessage", msg => {
      this.comment = this.comment + msg.messageComment + "\n";
    });
    socket.on("answerVideo", (id, description) => {
      peerConnectionsVideo[id].setRemoteDescription(description);
    });
    socket.on("answerAudio", (id, description) => {
      peerConnectionsAudio[id].setRemoteDescription(description);
    });
    socket.on("watcherVideo", id => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnectionsVideo[id] = peerConnection;

      let streamVideo = this.videoElem;
      streamVideo
        .getTracks()
        .forEach(track => peerConnection.addTrack(track, streamVideo));
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidateVideo", id, event.candidate);
        }
      };
      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offerVideo", id, peerConnection.localDescription);
        });
    });
    socket.on("watcherAudio", id => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnectionsAudio[id] = peerConnection;

      let streamAudio = this.audioElem;
      streamAudio
        .getTracks()
        .forEach(track => peerConnection.addTrack(track, streamAudio));
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidateAudio", id, event.candidate);
        }
      };
      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offerAudio", id, peerConnection.localDescription);
        });
    });
    socket.on("candidateVideo", (id, candidate) => {
      peerConnectionsVideo[id].addIceCandidate(new RTCIceCandidate(candidate));
    });
    socket.on("candidateAudio", (id, candidate) => {
      peerConnectionsAudio[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("disconnectPeer", id => {
      peerConnectionsVideo[id].close();
      delete peerConnectionsVideo[id];
      peerConnectionsAudio[id].close();
      delete peerConnectionsAudio[id];
    });
  },
  layout: "toolbarClassroom",
  methods: {
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    async startCapture() {
      navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then(mediaStream => {
          this.videoElem = mediaStream;
          socket.emit("broadcasterVideo");
          (this.buttonStart = true), (this.buttonStop = false);
        });
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(mediaStream => {
          this.audioElem = mediaStream;
          socket.emit("broadcasterAudio");
        })
        .catch(err => {
          console.error("Error: " + err);
        });
    },

    stopCapture() {
      (this.buttonStart = false), (this.buttonStop = true);
      this.videoElem.getTracks().forEach(track => track.stop());
      this.audioElem.getTracks().forEach(track => track.stop());
    },
    logout() {},
    sendMessage(messageComment) {
      messageComment = this.userEmail + " : " + messageComment;
      socket.emit("sendMessage", { messageComment });
      this.messageComment = "";
    },
    async next() {
      if (this.Example === "CHOICE") {
        if (
          this.date === "" ||
          this.textStart === "" ||
          this.textEnd === "" ||
          this.Quizetion === "" ||
          this.choice1 === "" ||
          this.choice2 === "" ||
          this.choice3 === "" ||
          this.choice4 === "" ||
          this.answer === ""
        ) {
          this.checkTextNull = false;
        } else {
          this.checkTextNull = true;
        }
      } else if (this.Example === "WRITING") {
        if (
          this.date === "" ||
          this.textStart === "" ||
          this.textEnd === "" ||
          this.Quizetion === ""
        ) {
          this.checkTextNull = false;
        } else {
          this.checkTextNull = true;
        }
      }
      if (this.checkTextNull === false) {
        this.checkText = true;
      } else {
        if (this.Example === "CHOICE") {
          this.countChoice = this.countChoice + 1;
          this.dataChoice.push({
            type: this.Example,
            countChoice: this.countChoice,
            question: this.Quizetion,
            choiceOne: this.choice1,
            choiceTwo: this.choice2,
            choiceThree: this.choice3,
            choiceFour: this.choice4,
            answer: this.answer
          });
          this.Quizetion = "";
          this.choice1 = "";
          this.choice2 = "";
          this.choice3 = "";
          this.choice4 = "";
          this.answer = "";
        } else {
          this.countWriting = this.countWriting + 1;
          this.dataWriting.push({
            type: this.Example,
            countWriting: this.countWriting,
            question: this.Quizetion
          });
          this.Quizetion = "";
        }
      }
    },
    close() {
      this.nameTitle = "";
      this.dialog = false;
      this.dataWriting = "";
      this.dataChoice = "";
      this.Quizetion = "";
      this.choice1 = "";
      this.choice2 = "";
      this.choice3 = "";
      this.choice4 = "";
      this.answer = "";
      this.textStart = "";
      this.textEnd = "";
      this.countWriting = 0;
      this.countChoice = 0;
      this.Example = "";
    },
    async save() {
      const snapshot = await db
        .collection("exam")
        .where("nameTitle", "==", this.nameTitle)
        .limit(1)
        .get();
      let beforeStart;
      let beforeEnd;
      beforeStart = moment(
        `${this.date} ${this.textStart}`,
        "YYYY-MM-DD HH:mm"
      );
      beforeEnd = moment(`${this.date} ${this.textEnd}`, "YYYY-MM-DD HH:mm");
      if (this.Example === "CHOICE") {
        if (
          this.date === "" ||
          this.textStart === "" ||
          this.textEnd === "" ||
          this.Quizetion === "" ||
          this.choice1 === "" ||
          this.choice2 === "" ||
          this.choice3 === "" ||
          this.choice4 === "" ||
          this.answer === ""
        ) {
          this.checkTextNull = false;
        } else {
          this.checkTextNull = true;
        }
      } else if (this.Example === "WRITING") {
        if (
          this.date === "" ||
          this.textStart === "" ||
          this.textEnd === "" ||
          this.Quizetion === ""
        ) {
          this.checkTextNull = false;
        } else {
          this.checkTextNull = true;
        }
      }
      if (this.checkTextNull === false) {
        this.checkText = true;
      } else if (!snapshot.empty) {
        this.displayCard = true;
      } else if (moment().isAfter(beforeStart) || moment().isAfter(beforeEnd)) {
        this.displayTime = true;
      } else {
        if (this.Example === "CHOICE") {
          this.countChoice = this.countChoice + 1;
          this.dataChoice.push({
            type: this.Example,
            countChoice: this.countChoice,
            question: this.Quizetion,
            choiceOne: this.choice1,
            choiceTwo: this.choice2,
            choiceThree: this.choice3,
            choiceFour: this.choice4,
            answer: this.answer
          });
        } else {
          this.countWriting = this.countWriting + 1;
          this.dataWriting.push({
            type: this.Example,
            countWriting: this.countWriting,
            question: this.Quizetion
          });
        }
        try {
          let itemQuestion = [];
          if (!isEmpty(this.dataChoice)) {
            itemQuestion = this.dataChoice;
          }
          if (!isEmpty(this.dataWriting)) {
            itemQuestion = [...itemQuestion, ...this.dataWriting];
          }

          await db.collection("exam").add({
            codeClass: this.getClass.code,
            nameTitle: this.nameTitle,
            date: this.date,
            timeStart: this.textStart,
            timeEnd: this.textEnd,
            itemQuestion
          });
        } catch (error) {
          console.log(error);
        }
        this.dialog = false;
        this.nameTitle = "";
        this.dataWriting = "";
        this.dataChoice = "";
        this.Quizetion = "";
        this.choice1 = "";
        this.choice2 = "";
        this.choice3 = "";
        this.choice4 = "";
        this.answer = "";
        this.textStart = "";
        this.textEnd = "";
        this.countWriting = 0;
        this.countChoice = 0;
      }
    },
    goto() {
      this.$router.push(`/exam`);
    },
    closeDisplayCard() {
      this.nameTitle = "";
      this.displayCard = false;
    },
    closeDisplayTime() {
      this.textStart = "";
      this.textEnd = "";
      this.displayTime = false;
    },
    closeCheckText() {
      this.checkText = false;
    }
  },
  computed: {
    ...mapGetters({
      getClass: "classroom/getClass"
    })
  }
};

Cookies.set("user-email", "userEmail", { expires: 1 });
</script>

<style>
.container {
  justify-items: center;
  align-items: center;
  flex-direction: row;
  display: flex;
  height: 100%;
}
.screenRoom {
  justify-items: center;
  align-items: center;
  height: 100%;
  width: 75%;
  padding-left: 0;
  border: 1px solid;
  padding: 10px;
  box-shadow: 5px 5px 5px #00695c;
}
.chatRoom {
  justify-items: center;
  align-items: center;
  height: 100%;
  width: 25%;
  border: 1px solid;
  padding: 10px;
  box-shadow: 15px 15px 15px #00695c;
}
.buttonChat {
  position: relative;
  margin-top: 200%;
}
.p {
  color: green;
  white-space: pre-line;
}
</style>
