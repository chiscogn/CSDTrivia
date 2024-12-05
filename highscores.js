const highScoresList = document.getElementById("highScoresList");

// Retrieve and display the high scores (if any)
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Check if there are no high scores
if (highScores.length === 0) {
  highScoresList.innerHTML = `<li class="high-score">No scores yet</li>`;
} else {
  // Sort scores to ensure the highest scores are at the top
  highScores.sort((a, b) => b.score - a.score);

  // Determine the highest score
  const topScore = highScores[0]?.score;

  // Display the high scores with a trophy for the highest scorer
  highScoresList.innerHTML = highScores
    .map((score) => {
      // Add a trophy to everyone with the top score
      const trophyIcon = score.score === topScore ? ' 🏆' : '';
      return `<li class="high-score">${score.name} - ${score.score}${trophyIcon}</li>`;
    })
    .join("");
}
