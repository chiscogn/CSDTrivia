document.addEventListener('DOMContentLoaded', () => {
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
  if (!url) {
    console.error('Quiz URL not found in localStorage!');
  }

  // Use Luxon to get the current date in PST
  const { DateTime } = luxon;
  const today = DateTime.now().setZone("America/Los_Angeles").toISODate(); // Get current date in PST (YYYY-MM-DD)

  // Retrieve stored date and questions from localStorage
  const storedDate = localStorage.getItem('lastDate');
  const storedQuestions = JSON.parse(localStorage.getItem('storedQuestions'));

  // CONSTANTS
  const CORRECT_BONUS = 10;
  const MAX_QUESTIONS = 10; // Set to 10 for your use case
  const CORRECT_ANSWER_COLOR = '#28a745'; // Color for highlighting the correct answer

  // Start the game
  const startGame = () => {
    if (!questions || questions.length === 0) {
      console.error('No questions available to start the game!');
      return;
    }

    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; // This is important! Create a copy of the questions array for the game session
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
  };

  // Get a new question
  const getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      localStorage.setItem('mostRecentScore', score);
      // Go to the end page
      return window.location.assign('/Samafraig/end.html');
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

  // Fetch new questions if needed
  if (storedDate !== today || !storedQuestions) {
    if (url) {
      console.log('Fetching new questions...');
      fetch(url)
        .then((res) => res.json())
        .then((loadedQuestions) => {
          if (!loadedQuestions || !loadedQuestions.results) {
            console.error('Invalid response from API:', loadedQuestions);
            return;
          }

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
          localStorage.setItem('lastDate', today);

          startGame();
        })
        .catch((err) => console.error('Error fetching questions:', err));
    } else {
      console.error('URL not found in localStorage!');
    }
  } else {
    console.log('Using stored questions...');
    questions = storedQuestions;
    startGame();
  }

  // Add event listeners to choices for answer selection
  choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
      console.log('Choice clicked:', e.target);
      if (!acceptingAnswers) {
        console.log('Not accepting answers right now.');
        return;
      }

      acceptingAnswers = false; // Block further clicks until the next question is ready

      const selectedChoice = e.target; // Get the clicked element
      const selectedAnswer = selectedChoice.dataset['number']; // Retrieve the data-number attribute

      const classToApply =
        selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

      if (classToApply === 'correct') {
        incrementScore(CORRECT_BONUS);
      } else {
        // Highlight the correct answer
        const correctChoiceIndex = currentQuestion.answer - 1;
        choices[correctChoiceIndex].style.backgroundColor = CORRECT_ANSWER_COLOR;
      }

      selectedChoice.parentElement.classList.add(classToApply); // Add feedback class

      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply); // Remove feedback class
        choices.forEach((choice) => choice.style.removeProperty('background-color')); // Reset styles
        getNewQuestion(); // Load the next question
      }, 3000); // Wait 3 seconds before moving on
    });
  });

  // Increment score function
  const incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
  };
});
