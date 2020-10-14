<template>
  <div class="container">
    <div class="statusRoom">
      <h2>Online</h2>
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
        <audio :srcObject.prop="audioElem2" controls ></audio>
        <br />
        <v-btn
          v-if="MicStart == false"
          style="color: white"
          color="#3949AB"
          @click="MicOn"
          :disabled="MicStart"
          >Mic On <v-icon dark right> mdi-microphone </v-icon></v-btn
        >
        <v-btn
          v-if="MicStart == true"
          style="color: white"
          color="#FF5252"
          @click="MicOff"
          :disabled="!MicStart"
          >Mic Off <v-icon dark right> mdi-microphone-off</v-icon></v-btn
        >
      </center>
    </div>
    <div class="chatRoom">
      <v-row justify="center" align="start"></v-row>
      <v-container
        id="scroll-target"
        style="max-height: 500px"
        class="overflow-y-auto"
      >
        <v-rowz
          class="p"
          v-scroll:#scroll-target="onScroll"
          align="start"
          justify="start"
          style="height: 500px"
          >{{ comment }}</v-rowz
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
import * as firebase from "firebase/app";
import "firebase/auth";
import Cookies from "js-cookie";
import { db } from "@/lib/firebase.js";
var io = require("socket.io-client");
var peerConnectionVideo = {};
var peerConnectionAudio = {};
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
// const socket = io("http://35.197.137.197:3001/");
const socket = io("http://localhost:3001/");
export default {
  data() {
    return {
      userEmail: "",
      username: "",
      videoElem: null,
      audioElem: null,
      audioElem2: null,
      onlineUsername: "",
      comment: "",
      messageComment: "",
      codeStudent: "",
      MicStart: false,
    };
  },

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email;
        this.getUsername();
        // ...
      } else {
        this.$router.push("/");
      }
    });
    socket.emit("create", this.$route.params.id);
    socket.on("sendMessage", (msg) => {
      this.comment = this.comment + msg.messageComment + "\n";
    });
    socket.on("sendUsername", (msg) => {
      this.onlineUsername = msg;
    });
    socket.on("offerVideo", (id, description) => {
      peerConnectionVideo = new RTCPeerConnection(config);
      peerConnectionVideo
        .setRemoteDescription(description)
        .then(() => peerConnectionVideo.createAnswer())
        .then((sdp) => peerConnectionVideo.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answerVideo", id, peerConnectionVideo.localDescription);
        });
      peerConnectionVideo.ontrack = (event) => {
        this.videoElem = event.streams[0];
      };
      peerConnectionVideo.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidateVideo", id, event.candidate);
        }
      };
    });
    socket.on("offerAudioReceive", (id, description) => {
      peerConnectionAudio = new RTCPeerConnection(config);
      peerConnectionAudio
        .setRemoteDescription(description)
        .then(() => peerConnectionAudio.createAnswer())
        .then((sdp) => peerConnectionAudio.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answerAudioReceive", id, peerConnectionAudio.localDescription);
        });
      peerConnectionAudio.ontrack = (event) => {
        this.audioElem2 = event.streams[0];
      };
      peerConnectionAudio.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidateAudioReceive", id, event.candidate);
        }
      };
    });
    socket.on("candidateVideo", (id, candidate) => {
      peerConnectionVideo
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
    socket.on("candidateAudioReceive", (id, candidate) => {
      peerConnectionAudio
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });

    socket.on("broadcasterVideo", () => {
      socket.emit("watcherVideo");
    });
    socket.on("broadcasterAudioReceive", () => {
      socket.emit("watcherAudioReceive");
    });

    socket.on("watcherAudioSend2", (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnectionAudio[id] = peerConnection;
      let streamAudio = this.audioElem;
      streamAudio
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, streamAudio));
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidateAudioSend2", id, event.candidate);
        }
      };
      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offerAudioSend2", id, peerConnection.localDescription);
        });
    });
    socket.on("answerAudioSend2", (id, description) => {
      peerConnectionAudio[id].setRemoteDescription(description);
    });
    socket.on("candidateAudioSend2", (id, candidate) => {
      peerConnectionAudio[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("broadcasterAudioReceive2", () => {
      socket.emit("watcherAudioReceive2");
    });
    socket.on("candidateAudioReceive2", (id, candidate) => {
      peerConnectionAudio
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
    socket.on("offerAudioReceive2", (id, description) => {
      peerConnectionAudio = new RTCPeerConnection(config);
      peerConnectionAudio
        .setRemoteDescription(description)
        .then(() => peerConnectionAudio.createAnswer())
        .then((sdp) => peerConnectionAudio.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answerAudioReceive2", id, peerConnectionAudio.localDescription);
        });
      peerConnectionAudio.ontrack = (event) => {
        this.audioElem2 = event.streams[0];
      };
      peerConnectionAudio.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidateAudioReceive2", id, event.candidate);
        }
      };
    });


    socket.on("disconnectPeer", () => {
      peerConnectionVideo.close();
      peerConnectionAudio.close();
    });
    window.onunload = window.onbeforeunload = () => {
      socket.close();
    };
  },
  layout: "toolbarClassroom",
  methods: {
    async getUsername() {
      //get data=> username
      const snapshot = await db
        .collection("user")
        .where("email", "==", this.userEmail)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          console.log(doc.data());
          this.username = doc.data().username;
          this.codeStudent = doc.data().code;
          this.sendUsername(this.username);
        });
      } else {
        console.log("Get Username Error");
      }
    },
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    sendMessage(messageComment) {
      messageComment = this.username + " : " + messageComment;
      socket.emit("sendMessage", { messageComment });
      this.messageComment = "";
    },
    sendUsername(username) {
      if(!username.empty){
        socket.emit("sendUsername", username + "(" + this.codeStudent + ")");
      }
      else{
        this.$router.push("/");
      }
      
    },
    logout() {},
    async MicOn() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((mediaStream) => {
          this.audioElem = mediaStream;
          socket.emit("broadcasterAudioSend2");
          (this.MicStart = true)
        })
        .catch((err) => {
          console.error("Error: " + err);
        });
    },

    MicOff() {
      (this.MicStart = false)
      this.audioElem.getTracks().forEach((track) => track.stop());
    },
  },
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
.statusRoom {
  justify-items: center;
  align-items: center;
  height: 100%;
  width: 25%;
  border: 1px solid;
  padding: 10px;
}
</style>
