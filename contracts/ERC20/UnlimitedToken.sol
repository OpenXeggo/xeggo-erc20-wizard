// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract UnlimitedToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

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
        _mint(tokenOwner, initialSupply * 10 ** decimals);
        _grantRole(DEFAULT_ADMIN_ROLE, tokenOwner);
        _grantRole(MINTER_ROLE, tokenOwner);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}