// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Privacy {
    struct Note {
        bytes32 commitment;
        bool nullified;
    }

    mapping(bytes32 => bool) public nullifiers;
    mapping(address => bytes32[]) public commitments;

    event NoteCreated(address indexed sender, bytes32 commitment);
    event NoteClaimed(address indexed receiver, bytes32 commitment);
    event NoteNullified(bytes32 nullifier);

    function submitOutgoingUpdate(bytes32 commitment, bytes32 nullifier) external {
        require(!nullifiers[nullifier], "Already spent");
        nullifiers[nullifier] = true;
        commitments[msg.sender].push(commitment);
        emit NoteCreated(msg.sender, commitment);
    }

    function claimNote(bytes32 commitment) external {
        commitments[msg.sender].push(commitment);
        emit NoteClaimed(msg.sender, commitment);
    }
}
