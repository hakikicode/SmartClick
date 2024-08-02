// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SmartToken.sol";

contract SmartClickGame is Ownable {
    SmartToken public token;
    uint256 public tokenIncrement;

    struct User {
        uint256 score;
        uint256 bonus;
        uint256 level;
        uint256 tokenBalance;
    }

    mapping(address => User) public users;

    event CoinClicked(address indexed user, uint256 tokensMinted);

    constructor(SmartToken _token, uint256 _tokenIncrement) Ownable(msg.sender) {
        token = _token;
        tokenIncrement = _tokenIncrement;
    }

    function clickCoin() public {
        User storage user = users[msg.sender];
        uint256 incrementValue = user.level > 1 ? 2 * user.level : 1;
        uint256 tokensToMint = incrementValue * tokenIncrement;

        user.score += incrementValue;
        user.tokenBalance += tokensToMint;
        token.mint(msg.sender, tokensToMint);

        emit CoinClicked(msg.sender, tokensToMint);

        if (user.score >= 10000 * user.level) {
            levelUp(msg.sender);
        }
    }

    function levelUp(address _user) internal {
        User storage user = users[_user];
        user.level++;
        user.score = 0;
    }

    function getUser(address _user) public view returns (uint256, uint256, uint256, uint256) {
        User storage user = users[_user];
        return (user.score, user.bonus, user.level, user.tokenBalance);
    }
}
