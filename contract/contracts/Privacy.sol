// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Verifier.sol";

contract Privacy {
    Verifier public verifier;

    struct Note {
        bytes32 commitment;
        bool nullified;
    }

    mapping(bytes32 => bool) public nullifiers;
    mapping(address => bytes32[]) public commitments;

    event NoteCreated(address indexed user, bytes32 commitment);
    event NoteNullified(bytes32 nullifier);

    constructor(address _verifier) {
        verifier = Verifier(_verifier);
    }

    function submitProof(
        bytes32 oldCommitment,
        bytes32 newCommitment,
        bytes32 nullifier,
        Verifier.Proof memory proof
    ) external {
        require(!nullifiers[nullifier], "Nullifier already used");

        // Verify zkSNARK proof
        bool valid = verifier.verifyProof(
            proof.a,
            proof.b,
            proof.c,
            [uint256(oldCommitment), uint256(newCommitment), uint256(nullifier)]
        );
        require(valid, "Invalid proof");

        // Mark nullifier as used
        nullifiers[nullifier] = true;
        emit NoteNullified(nullifier);

        // Record new commitment
        commitments[msg.sender].push(newCommitment);
        emit NoteCreated(msg.sender, newCommitment);
    }
}
