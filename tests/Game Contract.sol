// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartClick {
    struct User {
        uint256 score;
        uint256 bonus;
        uint256 level;
    }

    mapping(address => User) public users;

    function updateUser(address _user, uint256 _score, uint256 _bonus, uint256 _level) public {
        users[_user].score = _score;
        users[_user].bonus = _bonus;
        users[_user].level = _level;
    }

    function getUser(address _user) public view returns (uint256, uint256, uint256) {
        return (users[_user].score, users[_user].bonus, users[_user].level);
    }
}
