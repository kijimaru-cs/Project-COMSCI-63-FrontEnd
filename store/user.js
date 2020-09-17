import firebase from "firebase/app";
import "firebase/firestore";
// import db from "../lib/firebase";
export const state = () => ({
  userData: {}
});

export const actions = {
  async getDataByEmail({ commit }, docs) {
    try {
      commit("SET_USER", docs);
      return docs;
    } catch (error) {
      console.log(error);
    }
  }
};

export const mutations = {
  SET_USER(state, docs) {
    state.userData = docs;
  }
};
export const getters = {
  getUser: state => state.userData
};
