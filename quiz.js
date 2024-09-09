let questions = [];
let timeLeft = 3600; // 60 minutes in seconds
const quizForm = document.getElementById('quizForm');
const showAnswerOnceCheckbox = document.getElementById('showAnswerOnce');

// Fetch questions dynamically from questions.json and shuffle them
function loadQuestions() {
    fetch('questions.json')  // Path to your JSON file
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            questions = shuffleArray(questions); // Shuffle questions
            displayQuestions();
            startTimer();
        })
        .catch(error => console.error('Error fetching questions:', error));
}

// Display Questions with shuffled answers
function displayQuestions() {
    questions.forEach((questionObj, index) => {
        let questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `<p>${index + 1}. ${questionObj.question}</p>`;

        let shuffledOptions = shuffleArray([...questionObj.options]); // Shuffle answers

        shuffledOptions.forEach(option => {
            let optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question${index}`;
            optionInput.value = option;
            optionInput.id = `${index}-${option}`;
            optionInput.addEventListener('change', () => provideFeedback(index, option));

            let label = document.createElement('label');
            label.htmlFor = optionInput.id;
            label.innerText = option;

            questionDiv.appendChild(optionInput);
            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement('br'));
        });

        let feedbackDiv = document.createElement('div');
        feedbackDiv.id = `feedback${index}`;
        feedbackDiv.style.display = 'none'; // Hide feedback initially
        feedbackDiv.style.color = 'blue'; // Feedback text style
        questionDiv.appendChild(feedbackDiv);

        quizForm.appendChild(questionDiv);
    });
}

// Provide feedback when the user selects an answer
function provideFeedback(index, selectedOption) {
    const correctAnswer = questions[index].correctAnswer;
    const feedbackDiv = document.getElementById(`feedback${index}`);
    const showAnswerOnce = showAnswerOnceCheckbox.checked;

    if (showAnswerOnce && feedbackDiv.style.display === 'block') {
        return; // If "Display correct answer once" is checked, only show once
    }

    if (selectedOption === correctAnswer) {
        feedbackDiv.innerText = `Correct! The answer is: ${correctAnswer}`;
        feedbackDiv.style.color = 'green'; // Show correct answer in green
    } else {
        feedbackDiv.innerText = `Incorrect! The correct answer is: ${correctAnswer}`;
        feedbackDiv.style.color = 'red'; // Show incorrect answer in red
    }
    feedbackDiv.style.display = 'block';

    // Disable the other options to prevent changing the answer
    const options = document.getElementsByName(`question${index}`);
    options.forEach(option => option.disabled = true);
}

// Shuffle array function (Fisher-Yates Algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Countdown Timer
function startTimer() {
    const timerElement = document.getElementById('time');
    const interval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(interval);
            submitQuiz(); // Automatically submit the quiz when time is up
        }
    }, 1000);
}

// Submit Quiz
function submitQuiz() {
    let score = 0;
    questions.forEach((questionObj, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === questionObj.correctAnswer) {
            score++;
        }
    });

    // Show result
    document.getElementById('quizForm').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('score').innerText = `You scored ${score} out of ${questions.length}`;
}

// Start the quiz by loading questions
window.onload = function() {
    loadQuestions();
};
