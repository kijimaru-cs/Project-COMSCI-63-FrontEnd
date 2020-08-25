<template>
  <v-card
    color="grey lighten-4"
    flat
    height="200px"
    tile
  >
  <v-toolbar>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <a href="/">
      <div>
        <img src="KU_Logo_PNG.png" style="width:60px;height:60px;" >
        
      </div>
      </a>
      <br>
      <h1>  Classroom</h1>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <nuxt/>
  </v-card>
  
</template>

<script>

</script>

<style scoped>
.con-center {
  text-align: center;
}
</style>