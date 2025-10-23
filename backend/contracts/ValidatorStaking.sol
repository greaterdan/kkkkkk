// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ValidatorStaking {
    struct Validator {
        address addr;
        string name;
        uint256 stake;
        uint256 commission; // in basis points (500 = 5%)
        string subnetId;
        bool active;
        uint256 uptime; // percentage * 100 (9980 = 99.80%)
        uint256 totalRewards;
        uint256 registeredAt;
    }
    
    mapping(address => Validator) public validators;
    address[] public validatorList;
    
    uint256 public constant MIN_STAKE = 10000 ether;
    uint256 public constant MAX_COMMISSION = 2000; // 20%
    
    event ValidatorRegistered(address indexed validator, string name, uint256 stake);
    event ValidatorStaked(address indexed validator, uint256 amount);
    event ValidatorUnstaked(address indexed validator, uint256 amount);
    event RewardDistributed(address indexed validator, uint256 amount);
    
    function registerValidator(
        string memory name,
        string memory subnetId,
        uint256 commission
    ) external payable {
        require(msg.value >= MIN_STAKE, "Insufficient stake");
        require(!validators[msg.sender].active, "Already registered");
        require(commission <= MAX_COMMISSION, "Commission too high");
        
        validators[msg.sender] = Validator({
            addr: msg.sender,
            name: name,
            stake: msg.value,
            commission: commission,
            subnetId: subnetId,
            active: true,
            uptime: 10000, // 100% initial
            totalRewards: 0,
            registeredAt: block.timestamp
        });
        
        validatorList.push(msg.sender);
        emit ValidatorRegistered(msg.sender, name, msg.value);
    }
    
    function stakeMore() external payable {
        require(validators[msg.sender].active, "Not a validator");
        validators[msg.sender].stake += msg.value;
        emit ValidatorStaked(msg.sender, msg.value);
    }
    
    function unstake(uint256 amount) external {
        require(validators[msg.sender].active, "Not a validator");
        require(validators[msg.sender].stake >= amount, "Insufficient stake");
        require(validators[msg.sender].stake - amount >= MIN_STAKE, "Below minimum stake");
        
        validators[msg.sender].stake -= amount;
        payable(msg.sender).transfer(amount);
        emit ValidatorUnstaked(msg.sender, amount);
    }
    
    function getAllValidators() external view returns (Validator[] memory) {
        Validator[] memory result = new Validator[](validatorList.length);
        for (uint i = 0; i < validatorList.length; i++) {
            result[i] = validators[validatorList[i]];
        }
        return result;
    }
    
    function getValidatorCount() external view returns (uint256) {
        return validatorList.length;
    }
    
    function getValidator(address addr) external view returns (Validator memory) {
        return validators[addr];
    }
    
    // Admin function to distribute rewards
    function distributeReward(address validator, uint256 amount) external {
        require(validators[validator].active, "Not active validator");
        validators[validator].totalRewards += amount;
        emit RewardDistributed(validator, amount);
    }
}

