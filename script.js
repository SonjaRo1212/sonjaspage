// === Responsive Menü Toggle ===
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// === Memory Game ===
const cardsArray = ['🍓','🍓','🌈','🌈','💎','💎','🌸','🌸','🚀','🚀','🎨','🎨'];
let memoryGameContainer = document.getElementById('memory-game');
let movesCounter = document.getElementById('moves');
let timerDisplay = document.getElementById('timer');
let restartBtn = document.getElementById('restart-game');

let moves = 0;
let time = 0;
let interval;
let firstCard, secondCard;
let lockBoard = false;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  memoryGameContainer.innerHTML = '';
  moves = 0;
  time = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  movesCounter.textContent = moves;
  timerDisplay.textContent = time;
  clearInterval(interval);
  interval = setInterval(() => {
    time++;
    timerDisplay.textContent = time;
  }, 1000);

  let shuffledCards = shuffle([...cardsArray]);
  shuffledCards.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front">${icon}</div>
    `;
    card.addEventListener('click', flipCard);
    memoryGameContainer.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  this.classList.add('flip');
  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  moves++;
  movesCounter.textContent = moves;
  const firstIcon = firstCard.querySelector('.card-front').textContent;
  const secondIcon = secondCard.querySelector('.card-front').textContent;
  if (firstIcon === secondIcon) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

restartBtn.addEventListener('click', startGame);

// === Modal Steuerung ===
const modal = document.getElementById('memory-game-modal');
const playGameLinks = document.querySelectorAll('.play-game');
const closeModal = document.querySelector('.close-modal');

playGameLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    modal.style.display = 'block';
    startGame();
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  clearInterval(interval);
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    clearInterval(interval);
  }
});

// === Cookie-Banner ===
document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("cookie-banner");
  const accept = document.getElementById("cookie-accept");
  if (!banner || !accept) return;
  if (!localStorage.getItem("cookieAccepted")) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
  }
  accept.addEventListener("click", function () {
    localStorage.setItem("cookieAccepted", "true");
    banner.style.display = "none";
  });
});
