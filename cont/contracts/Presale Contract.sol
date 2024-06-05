// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SmartToken.sol";

contract PresaleContract is Ownable {
    SmartToken public token;
    uint256 public constant TOKEN_PRICE_USD = 0.001 * 10**18; // 0.001 USD per SON
    uint256 public constant TOKEN_PRICE_NGN = 1.34 * 10**18; // 1.34 NGN per SON
    uint256 public constant MAX_SALE_TOKENS = 100000000 * 10**18; // 100,000,000 SON
    uint256 public constant DURATION = 90 days; // 3 months

    uint256 public startTime;
    uint256 public soldTokens;
    address payable public fundReceiver;

    mapping(address => uint256) public payments;

    event TokenPurchased(address indexed buyer, uint256 amount, uint256 cost);

    constructor(SmartToken _token, address payable _fundReceiver) Ownable(msg.sender) {
        token = _token;
        fundReceiver = _fundReceiver;
        startTime = block.timestamp;
    }

    modifier presaleActive() {
        require(block.timestamp < startTime + DURATION, "Presale ended");
        _;
    }

    function buyTokens(uint256 tokenAmount) external payable presaleActive {
        uint256 cost = tokenAmount * TOKEN_PRICE_USD / 10**18;
        require(msg.value >= cost, "Insufficient ETH");

        uint256 remaining = msg.value - cost;
        if (remaining > 0) {
            payable(msg.sender).transfer(remaining); // Refund extra ETH
        }

        token.transfer(msg.sender, tokenAmount);
        soldTokens += tokenAmount;
        fundReceiver.transfer(cost);

        emit TokenPurchased(msg.sender, tokenAmount, cost);
    }

    function updateFundReceiver(address payable _fundReceiver) external onlyOwner {
        fundReceiver = _fundReceiver;
    }

    function endPresale() external onlyOwner {
        uint256 unsoldTokens = token.balanceOf(address(this));
        if (unsoldTokens > 0) {
            token.transfer(owner(), unsoldTokens);
        }
    }
}
