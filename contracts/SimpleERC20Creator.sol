//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC20/SimpleToken.sol";
import "./ERC20/StandardToken.sol";

contract SimpleERC20Creator is Ownable {
    mapping(address => address[]) public userTokensList;
    event TokenCreated(address _token);

    function createSimpleToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public {
        SimpleToken token = new SimpleToken(
            name,
            symbol,
            msg.sender,
            initialSupply
        );
        userTokensList[msg.sender].push(address(token));
        emit TokenCreated(address(token));
    }

    function createStandardToken(
        string memory name,
        string memory symbol,
        uint256 decimals,
        uint256 initialSupply
    ) public {
        StandardToken token = new StandardToken(
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
