// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintableToken is ERC20Capped, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 decimals,
        address tokenOwner,
        uint256 initialSupply,
        uint256 cap
    ) ERC20Capped(cap) ERC20(name, symbol) {
        require(
            tokenOwner != address(0)
        );
        _mint(tokenOwner, initialSupply * 10**decimals);
        _transferOwnership(tokenOwner);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
