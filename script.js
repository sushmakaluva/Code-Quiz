var questions = [
    {
        title: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: 2
    },
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: 2
    },
    {
        title: "Inside which HTML element do we put the JavaScript?",
        choices: ["<script>", "<scripting>", "<javascript>", "<js>"],
        answer: 0
    },
    {
        title: "Which event occurs when the user clicks on an HTML element?",
        choices: ["onmouseclick", "onclick", "onchange", "onmouseover"],
        answer: 1
    },
    {
        title: "Which operator is used to assign a value to a variable?",
        choices: ["*", "/", "+", "="],
        answer: 3
    },

];

var currentQuestionNo;
var correctAnswerCount;

// Time related
var quizTimeLeft;
var quizTimer;

var questionTime = 15;
var questionTimer;

var score;

function startQuiz() {
    $("#intro").hide();
    $("#quiz").show();
    $("#aTagId").hide();
    quizTimeLeft = 75;
    startQuizTimer();
    correctAnswerCount = 0;
    showQuestion(0);

}

function startQuizTimer() {
    $("#Timer").html(quizTimeLeft);
    quizTimer = setInterval(function () {
        quizTimeLeft--;
        if (quizTimeLeft < 0) quizTimeLeft = 0;
        $("#Timer").html(quizTimeLeft);
        if (quizTimeLeft == 0) {
            showSummary();
        }
    }, 1000);
}

function showQuestion(questionNumber) {
    currentQuestionNo = questionNumber;
    var questionDiv = document.createElement("div");
    questionDiv.textContent = (questionNumber + 1) + ". " + questions[questionNumber].title;
    $("#question").append(questionDiv);
    for (let i = 0; i < questions[questionNumber].choices.length; i++) {
        var buttonDiv = document.createElement("div");
        var btnEl = document.createElement("button");
        btnEl.setAttribute('onclick', 'verifyAnswer(this);');
        btnEl.setAttribute("class", "answerButtons");
        btnEl.innerText = (i + 1) + ". " + questions[questionNumber].choices[i];
        buttonDiv.append(btnEl);
        $("#question").append(buttonDiv);

    }
    $(".answerButtons").addClass("btn-primary btn-rounded btn m-1");
}

function nextQuestion() {
    if (questionTimer) clearInterval(questionTimer);
    $("#question").html("");
    $("#answer").html("");
    if (currentQuestionNo + 1 < questions.length) {
        showQuestion(currentQuestionNo + 1);
        questionTimer = setInterval(function () { nextQuestion(); }, questionTime * 1000);
    } else {
        showSummary();
    }
}

function verifyAnswer(objbutton) {
    var selected = parseInt(objbutton.innerText.split(".")[0]) - 1;
    if (selected == questions[currentQuestionNo].answer) {
        document.getElementById("answer").innerHTML = "Correct answer";
        $("#answer").addClass("text-success m-3");
        $("#answer").removeClass("text-danger m-3");
        correctAnswerCount = correctAnswerCount + 1;
    } else {
        document.getElementById("answer").innerHTML = "Wrong answer";
        $("#answer").addClass("text-danger m-3");
        $("#answer").addClass("text-success m-3");
        quizTimeLeft = quizTimeLeft - questionTime;
    }
    $(".answerButtons").prop('disabled', true);
    setTimeout(function () { nextQuestion(); }, 1000);
}

function showSummary() {
    $("#aTagId").show();
    if (quizTimer) clearInterval(quizTimer);
    $("#quiz").hide();
    $("#summary").show();
    $("#displayTime").hide();
    score = (correctAnswerCount * 10) + Math.round(quizTimeLeft / 5);
    $("#correctAnswers").html("All done ! No of questions answered correctly:  " + correctAnswerCount);
    $("#score").html("Your score is " + score);
}

function showHighscore() {
    $("#summary").hide();
    var initials = document.getElementById("inputBox").value;
    var arrayList = [];
    var itemsList = localStorage.getItem("ScoresList");
    if (itemsList) arrayList = JSON.parse(itemsList);
    arrayList.push({ name: initials, score: score });
    localStorage.setItem("ScoresList", JSON.stringify(arrayList));
    $("#initialsAndScore").html(initials + ": " + score);
    $("#highscoreSummary").show();
}

function backToStart() {
    $("#intro").show();
    $("#displayTime").show();
    $("#Timer").html(0);
    $("#highscoreSummary").hide();
    $('#inputBox').val("");
}

function clearHighscores() {
    localStorage.clear();
    $("#initialsAndScore").html('');
}

function showTop5Scores() {
    $("#intro").hide();
    $("#quiz").hide();
    $("#summary").hide();
    $("#highscoreSummary").hide();

    var arrayList = [];
    var itemsList = localStorage.getItem("ScoresList");
    if (itemsList) arrayList = JSON.parse(itemsList);

    arrayList.sort(function (a, b) {
        return b.score - a.score;
    });

    $("#orderedList").empty();
    for (let i = 0; i < arrayList.length; i++) {
        var liEl = document.createElement("li");
        liEl.textContent = arrayList[i].name + ": " + arrayList[i].score;
        $("#orderedList").append(liEl);
    }
}