// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Bridge {
    event Deposit(address indexed from, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed to, uint256 amount, uint256 timestamp);
    
    mapping(address => uint256) public deposits;
    
    function deposit() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        deposits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
    
    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        deposits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount, block.timestamp);
    }
    
    function getBalance(address user) external view returns (uint256) {
        return deposits[user];
    }
}

