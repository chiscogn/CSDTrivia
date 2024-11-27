const categoryTable = {
  "Entertainment: Books" : 10,
  //"Technology" : 18,
  "General Knowledge" : 9,
  "Entertainment: Film" : 11,
  "Entertainment: Music" : 12,
  "Entertainment: Television" : 14,
  "Entertainment: Video Games" : 15,
  "Science & Nature" : 17,
  "Mythology" : 20,
  "Sports": 21,
  "Geography": 22,
  "History": 23,
  "Celebrities": 26,
  "Animals": 27,
  "Entertainment: Japanese Anime & Manga": 31,
};

// Retrieve the last category index and the last date from localStorage
let lastCategoryIndex = parseInt(localStorage.getItem('lastCategoryIndex')) || 0;
const lastDate = localStorage.getItem('lastDate');

// Get today's date in YYYY-MM-DD format to compare with the stored date
const today = new Date().toISOString().split('T')[0];

// Check if the date has changed since the last time
if (lastDate !== today) {
  // If the date is different, change the category and update the index
  lastCategoryIndex = (lastCategoryIndex + 1) % Object.keys(categoryTable).length; // Cycle through categories
  localStorage.setItem('lastCategoryIndex', lastCategoryIndex); // Save the index
  localStorage.setItem('lastDate', today); // Save the current date
}

// Get the category from the updated index
const categories = Object.keys(categoryTable);
const selectedCategory = categories[lastCategoryIndex];
const categoryNumber = categoryTable[selectedCategory];

// Create the URL for the quiz
const url = `https://opentdb.com/api.php?amount=10&category=${categoryNumber}&type=multiple`;

// Save the URL to localStorage
localStorage.setItem('quizURL', url);

// Log the details
console.log(`Category: ${selectedCategory}, Number: ${categoryNumber}, URL: ${url}`);

// Update the category name on the page
const categoryNameElement = document.getElementById('categoryName');
categoryNameElement.innerText = selectedCategory;
