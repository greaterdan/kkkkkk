// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Token01A.sol";
import "../src/TokenBridge.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Token01A
        console.log("Deploying Token01A...");
        Token01A token = new Token01A();
        console.log("Token01A deployed at:", address(token));
        
        // Deploy TokenBridge
        console.log("Deploying TokenBridge...");
        TokenBridge bridge = new TokenBridge(address(token));
        console.log("TokenBridge deployed at:", address(bridge));
        
        // Set bridge address in token
        console.log("Setting bridge in Token01A...");
        token.setBridge(address(bridge));
        console.log("Bridge set in Token01A");
        
        // Fund bridge with some BNB for testing
        console.log("Funding bridge with 10 BNB...");
        (bool success,) = address(bridge).call{value: 10 ether}("");
        require(success, "Failed to fund bridge");
        console.log("Bridge funded with 10 BNB");
        
        vm.stopBroadcast();
        
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Token01A:", address(token));
        console.log("TokenBridge:", address(bridge));
        console.log("Exchange Rate: 1 BNB = 1000 01A");
        console.log("Bridge BNB Balance: 10 BNB");
    }
}
