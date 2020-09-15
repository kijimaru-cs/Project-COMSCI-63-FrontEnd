<template>
  <div class="container">
    <div class="screenRoom">
      <center>
        <v-btn style="color: white" color="#00695C" @click="startCapture">Start Share Screen</v-btn>
        <v-btn style="color: white" color="#00695C" @click="stopCapture">Stop Share Screen</v-btn>
        <video
          width="80%"
          max-width="400px"
          :srcObject.prop="videoElem"
          autoplay="autoplay"
          controls
        ></video>
        <audio :srcObject.prop="audioElem" autoplay="autoplay" controls></audio>
      </center>
    </div>
    <div class="chatRoom">
      <p>this is chat room</p>
      <p>
        {{ comment }}
        <br />
      </p>
      <v-text-field
        class="buttonChat"
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
import "firebase/auth";
import Cookies from "js-cookie";
const io = require("socket.io-client");
const socket = io("http://localhost:3001");
const socketStream = require("socket.io-stream");
const stream = require("stream");
const peerConnectionsVideo = {};
const peerConnectionsAudio = {};
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
var displayMediaOptions = {
  video: {
    cursor: "always",
  },
  audio: false,
};
export default {
  data() {
    return {
      userEmail: "",
      comment: "",
      messageComment: "",
      video: null,
      videoElem: null,
      audioElem: null,
    };
  },
  mounted() {
    this.setupFirebase();
    socket.on("sendMessage", (msg) => {
      this.comment = this.comment + msg.messageComment + "\n";
    });
    socket.on("answerVideo", (id, description) => {
      peerConnectionsVideo[id].setRemoteDescription(description);
    });
    socket.on("answerAudio", (id, description) => {
      peerConnectionsAudio[id].setRemoteDescription(description);
    });
    socket.on("watcherVideo", (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnectionsVideo[id] = peerConnection;

      let streamVideo = this.videoElem;
      streamVideo
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, streamVideo));
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidateVideo", id, event.candidate);
        }
      };
      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offerVideo", id, peerConnection.localDescription);
        });
    });
    socket.on("watcherAudio", (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnectionsAudio[id] = peerConnection;

      let streamAudio = this.audioElem;
      streamAudio
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, streamAudio));
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidateAudio", id, event.candidate);
        }
      };
      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
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

    socket.on("disconnectPeer", (id) => {
      peerConnectionsVideo[id].close();
      delete peerConnectionsVideo[id];
      peerConnectionsAudio[id].close();
      delete peerConnectionsAudio[id];
    });
  },
  layout: "toolbar",
  methods: {
    async setupFirebase() {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          // console.log(user.displayName);
          // console.log(user.email);
          // console.log(user.emailVerified);
          // console.log(user.uid);
          self.userEmail = user.email;
          // ...
        } else {
          // User is signed out.
          // ...
        }
      });
    },
    async startCapture() {
      navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((mediaStream) => {
          this.videoElem = mediaStream;
          socket.emit("broadcasterVideo");
        });
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((mediaStream) => {
          this.audioElem = mediaStream;
          socket.emit("broadcasterAudio");
        })
        .catch((err) => {
          console.error("Error: " + err);
        });
    },

    stopCapture() {
      this.videoElem.getTracks().forEach((track) => track.stop());
      this.audioElem.getTracks().forEach((track) => track.stop());
    },
    logout() {},
    sendMessage(messageComment) {
      socket.emit("sendMessage", { messageComment });
      this.messageComment = "";
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
  width: 85%;
}
.chatRoom {
  justify-items: center;
  align-items: center;
  height: 100%;
  width: 15%;
}
.buttonChat {
  position: relative;
  margin-top: 200%;
}
</style>
