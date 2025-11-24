let score = 0;
let clickPower = 10;
let walletAddress = "";

function startGame() {
    document.getElementById('game-area').innerHTML = "";
    score = 0;
    updateScore();
    spawnTokens();
}

function spawnTokens() {
    setInterval(() => {
        let token = document.createElement('div');
        token.className = 'token';
        token.style.left = Math.random() * 90 + "%";
        document.getElementById('game-area').appendChild(token);

        let interval = setInterval(() => {
            let top = parseInt(token.style.top || "0");
            if (top > 380) {
                clearInterval(interval);
                token.remove();
            } else {
                token.style.top = top + 5 + "px";
            }
        }, 100);

        token.onclick = function() {
            score += clickPower;
            updateScore();
            token.remove();
        };
    }, 1000);
}

function updateScore() {
    document.getElementById('score').innerText = score;
}

function showWalletInput() {
    document.getElementById('wallet-input').style.display = "block";
}

function saveWallet() {
    walletAddress = document.getElementById('wallet-address').value;
    localStorage.setItem("wallet", walletAddress);
    alert("Wallet saved!");
    closePopup('wallet-input');
}

function showReferral() {
    document.getElementById('referral').style.display = "block";
}

function shareReferral() {
    Telegram.WebApp.openTelegramLink("https://t.me/SMARTGameBot");
}

function showStore() {
    document.getElementById('store').style.display = "block";
}

function buyItem(item) {
    if (item === 'doublePoints') {
        clickPower *= 2;
        alert("Double Earnings activated!");
    } else if (item === 'autoClick') {
        autoClicker();
    }
    closePopup('store');
}

function autoClicker() {
    setInterval(() => {
        score += clickPower;
        updateScore();
    }, 1000);
}

function showNFTs() {
    document.getElementById('nft-store').style.display = "block";
}

function buyNFT(nft) {
    if (nft === 'goldenToken') {
        clickPower *= 2;
        alert("Golden Token NFT equipped! You now earn double points.");
    }
    closePopup('nft-store');
}

function closePopup(id) {
    document.getElementById(id).style.display = "none";
}
