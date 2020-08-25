<template>
  <div class="con-center">
    <h1> 3.V-computed</h1>
    <h1>Hello {{ name }}</h1>
    <h2>Up Name = {{upperName}}</h2>
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
  },
  computed: {
    upperName(){
      return this.name.toUpperCase()
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