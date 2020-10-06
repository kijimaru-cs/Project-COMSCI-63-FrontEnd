<template>
  <div class="card">
    <v-card
      v-for="(data, index) in dataExam"
      v-bind:key="index"
      class="d-inline-block mx-auto"
      height="300"
      width="300"
    >
      <v-container>
        <v-row justify="space-between">
          <v-col cols="auto" class="text-center pl-0">
            <v-row class="flex-column ma-0 fill-height" justify="center">
              <v-card-text>{{ data.nameTitle }}</v-card-text>
              <v-btn
                v-if="data.isTimeUp"
                class="center"
                style="color: white"
                large
                color="#00695C"
                @click="pushExam(data.id)"
                >OPEN</v-btn
              >
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/lib/firebase";
import * as firebase from "firebase/app";
import moment from "moment";

export default {
  data: () => ({
    dataExam: []
  }),
  layout: "toolbarClassroom",
  mounted() {
    this.getExam();
  },
  methods: {
    async getExam() {
      try {
        const snapshot = await db
          .collection("exam")
          .where("codeClass", "==", this.getClass.code)
          .get();
        if (!snapshot.empty) {
          this.dataExam = await Promise.all(
            snapshot.docs.map(async doc => {
              let item = {};
              item = await doc.data();
              item.id = doc.id;
              item.start = moment(
                `${item.date} ${item.timeStart}`,
                "YYYY-MM-DD HH:mm"
              );
              item.end = moment(
                `${item.date} ${item.timeEnd}`,
                "YYYY-MM-DD HH:mm"
              );
              item.isTimeUp =
                moment().isAfter(item.start) && moment().isBefore(item.end);
              return item;
            })
          );

          console.log(this.dataExam);
        }
      } catch (error) {
        console.log(this.getUser.id);
        console.log(error);
      }
    },
    pushExam(id) {
      this.$router.push(`/exam/${id}`);
    }
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser",
      getClass: "classroom/getClass"
    })
  }
};
</script>

<style>
.card {
  padding: 5;
}
</style>
