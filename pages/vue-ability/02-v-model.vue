<template>
  <div class="con-center">
    <h1> 2.V-Model</h1>
    <h1>Hello {{ name }}</h1>
    <input  type="text" :value="name"/>
    <br><br>
    <input type="text" v-model="name"/>
  </div>
</template>
<script>
export default {
  data() {
      
    return {
      name: "Artdvp"
    }
  }
}
</script>
<style>
.con-center {
  text-align: center;
  margin-top: 1rem;
  background-color: white;
  color: black;
}
</style>