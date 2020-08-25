<template>
  <div class="con-center">
    <h1> 6.V-for</h1>
    <h1 >Student List</h1>
    <ul>   
        <li v-for="st in student" :key="st.code">
            <span>{{st.code}}</span>
            <span> {{st.name}}</span>
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      student:[
          {code: "001", name:"Name1"},
          {code: "002", name:"Name2"},
          {code: "003", name:"Name3"},
          {code: "004", name:"Name4"},
          {code: "005", name:"Name5"}
      ]
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