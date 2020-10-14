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
        <audio :srcObject.prop="audioElem" controls></audio><br />
        <v-btn style="color: white" color="#00695C" @click="nextDisplayExam"
          >Quiz and Exam</v-btn
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
        <v-row
          class="p"
          v-scroll:#scroll-target="onScroll"
          align="start"
          justify="start"
          style="height: 500px"
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
import { mapGetters } from "vuex";
import * as firebase from "firebase/app";
import "firebase/auth";
import Cookies from "js-cookie";
const io = require("socket.io-client");
var peerConnectionVideo = null;
var peerConnectionAudio = null;
const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};
// const socket = io("http://35.197.137.197:3001/");
const socket = io("http://localhost:3001/");
export default {
  data() {
    return {
      userEmail: "",
      videoElem: null,
      audioElem: null,
      comment: "",
      messageComment: ""
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
    socket.on("offerVideo", (id, description) => {
      peerConnectionVideo = new RTCPeerConnection(config);
      peerConnectionVideo
        .setRemoteDescription(description)
        .then(() => peerConnectionVideo.createAnswer())
        .then(sdp => peerConnectionVideo.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answerVideo", id, peerConnectionVideo.localDescription);
        });
      peerConnectionVideo.ontrack = event => {
        this.videoElem = event.streams[0];
      };
      peerConnectionVideo.onicecandidate = event => {
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
        .then(sdp => peerConnectionAudio.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answerAudio", id, peerConnectionAudio.localDescription);
        });
      peerConnectionAudio.ontrack = event => {
        this.audioElem = event.streams[0];
      };
      peerConnectionAudio.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidateAudio", id, event.candidate);
        }
      };
    });
    socket.on("candidateVideo", (id, candidate) => {
      peerConnectionVideo
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    });
    socket.on("candidateAudio", (id, candidate) => {
      peerConnectionAudio
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
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
  layout: "toolbarClassroom",
  methods: {
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    sendMessage(messageComment) {
      messageComment = this.userEmail + " : " + messageComment;
      socket.emit("sendMessage", { messageComment });
      this.messageComment = "";
    },
    logout() {},
    nextDisplayExam() {
      this.$router.push(`/exam`);
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
