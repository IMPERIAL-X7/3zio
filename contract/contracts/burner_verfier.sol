// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Verifier.sol";
import "./main.sol";
import "./data_types.sol";

contract Depositor {
    Main_Contract public real_contract;
    Verifier public verifier;

    constructor(address _contract, address _verifier) {
        real_contract = Main_Contract(_contract);
        verifier = Verifier(_verifier);
    }

    function depositWithProof(bytes calldata proof) external payable {
        // Step 1: verify proof
        bool verified = verifier.verifyProof(proof);
        require(verified, "Invalid proof");

        // Step 2: deposit into SafeVault
        real_contract.deposit{value: msg.value}(msg.sender);
    }
}