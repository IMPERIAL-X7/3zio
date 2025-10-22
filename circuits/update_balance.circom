pragma circom 2.1.6;

include "circomlib/poseidon.circom";

template UpdateBalance() {
    // Public inputs (on-chain)
    signal input old_commitment;  // previous commitment hash
    signal input new_commitment;  // new commitment hash
    signal input nullifier;       // nullifier hash (public to prevent reuse)

    // Private inputs (kept by Alice)
    signal private input secret;  // user secret / private key
    signal private input old_balance;
    signal private input spend_amount;
    signal private input new_balance;

    // === Constraints ===

    // Balance update check
    new_balance <== old_balance - spend_amount;

    // Commitment generation (Poseidon hash)
    signal computed_old_commitment <== Poseidon([secret, old_balance]);
    signal computed_new_commitment <== Poseidon([secret, new_balance]);
    signal computed_nullifier <== Poseidon([secret, old_commitment]);

    // Enforce equality between computed and provided commitments
    computed_old_commitment === old_commitment;
    computed_new_commitment === new_commitment;
    computed_nullifier === nullifier;
}

component main = UpdateBalance();

