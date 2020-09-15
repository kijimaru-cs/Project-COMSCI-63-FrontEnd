// import firebase from "firebase/app";
// import "firebase/firestore";
// export const state = () => ({
//   userData: {}
// });

// export const action = {
//   async getDataByEmail({ commit }, email) {
//     try {
//       const snapshot = await firebase
//         .collection("user")
//         .where("email", "==", email)
//         .limit(1)
//         .get();
//       if (snapshot.empty) return null;
//       const docs = await Promise.all(
//         snapshot.docs.map(async doc => {
//           let item = {};
//           item = await doc.data();
//           item.id = doc.id;
//           return item;
//         })
//       );
//       commit("SET_USER", docs);
//       return docs;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };

// export const mutations = {
//   SET_USER(state, docs) {
//     state.user = docs;
//   }
// };
// export const getters = {
//   getUser: state => state.user
// };
