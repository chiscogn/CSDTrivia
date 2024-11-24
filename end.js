const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const avatarList = document.getElementById('avatarList');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const saveScoreForm = document.getElementById('saveScoreForm');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

let selectedAvatar = null;

// Handle avatar selection with single selection logic
avatarList.addEventListener('click', (event) => {
  // Check if the clicked element is a circle
  if (event.target.classList.contains('circle')) {
    // If a previous avatar is selected, deselect it
    if (selectedAvatar) {
      selectedAvatar.classList.remove('selected');
    }

    // Select the clicked avatar and visually indicate selection
    selectedAvatar = event.target;
    selectedAvatar.classList.add('selected');

    // Enable the save button only if an avatar is selected
    saveScoreBtn.disabled = selectedAvatar === null;
  } else {
    // Clicking outside an avatar deselects the current one (optional)
    if (selectedAvatar) {
      selectedAvatar.classList.remove('selected');
      selectedAvatar = null;
      saveScoreBtn.disabled = true;
    }
  }
});

// Handle form submission
saveScoreForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  if (!selectedAvatar) {
    return; // Don't save if no avatar selected
  }

  const score = {
    score: parseInt(mostRecentScore),
    name: selectedAvatar.dataset.avatarName, // Use avatar name
  };

  // Find the existing score index
  const existingScoreIndex = highScores.findIndex(s => s.name === score.name);

  if (existingScoreIndex !== -1) {
    // Replace the existing score with the new one
    highScores[existingScoreIndex] = score;
  } else {
    // If no existing score, push the new score
    highScores.push(score);
  }

  // Sort and limit high scores
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
  window.location.assign('/'); 1  // Redirect to home page after saving
});