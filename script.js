document.addEventListener("DOMContentLoaded", function() {
    var rollButton = document.getElementById("rollDice");
    var diceElements = document.querySelectorAll(".dice img"); // Selecteer de afbeeldingen van de dobbelstenen
    var scoreTable = document.getElementById("scoreTable");

    var diceValues = [1, 1, 1, 1, 1, 1];  // Nu 6 dobbelstenen
    var lockedDice = [false, false, false, false, false, false];  // Aangepast naar 6 dobbelstenen
    var rollsLeft = 3;  // Aantal worpen over

    var scores = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null
    };

    function rollDice() {
        if (rollsLeft > 0) {
            for (var i = 0; i < diceValues.length; i++) {
                if (!lockedDice[i]) {
                    diceValues[i] = Math.floor(Math.random() * 6) + 1;  // Kies een nieuw getal tussen 1 en 6
                }
            }
            rollsLeft--;  // Verminder het aantal worpen over
            updateUI();  // Update de UI met nieuwe waarden
        }
    }

    function toggleDiceLock(index) {
        lockedDice[index] = !lockedDice[index];  // Wissel de status van vergrendelen
        updateUI();  // Update de UI
    }

    function updateUI() {
        for (var i = 0; i < diceElements.length; i++) {
            var dieImage = diceElements[i];
            dieImage.src = "dice-" + diceValues[i] + ".png";  // Verander de afbeelding afhankelijk van de waarde
            if (lockedDice[i]) {
                dieImage.style.backgroundColor = "lightblue";  // Geef een visuele indicatie voor vergrendelde dobbelstenen
            } else {
                dieImage.style.backgroundColor = "white";
            }
        }
        rollButton.textContent = "Roll (" + rollsLeft + " left)";
    }

    function calculateScore() {
        var count = {};
        for (var i = 0; i < diceValues.length; i++) {
            var value = diceValues[i];
            count[value] = (count[value] || 0) + 1;  // Tel het aantal keer dat een waarde voorkomt
        }

        scores.ones = (count[1] || 0) * 1;
        scores.twos = (count[2] || 0) * 2;
        scores.threes = (count[3] || 0) * 3;
        scores.fours = (count[4] || 0) * 4;
        scores.fives = (count[5] || 0) * 5;
        scores.sixes = (count[6] || 0) * 6;

        scores.threeOfAKind = Object.values(count).some(x => x >= 3) ? diceValues.reduce((a, b) => a + b, 0) : 0;
        scores.fourOfAKind = Object.values(count).some(x => x >= 4) ? diceValues.reduce((a, b) => a + b, 0) : 0;
        scores.fullHouse = Object.values(count).includes(3) && Object.values(count).includes(2) ? 25 : 0;
        scores.smallStraight = [1, 2, 3, 4].every(n => diceValues.includes(n)) || 
                               [2, 3, 4, 5].every(n => diceValues.includes(n)) || 
                               [3, 4, 5, 6].every(n => diceValues.includes(n)) ? 30 : 0;

        scores.largeStraight = [1, 2, 3, 4, 5].every(n => diceValues.includes(n)) || 
                               [2, 3, 4, 5, 6].every(n => diceValues.includes(n)) ? 40 : 0;

        scores.yahtzee = Object.values(count).includes(5) ? 50 : 0;
        scores.chance = diceValues.reduce((a, b) => a + b, 0);

        updateScoreboard();
    }

    function updateScoreboard() {
        scoreTable.innerHTML = "";
        for (var category in scores) {
            var row = document.createElement("tr");
            var categoryCell = document.createElement("td");
            var scoreCell = document.createElement("td");

            categoryCell.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');

            if (scores[category] === null) {
                categoryCell.style.cursor = "pointer";
                categoryCell.addEventListener("click", function() {
                    assignScore(category);
                });
            } else {
                categoryCell.classList.add("disabled");
            }

            scoreCell.textContent = scores[category] === null ? "Not scored yet" : scores[category];
            row.appendChild(categoryCell);
            row.appendChild(scoreCell);
            scoreTable.appendChild(row);
        }
    }

    function assignScore(category) {
        scores[category] = calculateCategoryScore(category);
        rollsLeft = 3;
        updateUI();
        calculateScore();
    }

    function calculateCategoryScore(category) {
        switch (category) {
            case "ones":
                return scores.ones;
            case "twos":
                return scores.twos;
            case "threes":
                return scores.threes;
            case "fours":
                return scores.fours;
            case "fives":
                return scores.fives;
            case "sixes":
                return scores.sixes;
            case "threeOfAKind":
                return scores.threeOfAKind;
            case "fourOfAKind":
                return scores.fourOfAKind;
            case "fullHouse":
                return scores.fullHouse;
            case "smallStraight":
                return scores.smallStraight;
            case "largeStraight":
                return scores.largeStraight;
            case "yahtzee":
                return scores.yahtzee;
            case "chance":
                return scores.chance;
            default:
                return 0;
        }
    }

    rollButton.addEventListener("click", function() {
        rollDice();
        calculateScore();
    });

    // Voeg een klikactie toe voor elke dobbelsteen om te vergrendelen/ontgrendelen
    for (var i = 0; i < diceElements.length; i++) {
        (function(index) {
            diceElements[index].addEventListener("click", function() {
                toggleDiceLock(index);
            });
        })(i);
    }
});
