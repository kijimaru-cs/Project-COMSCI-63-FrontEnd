<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png" />
    </div>
    <div>
      <div class="center-button">
        <v-btn x-large href="/admin/login" color="success" dark>Login</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  layout: "toolbar",
  methods: {}
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
</style>
