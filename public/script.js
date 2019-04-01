//Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
  el: '#app',
  data: {
    frontPage: true,
    editingQuestions: false,
    onAnswer: false,
    currentQuestion: 0,
    gotCorrect: 0,
    failString: "",
    questions: [],
    questionString: "",
    optionA: "",
    optionB: "",
    optionC: "",
    correctChoice: 1,
    isCorrect: false,
  },

  created() {
    this.getQuestions();
  },

  methods: {
    beginGame() {
      if (this.questions.length == 0) {
        this.failString = "You need to make some questions before running a trivia session."
      }
      else {
        this.frontPage = false;
        this.currentQuestion = 0;
        this.getNextQuestion();
        this.gotCorrect = 0;
      }
    },

    finishQuiz() {
      this.failString = "You got " + this.gotCorrect + " out of " + this.currentQuestion + " questions correct!";
      if (this.gotCorrect === this.currentQuestion)
        this.failString += " Great job, you got them all right!";
      if (this.gotCorrect === 0)
        this.failString += " Wow, you didn't get any right. That's just sad!"
      this.questionString = "";
      this.optionA = "";
      this.optionB = "";
      this.optionC = "";
      this.frontPage = true;
      this.onAnswer = false;
    },

    getNextQuestion() {
      if (this.questions[this.currentQuestion] == undefined) {
        this.finishQuiz();
        return;
      }
      this.questionString = this.questions[this.currentQuestion].questionString;
      this.optionA = this.questions[this.currentQuestion].optionA;
      this.optionB = this.questions[this.currentQuestion].optionB;
      this.optionC = this.questions[this.currentQuestion].optionC;
      this.correctChoice = this.questions[this.currentQuestion].correctChoice;
      this.currentQuestion++;
      this.onAnswer = false;
    },

    checkAnswer(val) {
      if (this.onAnswer === true)
        return;

      if (val === this.correctChoice) {
        this.failString = "You are correct!";
        this.onAnswer = true;
        this.gotCorrect++;
      }
      else {
        this.failString = "Sorry, the correct answer is " + this.getCorrectChoice();
        this.onAnswer = true;
      }
    },

    getCorrectChoice() {
      if (this.correctChoice === 1)
        return "A";
      else if (this.correctChoice === 2)
        return "B";
      else
        return "C";
    },

    editQuestions() {
      this.editingQuestions = true;
      this.frontPage = false;
    },

    toHome() {
      this.editingQuestions = false;
      this.frontPage = true;
      this.failString = "";
    },

    async getQuestions() {
      try {
        let response = await axios.get("/api/questions");
        this.questions = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    async addQuestion() {
      if (this.questionString === "")
        return;
      try {
        let response = await axios.post("/api/questions", {
          questionString: this.questionString,
          optionA: this.optionA,
          optionB: this.optionB,
          optionC: this.optionC,
          correctChoice: this.correctChoice,
        });
        this.questionString = '';
        this.optionA = '';
        this.optionB = '';
        this.optionC = '';
        this.getQuestions();
      } catch (error) {
        console.log(error);
      }
    },

    async removeQuestion(question) {
      try {
        let response = axios.delete("/api/questions/" + question.id);
        this.getQuestions();
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    changeCorrectAnswer(num) {
      this.correctChoice = num;
    }
  }
})
