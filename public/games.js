let userId = 'Hey @${data.username}! 🌟 You have ${data.coinCount} SMART.'; // This should be dynamic in a real app
let taps = 0;
let score = 0;
let level = 1;
let bonus = 0;
let isRewardActive = false;
let bonusInterval;
let fallingCoinsInterval;
let bonusRainTimeout;

const tapArea = document.getElementById('tapArea');
const tokenClickDisplay = document.querySelector('#token-click span');
const levelDisplay = document.querySelector('#level span');
const bonusDisplay = document.querySelector('#bonus span');
const rewardBox = document.getElementById('reward-box');
const referralButton = document.getElementById('referral-button');

var url = new URL(location.href);
var playerid = url.searchParams.get("id");

// Function to create a falling coin
function createFallingCoin() {
    const coin = document.createElement('img');
    coin.src = 'icon.png'; // Ensure the icon.png is in the same directory
    coin.className = 'coin';
    coin.style.left = Math.random() * (tapArea.clientWidth - 50) + 'px';
    coin.style.top = '-50px'; // Start above the visible area
    coin.addEventListener('click', handleTap);
    tapArea.appendChild(coin);
    animateCoin(coin);
}

// Animate the coin falling
function animateCoin(coin) {
    const fallDuration = Math.random() * 3 + 3; // Random duration between 1 and 3 seconds
    coin.style.transition = `top ${fallDuration}s linear`;
    setTimeout(() => {
        coin.style.top = tapArea.clientHeight + 'px'; // End below the visible area
    }, 0);
    
    coin.addEventListener('transitionend', () => {
        if (coin.parentElement === tapArea) {
            tapArea.removeChild(coin);
        }
    });
}

        // Disable pinch-to-zoom
        document.addEventListener('touchmove', function(event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, { passive: false });

        // Disable double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

// Function to create a falling bonus icon
function createFallingBonusIcon() {
    const bonusIcon = document.createElement('img');
    bonusIcon.src = 'bonus-icon.png'; // Ensure the bonus-icon.png is in the same directory
    bonusIcon.className = 'coin';
    bonusIcon.style.left = Math.random() * (tapArea.clientWidth - 50) + 'px';
    bonusIcon.style.top = '-50px'; // Start above the visible area
    bonusIcon.addEventListener('click', handleBonusTap);
    tapArea.appendChild(bonusIcon);

    // Animate the bonus icon falling
    const fallDuration = Math.random() * 3 + 3; // Random duration between 1 and 3 seconds
    bonusIcon.style.transition = `top ${fallDuration}s linear`;
    setTimeout(() => {
        bonusIcon.style.top = tapArea.clientHeight + 'px'; // End below the visible area
    }, 0);
    
    bonusIcon.addEventListener('transitionend', () => {
        if (bonusIcon.parentElement === tapArea) {
            tapArea.removeChild(bonusIcon);
        }
    });
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
    event.target.remove();

    // Play sound
    document.getElementById('coin-sound').play();
}

// Function to handle taps on bonus icons
function handleBonusTap(event) {
    bonus++;
    showIncrement(event.clientX, event.clientY, 1, 'bonus');
    updateUI();
    updateScoreOnServer(taps, score, level, bonus);
    event.target.remove();

    // Play bonus sound
    document.getElementById('bonus-sound').play();
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

// Initialize Web3 when the window loads
window.addEventListener('load', initializeWeb3);

async function initializeWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        console.log('No Ethereum provider detected. Install MetaMask.');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const user = accounts[0];

    smartToken = new web3.eth.Contract(SmartTokenABI, tokenAddress);
    presaleContract = new web3.eth.Contract(PresaleContractABI, presaleAddress);
    airdropContract = new web3.eth.Contract(AirdropContractABI, airdropAddress);

    // Load user data from the smart contract
    const userData = await smartClickGame.methods.getUser(user).call();
    score = userData[0];
    bonus = userData[1];
    level = userData[2];
    tokenClickDisplay.textContent = score;
    levelDisplay.textContent = level;
    bonusDisplay.textContent = bonus;
    updateProgressBar();
}

// Function to update the UI
function updateUI() {
    tokenClickDisplay.innerText = score;
    levelDisplay.innerText = level;
    bonusDisplay.innerText = bonus;

    // Update progress bar
    const progress = (score / (level * 10000)) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

// Function to update score on the server
function updateScoreOnServer(taps, score, level, bonus) {
    fetch('/update-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, taps, score, level, bonus }),
    })
    .then(response => response.json())
    .then(data => console.log('Score updated:', data))
    .catch(error => console.error('Error:', error));
}

// Function to start the game
function startGame() {
    fallingCoinsInterval = setInterval(createFallingCoin, 1000);
    setTimeout(startBonusRain, 120000); // 2 minutes for level 1
}

// Function to start the bonus rain
function startBonusRain() {
    const bonusRainInterval = setInterval(createFallingBonusIcon, 1000);
    const randomInterval = Math.random() * 30000 + 120000; // Random interval between 2 and 5 minutes
    setTimeout(() => {
        clearInterval(bonusRainInterval);
        bonusRainTimeout = setTimeout(startBonusRain, randomInterval);
    }, 5000);
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
