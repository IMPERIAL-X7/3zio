// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Verifier.sol";
import "./main.sol";
import "./data_types.sol";

contract Burner_Verifier {
    Main_Contract public real_contract;
    Groth16Verifier public verifier;

    constructor(address _contract, address _verifier) {
        real_contract = Main_Contract(_contract);
        verifier = Groth16Verifier(_verifier);
    }

    function BurnerVerifier(bytes calldata proof, proof_data_A calldata info) external payable {
        // Step 1: verify proof
        bool verified = verifier.verifyProof(proof);
        require(verified, "Invalid proof");
        require(info.valid_rp, "Invalid range proof");
        balance_data balances = real_contract.getbalance(msg.sender);
        require(info.curr_pub_balance == balances[msg.sender].pub_balance, "Invalid current public balance");
        require(info.curr_priv_balance == balances[msg.sender].priv_balance, "Invalid private balances");
        // Step 2: deposit into SafeVault
        real_contract.burner(msg.sender, parseProof(proof));
    }
}