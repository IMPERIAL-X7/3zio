pragma circom 2.0.0;

// Import necessary components from the circomlib library.
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

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
    oldHasher.out === oldHashedPrivateBalance;

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
