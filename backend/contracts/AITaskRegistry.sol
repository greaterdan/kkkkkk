// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AITaskRegistry {
    enum TaskStatus { Pending, Processing, Completed, Failed }
    enum TaskType { LLM, Vision, Embedding, Audio }
    
    struct Task {
        bytes32 id;
        address submitter;
        TaskType taskType;
        string prompt;
        string result;
        string subnetId;
        uint256 payment;
        TaskStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    mapping(bytes32 => Task) public tasks;
    mapping(address => bytes32[]) public userTasks;
    bytes32[] public allTasks;
    
    event TaskSubmitted(bytes32 indexed taskId, address indexed submitter, TaskType taskType, uint256 payment);
    event TaskProcessing(bytes32 indexed taskId);
    event TaskCompleted(bytes32 indexed taskId, string result);
    event TaskFailed(bytes32 indexed taskId, string reason);
    
    function submitTask(
        TaskType taskType,
        string memory prompt,
        string memory subnetId
    ) external payable returns (bytes32) {
        require(msg.value > 0, "Payment required");
        
        bytes32 taskId = keccak256(abi.encodePacked(msg.sender, block.timestamp, prompt));
        
        tasks[taskId] = Task({
            id: taskId,
            submitter: msg.sender,
            taskType: taskType,
            prompt: prompt,
            result: "",
            subnetId: subnetId,
            payment: msg.value,
            status: TaskStatus.Pending,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        userTasks[msg.sender].push(taskId);
        allTasks.push(taskId);
        
        emit TaskSubmitted(taskId, msg.sender, taskType, msg.value);
        return taskId;
    }
    
    function updateTaskStatus(bytes32 taskId, TaskStatus status) external {
        require(tasks[taskId].submitter != address(0), "Task does not exist");
        tasks[taskId].status = status;
        
        if (status == TaskStatus.Processing) {
            emit TaskProcessing(taskId);
        }
    }
    
    function completeTask(bytes32 taskId, string memory result) external {
        require(tasks[taskId].submitter != address(0), "Task does not exist");
        require(tasks[taskId].status != TaskStatus.Completed, "Already completed");
        
        tasks[taskId].status = TaskStatus.Completed;
        tasks[taskId].result = result;
        tasks[taskId].completedAt = block.timestamp;
        
        emit TaskCompleted(taskId, result);
    }
    
    function failTask(bytes32 taskId, string memory reason) external {
        require(tasks[taskId].submitter != address(0), "Task does not exist");
        
        tasks[taskId].status = TaskStatus.Failed;
        
        // Refund payment
        payable(tasks[taskId].submitter).transfer(tasks[taskId].payment);
        
        emit TaskFailed(taskId, reason);
    }
    
    function getUserTasks(address user) external view returns (bytes32[] memory) {
        return userTasks[user];
    }
    
    function getTask(bytes32 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }
    
    function getTaskCount() external view returns (uint256) {
        return allTasks.length;
    }
}

