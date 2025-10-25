// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./data_types.sol";

contract Main_Contract{

    mapping (address => balance_data) private balances;
    address public burn_controller; // ConditionalBurner contract
    address public mint_controller; // ConditionalMinter contract
    address public owner;

    // Set of uint256 values
    mapping(uint256 => bool) private unminted_proofs;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyBurner() {
        require(msg.sender == burn_controller, "Not authorized");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == mint_controller, "Not authorized");
        _;        
    }

    // internal updater used by both the owner and the controller path
    function _setbalance(address user, uint256 pub_balance, uint256 priv_balance) internal {
        balances[user] = balance_data(pub_balance, priv_balance);
    }

    function burner(address user, proof_data_A calldata info) external payable onlyBurner{
        require(info.valid_rp, "Invalid range proof");
        require(info.curr_pub_balance == balances[user].pub_balance, "Invalid current public balance");
        require(info.curr_priv_balance == balances[user].priv_balance, "Invalid private balances");
        _setbalance(user, info.curr_pub_balance, info.new_priv_balance);
        unminted_proofs[info.nullifier] = true;
    }

    funtion minter()
    


}