'use strict';

/*WE USE "." BECAUSE WE ARE SELECTING THE CLASS NAME OF EVERY ELEMENT*/
/*
document.querySelector('.message');
console.log(document.querySelector('.message').textContent);
document.querySelector('.message').textContent = 'Correct Number😎';

document.querySelector('.number').textContent = 15;
document.querySelector('.score').textContent = 20;

//TO SEE THE VALUE OF THE ELEMENT INPUT
document.querySelector('.guess').value = 23;
console.log(document.querySelector('.guess').value);
*/

/*Event listener*/

let secretNumber = Math.trunc(Math.random() * 20) + 1; //random number to guess
let score = 20;
let highscore = 0;
const displayingMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

//console.log(highestScore);
document.querySelector('.number').textContent = '?';
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  // WHEN THERE IS NO INPUT
  if (!guess) {
    displayingMessage('🚫 No Number inserted');

    // WHEN PLAYER GUESSES NUMBER
  } else if (guess === secretNumber) {
    displayingMessage('😎 Correct Number 😎');
    document.querySelector('.number').textContent = secretNumber;
    //CHANGES THE COLOR OF BACKGROUND WHEN PLAYER WINS
    document.querySelector('body').style.backgroundColor = '#8B8000';
    //CHANGES THE WIDTH OF THE BOX WHERE THE SECRET NUMBER IS IN
    document.querySelector('.number').style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    //when guess is wrong
  } else if (guess !== secretNumber) {
    if (score > 1) {
      displayingMessage(
        guess > secretNumber ? '😁 Too High 😁' : '😒 Too Low 😒'
      );
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      //WHEN PLAYER RUNS OUT OF LIVES
      displayingMessage('🤦‍♂️ You lost the game 😢');
      document.querySelector('.score').textContent = 0;
    }
  }
});
document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  displayingMessage('Start guessing...');
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = 'black';
  document.querySelector('.number').style.width = '15rem';
});
