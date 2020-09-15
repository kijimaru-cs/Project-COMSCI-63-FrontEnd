<template>
  <div class="container">
    <p>This is student Screen</p>
    <button @click="logout">Logout</button>
    <video width="90%" max-width="500px" :srcObject.prop="videoElem" autoplay="autoplay" controls></video>
    <audio :srcObject.prop="audioElem" autoplay="autoplay" controls></audio>
    <p>{{ userEmail }}</p>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import Cookies from "js-cookie";
const io = require("socket.io-client");
var peerConnectionVideo = null;
var peerConnectionAudio = null;
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
const socket = io.connect("http://localhost:3001");
export default {
  data() {
    return {
      userEmail: "",
      videoElem: null,
      audioElem: null,
    };
  },
  mounted() {
    this.setupFirebase();
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
    socket.on("offerAudio", (id, description) => {
      peerConnectionAudio = new RTCPeerConnection(config);
      peerConnectionAudio
        .setRemoteDescription(description)
        .then(() => peerConnectionAudio.createAnswer())
        .then((sdp) => peerConnectionAudio.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answerAudio", id, peerConnectionAudio.localDescription);
        });
      peerConnectionAudio.ontrack = (event) => {
        this.audioElem = event.streams[0];
      };
      peerConnectionAudio.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidateAudio", id, event.candidate);
        }
      };
    });
    socket.on("candidateVideo", (id, candidate) => {
      peerConnectionVideo
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
    socket.on("candidateAudio", (id, candidate) => {
      peerConnectionAudio
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });

    socket.on("connect", () => {
      socket.emit("watcherVideo");
      socket.emit("watcherAudio");
    });

    socket.on("broadcasterVideo", () => {
      socket.emit("watcherVideo");
    });
    socket.on("broadcasterAudio", () => {
      socket.emit("watcherAudio");
    });

    socket.on("disconnectPeer", () => {
      peerConnectionVideo.close();
      peerConnectionAudio.close();
    });
    window.onunload = window.onbeforeunload = () => {
      socket.close();
    };
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
    logout() {},
  },
};

Cookies.set("user-email", "userEmail", { expires: 1 });
</script>

<style>
.container {
  justify-items: center;
  align-items: center;
}
</style>
