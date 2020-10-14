import firebase from "firebase/app";
import "firebase/firestore";
// import db from "../lib/firebase";
export const state = () => ({
  roomData: {}
});

export const actions = {
  async getClassRoom({ commit }, docs) {
    try {
      commit("SET_CLASSROOM", docs);
      return docs;
    } catch (error) {
      console.log(error);
    }
  }
};

export const mutations = {
  SET_CLASSROOM(state, docs) {
    state.roomData = docs;
  }
};
export const getters = {
  getClass: state => state.roomData
};
