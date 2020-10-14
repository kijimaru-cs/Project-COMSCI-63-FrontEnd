<template>
  <v-app light>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import { isEmpty } from "lodash";
export default {
  data: () => ({}),

  async created() {
    const data = await new Promise((resolve, reject) =>
      firebase.auth().onAuthStateChanged(async user => {
        resolve(user);
      })
    );

    if (data) {
      const snapshot = await firebase
        .firestore()
        .collection("user")
        .where("email", "==", data.email)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        const [docs] = await Promise.all(
          snapshot.docs.map(async doc => {
            let item = {};
            item = await doc.data();
            item.id = doc.id;
            return item;
          })
        );
        this.$store.dispatch("user/getDataByEmail", docs);
      }
      console.log("data", data);
    }
  },
  watch: {
    // getUser() {
    //   if (this.getUser) {
    //     console.log(getUser.email, "LOGIN SUCCESS");
    //   } else {
    //     console.log("LOGIN FAILED");
    //   }
    // }
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser"
    })
  }
};
</script>

<style scoped>
.con-center {
  text-align: center;
}

.toolbar {
  width: 100%;
}
</style>
