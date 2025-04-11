// Navigationsmenü Toggle für Mobile
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Klick außerhalb des Menüs schließt das Menü
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// Navbar Scrolling Effekt
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll für Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Menü schließen, wenn auf einen Link geklickt wird
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animation für Elemente beim Scrollen
const fadeInElements = document.querySelectorAll('.interest-card, .about-image, .about-text, .projekt-item');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.3 });

fadeInElements.forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeInObserver.observe(element);
});

// Projekt Filter Funktionalität
const tabButtons = document.querySelectorAll('.tab-btn');
const projektItems = document.querySelectorAll('.projekt-item');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Aktiven Button setzen
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-tab');
        
        // Projekte filtern
        projektItems.forEach(item => {
            if (filterValue === 'alle' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = 1;
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = 0;
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 500);
            }
        });
    });
});

// Memory Game
const memoryGameModal = document.getElementById('memory-game-modal');
const memoryGameContainer = document.getElementById('memory-game');
const closeModal = document.querySelector('.close-modal');
const playGameBtns = document.querySelectorAll('.play-game');
const restartGameBtn = document.getElementById('restart-game');
const movesCounter = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');

// Memory Game Emoji-Karten
const emojis = ['🐱', '🐶', '🐼', '🦊', '🐰', '🦁', '🐯', '🦄'];
let cards = [...emojis, ...emojis];
let moves = 0;
let timer = 0;
let timerInterval;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// Modal öffnen, wenn auf Spielen-Button geklickt wird
playGameBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        memoryGameModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Scrolling deaktivieren
        startGame();
    });
});

// Modal schließen
closeModal.addEventListener('click', () => {
    memoryGameModal.style.display = 'none';
    document.body.style.overflow = ''; // Scrolling aktivieren
    clearInterval(timerInterval);
});

// Klick außerhalb des Modals schließt es
window.addEventListener('click', (e) => {
    if (e.target === memoryGameModal) {
        memoryGameModal.style.display = 'none';
        document.body.style.overflow = ''; // Scrolling aktivieren
        clearInterval(timerInterval);
    }
});

// Neustart des Spiels
restartGameBtn.addEventListener('click', startGame);

// Spiel initialisieren
function startGame() {
    // Zurücksetzen des Spielzustands
    memoryGameContainer.innerHTML = '';
    moves = 0;
    movesCounter.textContent = moves;
    clearInterval(timerInterval);
    timer = 0;
    timerDisplay.textContent = timer;
    hasFlippedCard = false;
    lockBoard = false;
    
    // Timer starten
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
    
    // Karten mischen
    shuffleCards();
    
    // Karten erstellen
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.framework = emoji;
        
        const front = document.createElement('div');
        front.classList.add('card-front');
        front.textContent = emoji;
        
        const back = document.createElement('div');
        back.classList.add('card-back');
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', flipCard);
        
        memoryGameContainer.appendChild(card);
    });
}

// Karten mischen
function shuffleCards() {
    cards = [...emojis, ...emojis];
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// Karte umdrehen
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    this.classList.add('flip');
    
    if (!hasFlippedCard) {
        // Erste Karte
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    // Zweite Karte
    secondCard = this;
    
    // Zug zählen
    moves++;
    movesCounter.textContent = moves;
    
    // Prüfen, ob es ein Match ist
    checkForMatch();
}

// Prüfen, ob die Karten übereinstimmen
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    
    isMatch ? disableCards() : unflipCards();
    
    // Prüfen, ob das Spiel gewonnen wurde
    if (document.querySelectorAll('.memory-card.flip').length === cards.length) {
        setTimeout(() => {
            clearInterval(timerInterval);
            alert(`Glückwunsch! Du hast das Spiel mit ${moves} Zügen in ${timer} Sekunden gewonnen! 🎉`);
        }, 500);
    }
}

// Bei einem Match Karten deaktivieren
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

// Bei keinem Match Karten wieder umdrehen
function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        resetBoard();
    }, 1000);
}

// Spielbrett zurücksetzen
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}