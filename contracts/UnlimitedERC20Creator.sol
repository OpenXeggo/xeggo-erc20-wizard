//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC20/UnlimitedToken.sol";

contract UnlimitedERC20Creator is Ownable {
    mapping(address => address[]) public userTokensList;
    event TokenCreated(address _token);

    function createUnlimitedToken(
        string memory name,
        string memory symbol,
        uint256 decimals,
        uint256 initialSupply
    ) public {
        UnlimitedToken token = new UnlimitedToken(
            name,
            symbol,
            decimals,
            msg.sender,
            initialSupply
        );
        userTokensList[msg.sender].push(address(token));
        emit TokenCreated(address(token));
    }

    // Get tokens by a user
    function getTokens() public view returns (address[] memory userTokens) {
        userTokens = userTokensList[msg.sender];
    }
}
