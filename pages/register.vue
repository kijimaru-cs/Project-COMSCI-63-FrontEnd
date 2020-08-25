<template>
  <div class="container">
    <div class="logo-style">
      <img class="center" src="KU_Logo_PNG.png">
    </div>
    
    <v-text-field label="Username" :rules="rules" hide-details="auto" v-model="username"></v-text-field>
    <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
    <div class="my-2">
      <v-btn class="center" style="color:white" depressed large color="#00695C" @click="doSave">Register</v-btn>
    </div>
  </div>
</template>


<script>
  export default {
    data: () => ({
        show1: false,
        username:"",
        password:"",
      rules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
    }),
    layout: 'toolbar',
    methods:{
      doSave() {
        alert("Username = "+this.username+"Password = "+this.password)
    },
      register(){
        
      }
    }
   }
</script>

<style scoped>
  .container{
    justify-items: center;
  }
  .font-style{
    text-align: center;
  }
  
  .center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>