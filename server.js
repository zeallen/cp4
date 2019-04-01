const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/trivia', {
    useNewUrlParser: true
});

const questionSchema = new mongoose.Schema({
    questionString: String,
    optionA: String,
    optionB: String,
    optionC: String,
    correctChoice: Number,
});

//Make _id into id
questionSchema.virtual('id')
    .get(function () {
        return this._id.toHexString();
    });

//make virtual fields serialized
questionSchema.set('toJSON', {
    virtuals: true
});

const Question = mongoose.model('Question', questionSchema);

app.get('/api/questions', async (req, res) => {
    try {
        let questions = await Question.find();
        res.send(questions);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/questions', async (req, res) => {
    const question = new Question({
        questionString: req.body.questionString,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        correctChoice: req.body.correctChoice
    });
    try {
        await question.save();
        res.send(question);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


app.delete('/api/questions/:id', async (req, res) => {
    try {
      await Question.deleteOne({
        _id: req.params.id
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });
  
  app.listen(4000, () => console.log('Server listening on port 4000!'));