const highScoresList = document.getElementById("highScoresList");

// Function to check and clear localStorage at the start of a new day
function checkAndClearStorage() {
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  const storedDate = localStorage.getItem('lastClearDate'); // Get stored date from localStorage

  // If the date has changed, clear the high scores from localStorage and update the stored date
  if (currentDate !== storedDate) {
    localStorage.removeItem("highScores"); // Remove the highScores from localStorage
    localStorage.setItem('lastClearDate', currentDate); // Store today's date as the last clear date
    console.log("Local storage cleared at the start of a new day.");
  }
}

// Run the function once when the page loads
checkAndClearStorage();

// Check every minute (60000 ms = 1 minute)
setInterval(checkAndClearStorage, 60000);

// Retrieve and display the high scores (if any)
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");
