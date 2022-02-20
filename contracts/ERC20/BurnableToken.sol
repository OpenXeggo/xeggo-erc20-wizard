// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract BurnableToken is ERC20, ERC20Burnable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 decimals,
        address tokenOwner,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        require(
            tokenOwner != address(0)
        );
        _mint(tokenOwner, initialSupply * 10**decimals);
    }
}
