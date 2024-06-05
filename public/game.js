var url = new URL(location.href);
var playerid = url.searchParams.get("id");

let userId = 'user123'; // This should be dynamic in a real app
let taps = 0;
let score = 0;
let level = 1;
let bonus = 0;
let isRewardActive = false;
let bonusInterval;

const tapArea = document.getElementById('tapArea');
const tokenClickDisplay = document.querySelector('#token-click span');
const levelDisplay = document.querySelector('#level span');
const bonusDisplay = document.querySelector('#bonus span');
const rewardBox = document.getElementById('reward-box');
const referralButton = document.getElementById('referral-button');

// Function to create a falling coin
function createFallingCoin() {
    const coin = document.createElement('img');
    coin.src = 'icon.png'; // Ensure the icon.png is in the same directory
    coin.className = 'coin';
    coin.style.left = Math.random() * (tapArea.clientWidth - 50) + 'px';
    coin.style.top = '-50px';
    coin.addEventListener('click', handleTap);
    tapArea.appendChild(coin);
    animateCoin(coin);
}

// Function to create a falling bonus icon
function createFallingBonusIcon() {
    const bonusIcon = document.createElement('img');
    bonusIcon.src = 'bonus-icon.png'; // Ensure the bonus-icon.png is in the same directory
    bonusIcon.className = 'coin';
    bonusIcon.style.left = Math.random() * (tapArea.clientWidth - 50) + 'px';
    bonusIcon.style.top = '-50px';
    bonusIcon.addEventListener('click', handleBonusTap);
    tapArea.appendChild(bonusIcon);
    animateCoin(bonusIcon);
}

// Function to animate the falling coin or bonus icon
function animateCoin(coin) {
    const duration = Math.random() * 3 + 3;
    const keyframes = [
        { transform: 'translateY(0)' },
        { transform: `translateY(${tapArea.clientHeight + 50}px)` }
    ];
    const options = {
        duration: duration * 1000,
        easing: 'linear',
    };
    const animation = coin.animate(keyframes, options);
    animation.onfinish = () => {
        tapArea.removeChild(coin);
    };
}

// Function to handle taps on coins
function handleTap(event) {
    const incrementValue = isRewardActive ? 10 : 1;
    score += incrementValue;
    taps++;
    showIncrement(event.clientX, event.clientY, incrementValue);
    if (score >= level * 15000) {
        showRewardBox();
    }
    if (score >= level * 10000) {
        level++;
        score = 0;
        alert(`Congratulations! You've reached level ${level}!`);
    }
    updateUI();
    updateScoreOnServer(taps, score, level, bonus);
    tapArea.removeChild(event.target);
}

// Function to handle taps on bonus icons
function handleBonusTap(event) {
    bonus++;
    showIncrement(event.clientX, event.clientY, 1, 'bonus');
    updateUI();
    updateScoreOnServer(taps, score, level, bonus);
    tapArea.removeChild(event.target);
}

// Function to show increment animation
function showIncrement(x, y, incrementValue, type = 'score') {
    const increment = document.createElement('div');
    increment.className = `increment ${type}`;
    increment.style.left = x + 'px';
    increment.style.top = y + 'px';
    increment.innerText = `+${incrementValue}`;
    document.body.appendChild(increment);
    setTimeout(() => document.body.removeChild(increment), 1000);
}

// Function to show reward box
function showRewardBox() {
    rewardBox.style.display = 'block';
    isRewardActive = true;
    setTimeout(() => {
        rewardBox.style.display = 'none';
        isRewardActive = false;
    }, 5000);
}

// Function to collect reward
function collectReward() {
    alert("You've collected unlimited tokens for 5 seconds!");
    isRewardActive = true;
    setTimeout(() => {
        isRewardActive = false;
        rewardBox.style.display = 'none';
    }, 5000);
}

// Function to update the UI
function updateUI() {
    tokenClickDisplay.innerText = score;
    levelDisplay.innerText = level;
    bonusDisplay.innerText = bonus;
}

// Function to update score on the server
function updateScoreOnServer(taps, score, level, bonus) {
    fetch('update-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, taps, score, level, bonus }),
    })
    .then(response => response.json())
    .then(data => console.log('Score updated:', data))
    .catch(error => console.error('Error:', error));

    // Submit highscore to Telegram
var xmlhttp = new XMLHttpRequest();
var url = "update-score" + level  +
"?id=" + playerid;
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

// Function to start the game
function startGame() {
    setInterval(createFallingCoin, 1000);
    setTimeout(() => {
        startBonusRain();
    }, 120000); // 2 minutes for level 1
}

// Function to start the bonus rain
function startBonusRain() {
    const bonusRainInterval = setInterval(createFallingBonusIcon, 1000);
    setTimeout(() => {
        clearInterval(bonusRainInterval);
        if (level > 1) {
            setTimeout(startBonusRain, 300000); // 5 minutes for other levels
        }
    }, 5000); // Bonus rain for 5 seconds
}

// Function to invite a friend
function inviteFriend() {
    referralButton.style.display = 'block';
    referralButton.innerText = "Click to Copy Referral Link";
}

// Function to show tasks
function showTasks() {
    alert("Complete the tasks to earn more tokens!");
}

// Function to generate referral link
function generateReferral() {
    const referralLink = `http://localhost:3000/referral?userId=${userId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
        alert("Referral link copied to clipboard!");
    });
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', startGame);
