var wordList = wordlist;
var height = 6; //number of guesses
var width = 5; //length of the word
var row = 0; // current guess (attempt)
var col = 0; // current letter for that attempt
var guessList = wordList;
var gameOver = false;

//var word = "SQUID";
var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
console.log(word);

window.onload = function(){
    intialize();
}

function intialize() {

    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            // <span id ="0-0" class="tile"></span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    //Create the key board
let keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
]

for (let i = 0; i < keyboard.length; i++){
    let currRow = keyboard[i];
    let keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
        let keyTile = document.createElement("div");

        let key = currRow[j];
        keyTile.innerText = key;
        if (key == "Enter") {
            keyTile.id = "Enter";
        }
        else if (key == "⌫") {
            keyTile.id = "Backspace";
        }
        else if ("A" <= key && key <= "Z") {
            keyTile.id = "Key" + key; //"Key" + "A"
        }

        keyTile.addEventListener("click", processKey);

        if (key == "Enter") {
            keyTile.classList.add("enter-key-tile");
        }
        else {
            keyTile.classList.add("key-tile");
        }
        keyboardRow.appendChild(keyTile);
    }
    document.body.appendChild(keyboardRow);
}

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processKey() {
    let e = {"code" : this.id};
    processInput(e)
}

function processInput(e) {
    if (gameOver) return;

    if ("KeyA" <= e.code && e.code <= "KeyZ"){
     if (col < width) {
         let currTile = document.getElementById(row.toString() + '-' + col.toString());
         if (currTile.innerText == "") {
             currTile.innerText = e.code[3];
             col += 1;
         }
     }
    }
    else if (e.code == "Backspace"){
     if ( 0 < col && col <= width) {
         col -= 1;

     }
     let currTile = document.getElementById(row.toString() + '-' + col.toString());
     currTile.innerText = ""
    }

    else if(e.code="Enter") {
     update();
    }


    if (!gameOver && row == height) {
     gameOver = true;
     document.getElementById("answer").innerText = word;
    }

}






function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    //string up the guess word
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }
    guess = guess.toLowerCase();
    if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Not in wordlist";
        return;
    }

    //start processing game
    let correct = 0;
    let letterCount = {}; //Count of letters
    for (let i = 0; i < word.length; i++){
        letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] += 1
        }
        else {
            letterCount[letter] = 1;
        }
    }

    //first iteration, check all correct ones
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //Is it in the corrcet position?
        if (word[c] == letter) {
            currTile.classList.remove("present");
            currTile.classList.add("correct");
            
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }
       
        if (correct == width) {
            gameOver = true;
        }
    }

// go again and mark which ones ape present but in wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        if (!currTile.classList.contains("correct")) {
            //Is it in word?
            if (word.includes(letter) && letterCount[letter] > 0) {
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                    currTile.classList.add("present");
                }    
                letterCount[letter] -= 1;
            } // Not in the word
            else {
                currTile.classList.add("absent");
            }
        }
    }
    row += 1; //start new row
    col = 0;
}