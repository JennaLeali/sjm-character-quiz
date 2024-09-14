// Define the quiz data for "Throne of Glass" and "A Court of Thorns and Roses"
const togQuizData = [
    {
        question: "What is your preferred way to spend a free day?",
        answers: [
            { text: "Reading and expanding your knowledge.", characters: ["Dorian", "Elide"] },
            { text: "Training or engaging in physical activity.", characters: ["Aelin", "Rowan", "Chaol", "Lorcan"] },
            { text: "Strategizing and planning ahead.", characters: ["Manon", "Lysandra"] }
        ]
    },
    {
        question: "Which quality do you value most in yourself?",
        answers: [
            { text: "Courage and bravery.", characters: ["Aelin", "Chaol"] },
            { text: "Intelligence and wisdom.", characters: ["Dorian", "Elide"] },
            { text: "Loyalty and dedication.", characters: ["Rowan", "Lorcan"] },
            { text: "Adaptability and cunning.", characters: ["Manon", "Lysandra"] }
        ]
    },
    // Add the rest of the questions here
];

const acotarQuizData = [
    {
        question: "How do you prefer to spend your leisure time?",
        answers: [
            { text: "Painting or engaging in creative arts.", characters: ["Feyre"] },
            { text: "Reading or studying ancient texts.", characters: ["Rhysand", "Amren"] },
            { text: "Training physically and pushing your limits.", characters: ["Cassian", "Nesta"] },
            { text: "Gardening or enjoying nature.", characters: ["Elain"] }
        ]
    },
    {
        question: "What is your greatest strength?",
        answers: [
            { text: "Resilience in the face of adversity.", characters: ["Feyre", "Nesta"] },
            { text: "Leadership and strategic thinking.", characters: ["Rhysand", "Mor"] },
            { text: "Compassion and empathy.", characters: ["Elain", "Azriel"] },
            { text: "Fierce loyalty to your friends.", characters: ["Cassian", "Amren"] }
        ]
    },
    // Add the rest of the questions here
];

// Define the characters for each series
const characters = {
    tog: ["Aelin", "Rowan", "Dorian", "Chaol", "Manon", "Lysandra", "Elide", "Lorcan"],
    acotar: ["Feyre", "Rhysand", "Cassian", "Nesta", "Elain", "Azriel", "Amren", "Mor"]
};

let currentQuizData = [];
let scores = {};

document.addEventListener('DOMContentLoaded', () => {
    const togButton = document.getElementById('tog-button');
    const acotarButton = document.getElementById('acotar-button');
    const seriesSelectionDiv = document.getElementById('series-selection');
    const quizContainer = document.getElementById('quiz-container');

    togButton.addEventListener('click', () => {
        startQuiz('tog');
        seriesSelectionDiv.style.display = 'none';
        quizContainer.style.display = 'block';
    });

    acotarButton.addEventListener('click', () => {
        startQuiz('acotar');
        seriesSelectionDiv.style.display = 'none';
        quizContainer.style.display = 'block';
    });
});

function startQuiz(series) {
    initializeScores(series);
    if (series === 'tog') {
        currentQuizData = togQuizData;
    } else if (series === 'acotar') {
        currentQuizData = acotarQuizData;
    }
    renderQuiz();
}

function initializeScores(series) {
    scores = {};
    characters[series].forEach(char => {
        scores[char] = 0;
    });
}

function renderQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Clear any existing content

    const quizForm = document.createElement('form');
    quizForm.id = 'quiz-form';

    currentQuizData.forEach((q, index) => {
        const questionElem = document.createElement('div');
        questionElem.classList.add('question');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = q.question;
        questionElem.appendChild(questionTitle);

        q.answers.forEach((a, aIndex) => {
            const label = document.createElement('label');

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `question${index}`;
            radio.value = aIndex;

            label.appendChild(radio);
            label.appendChild(document.createTextNode(a.text));
            questionElem.appendChild(label);
        });

        quizForm.appendChild(questionElem);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'See Your Result';
    quizForm.appendChild(submitButton);

    quizForm.addEventListener('submit', calculateResult);
    quizContainer.appendChild(quizForm);
}

function calculateResult(event) {
    event.preventDefault();
    // Reset scores
    Object.keys(scores).forEach(char => scores[char] = 0);

    // Check if all questions are answered
    let allAnswered = true;
    currentQuizData.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (!selected) {
            allAnswered = false;
        }
    });

    if (!allAnswered) {
        alert("Please answer all questions before submitting.");
        return;
    }

    currentQuizData.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected) {
            const answerIndex = selected.value;
            const selectedAnswer = q.answers[answerIndex];
            selectedAnswer.characters.forEach((char) => {
                if (scores.hasOwnProperty(char)) {
                    scores[char]++;
                }
            });
        }
    });

    const maxScore = Math.max(...Object.values(scores));
    const topCharacters = Object.keys(scores).filter(char => scores[char] === maxScore);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    const resultText = document.createElement('p');
    if (topCharacters.length === 1) {
        resultText.textContent = `You are most like ${topCharacters[0]}!`;
    } else {
        resultText.textContent = `You are a combination of ${topCharacters.join(' and ')}!`;
    }
    resultDiv.appendChild(resultText);

    // Optionally, display character images
    topCharacters.forEach(char => {
        const img = document.createElement('img');
        img.src = `images/${char}.jpg`; // Ensure images are named correctly
        img.alt = char;
        img.classList.add('result-image');
        resultDiv.appendChild(img);
    });

    // Optionally, offer a retry or select another series
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Take Another Quiz';
    retryButton.classList.add('retry-button');
    retryButton.addEventListener('click', () => {
        window.location.reload();
    });
    resultDiv.appendChild(retryButton);
}