// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartToken is ERC20Burnable, Ownable {
    uint256 public constant TOTAL_SUPPLY = 900000000000000 * 10**18;

    address public gameAddress;
    address public communityAddress;
    address public circulationAddress;
    address public developersAddress;

    constructor(
        address _gameAddress,
        address _communityAddress,
        address _circulationAddress,
        address _developersAddress
    ) ERC20("Smart Token", "SON") Ownable(msg.sender) {
        require(_gameAddress != address(0), "Invalid game address");
        require(_communityAddress != address(0), "Invalid community address");
        require(_circulationAddress != address(0), "Invalid circulation address");
        require(_developersAddress != address(0), "Invalid developers address");

        gameAddress = _gameAddress;
        communityAddress = _communityAddress;
        circulationAddress = _circulationAddress;
        developersAddress = _developersAddress;

        _mint(gameAddress, TOTAL_SUPPLY * 40 / 100); // 40% for the smartclick game airdrop
        _mint(communityAddress, TOTAL_SUPPLY * 10 / 100); // 10% for community airdrop
        _mint(circulationAddress, TOTAL_SUPPLY * 30 / 100); // 30% for circulation
        _mint(developersAddress, TOTAL_SUPPLY * 20 / 100); // 20% for developers
    }
}
