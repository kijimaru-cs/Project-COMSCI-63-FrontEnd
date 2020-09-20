<template>
  <div class="container">
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
        <v-dialog v-model="dialog" scrollable max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-3" color="#00695C" dark v-bind="attrs" v-on="on">
              Create Quize And Test
            </v-btn>
          </template>
          <v-card>
            <v-card-title>เเบบฝึกหัดหรือข้อสอบ</v-card-title>
            <v-divider></v-divider>
            <v-row
              ><v-col>
                <v-select
                  v-model="Example"
                  :items="choice"
                  label="type"
                ></v-select> </v-col
            ></v-row>

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
import { db } from "@/lib/firebase.js";
import "firebase/auth";
import Cookies from "js-cookie";
import { isEmpty } from "lodash";
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
      countChoice: 0,
      countWriting: 0,
      Example: "",
      Quizetion: "",
      choice1: "",
      choice2: "",
      choice3: "",
      choice4: "",
      answer: "",
      dataChoice: [
        {
          question: "",
          choiceOne: "",
          choiceTwo: "",
          choiceThree: "",
          choiceFour: "",
          Answer: ""
        }
      ],
      dataWriting: [{ question: "" }],
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
  layout: "toolbar",
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
    next() {
      if (this.Example === "CHOICE") {
        console.log("dataChoice", {
          countChoice: this.countChoice,
          question: this.Quizetion,
          choiceOne: this.choice1,
          choiceTwo: this.choice2,
          choiceThree: this.choice3,
          choiceFour: this.choice4,
          answer: this.answer
        });
        this.dataChoice.push({
          countChoice: this.countChoice,
          question: this.Quizetion,
          choiceOne: this.choice1,
          choiceTwo: this.choice2,
          choiceThree: this.choice3,
          choiceFour: this.choice4,
          answer: this.answer
        });
        this.countChoice = this.countChoice + 1;
        this.Quizetion = "";
        this.choice1 = "";
        this.choice2 = "";
        this.choice3 = "";
        this.choice4 = "";
        this.answer = "";
      } else {
        this.dataWriting.push({
          countWriting: this.countWriting,
          question: this.Quizetion
        });
        this.countWriting = this.countWriting + 1;
        this.Quizetion = "";
      }
    },
    close() {
      this.dialog = false;
      this.dataWriting = "";
      this.dataChoice = "";
      this.Quizetion = "";
      this.choice1 = "";
      this.choice2 = "";
      this.choice3 = "";
      this.choice4 = "";
      this.answer = "";
      this.countWriting = 0;
      this.countChoice = 0;
    },
    async save() {
      console.log("test", this.dataChoice);
      try {
        if (isEmpty(this.dataChoice) && isEmty(this.dataWriting)) {
          await db.collection("exam").add({
            ...this.dataWriting,
            ...this.dataChoice
          });
        } else if (isEmpty(this.dataChoice)) {
          await db.collection("exam").add({
            ...this.dataChoice
          });
        } else if (isEmty(this.dataWriting)) {
          await db.collection("exam").add({
            ...this.dataWriting
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.dialog = false;
      this.dataWriting = "";
      this.dataChoice = "";
      this.Quizetion = "";
      this.choice1 = "";
      this.choice2 = "";
      this.choice3 = "";
      this.choice4 = "";
      this.answer = "";
      this.countWriting = 0;
      this.countChoice = 0;
    }
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
