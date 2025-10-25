pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

/*
 * @title UpdateBalanceOptimal
 * @dev Combines the best features of both designs:
 * 1. Range proof verification (sufficient funds check)
 * 2. State commitment verification (old balance proves)
 * 3. New balance computation and hashing
 * 4. Robust nullifier for replay attack prevention
 * 5. Transaction uniqueness hash for receiver verification
 *
 * Key improvements:
 * - Verifies old commitment matches the prover's secret and balance
 * - Computes new commitment for the updated balance
 * - Generates transaction uniqueness hash for receiver
 * - Uses comprehensive nullifier to prevent replay attacks
 * - Uses LessThan for proper range checking instead of LessEqThan
 */
template UpdateBalanceOptimal() {
    // === Public Inputs ===
    signal input public_balance;
    signal input old_commitment;     // Commitment of old private balance
    
    // === Private Inputs ===
    signal input secret;             // User's private key/secret
    signal input private_balance;    // User's private balance
    signal input spend_amount;       // Amount to spend
    signal input randomness;         // Random nonce for uniqueness
    
    // === Intermediate Signals ===
    signal new_balance;
    signal computed_old_commitment;
    signal computed_new_commitment;
    
    // === Public Outputs ===
    signal output new_commitment;
    signal output amount_hash;       // Hash(spend_amount, randomness)
    signal output nullifier;         // Replay attack prevention
    
    // --- MODULE 1: SUFFICIENT FUNDS RANGE PROOF ---
    // Verify: public_balance + private_balance >= spend_amount
    signal available_balance;
    available_balance <== public_balance + private_balance;
    
    component rangeCheck = LessThan(252);
    rangeCheck.in[0] <== spend_amount;
    rangeCheck.in[1] <== available_balance;
    rangeCheck.out === 1;  // ENFORCE: Must have sufficient funds
    
    // --- MODULE 2: VERIFY OLD COMMITMENT ---
    // Verify that the provided old_commitment matches Hash(secret || private_balance)
    // This proves the prover knows the private balance and secret
    component oldHasher = Poseidon(2);
    oldHasher.inputs[0] <== secret;
    oldHasher.inputs[1] <== private_balance;
    computed_old_commitment <== oldHasher.out;
    computed_old_commitment === old_commitment;  // ENFORCE: Old commitment must match
    
    // --- MODULE 3: COMPUTE NEW BALANCE AND COMMITMENT ---
    // Calculate: new_balance = private_balance - spend_amount
    new_balance <== private_balance - spend_amount;
    
    // Hash new balance with same secret
    component newHasher = Poseidon(2);
    newHasher.inputs[0] <== secret;
    newHasher.inputs[1] <== new_balance;
    computed_new_commitment <== newHasher.out;
    new_commitment <== computed_new_commitment;
    
    // --- MODULE 4: TRANSACTION UNIQUENESS HASH ---
    // Generate hash of (spend_amount, randomness) for receiver
    // This ensures each transaction is unique and can be tracked
    component amountHasher = Poseidon(2);
    amountHasher.inputs[0] <== spend_amount;
    amountHasher.inputs[1] <== randomness;
    amount_hash <== amountHasher.out;
    
    // --- MODULE 5: COMPREHENSIVE NULLIFIER ---
    // Robust nullifier to prevent replay attacks
    // Includes all relevant transaction data to make nullifier truly unique
    // Hash: (old_commitment, spend_amount, randomness, secret)
    // This ensures even if someone steals the proof, they can't replay it
    // because the combination of all these values is unique to this transaction
    component nullifierHasher = Poseidon(4);
    nullifierHasher.inputs[0] <== old_commitment;
    nullifierHasher.inputs[1] <== spend_amount;
    nullifierHasher.inputs[2] <== randomness;
    nullifierHasher.inputs[3] <== secret;
    nullifier <== nullifierHasher.out;
}

component main {public [public_balance, old_commitment]} = UpdateBalanceOptimal();
