const questions = [
  {
    title: 'Commonly used data types DO NOT include:',
    choices: ['strings', 'booleans', 'alerts', 'numbers'],
    answer: 2,
  },
  {
    title: 'The condition in an if / else statement is enclosed within ____.',
    choices: ['quotes', 'curly brackets', 'parentheses', 'square brackets'],
    answer: 2,
  },
  {
    title: 'Inside which HTML element do we put the JavaScript?',
    choices: ['<script>', '<scripting>', '<javascript>', '<js>'],
    answer: 0,
  },
  {
    title: 'Which event occurs when the user clicks on an HTML element?',
    choices: ['onmouseclick', 'onclick', 'onchange', 'onmouseover'],
    answer: 1,
  },
  {
    title: 'Which operator is used to assign a value to a variable?',
    choices: ['*', '/', '+', '='],
    answer: 3,
  },

];

let currentQuestionNo;
let correctAnswerCount;

// Time related
let quizTimeLeft;
let quizTimer;

const questionTime = 15;
let questionTimer;

let score;

function startQuiz() {
  $('#intro').hide();
  $('#quiz').show();
  $('#aTagId').hide();
  quizTimeLeft = 75;
  startQuizTimer();
  correctAnswerCount = 0;
  showQuestion(0);
}

function startQuizTimer() {
  $('#Timer').html(quizTimeLeft);
  quizTimer = setInterval(() => {
    quizTimeLeft--;
    if (quizTimeLeft < 0) quizTimeLeft = 0;
    $('#Timer').html(quizTimeLeft);
    if (quizTimeLeft == 0) {
      showSummary();
    }
  }, 1000);
}

function showQuestion(questionNumber) {
  currentQuestionNo = questionNumber;
  const questionDiv = document.createElement('div');
  questionDiv.textContent = `${questionNumber + 1}. ${questions[questionNumber].title}`;
  $('#question').append(questionDiv);
  for (let i = 0; i < questions[questionNumber].choices.length; i++) {
    const buttonDiv = document.createElement('div');
    const btnEl = document.createElement('button');
    btnEl.setAttribute('onclick', 'verifyAnswer(this);');
    btnEl.setAttribute('class', 'answerButtons');
    btnEl.innerText = `${i + 1}. ${questions[questionNumber].choices[i]}`;
    buttonDiv.append(btnEl);
    $('#question').append(buttonDiv);
  }
  $('.answerButtons').addClass('btn-primary btn-rounded btn m-1');
}

function nextQuestion() {
  if (questionTimer) clearInterval(questionTimer);
  $('#question').html('');
  $('#answer').html('');
  if (currentQuestionNo + 1 < questions.length) {
    showQuestion(currentQuestionNo + 1);
    questionTimer = setInterval(() => { nextQuestion(); }, questionTime * 1000);
  } else {
    showSummary();
  }
}

function verifyAnswer(objbutton) {
  const selected = parseInt(objbutton.innerText.split('.')[0]) - 1;
  if (selected == questions[currentQuestionNo].answer) {
    document.getElementById('answer').innerHTML = 'Correct answer';
    $('#answer').addClass('text-success m-3');
    // $('#answer').removeClass('text-danger m-3');
    correctAnswerCount += 1;
  } else {
    document.getElementById('answer').innerHTML = 'Wrong answer';
    $('#answer').addClass('text-danger m-3');
    // $('#answer').removeClass('text-success m-3');
    quizTimeLeft -= questionTime;
  }
  $('.answerButtons').prop('disabled', true);
  setTimeout(() => { nextQuestion(); }, 1000);
}

function showSummary() {
  $('#aTagId').show();
  if (quizTimer) clearInterval(quizTimer);
  $('#quiz').hide();
  $('#summary').show();
  $('#displayTime').hide();
  score = (correctAnswerCount * 10) + Math.round(quizTimeLeft / 5);
  $('#correctAnswers').html(`All done ! No of questions answered correctly:  ${correctAnswerCount}`);
  $('#score').html(`Your score is ${score}`);
}

function showHighscore() {
  $('#summary').hide();
  const initials = document.getElementById('inputBox').value;
  let arrayList = [];
  const itemsList = localStorage.getItem('ScoresList');
  if (itemsList) arrayList = JSON.parse(itemsList);
  arrayList.push({ name: initials, score });
  localStorage.setItem('ScoresList', JSON.stringify(arrayList));
  $('#initialsAndScore').html(`${initials}: ${score}`);
  $('#highscoreSummary').show();
}

function backToStart() {
  $('#intro').show();
  $('#displayTime').show();
  $('#Timer').html(0);
  $('#highscoreSummary').hide();
  $('#inputBox').val('');
}

function clearHighscores() {
  localStorage.clear();
  $('#initialsAndScore').html('');
}

function showTop5Scores() {
  $('#intro').hide();
  $('#quiz').hide();
  $('#summary').hide();
  $('#highscoreSummary').hide();

  let arrayList = [];
  const itemsList = localStorage.getItem('ScoresList');
  if (itemsList) arrayList = JSON.parse(itemsList);

  arrayList.sort((a, b) => b.score - a.score);

  $('#orderedList').empty();
  for (let i = 0; i < arrayList.length; i++) {
    const liEl = document.createElement('li');
    liEl.textContent = `${arrayList[i].name}: ${arrayList[i].score}`;
    $('#orderedList').append(liEl);
  }
}
