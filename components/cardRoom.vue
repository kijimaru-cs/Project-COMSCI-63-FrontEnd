<template>
  <v-card class="d-inline-block mx-auto" height="200" width="200">
    <v-container>
      <v-row justify="space-between">
        <v-col cols="auto" class="text-center pl-0">
          <v-row class="flex-column ma-0 fill-height" justify="center">
            <v-card-text> {{ name }} </v-card-text>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: ""
    }
  }
};
</script>
