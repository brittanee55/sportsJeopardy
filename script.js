const questions = {
    Football: [
        { question: "Which team won the first Super Bowl?", answer: "Green Bay Packers", points: 100 },
        { question: "Who is the all-time leading rusher in NFL history?", answer: "Emmitt Smith", points: 200 },
        { question: "What year was the NFL established?", answer: "1920", points: 300 },
        { question: "Which player has the most career receptions in NFL history?", answer: "Jerry Rice", points: 400 },
        { question: "Who was the MVP of Super Bowl LI?", answer: "Tom Brady", points: 500 },
    ],
    Basketball: [
        { question: "Who holds the record for the most points scored in a single NBA game?", answer: "Wilt Chamberlain", points: 100 },
        { question: "Which team won the NBA championship in 2020?", answer: "Los Angeles Lakers", points: 200 },
        { question: "Who is the NBA's all-time leading scorer as of 2023?", answer: "LeBron James", points: 300 },
        { question: "What year did the NBA introduce the three-point line?", answer: "1979", points: 400 },
        { question: "Which player has won the most MVP awards in NBA history?", answer: "Kareem Abdul-Jabbar", points: 500 },
    ],
    Baseball: [
        { question: "Who holds the record for the most home runs in a single MLB season?", answer: "Barry Bonds", points: 100 },
        { question: "What is the name of the annual championship series in Major League Baseball?", answer: "World Series", points: 200 },
        { question: "Who was the first African American player in Major League Baseball?", answer: "Jackie Robinson", points: 300 },
        { question: "Which team has the most World Series titles?", answer: "New York Yankees", points: 400 },
        { question: "What pitcher holds the record for the most career strikeouts in MLB history?", answer: "Nolan Ryan", points: 500 },
    ],
    MMA: [
        { question: "Who is the most successful fighter in UFC history based on title defenses?", answer: "Anderson Silva", points: 100 },
        { question: "What does UFC stand for?", answer: "Ultimate Fighting Championship", points: 200 },
        { question: "Who was the first female champion in UFC history?", answer: "Ronda Rousey", points: 300 },
        { question: "What weight class did Khabib Nurmagomedov compete in?", answer: "Lightweight", points: 400 },
        { question: "Who holds the record for the fastest knockout in UFC history?", answer: "Jorge Masvidal", points: 500 },
    ]
};

let currentTeam = null;
let scores = { A: 0, B: 0 };
let selectedQuestions = [];
let timerInterval;

document.getElementById("startGame").onclick = function() {
    document.getElementById("instructions").style.display = "none";
    document.querySelector(".teams").style.display = "flex";
    document.getElementById("board").style.display = "none";
};

document.getElementById("rollDiceA").onclick = function() {
    const roll = Math.floor(Math.random() * 6) + 1;
    document.getElementById("diceResultA").innerText = `Team A rolled: ${roll}`;
    determineFirstTeam(roll, "A");
};

document.getElementById("rollDiceB").onclick = function() {
    const roll = Math.floor(Math.random() * 6) + 1;
    document.getElementById("diceResultB").innerText = `Team B rolled: ${roll}`;
    determineFirstTeam(roll, "B");
};

let teamARoll = null;
let teamBRoll = null;

function determineFirstTeam(roll, team) {
    if (team === "A") {
        teamARoll = roll;
    } else {
        teamBRoll = roll;
    }

    if (teamARoll !== null && teamBRoll !== null) {
        if (teamARoll > teamBRoll) {
            currentTeam = "A";
            document.getElementById("message").innerText = "Team A goes first!";
            setupBoard();
        } else if (teamBRoll > teamARoll) {
            currentTeam = "B";
            document.getElementById("message").innerText = "Team B goes first!";
            setupBoard();
        } else {
            document.getElementById("message").innerText = "It's a tie! Roll again.";
            teamARoll = null;
            teamBRoll = null;
            document.getElementById("diceResultA").innerText = "";
            document.getElementById("diceResultB").innerText = "";
        }
    }
}

function setupBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // Clear previous board

    // Create header row with categories
    for (let category in questions) {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";
        categoryDiv.innerText = category;
        board.appendChild(categoryDiv);
    }

    // Create question grid
    for (let i = 0; i < 5; i++) { // 5 rows of questions
        for (let category in questions) {
            const question = questions[category][i];
            const questionDiv = document.createElement("div");
            questionDiv.className = "question";
            questionDiv.innerText = question.points;
            questionDiv.onclick = () => selectQuestion(category, question, questionDiv);
            board.appendChild(questionDiv);
        }
    }

    board.style.display = "grid";
}

function selectQuestion(category, question, element) {
    if (selectedQuestions.includes(question)) {
        alert("Question already selected!");
        return;
    }
    selectedQuestions.push(question);
    element.style.backgroundColor = "#d3d3d3";
    element.style.cursor = "not-allowed";
    element.onclick = null; // Disable further clicks

    document.getElementById("questionText").innerText = question.question;
    document.getElementById("answerText").style.display = "none";
    document.getElementById("questionContainer").style.display = "block";
    startTimer(question.answer);
}

function startTimer(answer) {
    let timeLeft = 15;
    document.getElementById("timer").innerText = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showAnswer(answer); // Show answer after time runs out
        }
    }, 1000);
}

function showAnswer(answer) {
    document.getElementById("answerText").innerText = `The answer is: ${answer}`;
    document.getElementById("answerText").style.display = "block";
    document.getElementById("answerOptions").style.display = "block";
}

document.getElementById("correctBtn").onclick = function() {
    const question = selectedQuestions[selectedQuestions.length - 1];
    scores[currentTeam] += question.points;
    document.getElementById(`score${currentTeam}`).innerText = scores[currentTeam];
    nextTurn();
};

document.getElementById("incorrectBtn").onclick = function() {
    nextTurn();
};

function nextTurn() {
    if (selectedQuestions.length === 20) {
        endGame();
        return;
    }

    currentTeam = currentTeam === "A" ? "B" : "A";
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("answerOptions").style.display = "none";
    document.getElementById("answerText").style.display = "none";
    document.getElementById("message").innerText = `It's Team ${currentTeam}'s turn!`;
}

function endGame() {
    clearInterval(timerInterval);
    const winner = scores.A > scores.B ? "Team A" : "Team B";
    alert(`Game over! The winner is ${winner}!`);
    resetGame();
}

function resetGame() {
    currentTeam = null;
    scores = { A: 0, B: 0 };
    selectedQuestions = [];
    document.getElementById("scoreA").innerText = 0;
    document.getElementById("scoreB").innerText = 0;
    document.getElementById("board").innerHTML = "";
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("answerOptions").style.display = "none";
    document.getElementById("answerText").style.display = "none";
    document.getElementById("message").innerText = "";
    document.getElementById("diceResultA").innerText = "";
    document.getElementById("diceResultB").innerText = "";
}
