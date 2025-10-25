// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Verifier.sol"; //to be changed to minter verifier
import "./main.sol";
import "./data_types.sol";

contract Minter_Verifier {
    Main_Contract public real_contract;
    Groth16Verifier public A_verifier;


    constructor(address _contract, address _verifier) {
        real_contract = Main_Contract(_contract);
        A_verifier = Groth16Verifier(_verifier);
    }

    function Minter_VerifierVerifier(bytes calldata proof_A, bytes calldata proof_B) external payable {
        // Step 1: verify proof
        bool verified_A = A_verifier.verifyProof(proof_A);
        require(verified_A, "Invalid proof");

        bool verified_B = A_verifier.verifyProof(proof_B);
        require(verified_B, "Invalid proof B");

        //logic for both nullfier to be same
        // Step 2: deposit into SafeVault
        real_contract.minter(msg.sender, parseProof(proof_A));
    }
}