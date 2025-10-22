pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template UpdateBalance() {
    // === Public inputs ===
    signal input old_commitment;  // previous commitment hash
    signal input new_commitment;  // new commitment hash
    signal input nullifier;       // nullifier hash (public to prevent reuse)

    // Private inputs (kept by Alice)
    signal input secret;  // user secret / private key
    signal input old_balance;
    signal input spend_amount;
    signal new_balance;

    // === Constraints ===
    new_balance <== old_balance - spend_amount;

    // Poseidon hash for old commitment
    component hash_old = Poseidon(2);
    hash_old.inputs[0] <== secret;
    hash_old.inputs[1] <== old_balance;
    signal computed_old_commitment <== hash_old.out;

    // Poseidon hash for new commitment
    component hash_new = Poseidon(2);
    hash_new.inputs[0] <== secret;
    hash_new.inputs[1] <== new_balance;
    signal computed_new_commitment <== hash_new.out;

    // Poseidon hash for nullifier
    component hash_nullifier = Poseidon(2);
    hash_nullifier.inputs[0] <== secret;
    hash_nullifier.inputs[1] <== old_commitment;
    signal computed_nullifier <== hash_nullifier.out;

    // Enforce equality
    computed_old_commitment === old_commitment;
    computed_new_commitment === new_commitment;
    computed_nullifier === nullifier;
}

component main = UpdateBalance();

