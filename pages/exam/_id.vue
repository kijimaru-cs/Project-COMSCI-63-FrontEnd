<template>
  <v-row>
    <v-col v-if="getUser.role === 'STUDENT'">
      <v-card flat>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-card v-for="(data, index) in dataExample" :key="index">
                  <div v-if="data.type === 'CHOICE'">
                    {{ `'ข้อที่${data.countChoice}. ${data.question}'` }}
                  </div>
                  <div v-else>
                    {{ `'ข้อที่${data.countWriting}. ${data.question}'` }}
                  </div>
                  <v-textarea
                    v-model="textAnswer[index]"
                    v-if="data.type === 'WRITING'"
                    @change="textAdd(index)"
                    outlined
                    auto-grow
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
                        <v-radio
                          :label="data.choiceOne"
                          :value="data.choiceOne"
                          color="black"
                        >
                        </v-radio>
                        <v-radio
                          :label="data.choiceTwo"
                          :value="data.choiceTwo"
                          color="black"
                        ></v-radio>
                      </v-col>
                      <v-col cols="6">
                        <v-radio
                          :label="data.choiceThree"
                          :value="data.choiceThree"
                          color="black"
                        ></v-radio>

                        <v-radio
                          :label="data.choiceFour"
                          :value="data.choiceFour"
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
      <v-btn
        style="color: white"
        color="#00695C"
        @click="submitTest"
        :disabled="saveDisable"
        >Submit</v-btn
      >
      <template>
        <div class="text-center">
          <v-dialog v-model="displayCard" width="500">
            <v-card>
              <v-card-title class="headline grey lighten-2"> </v-card-title>
              คะเเนน
              <v-card-text> คะเเนนที่ทำได้{{ correctChoice }} </v-card-text>
              <v-divider></v-divider>
              <v-btn elevation="2" @click="closeDisplayCard">Ok</v-btn>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-col>
    <v-col v-else>
      <template v-if="getMode === 'EDIT EXAM'">
        <v-card
          ><v-row
            ><v-col class="ml-2" cols="6">
              <v-select
                v-model="mode"
                :items="choice"
                @change="setHeader"
                label="type"
              ></v-select> </v-col
          ></v-row>
          <v-card-title>
            คะเเนน
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="head"
            :items="dataHeader"
            sort-by="code"
            :search="search"
          ></v-data-table>
          <v-btn class="mb-3 ml-3" elevation="3" @click="print">Print</v-btn>
        </v-card>
      </template>
      <template v-else-if="getMode === 'SHOW EXAM'">
        <v-row
          ><v-col cols="8">
            <v-card elevation="3">
              <v-text-field
                v-model="fixNameTitle"
                :label="titleName"
                :value="titleName"
              ></v-text-field>
            </v-card> </v-col
        ></v-row>
        <v-row
          ><v-col cols="8">
            <v-card elevation="3">
              <div v-for="(data, index) in dataExample" :key="index">
                <v-col>
                  <v-text-field
                    v-model="fixQuestion[index]"
                    :label="data.question"
                    :value="data.question"
                  ></v-text-field>
                  <div v-if="data.type === 'CHOICE'">
                    <v-text-field
                      v-model="fixChoiceOne[index]"
                      :label="data.choiceOne"
                      :value="data.choiceOne"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="fixChoiceTwo[index]"
                      :label="data.choiceTwo"
                      :value="data.choiceTwo"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="fixChoiceThree[index]"
                      :label="data.choiceThree"
                      :value="data.choiceThree"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="fixChoiceFour[index]"
                      :label="data.choiceFour"
                      :value="data.choiceFour"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="fixAnswer[index]"
                      :label="data.answer"
                      :value="data.answer"
                    >
                    </v-text-field>
                  </div>
                </v-col>
              </div>
            </v-card>
            <v-btn class="mt-3" @click="updateData">update</v-btn>
          </v-col></v-row
        >
      </template>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from "vuex";
import { isEmpty } from "lodash";
import { db } from "@/lib/firebase";
import * as firebase from "firebase/app";
export default {
  data: () => ({
    dataExam: [],
    dataExample: [],
    selectedChoice: [],
    dataAnswer: [],
    dataTextAnswer: [],
    dataHeader: [],
    dataWait: [],
    mode: [],
    search: "",
    head: [],
    displayCard: false,
    headerScore: [
      {
        text: "รหัสนิสิต",
        align: "start",
        sortable: false,
        value: "code"
      },
      { text: "ชื่อ", value: "username" },
      { text: "คะเเนน", value: "score" }
    ],
    headerWrite: [
      {
        text: "รหัสนิสิต",
        align: "start",
        sortable: false,
        value: "code"
      },
      { text: "ชื่อ", value: "username" },
      { text: "คำตอบ", value: "answer" }
    ],
    countWrite: 0,
    saveDisable: false,
    correctChoice: 0,
    choice: [
      {
        text: "score",
        value: "SCORE"
      },
      {
        text: "answertext",
        value: "ANSWERTEXT"
      }
    ],
    textAnswer: [],
    text: "",
    dataScore: {},
    titleName: "",
    answerText: [],
    fixNameTitle: "",
    fixQuestion: [],
    fixChoiceOne: [],
    fixChoiceTwo: [],
    fixChoiceThree: [],
    fixChoiceFour: [],
    fixAnswer: [],
    dataFixChoice: [],
    dataFixWriting: []
  }),
  mounted() {
    this.getDataExam();
    this.getAnswer();
  },
  methods: {
    async getDataExam() {
      try {
        this.dataExam = await db
          .collection("exam")
          .doc(this.$route.params.id)
          .get();
        this.titleName = this.dataExam.data().nameTitle;
        this.dataExample = this.dataExam.data().itemQuestion;
      } catch (error) {
        console.log(error);
      }
    },
    async submitTest() {
      const len = this.dataExample.length;
      var x;
      for (x in this.dataExample) {
        if (this.dataExample[x].type === "WRITING") {
          this.countWrite = this.countWrite + 1;
        }
      }
      this.correctChoice = this.dataExample.reduce((acc, cur, index) => {
        if (cur.type === "CHOICE") {
          if (this.selectedChoice[index] === cur.answer) {
            return acc + 1;
          }
          return acc;
        }
        return acc;
      }, 0);
      console.log("textAnswer", this.answerText);
      console.log("score", this.dataScore);
      let scoreAndAnswer = this.dataScore;
      let answerWrite = [];
      answerWrite = this.answerText;
      await db.collection("answer").add({
        codeClass: this.$route.params.id,
        nameExam: this.titleName,
        code: this.getUser.code,
        username: this.getUser.username,
        score: this.correctChoice,
        answerWrite
      });
      this.displayCard = true;
    },
    textAdd(index) {
      let x;
      this.text = this.textAnswer[index];
      this.answerText.push({
        answer: this.text
      });
    },
    async getAnswer() {
      try {
        const snapshot = await db
          .collection("answer")
          .where("codeClass", "==", this.$route.params.id)
          .get();
        if (!snapshot.empty) {
          const data = await Promise.all(
            snapshot.docs.map(async doc => {
              let item = {};
              item = await doc.data();
              item.id = doc.id;
              return item;
            })
          );
          this.dataAnswer = data;
          console.log("length", this.dataAnswer[0].answerWrite.length);
          let x;
          for (x = 0; x < this.dataAnswer.length; x++) {
            let y;
            for (y = 0; y < this.dataAnswer[x].answerWrite.length; y++) {
              this.dataTextAnswer.push({
                code: this.dataAnswer[x].code,
                username: this.dataAnswer[x].username,
                answer: this.dataAnswer[x].answerWrite[y].answer
              });
            }
          }
          console.log("TestTextAnswer", this.dataTextAnswer);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async setHeader() {
      console.log("mode", this.mode);
      try {
        if (this.mode === "SCORE") {
          this.head = this.headerScore;
          this.dataHeader = this.dataAnswer;
        } else if (this.mode === "ANSWERTEXT") {
          this.head = this.headerWrite;
          this.dataHeader = this.dataTextAnswer;
        }
        console.log("head", this.head, "dataHeader", this.dataHeader);
      } catch (error) {
        console.log(error);
      }
    },
    async print() {
      window.print();
    },
    async closeDisplayCard() {
      this.displayCard = false;
      this.$router.push(`/exam`);
    },
    async updateData() {
      console.log("NameTitle", this.fixNameTitle);
      console.log("question", this.fixQuestion);
      // let x;
      //  for (x = 0; x < this.dataExample.length; x++) {
      //  if()
      // if (this.dataExam.type[x] === "CHOICE") {
      // this.dataFixChoice.push({
      //   question: this.fixQuestion[x],
      //   choiceOne: this.fixChoiceOne[x],
      //   choiceTwo: this.fixChoiceTwo[x],
      //   choiceThree: this.fixChoiceThree[x],
      //   choiceFour: this.choiceFour[x],
      //   answer: this.fixAnswer[x]
      // });
      //     console.log("hello choice");
      //   } else if (this.dataExample.type[x] === "WRITING") {
      //     console.log("hello writing");
      //     this.dataFixWriting.push({
      //       question: this.fixQuestion[x]
      //     });
      //   }
      // }
      // console.log(this.dataFixChoice);
      // try {
      //   let itemQuestion = [];
      //   if (!isEmpty(this.dataFixChoice)) {
      //     itemQuestion = this.dataFixChoice;
      //   }
      //   if (!isEmpty(this.dataFixWriting)) {
      //     itemQuestion = [...itemQuestion, ...this.dataFixWriting];
      //   }
      //   console.log(itemQuestion);
      //   const dataRef = {
      //     nameTitle: this.fixNameTitle,
      //     itemQuestion
      //   };
      //   console.log("dataRef", dataRef);
      //   // await db
      //   //   .collection("exam")
      //   //   .doc(this.$route.params.id)
      //   //   .updateData(dataRef);
      // } catch (error) {
      //   console.log(error);
      // }
    }
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser",
      getMode: "exam/getMode"
    })
  }
};
</script>
