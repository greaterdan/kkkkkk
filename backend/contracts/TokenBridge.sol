// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Token01A.sol";

contract TokenBridge {
    Token01A public token01A;
    address public owner;
    
    // Bridge rates (1 BNB = 1000 01A tokens)
    uint256 public constant BNB_TO_01A_RATE = 1000;
    
    event BridgeDeposit(address indexed user, uint256 bnbAmount, uint256 tokenAmount, uint256 timestamp);
    event BridgeWithdraw(address indexed user, uint256 tokenAmount, uint256 bnbAmount, uint256 timestamp);
    
    constructor(address _token01A) {
        token01A = Token01A(_token01A);
        owner = msg.sender;
    }
    
    // Bridge BNB to 01A tokens
    function bridgeBNBTo01A() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Calculate 01A tokens to mint (1 BNB = 1000 01A)
        uint256 tokenAmount = msg.value * BNB_TO_01A_RATE;
        
        // Mint 01A tokens to user
        token01A.transfer(msg.sender, tokenAmount);
        
        emit BridgeDeposit(msg.sender, msg.value, tokenAmount, block.timestamp);
    }
    
    // Bridge 01A tokens back to BNB
    function bridge01AToBNB(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount must be greater than 0");
        
        // Calculate BNB to return (1000 01A = 1 BNB)
        uint256 bnbAmount = tokenAmount / BNB_TO_01A_RATE;
        
        // Check contract has enough BNB
        require(address(this).balance >= bnbAmount, "Insufficient BNB in bridge");
        
        // Check user has enough 01A tokens
        require(token01A.balanceOf(msg.sender) >= tokenAmount, "Insufficient 01A tokens");
        
        // Transfer 01A tokens from user to bridge (burn them)
        token01A.transferFrom(msg.sender, address(this), tokenAmount);
        
        // Send BNB to user
        payable(msg.sender).transfer(bnbAmount);
        
        emit BridgeWithdraw(msg.sender, tokenAmount, bnbAmount, block.timestamp);
    }
    
    // Get user's 01A token balance
    function get01ABalance(address user) external view returns (uint256) {
        return token01A.balanceOf(user);
    }
    
    // Get bridge BNB balance
    function getBridgeBNBBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Owner can withdraw BNB (for maintenance)
    function withdrawBNB() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    // Receive BNB
    receive() external payable {}
}
