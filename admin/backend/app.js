let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let app = express();

let signIn = require('./routes/signin');
let signUp = require('./routes/signup');
let questionAndAnswer = require('./routes/questionAndAnswer');
let categories = require('./routes/categories');
let appliesTo = require('./routes/appliesTo');

// app.use(logger('dev'));

let corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/signIn', signIn.signIn);
app.use('/signUp',signUp.signUp);
app.use('/approveUser',signUp.approveUser);
app.use('/setQuestionAndAnswer',questionAndAnswer.setQuestionAndAnswer);
app.use('/editQuestionAndAnswer',questionAndAnswer.editQuestionAndAnswer);
app.use('/deleteQuestionAndAnswer',questionAndAnswer.deleteQuestionAndAnswer);
app.use('/getAllQuestionsAndAnswers',questionAndAnswer.getAllQuestionsAndAnswers);
app.use('/getAnswer',questionAndAnswer.getAnswer);
app.use('/getAllUnansweredQuestions',questionAndAnswer.getAllUnansweredQuestions);
app.use('/deleteUnansweredQuestion',questionAndAnswer.deleteUnansweredQuestion);
app.use('/getAllMatchingQuestions',questionAndAnswer.getAllMatchingQuestions);
app.use('/getAllCategories',categories.getAllCategories);
app.use('/setCategory',categories.setCategory);
app.use('/getAllAppliesTo',appliesTo.getAllAppliesTo);
app.use('/setAppliesTo',appliesTo.setAppliesTo);

module.exports = app;
