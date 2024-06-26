const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

// const words = ['application', 'programming', 'interface', 'wizard', 'python', 'java'];
// let selectedWord = words[Math.floor(Math.random()*words.length)];
let selectedWord="";

// get the word
function getWord(){
    fetch('https://random-word-api.herokuapp.com/word')
        .then(res => res.json())
        .then(data => {
            selectedWord = data[0];
            displayWord();
        });
}

let correctLetters = [];
let wrongLetters = [];

// show the hidden word
function displayWord(){
    wordEl.innerHTML=`
        ${selectedWord
            .split('')
            .map(letter => `
                <span class="letter">
                    ${correctLetters.includes(letter) ? letter : ''}
                </span>
            `).join('')
        }
    `;

    const innerWord = wordEl.innerText.replace(/\n/g,'');

    if(innerWord === selectedWord && selectedWord !== ""){
        finalMessage.innerText = ' Congratulation! You won! 😃';
        popup.style.display = 'flex';
    }
}

// update the wrong letters
function updateWrongLettersEl(){
    // display wrong letters
    wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ? '<p>Wrong</p>':''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;

    // display parts
    figureParts.forEach((part, index)=>{
        const errors = wrongLetters.length;
        if(index < errors){
            part.style.display = 'block';
        }else{
            part.style.display = 'none'
        }
    });

    //check if lost
    if(wrongLetters.length === figureParts.length){
        finalMessage.innerText = `Unfortunately you lost. The correct word is ${selectedWord}. 😟`
        popup.style.display = 'flex';
    }
}

// show notification
function showNotification(){
    notification.classList.add('show');
    setTimeout(()=>{
        notification.classList.remove('show');
    },2000);
}

// keydown letter press
window.addEventListener('keydown', e => {
    if(e.keyCode >= 65 && e.keyCode <= 90){
        const letter = e.key;
        if(selectedWord.includes(letter)){
            if(!correctLetters.includes(letter)){
                correctLetters.push(letter);
                displayWord();
            }else{
                showNotification();
            }
        }else{
            if(!wrongLetters.includes(letter)){
                wrongLetters.push(letter);
                updateWrongLettersEl();
            }else{
                showNotification();
            }
        }
    }
});

// restart game and play again
playAgainBtn.addEventListener('click',() => {
    // Empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);

    // selectedWord = words[Math.floor(Math.random()*words.length)];
    getWord();
    updateWrongLettersEl();
    popup.style.display = 'none';
    displayWord();
});

getWord();