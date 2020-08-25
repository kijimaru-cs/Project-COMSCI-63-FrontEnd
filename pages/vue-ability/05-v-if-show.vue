<template>
  <div class="con-center">
    <h1> 5.if show</h1>
    <h1 v-if="ok">Hello {{ name }}</h1>
    <h2 v-show="ok">Up Name = {{upperName}}</h2>
    <input  type="text" :value="name"/>
    <br><br>
    <input type="text" v-model="name"/><br>
    <button @click="doSave">Save</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "Artdvp",
      ok: true
    }
  },
  computed: {
    upperName(){
      return this.name.toUpperCase()
    }
  },
  methods:{
      doSave(){
          this.ok = !this.ok
          console.log("this is name" + this.name)
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