let usefulFunctions = require('./usefulFunctions');

exports.setQuestionAndAnswer = function(req,res) {
    let question=req.body.question;
    let answer=req.body.answer;
    let category=req.body.category;
    let applyTo=req.body.applyTo;

    question = question.replace(new RegExp("'", 'g'), "\\'");
    answer = answer.replace(new RegExp("'", 'g'), "\\'");
    category = category.replace(new RegExp("'", 'g'), "\\'");
    applyTo = applyTo.replace(new RegExp("'", 'g'), "\\'");

    let sqlSetQuestionAndAnswer= "CALL advising.prc_add_qna('"+answer+"','"+question+"','"+category+"','"+applyTo+"',@RetMsg); select @RetMsg; ";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results[1][0]['@RetMsg'] === 'Data inserted successfully'){
                res.status(201).json({status: 1});
            }
            else if(results[1][0]['@RetMsg'] === 'Question already exist'){
                res.status(201).json({status: -1});
            }
        }
    },sqlSetQuestionAndAnswer);
};

exports.editQuestionAndAnswer = function(req,res) {

    let questionId=req.body.questionId;
    let answerId=req.body.answerId;
    let answer=req.body.answer;
    let question=req.body.question;
    let category=req.body.category;
    let applyTo=req.body.applyTo;

    question = question.replace("'", "\\'");
    answer = answer.replace("'", "\\'");
    category = category.replace("'", "\\'");
    applyTo = applyTo.replace("'", "\\'");

    let sqlEditQuestionAndAnswer = "CALL advising.prc_update_qna("+questionId+","+answerId+",'"+answer+"','"+question+"','"+category+"','"+applyTo+"',@RetMsg); select @RetMsg; ";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results[1][0]['@RetMsg'] === 'Data updated successfully'){
                res.status(201).json({status: 1});
            }
            else if(results[1][0]['@RetMsg'] === 'Invalid answer id sent' || results[1][0]['@RetMsg'] === 'Invalid question id sent.'){
                res.status(201).json({status: -1});
            }
        }
    },sqlEditQuestionAndAnswer);
};

exports.deleteQuestionAndAnswer = function(req,res) {

    let questionId=req.body.questionId;
    let answerId=req.body.answerId;

    let sqlDeleteQuestionAndAnswer= "CALL advising.prc_delete_qna("+questionId+","+answerId+",@RetMsg); select @RetMsg; ";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results[1][0]['@RetMsg'] === 'Data Deleted successfully'){
                res.status(201).json({status: 1});
            }
            else if(results[1][0]['@RetMsg'] === 'Invalid answer id sent' || results[1][0]['@RetMsg'] === 'Invalid question id sent.'){
                res.status(201).json({status: -1});
            }
        }
    },sqlDeleteQuestionAndAnswer);
};


exports.getAllQuestionsAndAnswers = function(req,res) {
    let sqlGetAllQuestionsAndAnswers = "call advising.prc_select_question_answer();";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                let questionAndAnswers = [];
                results[0].forEach(function(element) {
                    let jsonObj = {
                        question    : JSON.parse(element.result)[0].question,
                        answer      : JSON.parse(element.result)[0].answer,
                        category    : JSON.parse(element.result)[0].category,
                        applyTo     : JSON.parse(element.result)[0].apply_to,
                        questionId  : JSON.parse(element.result)[0].ques_id,
                        answerId    : JSON.parse(element.result)[0].ans_id,
                        categoryId  : JSON.parse(element.result)[0].cat_id,
                        applyToID   : JSON.parse(element.result)[0].applies_to_id
                    };
                    questionAndAnswers.push(jsonObj);
                });

                res.status(201).json({status: 1,questionAndAnswers:questionAndAnswers});
            }
            else {
                res.status(201).json({status: -1});
            }
        }
    },sqlGetAllQuestionsAndAnswers);
};

exports.getAnswer = function(req,res) {

    let question=req.body.question;

    let sqlGetAnswer = "call advising.prc_get_answer('"+question+"');";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0 && results[0][0].result !== "Question doesn't exist"){
                let questionAndAnswer = [];
                let jsonObj = {
                    question    : JSON.parse(results[0][0].result)[0].question,
                    answer      : JSON.parse(results[0][0].result)[0].answer,
                    category    : JSON.parse(results[0][0].result)[0].category,
                    applyTo     : JSON.parse(results[0][0].result)[0].apply_to,
                    questionId  : JSON.parse(results[0][0].result)[0].ques_id,
                    answerId    : JSON.parse(results[0][0].result)[0].ans_id,
                    categoryId  : JSON.parse(results[0][0].result)[0].cat_id,
                    applyToID   : JSON.parse(results[0][0].result)[0].applies_to_id
                };
                    questionAndAnswer.push(jsonObj);

                res.status(201).json({status: 1,questionAndAnswer:questionAndAnswer});
            }
            else {
                res.status(201).json({status: -1});
            }
        }
    },sqlGetAnswer);
};

exports.getAllUnansweredQuestions = function(req,res) {

    let sqlGetAllUnansweredQuestions = "call advising.prc_get_unanswered_questions();";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                let unansweredQuestions = [];
                results[0].forEach(function(element) {
                    let jsonObj = {
                        question    : JSON.parse(element.result)[0].question,
                        id          : JSON.parse(element.result)[0].id
                    };
                    unansweredQuestions.push(jsonObj);
                });

                res.status(201).json({status: 1,unansweredQuestions:unansweredQuestions});
            }
            else {
                console.log("No Questions Found!");
                res.status(201).json({status: -1});
            }
        }

    },sqlGetAllUnansweredQuestions);
};

exports.deleteUnansweredQuestion = function(req,res) {

    let questionId=req.body.questionId;

    let sqlDeleteUnansweredQuestion = "call advising.prc_delete_unaswered_q("+questionId+",@RetMsg); select @RetMsg;";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results[1][0]['@RetMsg'] === 'Data Deleted successfully'){
                res.status(201).json({status: 1});
            }
            else if(results[1][0]['@RetMsg'] === 'Invalid question id sent.'){
                res.status(201).json({status: -1});
            }
        }
    },sqlDeleteUnansweredQuestion);
};

exports.getAllMatchingQuestions = function(req,res) {

    let questionId=req.body.questionId;

    let sqlGetAllMatchingQuestions = "call advising.prc_match_unaswered_q_to_existing_q('"+questionId+"',@RetMsg); select @RetMsg;";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                let questionAndAnswers = [];
                results[0].forEach(function(element) {

                    if(element.question === undefined && element.answer === undefined && element.category_name === undefined && element.apply_to === undefined){
                        return;
                    }

                    let jsonObj = {
                        question    :element.question,
                        answer      :element.answer,
                        category    :element.category_name,
                        appliesTo   :element.apply_to
                    };

                    questionAndAnswers.push(jsonObj);
                });

                if(questionAndAnswers.length !== 0){
                    res.status(201).json({status: 1,questionAndAnswers:questionAndAnswers});
                } else {
                    res.status(201).json({status: -1});
                }
            }
        }
    },sqlGetAllMatchingQuestions);
};

exports.getFeedback = function(req,res) {

    let sqlGetFeedback = "call advising.prc_get_feedback();";

    usefulFunctions.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                let feedBackQuestions = [];
                results[0].forEach(function(element) {
                    let jsonObj = {
                        question    : element.question,
                        answer      : element.answer,
                        asked_on    : element.asked_on,
                        id          : element.id
                    };
                    feedBackQuestions.push(jsonObj);
                });

                res.status(201).json({status: 1,feedBackQuestions:feedBackQuestions});
            }
            else {
                console.log("No Questions Found!");
                res.status(201).json({status: -1});
            }
        }

    },sqlGetFeedback);
};
