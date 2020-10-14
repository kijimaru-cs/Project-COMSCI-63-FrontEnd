<template>
  <div class="container">
    <br/><br/>
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>
    <br/><br/><br/><br/>
    <div>
      <div class="center-button">
        <v-btn class="buttonStyle" href="/login" x-large color="#00695C" dark>Login <v-icon > mdi-login</v-icon></v-btn>
        <v-btn href="/register" x-large color="#00695C" dark>Register <v-icon > mdi-account</v-icon></v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  layout: "toolbar",
  methods: {},
};
</script>

<style scoped>
.container {
  justify-items: center;
  align-items: center;
}
.font-style {
  text-align: center;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 15%;
}
.center-button {
  text-align: center;
}
.butonStyle{
  color: black;
  }
</style>
