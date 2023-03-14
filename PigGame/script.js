'use strict';

//Element selection
const player0Background = document.querySelector('.player--0');
const player1Background = document.querySelector('.player--1');
const score0Element = document.querySelector('#score--0');
const score1Element = document.getElementById('score--1');
const current0Element = document.getElementById('current--0');
const current1Element = document.getElementById('current--1');

const diceElement = document.querySelector('.dice');
const btnNewGame = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnSave = document.querySelector('.btn--hold');

let scores, currentScore, activePlayer, playing;
//Beginning conditions

const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0Element.textContent = 0;
  score1Element.textContent = 0;
  diceElement.classList.add('hidden');

  score0Element.textContent = 0;
  score1Element.textContent = 0;
  current0Element.textContent = 0;
  current1Element.textContent = 0;
  player0Background.classList.remove('player--winner');
  player1Background.classList.remove('player--winner');
  player0Background.classList.add('player--active');
  player1Background.classList.remove('player--active');
};

//switching player function
const switchingPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;
  //toggle removes the class if existent
  player0Background.classList.toggle('player--active');
  player1Background.classList.toggle('player--active');
};

init();

// Rolling die functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. To generate random die roll
    const dieRandom = Math.trunc(Math.random() * 6) + 1;

    //2. Display die
    diceElement.classList.remove('hidden');
    diceElement.src = `dice-${dieRandom}.png`;

    //checking if a 1 is rolled. If true, the other player throws
    if (dieRandom !== 1) {
      //add die to current score
      currentScore += dieRandom;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      //switching player
      switchingPlayer();
    }
  }
});

btnSave.addEventListener('click', function () {
  if (playing) {
    //1.- Add active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    //2.- Check if player's score is >= 100
    if (scores[activePlayer] >= 100) {
      //Finish game
      playing = false;
      diceElement.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      //3.- Switch to next player
      switchingPlayer();
    }
  }
});

btnNewGame.addEventListener('click', init);
