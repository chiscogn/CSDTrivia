const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

// Fetch the quiz URL from localStorage
const url = localStorage.getItem('quizURL');

// Get today's date in YYYY-MM-DD format to compare
const today = new Date().toISOString().split('T')[0];

// Retrieve stored date and questions from localStorage
const storedDate = localStorage.getItem('lastFetchDate');
const storedQuestions = JSON.parse(localStorage.getItem('storedQuestions'));

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10 // Set to 10 for your use case
const CORRECT_ANSWER_COLOR = '#28a745'; // Color for highlighting the correct answer

// Define getNewQuestion before startGame to avoid reference errors
const getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score);
    // Go to the end page
    return window.location.assign('/end.html');
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  // Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerHTML = currentQuestion['choice' + number];
    choice.style.removeProperty('background-color'); // Remove any previous color
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

// Start the game
const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; // This is important! Create a copy of the questions array for the game session
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
};

// If the date has changed, or no questions are stored, fetch new questions
if (storedDate !== today || !storedQuestions) {
  if (url) {
    fetch(url)
      .then((res) => res.json())
      .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
          const formattedQuestion = {
            question: loadedQuestion.question,
          };

          const answerChoices = [...loadedQuestion.incorrect_answers];
          formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
          answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

          answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
          });

          return formattedQuestion;
        });

        // Save questions and current date to localStorage
        localStorage.setItem('storedQuestions', JSON.stringify(questions));
        localStorage.setItem('lastFetchDate', today);

        startGame();  // Now that startGame is defined, we can call it
      })
      .catch((err) => console.error(err));
  } else {
    console.error("URL not found in localStorage!");
  }
} else {
  // If questions are stored and the date hasn't changed, use the stored questions
  questions = storedQuestions;
  startGame();  // Now that startGame is defined, we can call it
}

choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    } else {
      // Highlight the correct answer in green
      const correctChoiceIndex = currentQuestion.answer - 1;
      choices[correctChoiceIndex].style.backgroundColor = CORRECT_ANSWER_COLOR;
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      choices.forEach((choice) => choice.style.removeProperty('background-color')); // Remove all highlights
      getNewQuestion();
    }, 3000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
