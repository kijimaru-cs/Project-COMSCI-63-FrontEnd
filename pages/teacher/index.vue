<template>
  <div class="container">
    <p>This is teacher Screen</p>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="300">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            CREATE ROOM
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">CREATER CLASSROOM</v-card-title>
          <v-divider></v-divider>
          <v-text-field>HELLOW </v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false"
              >Disagree</v-btn
            >
            <v-btn color="green darken-1" text @click="dialog = false"
              >Agree</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import cardRoom from "@/components/cardRoom";
import { db } from "@/lib/firebase";
export default {
  data: () => ({
    dialog: false,
    name: ""
  }),
  components: {
    cardRoom
  },
  methods: {
    async createRoom() {
      const snapshot = await db
        .collection("user")
        .where("name", "==", this.name)
        .limit(1)
        .get();
      if (snapshot) return null;
    }
  }
};
</script>

<style>
.container {
  justify-items: center;
  align-items: center;
}
</style>
