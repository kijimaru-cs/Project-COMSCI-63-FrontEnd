<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                {{ this.selectedChoice }}

                <v-card v-for="(data, index) in dataExample" :key="index">
                  <div v-if="data.type === 'CHOICE'">
                    {{ `'ข้อที่${data.countChoice} ${data.question}'` }}
                  </div>
                  <div v-else>
                    {{ `'ข้อที่${data.countWriting} ${data.question}'` }}
                  </div>
                  <v-textarea
                    v-if="data.type === 'WRITING'"
                    outlined
                    name="input-7-4"
                    label="ตอบ"
                  ></v-textarea>

                  <v-radio-group
                    v-if="data.type === 'CHOICE'"
                    class="ml-2"
                    v-model="selectedChoice[index]"
                    column
                  >
                    <v-row>
                      <v-col cols="6">
                        <v-radio :label="data.choiceOne" color="black">
                        </v-radio>
                        <v-radio
                          :label="data.choiceTwo"
                          color="black"
                        ></v-radio>
                      </v-col>
                      <v-col cols="6">
                        <v-radio
                          :label="data.choiceThree"
                          color="black"
                        ></v-radio>

                        <v-radio
                          :label="data.choiceFour"
                          color="black"
                        ></v-radio
                      ></v-col>
                    </v-row>
                  </v-radio-group>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { db } from "@/lib/firebase";
import * as firebase from "firebase/app";
export default {
  data: () => ({
    dataExam: [],
    dataExample: [],
    selectedChoice: []
  }),
  mounted() {
    this.getDataExam();
  },
  methods: {
    async getDataExam() {
      try {
        console.log(this.$route.params.id);
        this.dataExam = await db
          .collection("exam")
          .doc(this.$route.params.id)
          .get();
        console.log("dataExam", this.dataExam.data().timeStart);
        this.dataExample = this.dataExam.data().itemQuestion;
        console.log("dataExample", this.dataExample);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
