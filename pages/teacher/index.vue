<template>
  <div class="container">
    <p>This is teacher Screen</p>
    <button @click="create">Create Class Room</button>
  </div>
</template>

<script>
import { db } from "@/lib/firebase.js";
export default {
  layout: "toolbar",
  data: () => ({})
};
</script>

<style>
.container {
  justify-items: center;
  align-items: center;
}
</style>
