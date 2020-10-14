import firebase from "firebase/app";
import "firebase/firestore";
// import db from "../lib/firebase";
export const state = () => ({
  mode:""
});

export const actions = {
  async getMode({ commit }, textButton) {
    try {
      commit("SET_EXAM", textButton);
      return textButton;
    } catch (error) {
      console.log(error);
    }
  }
};

export const mutations = {
  SET_EXAM(state, textButton) {
    state.mode = textButton;
  }
};
export const getters = {
  getMode: state => state.mode
};
