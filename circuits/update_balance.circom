pragma circom 2.0.0;

// Import necessary components from the circomlib library.
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

<<<<<<< HEAD
/*
 * @title BalanceUpdateWithRangeProof
 * @dev This circuit proves a valid balance update with the following guarantees:
 * 1. Range Proof: Total balance (public + private) >= transaction amount.
 * 2. Correct State Update: The new hashed private balance is correctly computed
 *    from a private balance that matches the provided old hashed balance.
 * 3. Transaction Uniqueness: A unique nullifier is generated for the transaction.
 *
 * @param n - The bit length for range checking (e.g., 252 for safe field arithmetic).
 */
template BalanceUpdateWithRangeProof(n) {
    // === Private Inputs (Prover's secret witness) ===
    signal input pvt_bal;
    signal input amt;
    signal input val;
    signal input r;

    // === Public Inputs (Known to Prover and Verifier) ===
    signal input pub_bal;
    signal input oldHashedPrivateBalance;
    
    // === Public Outputs (Computed by the circuit) ===
    signal output newHashedPrivateBalance;
    signal output transactionNullifier;
    signal output rangeProofValid;

    // --- MODULE 1: RANGE PROOF (pub_bal + pvt_bal >= amt) ---
    signal totalBalance <== pub_bal + pvt_bal;
    component rangeCheck = LessEqThan(n);
    rangeCheck.in[0] <== amt;
    rangeCheck.in[1] <== totalBalance;
    rangeProofValid <== rangeCheck.out;
    rangeProofValid === 1;

    // --- MODULE 2: CORRECT STATE UPDATE PROOF ---
    // Verify old hashed private balance
    component oldHasher = Poseidon(2);
    oldHasher.inputs[0] <== pvt_bal;
    oldHasher.inputs[1] <== val;
=======
template UpdateBalance() {
    // === Public inputs ===
    signal input public_balance;
    signal input old_commitment;  // previous commitment hash
    signal input new_commitment;  // new commitment hash
    // signal input nullifier;       // nullifier hash (public to prevent reuse)

    // Private inputs (kept by Alice)
    signal input secret;  // user secret / private key
    signal input randomness; 
    signal input private_balance;
    signal input spend_amount;
    signal new_balance;

    // === Constraints ===
    signal available_balance;
    available_balance <== public_balance + private_balance;

    // enforce spend_amount < available_balance
    component lt = LessThan(250);
    lt.in[0] <== spend_amount;
    lt.in[1] <== available_balance;
    lt.out === 1;
    new_balance <== private_balance - spend_amount;

    // Poseidon hash for old commitment
    component hash_old = Poseidon(2);
    hash_old.inputs[0] <== secret;
    hash_old.inputs[1] <== private_balance;
    signal computed_old_commitment <== hash_old.out;
>>>>>>> dev-circuit

    // --------------------------------------TODO-----------------------
    // oldHasher.out === oldHashedPrivateBalance;

<<<<<<< HEAD
    // Calculate new private balance
    signal newPrivateBalance <== pvt_bal - amt;

    // Compute new hashed private balance
    component newBalanceHasher = Poseidon(2);
    newBalanceHasher.inputs[0] <== newPrivateBalance;
    newBalanceHasher.inputs[1] <== val;
    newHashedPrivateBalance <== newBalanceHasher.out;

    // --- MODULE 3: TRANSACTION UNIQUENESS NULLIFIER ---
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== amt;
    nullifierHasher.inputs[1] <== r;
    transactionNullifier <== nullifierHasher.out;
}

// Instantiate the main component of the circuit.
// This defines the final public interface for proof generation and verification.
component main {public [pub_bal, oldHashedPrivateBalance]} = BalanceUpdateWithRangeProof(252);
=======
    // Poseidon hash for nullifier
    // component hash_nullifier = Poseidon(2);
    // hash_nullifier.inputs[0] <== secret;
    // hash_nullifier.inputs[1] <== old_commitment;
    // signal computed_nullifier <== hash_nullifier.out;

    // Enforce equality
    computed_old_commitment === old_commitment;
    computed_new_commitment === new_commitment;
    // computed_nullifier === nullifier;

    signal output amount_hash;
    component hash_amount = Poseidon(2);
    hash_amount.inputs[0] <== spend_amount;
    hash_amount.inputs[1] <== randomness;
    amount_hash <== hash_amount.out;

    signal output nullifier;
    component hash_nullifier = Poseidon(5);
    hash_nullifier.inputs[0] <== public_balance;
    hash_nullifier.inputs[1] <== private_balance;
    hash_nullifier.inputs[2] <== spend_amount;
    hash_nullifier.inputs[3] <== randomness;
    hash_nullifier.inputs[4] <== secret;
    nullifier <== hash_nullifier.out;
}

component main{public[public_balance, old_commitment, new_commitment]} = UpdateBalance();

>>>>>>> dev-circuit
